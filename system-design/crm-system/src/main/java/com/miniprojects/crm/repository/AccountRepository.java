package com.miniprojects.crm.repository;

import com.miniprojects.crm.model.Account;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AccountRepository extends JpaRepository<Account, String> {}
