package com.miniprojects.courier.service;

import com.miniprojects.courier.api.dto.CreateShipmentRequest;
import com.miniprojects.courier.api.dto.CreateShipmentResponse;
import com.miniprojects.courier.api.dto.DeliverShipmentRequest;
import com.miniprojects.courier.api.dto.ShipmentActionRequest;
import com.miniprojects.courier.api.dto.TrackEventRequest;
import com.miniprojects.courier.api.dto.TrackEventResponse;
import com.miniprojects.courier.api.dto.TrackShipmentResponse;
import com.miniprojects.courier.api.dto.TrackingTimelineItem;
import com.miniprojects.courier.model.ActionType;
import com.miniprojects.courier.model.Shipment;
import com.miniprojects.courier.model.ShipmentEvent;
import com.miniprojects.courier.model.ShipmentState;
import com.miniprojects.courier.repository.ShipmentEventRepository;
import com.miniprojects.courier.repository.ShipmentRepository;
import jakarta.persistence.EntityNotFoundException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.EnumMap;
import java.util.EnumSet;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TrackingService {

    private static final Map<ShipmentState, EnumSet<ShipmentState>> ALLOWED_TRANSITIONS =
        new EnumMap<>(ShipmentState.class);

    static {
        ALLOWED_TRANSITIONS.put(ShipmentState.CREATED, EnumSet.of(ShipmentState.PICKUP_SCHEDULED));
        ALLOWED_TRANSITIONS.put(ShipmentState.PICKUP_SCHEDULED, EnumSet.of(ShipmentState.PICKED_UP));
        ALLOWED_TRANSITIONS.put(ShipmentState.PICKED_UP, EnumSet.of(ShipmentState.IN_TRANSIT));
        ALLOWED_TRANSITIONS.put(ShipmentState.IN_TRANSIT, EnumSet.of(
            ShipmentState.AT_HUB,
            ShipmentState.OUT_FOR_DELIVERY,
            ShipmentState.RETURN_INITIATED
        ));
        ALLOWED_TRANSITIONS.put(ShipmentState.AT_HUB, EnumSet.of(
            ShipmentState.IN_TRANSIT,
            ShipmentState.OUT_FOR_DELIVERY
        ));
        ALLOWED_TRANSITIONS.put(ShipmentState.OUT_FOR_DELIVERY, EnumSet.of(
            ShipmentState.DELIVERED,
            ShipmentState.DELIVERY_FAILED
        ));
        ALLOWED_TRANSITIONS.put(ShipmentState.DELIVERY_FAILED, EnumSet.of(
            ShipmentState.OUT_FOR_DELIVERY,
            ShipmentState.RETURN_INITIATED
        ));
        ALLOWED_TRANSITIONS.put(ShipmentState.RETURN_INITIATED, EnumSet.of(ShipmentState.RETURNED));
        ALLOWED_TRANSITIONS.put(ShipmentState.RETURNED, EnumSet.noneOf(ShipmentState.class));
        ALLOWED_TRANSITIONS.put(ShipmentState.DELIVERED, EnumSet.noneOf(ShipmentState.class));
    }

    private final ShipmentRepository shipmentRepository;
    private final ShipmentEventRepository eventRepository;

    public TrackingService(ShipmentRepository shipmentRepository, ShipmentEventRepository eventRepository) {
        this.shipmentRepository = shipmentRepository;
        this.eventRepository = eventRepository;
    }

    @Transactional
    public CreateShipmentResponse createShipment(CreateShipmentRequest request) {
        return eventRepository.findByIdempotencyKey(request.idempotencyKey())
            .flatMap(existing -> shipmentRepository.findByTrackingNo(existing.getTrackingNo()))
            .map(existingShipment -> new CreateShipmentResponse(
                existingShipment.getId(),
                existingShipment.getTrackingNo(),
                existingShipment.getCurrentState()
            ))
            .orElseGet(() -> {
                Shipment shipment = new Shipment();
                shipment.setTrackingNo(generateTrackingNo());
                shipment.setMerchantId(request.merchantId());
                shipment.setSenderName(request.senderName());
                shipment.setSenderAddress(request.senderAddress());
                shipment.setReceiverName(request.receiverName());
                shipment.setReceiverAddress(request.receiverAddress());
                shipment.setServiceLevel(request.serviceLevel());
                shipment.setCurrentState(ShipmentState.CREATED);
                shipment.setStateVersion(1);

                Shipment saved = shipmentRepository.save(shipment);
                persistEvent(saved, ShipmentState.CREATED, Instant.now(), "SYSTEM", "INIT", "Shipment created", request.idempotencyKey());

                return new CreateShipmentResponse(saved.getId(), saved.getTrackingNo(), saved.getCurrentState());
            });
    }

    @Transactional
    public TrackEventResponse ingestEvent(TrackEventRequest request) {
        Shipment shipment = shipmentRepository.findByTrackingNo(request.trackingNo())
            .orElseThrow(() -> new EntityNotFoundException("Tracking number not found"));

        return eventRepository.findByIdempotencyKey(request.idempotencyKey())
            .map(existing -> new TrackEventResponse(true, existing.getEventId()))
            .orElseGet(() -> {
                validateTransition(shipment.getCurrentState(), request.eventType());
                shipment.setCurrentState(request.eventType());
                shipment.setStateVersion(shipment.getStateVersion() + 1);
                shipmentRepository.save(shipment);
                ShipmentEvent event = persistEvent(
                    shipment,
                    request.eventType(),
                    request.occurredAt(),
                    request.sourceId(),
                    request.location(),
                    request.payload(),
                    request.idempotencyKey()
                );
                return new TrackEventResponse(true, event.getEventId());
            });
    }

    @Transactional(readOnly = true)
    public TrackShipmentResponse getTracking(String trackingNo) {
        Shipment shipment = shipmentRepository.findByTrackingNo(trackingNo)
            .orElseThrow(() -> new EntityNotFoundException("Tracking number not found"));
        List<ShipmentEvent> events = eventRepository.findByTrackingNoOrderByOccurredAtAsc(trackingNo);
        String lastLocation = events.isEmpty() ? "N/A" : events.get(events.size() - 1).getLocation();
        String eta = switch (shipment.getCurrentState()) {
            case DELIVERED -> "Delivered";
            case RETURNED -> "Returned";
            default -> Instant.now().plus(2, ChronoUnit.DAYS).toString();
        };
        return new TrackShipmentResponse(
            shipment.getId(),
            shipment.getTrackingNo(),
            shipment.getCurrentState(),
            eta,
            lastLocation,
            events.stream().map(this::toTimelineItem).toList()
        );
    }

    @Transactional(readOnly = true)
    public List<TrackingTimelineItem> getTimeline(String shipmentId) {
        Shipment shipment = shipmentRepository.findById(shipmentId)
            .orElseThrow(() -> new EntityNotFoundException("Shipment not found"));
        return eventRepository.findByTrackingNoOrderByOccurredAtAsc(shipment.getTrackingNo())
            .stream()
            .map(this::toTimelineItem)
            .toList();
    }

    @Transactional
    public TrackEventResponse applyAction(String shipmentId, ShipmentActionRequest request) {
        Shipment shipment = shipmentRepository.findById(shipmentId)
            .orElseThrow(() -> new EntityNotFoundException("Shipment not found"));

        ShipmentState targetState = mapActionToState(request.actionType(), shipment.getCurrentState());
        TrackEventRequest eventRequest = new TrackEventRequest(
            shipment.getTrackingNo(),
            targetState,
            Instant.now(),
            "OPS_CONTROL",
            request.actorId(),
            "Action: " + request.actionType() + ", reason: " + request.reason(),
            request.idempotencyKey()
        );
        return ingestEvent(eventRequest);
    }

    @Transactional
    public TrackEventResponse deliverShipment(String shipmentId, DeliverShipmentRequest request) {
        Shipment shipment = shipmentRepository.findById(shipmentId)
            .orElseThrow(() -> new EntityNotFoundException("Shipment not found"));
        if (!"123456".equals(request.otp())) {
            throw new IllegalArgumentException("OTP verification failed. Use 123456 for demo data.");
        }
        String payload = "Recipient=" + request.recipientName()
            + ", signatureUri=" + safe(request.signatureUri())
            + ", photoUri=" + safe(request.photoUri());
        TrackEventRequest eventRequest = new TrackEventRequest(
            shipment.getTrackingNo(),
            ShipmentState.DELIVERED,
            Instant.now(),
            "LAST_MILE",
            "COURIER_APP",
            payload,
            request.idempotencyKey()
        );
        return ingestEvent(eventRequest);
    }

    private ShipmentEvent persistEvent(
        Shipment shipment,
        ShipmentState eventType,
        Instant occurredAt,
        String sourceId,
        String location,
        String payload,
        String idempotencyKey
    ) {
        ShipmentEvent event = new ShipmentEvent();
        event.setEventId(UUID.randomUUID().toString());
        event.setTrackingNo(shipment.getTrackingNo());
        event.setEventType(eventType);
        event.setOccurredAt(occurredAt);
        event.setSourceId(sourceId);
        event.setLocation(location);
        event.setPayload(payload);
        event.setIdempotencyKey(idempotencyKey);
        return eventRepository.save(event);
    }

    private void validateTransition(ShipmentState current, ShipmentState next) {
        if (current == next) {
            return;
        }
        EnumSet<ShipmentState> allowed = ALLOWED_TRANSITIONS.getOrDefault(current, EnumSet.noneOf(ShipmentState.class));
        if (!allowed.contains(next)) {
            throw new IllegalArgumentException("Invalid state transition: " + current + " -> " + next);
        }
    }

    private ShipmentState mapActionToState(ActionType actionType, ShipmentState currentState) {
        return switch (actionType) {
            case HOLD -> ShipmentState.AT_HUB;
            case REROUTE -> ShipmentState.IN_TRANSIT;
            case REATTEMPT -> {
                if (currentState != ShipmentState.DELIVERY_FAILED) {
                    throw new IllegalArgumentException("REATTEMPT is only valid after DELIVERY_FAILED");
                }
                yield ShipmentState.OUT_FOR_DELIVERY;
            }
        };
    }

    private TrackingTimelineItem toTimelineItem(ShipmentEvent event) {
        return new TrackingTimelineItem(
            event.getEventId(),
            event.getEventType(),
            event.getOccurredAt(),
            event.getLocation(),
            event.getSourceId(),
            event.getPayload()
        );
    }

    private String generateTrackingNo() {
        return "TRK-" + Instant.now().toEpochMilli() + "-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();
    }

    private String safe(String value) {
        return value == null ? "" : value;
    }
}
