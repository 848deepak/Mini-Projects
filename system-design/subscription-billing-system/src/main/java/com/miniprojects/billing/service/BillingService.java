package com.miniprojects.billing.service;

import com.miniprojects.billing.dto.CreatePlanRequest;
import com.miniprojects.billing.dto.CreateSubscriptionRequest;
import com.miniprojects.billing.dto.InvoiceResponse;
import com.miniprojects.billing.dto.PayInvoiceRequest;
import com.miniprojects.billing.dto.PlanResponse;
import com.miniprojects.billing.dto.SubscriptionResponse;
import com.miniprojects.billing.exception.NotFoundException;
import com.miniprojects.billing.exception.ConflictException;
import com.miniprojects.billing.model.Invoice;
import com.miniprojects.billing.model.Payment;
import com.miniprojects.billing.model.Plan;
import com.miniprojects.billing.model.Subscription;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class BillingService {

  private final Map<String, Plan> plans = new ConcurrentHashMap<>();
  private final Map<String, Subscription> subscriptions = new ConcurrentHashMap<>();
  private final Map<String, Invoice> invoices = new ConcurrentHashMap<>();
  private final Map<String, Payment> payments = new ConcurrentHashMap<>();
  private final AtomicLong idSequence = new AtomicLong(1_000);

  public BillingService() {
    seedPlans();
  }

  public Collection<PlanResponse> listPlans() {
    return plans.values().stream().map(this::toPlanResponse).sorted(Comparator.comparing(PlanResponse::name)).toList();
  }

  public synchronized PlanResponse createPlan(CreatePlanRequest request) {
    String id = nextId("plan");
    Plan plan = new Plan(id, request.name(), request.billingCycle().toLowerCase(), normalizeMoney(request.price()), request.currency().toUpperCase(), request.description());
    plans.put(id, plan);
    return toPlanResponse(plan);
  }

  public synchronized SubscriptionResponse createSubscription(CreateSubscriptionRequest request) {
    Plan plan = findPlan(request.planId());
    String id = nextId("sub");
    Instant now = Instant.now();
    Subscription subscription = new Subscription(
      id,
      request.customerId(),
      plan.getId(),
      "ACTIVE",
      now,
      now,
      now.plus(periodFor(plan.getBillingCycle())),
      plan.getPrice()
    );
    subscriptions.put(id, subscription);
    return toSubscriptionResponse(subscription);
  }

  public Collection<SubscriptionResponse> listSubscriptions() {
    return subscriptions.values().stream().map(this::toSubscriptionResponse).sorted(Comparator.comparing(SubscriptionResponse::createdAt).reversed()).toList();
  }

  public SubscriptionResponse getSubscription(String subscriptionId) {
    return toSubscriptionResponse(findSubscription(subscriptionId));
  }

  public synchronized SubscriptionResponse updateSubscription(String subscriptionId, String planId) {
    Subscription subscription = findSubscription(subscriptionId);
    Plan newPlan = findPlan(planId);
    subscription.setRecurringAmount(newPlan.getPrice());
    subscription = withPlan(subscription, newPlan.getId(), newPlan.getBillingCycle());
    subscriptions.put(subscriptionId, subscription);
    return toSubscriptionResponse(subscription);
  }

  public InvoiceResponse generateInvoice(String subscriptionId) {
    Subscription subscription = findSubscription(subscriptionId);
    String id = nextId("inv");
    Instant now = Instant.now();
    Invoice invoice = new Invoice(id, subscription.getId(), subscription.getCustomerId(), normalizeMoney(subscription.getRecurringAmount()), findPlan(subscription.getPlanId()).getCurrency(), now, now.plus(Duration.ofDays(7)), "ISSUED");
    invoices.put(id, invoice);
    return toInvoiceResponse(invoice);
  }

  public InvoiceResponse payInvoice(String invoiceId, PayInvoiceRequest request) {
    Invoice invoice = findInvoice(invoiceId);
    if ("PAID".equals(invoice.getStatus())) {
      throw new ConflictException("Invoice already paid");
    }

    Payment payment = new Payment(nextId("pay"), invoiceId, invoice.getAmount(), request.provider(), "PRV-" + idSequence.incrementAndGet(), Instant.now());
    payments.put(payment.getId(), payment);
    invoice.setStatus("PAID");
    invoice.setPaidAt(payment.getPaidAt());
    return toInvoiceResponse(invoice);
  }

  public List<InvoiceResponse> listInvoicesForSubscription(String subscriptionId) {
    findSubscription(subscriptionId);
    return invoices.values().stream()
      .filter(invoice -> invoice.getSubscriptionId().equals(subscriptionId))
      .sorted(Comparator.comparing(Invoice::getIssuedAt).reversed())
      .map(this::toInvoiceResponse)
      .toList();
  }

  private void seedPlans() {
    createSeedPlan("Starter", "monthly", new BigDecimal("19.00"), "USD", "Entry plan for small teams");
    createSeedPlan("Growth", "monthly", new BigDecimal("49.00"), "USD", "Scaling plan with automation");
    createSeedPlan("Scale", "annual", new BigDecimal("499.00"), "USD", "Annual plan with premium support");
  }

  private void createSeedPlan(String name, String billingCycle, BigDecimal price, String currency, String description) {
    String id = nextId("plan");
    plans.put(id, new Plan(id, name, billingCycle, normalizeMoney(price), currency, description));
  }

  private Plan findPlan(String planId) {
    Plan plan = plans.get(planId);
    if (plan == null) {
      throw new NotFoundException("Plan not found: " + planId);
    }
    return plan;
  }

  private Subscription findSubscription(String subscriptionId) {
    Subscription subscription = subscriptions.get(subscriptionId);
    if (subscription == null) {
      throw new NotFoundException("Subscription not found: " + subscriptionId);
    }
    return subscription;
  }

  private Invoice findInvoice(String invoiceId) {
    Invoice invoice = invoices.get(invoiceId);
    if (invoice == null) {
      throw new NotFoundException("Invoice not found: " + invoiceId);
    }
    return invoice;
  }

  private PlanResponse toPlanResponse(Plan plan) {
    return new PlanResponse(plan.getId(), plan.getName(), plan.getBillingCycle(), plan.getPrice(), plan.getCurrency(), plan.getDescription());
  }

  private SubscriptionResponse toSubscriptionResponse(Subscription subscription) {
    return new SubscriptionResponse(
      subscription.getId(),
      subscription.getCustomerId(),
      subscription.getPlanId(),
      subscription.getStatus(),
      subscription.getCreatedAt(),
      subscription.getCurrentPeriodStart(),
      subscription.getCurrentPeriodEnd(),
      subscription.getRecurringAmount()
    );
  }

  private InvoiceResponse toInvoiceResponse(Invoice invoice) {
    return new InvoiceResponse(
      invoice.getId(),
      invoice.getSubscriptionId(),
      invoice.getCustomerId(),
      invoice.getAmount(),
      invoice.getCurrency(),
      invoice.getIssuedAt(),
      invoice.getDueAt(),
      invoice.getStatus(),
      invoice.getPaidAt()
    );
  }

  private Subscription withPlan(Subscription subscription, String planId, String billingCycle) {
    subscription.setCurrentPeriodStart(Instant.now());
    subscription.setCurrentPeriodEnd(Instant.now().plus(periodFor(billingCycle)));
    return new Subscription(
      subscription.getId(),
      subscription.getCustomerId(),
      planId,
      subscription.getStatus(),
      subscription.getCreatedAt(),
      subscription.getCurrentPeriodStart(),
      subscription.getCurrentPeriodEnd(),
      subscription.getRecurringAmount()
    );
  }

  private Duration periodFor(String billingCycle) {
    return switch (billingCycle.toLowerCase()) {
      case "annual", "yearly" -> Duration.ofDays(365);
      case "quarterly" -> Duration.ofDays(90);
      default -> Duration.ofDays(30);
    };
  }

  private BigDecimal normalizeMoney(BigDecimal amount) {
    return amount.setScale(2, RoundingMode.HALF_UP);
  }

  private String nextId(String prefix) {
    return prefix + "-" + idSequence.incrementAndGet();
  }
}
