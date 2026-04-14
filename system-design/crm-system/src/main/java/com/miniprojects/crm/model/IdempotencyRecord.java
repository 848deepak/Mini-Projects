package com.miniprojects.crm.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "idempotency_records")
public class IdempotencyRecord {

    @Id
    private String id;

    @Column(nullable = false, unique = true)
    private String keyValue;

    @Column(nullable = false)
    private String responseRef;

    @Column(nullable = false)
    private Instant createdAt;

    public IdempotencyRecord() {}

    @PrePersist
    public void onCreate() {
        if (id == null || id.isBlank()) {
            id = UUID.randomUUID().toString();
        }
        if (createdAt == null) {
            createdAt = Instant.now();
        }
    }

    public String getId() { return id; }
    public String getKeyValue() { return keyValue; }
    public void setKeyValue(String keyValue) { this.keyValue = keyValue; }
    public String getResponseRef() { return responseRef; }
    public void setResponseRef(String responseRef) { this.responseRef = responseRef; }
}
