package com.miniprojects.courier.api.dto;

public record TrackEventResponse(
    boolean accepted,
    String eventId
) {
}
