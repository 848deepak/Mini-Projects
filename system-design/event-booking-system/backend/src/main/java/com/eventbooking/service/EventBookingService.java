package com.eventbooking.service;

import com.eventbooking.domain.Models;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.math.BigDecimal;
import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
public class EventBookingService {

    private static final Duration HOLD_TTL = Duration.ofMinutes(5);

    private final Map<String, Models.Event> events = new ConcurrentHashMap<>();
    private final Map<String, Models.Hold> holds = new ConcurrentHashMap<>();
    private final Map<String, Models.Booking> bookings = new ConcurrentHashMap<>();
    private final Map<String, Models.WaitlistEntry> waitlistEntries = new ConcurrentHashMap<>();
    private final Map<String, Models.Ticket> ticketsByToken = new ConcurrentHashMap<>();

    private final Map<String, String> holdIdempotency = new ConcurrentHashMap<>();
    private final Map<String, String> bookingIdempotency = new ConcurrentHashMap<>();
    private final Map<String, String> checkinIdempotency = new ConcurrentHashMap<>();

    @PostConstruct
    void seed() {
        Models.Event e1 = new Models.Event(
                "evt_1001",
                "org_1",
                "Indie Music Festival",
                "Bengaluru",
                "Phoenix Arena",
                Instant.now().plus(Duration.ofDays(12)),
                Instant.now().plus(Duration.ofDays(12)).plus(Duration.ofHours(8)),
                Models.EventStatus.PUBLISHED,
                List.of(
                        new Models.TicketTier("tier_vip", "VIP", new BigDecimal("4999"), 120, 0, 0),
                        new Models.TicketTier("tier_ga", "General", new BigDecimal("1499"), 1200, 0, 0)
                )
        );

        Models.Event e2 = new Models.Event(
                "evt_1002",
                "org_2",
                "Startup Summit 2026",
                "Mumbai",
                "Harbor Convention Center",
                Instant.now().plus(Duration.ofDays(20)),
                Instant.now().plus(Duration.ofDays(20)).plus(Duration.ofHours(10)),
                Models.EventStatus.PUBLISHED,
                List.of(
                        new Models.TicketTier("tier_exec", "Executive", new BigDecimal("8999"), 300, 0, 0),
                        new Models.TicketTier("tier_std", "Standard", new BigDecimal("2999"), 2000, 0, 0)
                )
        );

        events.put(e1.eventId(), e1);
        events.put(e2.eventId(), e2);
    }

    public List<Models.Event> listEvents(String city, String query) {
        return events.values().stream()
                .filter(e -> city == null || e.city().equalsIgnoreCase(city))
                .filter(e -> query == null || e.title().toLowerCase().contains(query.toLowerCase()))
                .sorted(Comparator.comparing(Models.Event::startAt))
                .toList();
    }

    public Models.Event getEvent(String eventId) {
        Models.Event event = events.get(eventId);
        if (event == null) {
            throw new IllegalArgumentException("Event not found");
        }
        return event;
    }

    public List<Models.Availability> getAvailability(String eventId) {
        Models.Event event = getEvent(eventId);
        return event.tiers().stream()
                .map(t -> new Models.Availability(
                        eventId,
                        t.tierId(),
                        t.capacity(),
                        t.soldCount(),
                        t.reservedCount(),
                        Math.max(0, t.capacity() - t.soldCount() - t.reservedCount())
                ))
                .toList();
    }

    public synchronized Models.Hold createHold(String eventId, String tierId, int quantity, String userId, String idempotencyKey) {
        if (quantity < 1) {
            throw new IllegalArgumentException("Quantity must be at least 1");
        }
        if (idempotencyKey != null && holdIdempotency.containsKey(idempotencyKey)) {
            return holds.get(holdIdempotency.get(idempotencyKey));
        }

        expireHoldsIfNeeded();

        Models.Event event = getEvent(eventId);
        Models.TicketTier tier = findTier(event, tierId)
                .orElseThrow(() -> new IllegalArgumentException("Tier not found"));

        int remaining = tier.capacity() - tier.soldCount() - tier.reservedCount();
        if (remaining < quantity) {
            throw new IllegalStateException("Inventory exhausted for selected tier");
        }

        Models.TicketTier updatedTier = new Models.TicketTier(
                tier.tierId(),
                tier.name(),
                tier.price(),
                tier.capacity(),
                tier.soldCount(),
                tier.reservedCount() + quantity
        );
        replaceTier(event, updatedTier);

        Models.Hold hold = new Models.Hold(
                "hold_" + UUID.randomUUID().toString().replace("-", ""),
                userId,
                eventId,
                tierId,
                quantity,
                Instant.now().plus(HOLD_TTL),
                Models.HoldStatus.HELD,
                tier.price().multiply(BigDecimal.valueOf(quantity)),
                idempotencyKey
        );
        holds.put(hold.holdId(), hold);
        if (idempotencyKey != null && !idempotencyKey.isBlank()) {
            holdIdempotency.put(idempotencyKey, hold.holdId());
        }
        return hold;
    }

