package com.miniprojects.trading.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record MarketTickRequest(
  @NotBlank String symbol,
  @NotNull BigDecimal price,
  @Min(1) long volume
) {
}
