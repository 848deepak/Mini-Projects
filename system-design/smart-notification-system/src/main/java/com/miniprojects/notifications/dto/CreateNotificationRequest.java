package com.miniprojects.notifications.dto;

import com.miniprojects.notifications.model.Channel;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record CreateNotificationRequest(
  @NotBlank String userId,
  @NotBlank String title,
  @NotBlank String body,
  @NotNull Channel preferredChannel,
  List<Channel> fallbackChannels
) {
}
