package com.digitalwallet.repository;

import com.digitalwallet.domain.WalletTxn;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface WalletTxnRepository extends JpaRepository<WalletTxn, UUID> {
}
