package com.eventbooking.domain;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;

public final class Models {

    private Models() {
    }

    public enum EventStatus { DRAFT, PUBLISHED, CANCELLED }
    public enum HoldStatus { HELD, EXPIRED, CONFIRMED, RELEASED }
    public enum BookingStatus { PENDING_PAYMENT, CONFIRMED, CANCELLED, REFUNDED }
    public enum TicketStatus { ISSUED, CHECKED_IN, CANCELLED }
    public enum WaitlistStatus { ACTIVE, PROMOTED, CANCELLED }

    public record Event(String eventId,
                        String organizerId,
                        String title,
                        String city,
                        String venue,
                        Instant startAt,
                        Instant endAt,
                        EventStatus status,
                        List<TicketTier> tiers) {
    }

    public record TicketTier(String tierId,
                             String name,
                             BigDecimal price,
                             int capacity,
                             int soldCount,
                             int reservedCount) {
    }

    public record Hold(String holdId,
                       String userId,
                       String eventId,
                       String tierId,
                       int quantity,
                       Instant expiresAt,
                       HoldStatus status,
                       BigDecimal amount,
                       String idempotencyKey) {
    }

    public record Booking(String bookingId,
                          String holdId,
                          String userId,
                          String eventId,
                          BookingStatus status,
                          BigDecimal totalAmount,
                          Instant createdAt,
                          List<Ticket> tickets) {
    }

    public record Ticket(String ticketId,
                         String bookingId,
                         String qrToken,
                         String attendeeName,
                         TicketStatus status,
                         Instant checkedInAt) {
    }

    public record WaitlistEntry(String waitlistId,
                                String eventId,
                                String userId,
                                String tierId,
                                int quantity,
                                int rank,
                                WaitlistStatus status,
                                Instant createdAt) {
    }

    public record Availability(String eventId,
                               String tierId,
                               int capacity,
                               int sold,
                               int reserved,
                               int remaining) {
    }

    public record CheckinValidation(boolean valid,
                                    String ticketStatus,
                                    String attendeeName,
                                    String ticketId,
                                    String reason) {
    }
}