    public synchronized Models.Booking confirmBooking(String holdId, String userId, String idempotencyKey) {
        if (idempotencyKey != null && bookingIdempotency.containsKey(idempotencyKey)) {
            return bookings.get(bookingIdempotency.get(idempotencyKey));
        }

        expireHoldsIfNeeded();

        Models.Hold hold = holds.get(holdId);
        if (hold == null) {
            throw new IllegalArgumentException("Hold not found");
        }
        if (!Objects.equals(hold.userId(), userId)) {
            throw new IllegalStateException("Hold does not belong to user");
        }
        if (hold.status() != Models.HoldStatus.HELD) {
            throw new IllegalStateException("Hold is no longer active");
        }
        if (hold.expiresAt().isBefore(Instant.now())) {
            throw new IllegalStateException("Hold expired");
        }

        Models.Event event = getEvent(hold.eventId());
        Models.TicketTier tier = findTier(event, hold.tierId())
                .orElseThrow(() -> new IllegalArgumentException("Tier not found"));

        Models.TicketTier updatedTier = new Models.TicketTier(
                tier.tierId(),
                tier.name(),
                tier.price(),
                tier.capacity(),
                tier.soldCount() + hold.quantity(),
                Math.max(0, tier.reservedCount() - hold.quantity())
        );
        replaceTier(event, updatedTier);

        Models.Hold confirmedHold = new Models.Hold(
                hold.holdId(),
                hold.userId(),
                hold.eventId(),
                hold.tierId(),
                hold.quantity(),
                hold.expiresAt(),
                Models.HoldStatus.CONFIRMED,
                hold.amount(),
                hold.idempotencyKey()
        );
        holds.put(confirmedHold.holdId(), confirmedHold);

        List<Models.Ticket> tickets = new ArrayList<>();
        for (int i = 0; i < hold.quantity(); i++) {
            String ticketId = "tkt_" + UUID.randomUUID().toString().substring(0, 12);
            String token = "qr_" + UUID.randomUUID().toString().replace("-", "");
            Models.Ticket ticket = new Models.Ticket(ticketId, "", token, "Guest " + (i + 1), Models.TicketStatus.ISSUED, null);
            tickets.add(ticket);
        }

        String bookingId = "bok_" + UUID.randomUUID().toString().replace("-", "");
        List<Models.Ticket> boundTickets = tickets.stream()
                .map(t -> new Models.Ticket(t.ticketId(), bookingId, t.qrToken(), t.attendeeName(), t.status(), t.checkedInAt()))
                .toList();

        Models.Booking booking = new Models.Booking(
                bookingId,
                hold.holdId(),
                userId,
                hold.eventId(),
                Models.BookingStatus.CONFIRMED,
                hold.amount(),
                Instant.now(),
                boundTickets
        );
        bookings.put(booking.bookingId(), booking);
        boundTickets.forEach(t -> ticketsByToken.put(t.qrToken(), t));

        if (idempotencyKey != null && !idempotencyKey.isBlank()) {
            bookingIdempotency.put(idempotencyKey, booking.bookingId());
        }
        return booking;
    }

