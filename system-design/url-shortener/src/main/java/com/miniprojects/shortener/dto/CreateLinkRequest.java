package com.miniprojects.shortener.dto;

import jakarta.validation.constraints.NotBlank;

public record CreateLinkRequest(
  @NotBlank String longUrl,
  String customAlias,
  String ownerId,
  Integer expiresInDays
) {
}
