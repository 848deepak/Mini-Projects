package com.miniprojects.onlinebanking.service;

import com.miniprojects.onlinebanking.dto.AccountResponse;
import com.miniprojects.onlinebanking.dto.CreateAccountRequest;
import com.miniprojects.onlinebanking.dto.TransactionResponse;
import com.miniprojects.onlinebanking.dto.TransferRequest;
import com.miniprojects.onlinebanking.dto.TransferResponse;
import com.miniprojects.onlinebanking.exception.InsufficientFundsException;
import com.miniprojects.onlinebanking.exception.NotFoundException;
import com.miniprojects.onlinebanking.model.BankAccount;
import com.miniprojects.onlinebanking.model.BankTransaction;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class BankingService {

  private final Map<String, BankAccount> accounts = new ConcurrentHashMap<>();
  private final Map<String, List<BankTransaction>> transactions = new ConcurrentHashMap<>();
  private final AtomicLong accountSequence = new AtomicLong(100_000);

  public BankingService() {
    seedDemoData();
  }

  public synchronized AccountResponse createAccount(CreateAccountRequest request) {
    String id = nextAccountId();
    String accountNumber = "ACC-" + accountSequence.incrementAndGet();
    BigDecimal openingBalance = normalizeMoney(request.openingBalance());
    BankAccount account = new BankAccount(id, request.ownerName(), accountNumber, request.currency().toUpperCase(), openingBalance, Instant.now());
    accounts.put(id, account);
    addTransaction(id, new BankTransaction(nextTransactionId(), BankTransaction.Type.ACCOUNT_OPENED, openingBalance, null, id, "Account opened", Instant.now()));
    return toAccountResponse(account);
  }

  public Collection<AccountResponse> listAccounts() {
    return accounts.values().stream().map(this::toAccountResponse).sorted(Comparator.comparing(AccountResponse::createdAt).reversed()).toList();
  }

  public AccountResponse getAccount(String accountId) {
    return toAccountResponse(findAccount(accountId));
  }

  public List<TransactionResponse> getTransactions(String accountId) {
    findAccount(accountId);
    return transactions.getOrDefault(accountId, List.of()).stream().map(this::toTransactionResponse).toList();
  }

  public synchronized TransferResponse transfer(TransferRequest request) {
    if (request.fromAccountId().equals(request.toAccountId())) {
      throw new IllegalArgumentException("Source and destination accounts must be different");
    }

    BankAccount source = findAccount(request.fromAccountId());
    BankAccount target = findAccount(request.toAccountId());

    if (!source.getCurrency().equals(target.getCurrency())) {
      throw new IllegalArgumentException("Currency mismatch between accounts");
    }

    BigDecimal amount = normalizeMoney(request.amount());
    if (source.getBalance().compareTo(amount) < 0) {
      throw new InsufficientFundsException("Insufficient funds in source account");
    }

    source.setBalance(normalizeMoney(source.getBalance().subtract(amount)));
    target.setBalance(normalizeMoney(target.getBalance().add(amount)));

    Instant now = Instant.now();
    String transferId = nextTransactionId();

    BankTransaction debit = new BankTransaction(
      transferId + "-OUT",
      BankTransaction.Type.TRANSFER_OUT,
      amount,
      source.getId(),
      target.getId(),
      request.note(),
      now
    );
    BankTransaction credit = new BankTransaction(
      transferId + "-IN",
      BankTransaction.Type.TRANSFER_IN,
      amount,
      source.getId(),
      target.getId(),
      request.note(),
      now
    );

    addTransaction(source.getId(), debit);
    addTransaction(target.getId(), credit);

    return new TransferResponse(transferId, source.getId(), target.getId(), amount, "COMPLETED", now);
  }

  private void seedDemoData() {
    createSeedAccount("Aditi Sharma", "INR", new BigDecimal("25000.00"));
    createSeedAccount("Rohan Verma", "INR", new BigDecimal("9800.00"));
    createSeedAccount("Meera Kapoor", "INR", new BigDecimal("15450.00"));
  }

  private void createSeedAccount(String ownerName, String currency, BigDecimal balance) {
    String id = nextAccountId();
    String accountNumber = "ACC-" + accountSequence.incrementAndGet();
    BankAccount account = new BankAccount(id, ownerName, accountNumber, currency, normalizeMoney(balance), Instant.now());
    accounts.put(id, account);
    addTransaction(id, new BankTransaction(nextTransactionId(), BankTransaction.Type.ACCOUNT_OPENED, balance, null, id, "Seed account", Instant.now()));
  }

  private BankAccount findAccount(String accountId) {
    BankAccount account = accounts.get(accountId);
    if (account == null) {
      throw new NotFoundException("Account not found: " + accountId);
    }
    return account;
  }

  private void addTransaction(String accountId, BankTransaction transaction) {
    transactions.computeIfAbsent(accountId, ignored -> new ArrayList<>()).add(0, transaction);
  }

  private AccountResponse toAccountResponse(BankAccount account) {
    return new AccountResponse(
      account.getId(),
      account.getOwnerName(),
      account.getAccountNumber(),
      account.getCurrency(),
      account.getBalance(),
      account.getCreatedAt()
    );
  }

  private TransactionResponse toTransactionResponse(BankTransaction transaction) {
    return new TransactionResponse(
      transaction.getId(),
      transaction.getType(),
      transaction.getAmount(),
      transaction.getFromAccountId(),
      transaction.getToAccountId(),
      transaction.getNote(),
      transaction.getTimestamp()
    );
  }

  private BigDecimal normalizeMoney(BigDecimal amount) {
    return amount.setScale(2, RoundingMode.HALF_UP);
  }

  private String nextAccountId() {
    return "acct-" + accountSequence.incrementAndGet();
  }

  private String nextTransactionId() {
    return "txn-" + Long.toHexString(System.nanoTime()).toUpperCase();
  }
}
