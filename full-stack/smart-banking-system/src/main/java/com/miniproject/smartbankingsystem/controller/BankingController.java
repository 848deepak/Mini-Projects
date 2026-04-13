package com.miniproject.smartbankingsystem.controller;

import com.miniproject.smartbankingsystem.model.BankAccount;
import com.miniproject.smartbankingsystem.repository.BankAccountRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/accounts")
@CrossOrigin(origins = "http://localhost:3000")
public class BankingController {

    private final BankAccountRepository repository;

    public BankingController(BankAccountRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<BankAccount> getAllAccounts() {
        return repository.findAll();
    }

    @PostMapping("/create")
    public BankAccount createAccount(@Valid @RequestBody BankAccount account) {
        return repository.save(account);
    }

    @PostMapping("/transaction/{id}")
    public ResponseEntity<BankAccount> performTransaction(@PathVariable Long id, @RequestBody TransactionRequest request) {
        BankAccount acc = repository.findById(id).orElseThrow();
        if ("Deposit".equalsIgnoreCase(request.type())) {
            acc.setBalance(acc.getBalance() + request.amount());
        } else if ("Withdraw".equalsIgnoreCase(request.type()) && acc.getBalance() >= request.amount()) {
            acc.setBalance(acc.getBalance() - request.amount());
        } else {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(repository.save(acc));
    }
    
    public record TransactionRequest(String type, Double amount) {}
}
