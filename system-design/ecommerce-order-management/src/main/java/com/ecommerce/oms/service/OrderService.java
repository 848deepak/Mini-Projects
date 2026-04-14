package com.ecommerce.oms.service;

import com.ecommerce.oms.api.dto.*;
import com.ecommerce.oms.api.exception.BadRequestException;
import com.ecommerce.oms.api.exception.NotFoundException;
import com.ecommerce.oms.domain.*;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.Year;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final Map<String, Order> orders = new ConcurrentHashMap<>();
    private final Map<String, ReturnRequestRecord> returns = new ConcurrentHashMap<>();

    private final Map<String, String> orderCreationIdempotency = new ConcurrentHashMap<>();
    private final Map<String, String> paymentIdempotency = new ConcurrentHashMap<>();
    private final Map<String, String> cancelIdempotency = new ConcurrentHashMap<>();
    private final Map<String, String> returnIdempotency = new ConcurrentHashMap<>();

    private final AtomicLong orderSeq = new AtomicLong(1000);

    public synchronized OrderResponse createOrder(CreateOrderRequest request) {
        if (orderCreationIdempotency.containsKey(request.idempotencyKey())) {
            String existingOrderId = orderCreationIdempotency.get(request.idempotencyKey());
            return toOrderResponse(fetchOrder(existingOrderId));
        }

        List<OrderItem> items = request.items().stream()
                .map(i -> new OrderItem(i.sku(), i.name(), i.quantity(), i.unitPrice()))
                .toList();

        BigDecimal subtotal = items.stream()
                .map(OrderItem::lineTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal total = subtotal
                .add(request.tax())
                .add(request.shippingFee())
                .subtract(request.discount());

        if (total.compareTo(BigDecimal.ZERO) < 0) {
            throw new BadRequestException("Total cannot be negative");
        }

        String orderId = "order-" + orderSeq.incrementAndGet();
        String orderNo = "ORD-" + Year.now().getValue() + "-" + orderSeq.get();

        Order order = new Order(
                orderId,
                orderNo,
                request.customerId(),
                items,
                request.currency(),
                subtotal,
                request.tax(),
                request.shippingFee(),
                request.discount(),
                total
        );

        order.transitionTo(OrderStatus.PAYMENT_PENDING, "awaiting payment confirmation");
        orders.put(orderId, order);
        orderCreationIdempotency.put(request.idempotencyKey(), orderId);

        return toOrderResponse(order);
    }

    public OrderResponse getOrder(String orderId) {
        return toOrderResponse(fetchOrder(orderId));
    }

    public List<OrderResponse> listOrdersByCustomer(String customerId) {
        return orders.values().stream()
                .filter(order -> order.getCustomerId().equals(customerId))
                .sorted((left, right) -> right.getCreatedAt().compareTo(left.getCreatedAt()))
                .map(this::toOrderResponse)
                .collect(Collectors.toList());
    }

    public synchronized OrderResponse updatePayment(String orderId, PaymentUpdateRequest request) {
        if (paymentIdempotency.containsKey(request.idempotencyKey())) {
            return toOrderResponse(fetchOrder(orderId));
        }

        Order order = fetchOrder(orderId);
        String status = request.paymentStatus().trim().toUpperCase();

        if ("PAID".equals(status)) {
            order.transitionTo(OrderStatus.PAID, "payment confirmed: " + request.providerRef());
        } else if ("FAILED".equals(status)) {
            order.transitionTo(OrderStatus.CANCELED, "payment failed: " + request.providerRef());
        } else {
            throw new BadRequestException("paymentStatus must be PAID or FAILED");
        }

        paymentIdempotency.put(request.idempotencyKey(), orderId);
        return toOrderResponse(order);
    }

    public synchronized OrderResponse cancelOrder(String orderId, CancelOrderRequest request) {
        if (cancelIdempotency.containsKey(request.idempotencyKey())) {
            return toOrderResponse(fetchOrder(orderId));
        }

        Order order = fetchOrder(orderId);
        order.transitionTo(OrderStatus.CANCELED, request.reason());
        cancelIdempotency.put(request.idempotencyKey(), orderId);

        return toOrderResponse(order);
    }

    public synchronized OrderResponse createShipment(String orderId, CreateShipmentRequest request) {
        Order order = fetchOrder(orderId);
        order.addShipment(new Shipment(request.carrier(), request.trackingNo()));
        return toOrderResponse(order);
    }

    public synchronized OrderResponse markDelivered(String orderId) {
        Order order = fetchOrder(orderId);
        order.transitionTo(OrderStatus.DELIVERED, "delivery confirmed");
        return toOrderResponse(order);
    }

    public synchronized ReturnResponse createReturn(CreateReturnRequest request) {
        if (returnIdempotency.containsKey(request.idempotencyKey())) {
            return toReturnResponse(returns.get(returnIdempotency.get(request.idempotencyKey())));
        }

        Order order = fetchOrder(request.orderId());
        if (order.getStatus() != OrderStatus.DELIVERED && order.getStatus() != OrderStatus.SHIPPED) {
            throw new BadRequestException("Returns are only allowed for shipped or delivered orders");
        }

        order.transitionTo(OrderStatus.RETURN_REQUESTED, request.reason());

        ReturnRequestRecord record = new ReturnRequestRecord(request.orderId(), request.reason(), request.refundAmount());
        returns.put(record.getReturnId(), record);
        returnIdempotency.put(request.idempotencyKey(), record.getReturnId());

        return toReturnResponse(record);
    }

    public synchronized ReturnResponse processRefund(String returnId) {
        ReturnRequestRecord record = returns.get(returnId);
        if (record == null) {
            throw new NotFoundException("Return not found: " + returnId);
        }

        if (!record.isRefunded()) {
            record.markRefunded();

            Order order = fetchOrder(record.getOrderId());
            if (order.getStatus() == OrderStatus.RETURN_REQUESTED) {
                order.transitionTo(OrderStatus.RETURNED, "item returned to warehouse");
            }
            if (order.getStatus() == OrderStatus.RETURNED) {
                order.transitionTo(OrderStatus.REFUNDED, "refund processed");
            }
        }

        return toReturnResponse(record);
    }

    private Order fetchOrder(String orderId) {
        Order order = orders.get(orderId);
        if (order == null) {
            throw new NotFoundException("Order not found: " + orderId);
        }
        return order;
    }

    private OrderResponse toOrderResponse(Order order) {
        List<OrderItemView> items = order.getItems().stream()
                .map(i -> new OrderItemView(i.getSku(), i.getName(), i.getQuantity(), i.getUnitPrice(), i.lineTotal()))
                .toList();

        List<ShipmentView> shipments = order.getShipments().stream()
                .map(s -> new ShipmentView(s.getShipmentId(), s.getCarrier(), s.getTrackingNo(), s.getCreatedAt()))
                .toList();

        List<StatusHistoryView> history = order.getStatusHistory().stream()
                .map(h -> new StatusHistoryView(h.getFrom(), h.getTo(), h.getReason(), h.getChangedAt()))
                .toList();

        return new OrderResponse(
                order.getOrderId(),
                order.getOrderNo(),
                order.getCustomerId(),
                order.getStatus(),
                order.getCurrency(),
                order.getSubtotal(),
                order.getTax(),
                order.getShippingFee(),
                order.getDiscount(),
                order.getTotal(),
                order.getCreatedAt(),
                order.getUpdatedAt(),
                items,
                shipments,
                history
        );
    }

    private ReturnResponse toReturnResponse(ReturnRequestRecord record) {
        return new ReturnResponse(
                record.getReturnId(),
                record.getOrderId(),
                record.getReason(),
                record.getRefundAmount(),
                record.isRefunded(),
                record.getCreatedAt()
        );
    }
}
