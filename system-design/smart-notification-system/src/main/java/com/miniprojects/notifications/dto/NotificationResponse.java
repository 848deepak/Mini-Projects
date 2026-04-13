package com.miniprojects.notifications.dto;

import com.miniprojects.notifications.model.Channel;
import com.miniprojects.notifications.model.NotificationStatus;

import java.time.Instant;
import java.util.List;

public record NotificationResponse(
  String id,
  String userId,
  String title,
  String body,
  Channel requestedChannel,
  Channel routedChannel,
  List<Channel> fallbackChannels,
  NotificationStatus status,
  String failureReason,
  Instant createdAt,
  Instant deliveredAt,
  int attempts
) {
}
