package com.miniproject.realtimenotificationsystem.repository;

import com.miniproject.realtimenotificationsystem.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
}
