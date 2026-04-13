package com.miniprojects.billing.controller;

import com.miniprojects.billing.dto.CreatePlanRequest;
import com.miniprojects.billing.dto.CreateSubscriptionRequest;
import com.miniprojects.billing.dto.InvoiceResponse;
import com.miniprojects.billing.dto.PayInvoiceRequest;
import com.miniprojects.billing.dto.PlanResponse;
import com.miniprojects.billing.dto.SubscriptionResponse;
import com.miniprojects.billing.service.BillingService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collection;
import java.util.List;

@RestController
@RequestMapping("/api")
public class BillingController {

  private final BillingService billingService;

  public BillingController(BillingService billingService) {
    this.billingService = billingService;
  }

  @GetMapping("/plans")
  public Collection<PlanResponse> listPlans() {
    return billingService.listPlans();
  }

  @PostMapping("/plans")
  @ResponseStatus(HttpStatus.CREATED)
  public PlanResponse createPlan(@Valid @RequestBody CreatePlanRequest request) {
    return billingService.createPlan(request);
  }

  @GetMapping("/subscriptions")
  public Collection<SubscriptionResponse> listSubscriptions() {
    return billingService.listSubscriptions();
  }

  @PostMapping("/subscriptions")
  @ResponseStatus(HttpStatus.CREATED)
  public SubscriptionResponse createSubscription(@Valid @RequestBody CreateSubscriptionRequest request) {
    return billingService.createSubscription(request);
  }

  @GetMapping("/subscriptions/{subscriptionId}")
  public SubscriptionResponse getSubscription(@PathVariable String subscriptionId) {
    return billingService.getSubscription(subscriptionId);
  }

  @PatchMapping("/subscriptions/{subscriptionId}")
  public SubscriptionResponse updateSubscription(@PathVariable String subscriptionId, @Valid @RequestBody CreateSubscriptionRequest request) {
    return billingService.updateSubscription(subscriptionId, request.planId());
  }

  @PostMapping("/subscriptions/{subscriptionId}/invoices")
  @ResponseStatus(HttpStatus.CREATED)
  public InvoiceResponse generateInvoice(@PathVariable String subscriptionId) {
    return billingService.generateInvoice(subscriptionId);
  }

  @GetMapping("/subscriptions/{subscriptionId}/invoices")
  public List<InvoiceResponse> listInvoices(@PathVariable String subscriptionId) {
    return billingService.listInvoicesForSubscription(subscriptionId);
  }

  @PostMapping("/invoices/{invoiceId}/pay")
  public InvoiceResponse payInvoice(@PathVariable String invoiceId, @Valid @RequestBody PayInvoiceRequest request) {
    return billingService.payInvoice(invoiceId, request);
  }
}