    public synchronized Models.Booking cancelBooking(String bookingId) {
        Models.Booking booking = bookings.get(bookingId);
        if (booking == null) {
            throw new IllegalArgumentException("Booking not found");
        }
        if (booking.status() == Models.BookingStatus.CANCELLED) {
            return booking;
        }

        Models.Event event = getEvent(booking.eventId());
        String tierId = extractTierFromHold(booking.holdId());
        Models.TicketTier tier = findTier(event, tierId)
                .orElseThrow(() -> new IllegalArgumentException("Tier not found"));

        Models.TicketTier updatedTier = new Models.TicketTier(
                tier.tierId(),
                tier.name(),
                tier.price(),
                tier.capacity(),
                Math.max(0, tier.soldCount() - booking.tickets().size()),
                tier.reservedCount()
        );
        replaceTier(event, updatedTier);

        List<Models.Ticket> cancelledTickets = booking.tickets().stream()
                .map(t -> new Models.Ticket(t.ticketId(), t.bookingId(), t.qrToken(), t.attendeeName(), Models.TicketStatus.CANCELLED, t.checkedInAt()))
                .toList();

        cancelledTickets.forEach(t -> ticketsByToken.put(t.qrToken(), t));

        Models.Booking cancelled = new Models.Booking(
                booking.bookingId(),
                booking.holdId(),
                booking.userId(),
                booking.eventId(),
                Models.BookingStatus.CANCELLED,
                booking.totalAmount(),
                booking.createdAt(),
                cancelledTickets
        );
        bookings.put(bookingId, cancelled);

        promoteWaitlist(event.eventId(), tier.tierId());
        return cancelled;
    }

    public synchronized Models.WaitlistEntry addWaitlist(String eventId, String tierId, int quantity, String userId) {
        if (quantity < 1) {
            throw new IllegalArgumentException("Quantity must be at least 1");
        }
        getEvent(eventId);

        int rank = (int) waitlistEntries.values().stream()
                .filter(w -> w.eventId().equals(eventId) && w.tierId().equals(tierId) && w.status() == Models.WaitlistStatus.ACTIVE)
                .count() + 1;

        Models.WaitlistEntry entry = new Models.WaitlistEntry(
                "wlt_" + UUID.randomUUID().toString().replace("-", ""),
                eventId,
                userId,
                tierId,
                quantity,
                rank,
                Models.WaitlistStatus.ACTIVE,
                Instant.now()
        );
        waitlistEntries.put(entry.waitlistId(), entry);
        return entry;
    }

    public Models.WaitlistEntry getWaitlist(String waitlistId) {
        Models.WaitlistEntry entry = waitlistEntries.get(waitlistId);
        if (entry == null) {
            throw new IllegalArgumentException("Waitlist entry not found");
        }
        return entry;
    }

    public synchronized Models.CheckinValidation validateCheckin(String qrToken, String idempotencyKey) {
        if (idempotencyKey != null && checkinIdempotency.containsKey(idempotencyKey)) {
            String token = checkinIdempotency.get(idempotencyKey);
            Models.Ticket ticket = ticketsByToken.get(token);
            if (ticket == null) {
                return new Models.CheckinValidation(false, "UNKNOWN", null, null, "Ticket not found");
            }
            boolean valid = ticket.status() == Models.TicketStatus.CHECKED_IN;
            return new Models.CheckinValidation(valid, ticket.status().name(), ticket.attendeeName(), ticket.ticketId(), valid ? "Already processed" : "Rejected");
        }

        Models.Ticket ticket = ticketsByToken.get(qrToken);
        if (ticket == null) {
            return new Models.CheckinValidation(false, "NOT_FOUND", null, null, "Ticket not found");
        }
        if (ticket.status() == Models.TicketStatus.CANCELLED) {
            return new Models.CheckinValidation(false, ticket.status().name(), ticket.attendeeName(), ticket.ticketId(), "Ticket cancelled");
        }
        if (ticket.status() == Models.TicketStatus.CHECKED_IN) {
            return new Models.CheckinValidation(false, ticket.status().name(), ticket.attendeeName(), ticket.ticketId(), "Duplicate scan detected");
        }

        Models.Ticket checkedIn = new Models.Ticket(
                ticket.ticketId(),
                ticket.bookingId(),
                ticket.qrToken(),
                ticket.attendeeName(),
                Models.TicketStatus.CHECKED_IN,
                Instant.now()
        );
        ticketsByToken.put(qrToken, checkedIn);

        Models.Booking booking = bookings.get(ticket.bookingId());
        if (booking != null) {
            List<Models.Ticket> updatedTickets = booking.tickets().stream()
                    .map(t -> t.qrToken().equals(qrToken) ? checkedIn : t)
                    .toList();
            bookings.put(booking.bookingId(), new Models.Booking(
                    booking.bookingId(),
                    booking.holdId(),
                    booking.userId(),
                    booking.eventId(),
                    booking.status(),
                    booking.totalAmount(),
                    booking.createdAt(),
                    updatedTickets
            ));
        }

        if (idempotencyKey != null && !idempotencyKey.isBlank()) {
            checkinIdempotency.put(idempotencyKey, qrToken);
        }

        return new Models.CheckinValidation(true, checkedIn.status().name(), checkedIn.attendeeName(), checkedIn.ticketId(), "Ticket validated");
    }

