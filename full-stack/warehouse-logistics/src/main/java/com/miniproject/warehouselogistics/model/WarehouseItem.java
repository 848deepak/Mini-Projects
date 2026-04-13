package com.miniproject.warehouselogistics.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import java.util.UUID;

@Entity
public class WarehouseItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String sku = "SKU-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

    @NotBlank(message = "Item Name required")
    private String name;

    @NotBlank(message = "Category required")
    private String category; // Electronics, Furniture, Clothing, Hardware

    @Min(value = 0, message = "Quantity cannot be negative")
    private int quantity = 0;

    private String aisle; // Location in warehouse (e.g. A1, B4)

    private String status = "In Stock"; // In Stock, Low Stock, Out of Stock, In Transit

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getSku() { return sku; }
    public void setSku(String sku) { this.sku = sku; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }
    public String getAisle() { return aisle; }
    public void setAisle(String aisle) { this.aisle = aisle; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
