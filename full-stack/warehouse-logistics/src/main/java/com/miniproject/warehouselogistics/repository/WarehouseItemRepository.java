package com.miniproject.warehouselogistics.repository;

import com.miniproject.warehouselogistics.model.WarehouseItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WarehouseItemRepository extends JpaRepository<WarehouseItem, Long> {
}
