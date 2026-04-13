package com.miniprojects.notifications.model;

import java.time.Instant;
import java.util.List;

public class Notification {

  private final String id;
  private final String userId;
  private final String title;
  private final String body;
  private final Channel requestedChannel;
  private final List<Channel> fallbackChannels;
  private final Instant createdAt;
  private NotificationStatus status;
  private Channel routedChannel;
  private String failureReason;
  private Instant deliveredAt;
  private int attempts;

  public Notification(String id, String userId, String title, String body, Channel requestedChannel, List<Channel> fallbackChannels, Instant createdAt) {
    this.id = id;
    this.userId = userId;
    this.title = title;
    this.body = body;
    this.requestedChannel = requestedChannel;
    this.fallbackChannels = fallbackChannels;
    this.createdAt = createdAt;
    this.status = NotificationStatus.QUEUED;
  }

  public String getId() {
    return id;
  }

  public String getUserId() {
    return userId;
  }

  public String getTitle() {
    return title;
  }

  public String getBody() {
    return body;
  }

  public Channel getRequestedChannel() {
    return requestedChannel;
  }

  public List<Channel> getFallbackChannels() {
    return fallbackChannels;
  }

  public Instant getCreatedAt() {
    return createdAt;
  }

  public NotificationStatus getStatus() {
    return status;
  }

  public void setStatus(NotificationStatus status) {
    this.status = status;
  }

  public Channel getRoutedChannel() {
    return routedChannel;
  }

  public void setRoutedChannel(Channel routedChannel) {
    this.routedChannel = routedChannel;
  }

  public String getFailureReason() {
    return failureReason;
  }

  public void setFailureReason(String failureReason) {
    this.failureReason = failureReason;
  }

  public Instant getDeliveredAt() {
    return deliveredAt;
  }

  public void setDeliveredAt(Instant deliveredAt) {
    this.deliveredAt = deliveredAt;
  }

  public int getAttempts() {
    return attempts;
  }

  public void incrementAttempts() {
    this.attempts += 1;
  }
}
