package com.miniprojects.trading.dto;

import java.math.BigDecimal;
import java.util.Map;

public record PortfolioResponse(
  String userId,
  BigDecimal cashBalance,
  BigDecimal marketValue,
  BigDecimal pnl,
  Map<String, Integer> holdings
) {
}
