package com.ecommerce.oms.api.dto;

import java.math.BigDecimal;

public record OrderItemView(
        String sku,
        String name,
        int quantity,
        BigDecimal unitPrice,
        BigDecimal lineTotal
) {
}
