package com.miniprojects.trading.dto;

import com.miniprojects.trading.model.TradingOrder;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public record SubmitOrderRequest(
  @NotBlank String userId,
  @NotBlank String symbol,
  @NotNull TradingOrder.Side side,
  @NotNull TradingOrder.Type type,
  @Min(1) int quantity,
  BigDecimal limitPrice
) {
}
