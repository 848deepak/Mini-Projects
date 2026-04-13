package com.miniprojects.notifications.controller;

import com.miniprojects.notifications.dto.CreateNotificationRequest;
import com.miniprojects.notifications.dto.NotificationResponse;
import com.miniprojects.notifications.dto.PreferenceResponse;
import com.miniprojects.notifications.dto.UpdatePreferenceRequest;
import com.miniprojects.notifications.service.NotificationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collection;

@RestController
@RequestMapping("/api")
public class NotificationController {

  private final NotificationService notificationService;

  public NotificationController(NotificationService notificationService) {
    this.notificationService = notificationService;
  }

  @PostMapping("/notifications")
  @ResponseStatus(HttpStatus.CREATED)
  public NotificationResponse send(@Valid @RequestBody CreateNotificationRequest request) {
    return notificationService.send(request);
  }

  @PostMapping("/notifications/{notificationId}/retry")
  public NotificationResponse retry(@PathVariable String notificationId) {
    return notificationService.retry(notificationId);
  }

  @GetMapping("/notifications/{notificationId}")
  public NotificationResponse getNotification(@PathVariable String notificationId) {
    return notificationService.getNotification(notificationId);
  }

  @GetMapping("/users/{userId}/notifications")
  public Collection<NotificationResponse> listNotifications(@PathVariable String userId) {
    return notificationService.listNotificationsForUser(userId);
  }

  @GetMapping("/preferences/{userId}")
  public PreferenceResponse getPreference(@PathVariable String userId) {
    return notificationService.getPreference(userId);
  }

  @PutMapping("/preferences/{userId}")
  public PreferenceResponse updatePreference(@PathVariable String userId, @Valid @RequestBody UpdatePreferenceRequest request) {
    return notificationService.upsertPreference(userId, request);
  }
}
