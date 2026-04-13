package com.miniprojects.notifications.dto;

public record PreferenceResponse(
  String userId,
  boolean emailEnabled,
  boolean smsEnabled,
  boolean pushEnabled,
  boolean inAppEnabled,
  String quietHoursStart,
  String quietHoursEnd,
  String locale
) {
}
