package com.miniprojects.notifications.model;

public class UserPreference {

  private final String userId;
  private boolean emailEnabled;
  private boolean smsEnabled;
  private boolean pushEnabled;
  private boolean inAppEnabled;
  private String quietHoursStart;
  private String quietHoursEnd;
  private String locale;

  public UserPreference(String userId, boolean emailEnabled, boolean smsEnabled, boolean pushEnabled, boolean inAppEnabled, String quietHoursStart, String quietHoursEnd, String locale) {
    this.userId = userId;
    this.emailEnabled = emailEnabled;
    this.smsEnabled = smsEnabled;
    this.pushEnabled = pushEnabled;
    this.inAppEnabled = inAppEnabled;
    this.quietHoursStart = quietHoursStart;
    this.quietHoursEnd = quietHoursEnd;
    this.locale = locale;
  }

  public String getUserId() {
    return userId;
  }

  public boolean isChannelEnabled(Channel channel) {
    return switch (channel) {
      case EMAIL -> emailEnabled;
      case SMS -> smsEnabled;
      case PUSH -> pushEnabled;
      case IN_APP -> inAppEnabled;
      case WEBHOOK -> true;
    };
  }

  public boolean isQuietHours() {
    if (quietHoursStart == null || quietHoursEnd == null || quietHoursStart.isBlank() || quietHoursEnd.isBlank()) {
      return false;
    }

    String now = java.time.LocalTime.now().toString().substring(0, 5);
    return quietHoursStart.compareTo(now) <= 0 && now.compareTo(quietHoursEnd) <= 0;
  }

  public String getQuietHoursStart() {
    return quietHoursStart;
  }

  public void setQuietHoursStart(String quietHoursStart) {
    this.quietHoursStart = quietHoursStart;
  }

  public String getQuietHoursEnd() {
    return quietHoursEnd;
  }

  public void setQuietHoursEnd(String quietHoursEnd) {
    this.quietHoursEnd = quietHoursEnd;
  }

  public String getLocale() {
    return locale;
  }

  public void setLocale(String locale) {
    this.locale = locale;
  }

  public void setEmailEnabled(boolean emailEnabled) {
    this.emailEnabled = emailEnabled;
  }

  public void setSmsEnabled(boolean smsEnabled) {
    this.smsEnabled = smsEnabled;
  }

  public void setPushEnabled(boolean pushEnabled) {
    this.pushEnabled = pushEnabled;
  }

  public void setInAppEnabled(boolean inAppEnabled) {
    this.inAppEnabled = inAppEnabled;
  }
}
