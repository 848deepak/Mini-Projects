package com.miniprojects.onlinebanking.model;

import java.math.BigDecimal;
import java.time.Instant;

public class BankTransaction {

  public enum Type {
    ACCOUNT_OPENED,
    TRANSFER_IN,
    TRANSFER_OUT
  }

  private final String id;
  private final Type type;
  private final BigDecimal amount;
  private final String fromAccountId;
  private final String toAccountId;
  private final String note;
  private final Instant timestamp;

  public BankTransaction(String id, Type type, BigDecimal amount, String fromAccountId, String toAccountId, String note, Instant timestamp) {
    this.id = id;
    this.type = type;
    this.amount = amount;
    this.fromAccountId = fromAccountId;
    this.toAccountId = toAccountId;
    this.note = note;
    this.timestamp = timestamp;
  }

  public String getId() {
    return id;
  }

  public Type getType() {
    return type;
  }

  public BigDecimal getAmount() {
    return amount;
  }

  public String getFromAccountId() {
    return fromAccountId;
  }

  public String getToAccountId() {
    return toAccountId;
  }

  public String getNote() {
    return note;
  }

  public Instant getTimestamp() {
    return timestamp;
  }
}