    public List<Models.Booking> listBookingsByUser(String userId) {
        return bookings.values().stream()
                .filter(b -> b.userId().equals(userId))
                .sorted(Comparator.comparing(Models.Booking::createdAt).reversed())
                .toList();
    }

    private void promoteWaitlist(String eventId, String tierId) {
        Models.Event event = getEvent(eventId);
        Models.TicketTier tier = findTier(event, tierId).orElse(null);
        if (tier == null) {
            return;
        }
        int remaining = tier.capacity() - tier.soldCount() - tier.reservedCount();
        if (remaining <= 0) {
            return;
        }

        Optional<Models.WaitlistEntry> candidate = waitlistEntries.values().stream()
                .filter(w -> w.eventId().equals(eventId) && w.tierId().equals(tierId) && w.status() == Models.WaitlistStatus.ACTIVE)
                .sorted(Comparator.comparingInt(Models.WaitlistEntry::rank))
                .filter(w -> w.quantity() <= remaining)
                .findFirst();

        candidate.ifPresent(entry -> waitlistEntries.put(entry.waitlistId(), new Models.WaitlistEntry(
                entry.waitlistId(),
                entry.eventId(),
                entry.userId(),
                entry.tierId(),
                entry.quantity(),
                entry.rank(),
                Models.WaitlistStatus.PROMOTED,
                entry.createdAt()
        )));
    }

    private Optional<Models.TicketTier> findTier(Models.Event event, String tierId) {
        return event.tiers().stream().filter(t -> t.tierId().equals(tierId)).findFirst();
    }

    private void replaceTier(Models.Event event, Models.TicketTier updatedTier) {
        List<Models.TicketTier> tiers = event.tiers().stream()
                .map(t -> t.tierId().equals(updatedTier.tierId()) ? updatedTier : t)
                .collect(Collectors.toList());

        Models.Event updatedEvent = new Models.Event(
                event.eventId(),
                event.organizerId(),
                event.title(),
                event.city(),
                event.venue(),
                event.startAt(),
                event.endAt(),
                event.status(),
                tiers
        );
        events.put(event.eventId(), updatedEvent);
    }

    private void expireHoldsIfNeeded() {
        Instant now = Instant.now();
        List<Models.Hold> toExpire = holds.values().stream()
                .filter(h -> h.status() == Models.HoldStatus.HELD && h.expiresAt().isBefore(now))
                .toList();

        for (Models.Hold hold : toExpire) {
            Models.Event event = events.get(hold.eventId());
            if (event == null) {
                continue;
            }
            Models.TicketTier tier = findTier(event, hold.tierId()).orElse(null);
            if (tier == null) {
                continue;
            }
            Models.TicketTier updatedTier = new Models.TicketTier(
                    tier.tierId(),
                    tier.name(),
                    tier.price(),
                    tier.capacity(),
                    tier.soldCount(),
                    Math.max(0, tier.reservedCount() - hold.quantity())
            );
            replaceTier(event, updatedTier);

            holds.put(hold.holdId(), new Models.Hold(
                    hold.holdId(),
                    hold.userId(),
                    hold.eventId(),
                    hold.tierId(),
                    hold.quantity(),
                    hold.expiresAt(),
                    Models.HoldStatus.EXPIRED,
                    hold.amount(),
                    hold.idempotencyKey()
            ));
        }
    }

    private String extractTierFromHold(String holdId) {
        Models.Hold hold = holds.get(holdId);
        if (hold == null) {
            throw new IllegalArgumentException("Related hold not found");
        }
        return hold.tierId();
    }

    public Map<String, Object> healthView() {
        Map<String, Object> data = new HashMap<>();
        data.put("events", events.size());
        data.put("holds", holds.size());
        data.put("bookings", bookings.size());
        data.put("waitlist", waitlistEntries.size());
        return data;
    }
}
