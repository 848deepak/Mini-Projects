package com.miniprojects.trading.dto;

import com.miniprojects.trading.model.TradingOrder;

import java.math.BigDecimal;
import java.time.Instant;

public record OrderResponse(
  String id,
  String userId,
  String symbol,
  TradingOrder.Side side,
  TradingOrder.Type type,
  int quantity,
  BigDecimal limitPrice,
  TradingOrder.Status status,
  int filledQuantity,
  Instant createdAt
) {
}
