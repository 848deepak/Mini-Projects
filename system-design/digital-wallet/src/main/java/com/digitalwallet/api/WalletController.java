package com.digitalwallet.api;

import com.digitalwallet.api.dto.CreateWalletRequest;
import com.digitalwallet.api.dto.CreateWalletResponse;
import com.digitalwallet.api.dto.P2PTransferRequest;
import com.digitalwallet.api.dto.TransferResponse;
import com.digitalwallet.api.dto.WalletBalanceResponse;
import com.digitalwallet.service.WalletService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@RequestMapping("/v1")
public class WalletController {

    private final WalletService walletService;

    public WalletController(WalletService walletService) {
        this.walletService = walletService;
    }

    @PostMapping("/wallets")
    @ResponseStatus(HttpStatus.CREATED)
    public CreateWalletResponse createWallet(@Valid @RequestBody CreateWalletRequest request) {
        return walletService.createWallet(request);
    }

    @GetMapping("/wallets/{walletId}/balance")
    public WalletBalanceResponse getBalance(@PathVariable UUID walletId) {
        return walletService.getBalance(walletId);
    }

    @PostMapping("/transfers/p2p")
    public TransferResponse p2pTransfer(@Valid @RequestBody P2PTransferRequest request) {
        return walletService.transferP2P(request);
    }
}
