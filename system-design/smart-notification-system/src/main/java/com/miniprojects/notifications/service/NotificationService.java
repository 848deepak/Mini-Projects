package com.miniprojects.notifications.service;

import com.miniprojects.notifications.dto.CreateNotificationRequest;
import com.miniprojects.notifications.dto.NotificationResponse;
import com.miniprojects.notifications.dto.PreferenceResponse;
import com.miniprojects.notifications.dto.UpdatePreferenceRequest;
import com.miniprojects.notifications.exception.ConflictException;
import com.miniprojects.notifications.exception.NotFoundException;
import com.miniprojects.notifications.model.Channel;
import com.miniprojects.notifications.model.Notification;
import com.miniprojects.notifications.model.NotificationStatus;
import com.miniprojects.notifications.model.UserPreference;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class NotificationService {

  private final Map<String, Notification> notifications = new ConcurrentHashMap<>();
  private final Map<String, UserPreference> preferences = new ConcurrentHashMap<>();
  private final AtomicLong sequence = new AtomicLong(5000);

  public NotificationService() {
    seedPreferences();
  }

  public synchronized PreferenceResponse upsertPreference(String userId, UpdatePreferenceRequest request) {
    UserPreference preference = preferences.computeIfAbsent(userId, key -> new UserPreference(key, true, true, true, true, null, null, request.locale()));
    preference.setEmailEnabled(request.emailEnabled());
    preference.setSmsEnabled(request.smsEnabled());
    preference.setPushEnabled(request.pushEnabled());
    preference.setInAppEnabled(request.inAppEnabled());
    preference.setQuietHoursStart(request.quietHoursStart());
    preference.setQuietHoursEnd(request.quietHoursEnd());
    preference.setLocale(request.locale());
    return toPreferenceResponse(preference);
  }

  public PreferenceResponse getPreference(String userId) {
    return toPreferenceResponse(findPreference(userId));
  }

  public synchronized NotificationResponse send(CreateNotificationRequest request) {
    Notification notification = buildNotification(request);
    route(notification, findPreference(request.userId()));
    notifications.put(notification.getId(), notification);
    return toNotificationResponse(notification);
  }

  public NotificationResponse retry(String notificationId) {
    Notification notification = findNotification(notificationId);
    if (notification.getStatus() == NotificationStatus.SENT) {
      throw new ConflictException("Notification already delivered");
    }

    route(notification, findPreference(notification.getUserId()));
    return toNotificationResponse(notification);
  }

  public NotificationResponse getNotification(String notificationId) {
    return toNotificationResponse(findNotification(notificationId));
  }

  public Collection<NotificationResponse> listNotificationsForUser(String userId) {
    return notifications.values().stream()
      .filter(notification -> notification.getUserId().equals(userId))
      .map(this::toNotificationResponse)
      .sorted((left, right) -> right.createdAt().compareTo(left.createdAt()))
      .toList();
  }

  private void route(Notification notification, UserPreference preference) {
    notification.incrementAttempts();
    List<Channel> candidates = new ArrayList<>();
    candidates.add(notification.getRequestedChannel());
    candidates.addAll(notification.getFallbackChannels());

    for (Channel channel : candidates) {
      if (!preference.isChannelEnabled(channel)) {
        continue;
      }

      if (preference.isQuietHours() && channel != Channel.IN_APP && channel != Channel.WEBHOOK) {
        continue;
      }

      notification.setRoutedChannel(channel);
      notification.setStatus(NotificationStatus.SENT);
      notification.setDeliveredAt(Instant.now());
      notification.setFailureReason(null);
      return;
    }

    notification.setStatus(NotificationStatus.FAILED);
    notification.setFailureReason("No eligible channel matched preferences or quiet hours");
  }

  private Notification buildNotification(CreateNotificationRequest request) {
    return new Notification(
      "notif-" + sequence.incrementAndGet(),
      request.userId(),
      request.title(),
      request.body(),
      request.preferredChannel(),
      request.fallbackChannels() == null ? List.of() : request.fallbackChannels(),
      Instant.now()
    );
  }

  private Notification findNotification(String notificationId) {
    Notification notification = notifications.get(notificationId);
    if (notification == null) {
      throw new NotFoundException("Notification not found: " + notificationId);
    }
    return notification;
  }

  private UserPreference findPreference(String userId) {
    return preferences.computeIfAbsent(userId, key -> new UserPreference(key, true, true, true, true, null, null, "en-US"));
  }

  private PreferenceResponse toPreferenceResponse(UserPreference preference) {
    return new PreferenceResponse(
      preference.getUserId(),
      preference.isChannelEnabled(Channel.EMAIL),
      preference.isChannelEnabled(Channel.SMS),
      preference.isChannelEnabled(Channel.PUSH),
      preference.isChannelEnabled(Channel.IN_APP),
      preference.getQuietHoursStart(),
      preference.getQuietHoursEnd(),
      preference.getLocale()
    );
  }

  private NotificationResponse toNotificationResponse(Notification notification) {
    return new NotificationResponse(
      notification.getId(),
      notification.getUserId(),
      notification.getTitle(),
      notification.getBody(),
      notification.getRequestedChannel(),
      notification.getRoutedChannel(),
      notification.getFallbackChannels(),
      notification.getStatus(),
      notification.getFailureReason(),
      notification.getCreatedAt(),
      notification.getDeliveredAt(),
      notification.getAttempts()
    );
  }

  private void seedPreferences() {
    preferences.put("user-1001", new UserPreference("user-1001", true, true, true, true, "22:00", "07:00", "en-US"));
    preferences.put("user-1002", new UserPreference("user-1002", true, false, true, true, null, null, "en-IN"));
  }
}
