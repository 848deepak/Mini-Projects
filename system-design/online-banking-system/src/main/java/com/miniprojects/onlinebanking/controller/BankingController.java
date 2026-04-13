package com.miniprojects.onlinebanking.controller;

import com.miniprojects.onlinebanking.dto.AccountResponse;
import com.miniprojects.onlinebanking.dto.CreateAccountRequest;
import com.miniprojects.onlinebanking.dto.TransactionResponse;
import com.miniprojects.onlinebanking.dto.TransferRequest;
import com.miniprojects.onlinebanking.dto.TransferResponse;
import com.miniprojects.onlinebanking.service.BankingService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collection;
import java.util.List;

@RestController
@RequestMapping("/api")
public class BankingController {

  private final BankingService bankingService;

  public BankingController(BankingService bankingService) {
    this.bankingService = bankingService;
  }

  @GetMapping("/accounts")
  public Collection<AccountResponse> listAccounts() {
    return bankingService.listAccounts();
  }

  @GetMapping("/accounts/{accountId}")
  public AccountResponse getAccount(@PathVariable String accountId) {
    return bankingService.getAccount(accountId);
  }

  @GetMapping("/accounts/{accountId}/transactions")
  public List<TransactionResponse> getTransactions(@PathVariable String accountId) {
    return bankingService.getTransactions(accountId);
  }

  @PostMapping("/accounts")
  @ResponseStatus(HttpStatus.CREATED)
  public AccountResponse createAccount(@Valid @RequestBody CreateAccountRequest request) {
    return bankingService.createAccount(request);
  }

  @PostMapping("/transfers")
  @ResponseStatus(HttpStatus.CREATED)
  public TransferResponse transfer(@Valid @RequestBody TransferRequest request) {
    return bankingService.transfer(request);
  }
}
