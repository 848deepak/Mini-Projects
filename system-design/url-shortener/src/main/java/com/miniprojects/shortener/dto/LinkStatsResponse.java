package com.miniprojects.shortener.dto;

import java.time.Instant;

public record LinkStatsResponse(
  String code,
  long clickCount,
  boolean enabled,
  Instant createdAt,
  Instant expiresAt
) {
}
