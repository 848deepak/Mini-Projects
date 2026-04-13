package com.miniprojects.shortener.dto;

import java.time.Instant;

public record LinkResponse(
  String code,
  String longUrl,
  String shortUrl,
  String customAlias,
  boolean enabled,
  long clickCount,
  Instant createdAt,
  Instant expiresAt
) {
}
