package com.miniprojects.notifications.dto;

import jakarta.validation.constraints.NotBlank;

public record UpdatePreferenceRequest(
  boolean emailEnabled,
  boolean smsEnabled,
  boolean pushEnabled,
  boolean inAppEnabled,
  @NotBlank String quietHoursStart,
  @NotBlank String quietHoursEnd,
  @NotBlank String locale
) {
}
