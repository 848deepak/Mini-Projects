package com.miniproject.smartbankingsystem.repository;

import com.miniproject.smartbankingsystem.model.BankAccount;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BankAccountRepository extends JpaRepository<BankAccount, Long> {
}
