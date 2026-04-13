package com.miniprojects.shortener.model;

import java.time.Instant;

public class ShortLink {

  private final String code;
  private final String longUrl;
  private final String customAlias;
  private final String ownerId;
  private final Instant createdAt;
  private final Instant expiresAt;
  private boolean enabled;
  private long clickCount;

  public ShortLink(String code, String longUrl, String customAlias, String ownerId, Instant createdAt, Instant expiresAt) {
    this.code = code;
    this.longUrl = longUrl;
    this.customAlias = customAlias;
    this.ownerId = ownerId;
    this.createdAt = createdAt;
    this.expiresAt = expiresAt;
    this.enabled = true;
  }

  public String getCode() {
    return code;
  }

  public String getLongUrl() {
    return longUrl;
  }

  public String getCustomAlias() {
    return customAlias;
  }

  public String getOwnerId() {
    return ownerId;
  }

  public Instant getCreatedAt() {
    return createdAt;
  }

  public Instant getExpiresAt() {
    return expiresAt;
  }

  public boolean isEnabled() {
    return enabled;
  }

  public void setEnabled(boolean enabled) {
    this.enabled = enabled;
  }

  public long getClickCount() {
    return clickCount;
  }

  public void incrementClickCount() {
    this.clickCount += 1;
  }
}
