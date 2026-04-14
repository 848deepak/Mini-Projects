package com.digitalwallet.service;

import com.digitalwallet.api.dto.CreateWalletRequest;
import com.digitalwallet.api.dto.CreateWalletResponse;
import com.digitalwallet.api.dto.P2PTransferRequest;
import com.digitalwallet.api.dto.TransferResponse;
import com.digitalwallet.api.dto.WalletBalanceResponse;
import com.digitalwallet.domain.IdempotencyRecord;
import com.digitalwallet.domain.LedgerEntry;
import com.digitalwallet.domain.WalletAccount;
import com.digitalwallet.domain.WalletTxn;
import com.digitalwallet.domain.enums.EntryType;
import com.digitalwallet.domain.enums.KycLevel;
import com.digitalwallet.domain.enums.TxnStatus;
import com.digitalwallet.domain.enums.TxnType;
import com.digitalwallet.domain.enums.WalletStatus;
import com.digitalwallet.exception.ApiException;
import com.digitalwallet.repository.IdempotencyRecordRepository;
import com.digitalwallet.repository.LedgerEntryRepository;
import com.digitalwallet.repository.WalletAccountRepository;
import com.digitalwallet.repository.WalletTxnRepository;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.Duration;
import java.time.Instant;
import java.util.HexFormat;
import java.util.Optional;
import java.util.UUID;

@Service
public class WalletService {

    private static final String IDEMPOTENCY_SCOPE = "p2p-transfer";

    private final WalletAccountRepository walletAccountRepository;
    private final WalletTxnRepository walletTxnRepository;
    private final LedgerEntryRepository ledgerEntryRepository;
    private final IdempotencyRecordRepository idempotencyRecordRepository;
    private final StringRedisTemplate redisTemplate;
    private final NotificationPublisher notificationPublisher;

    public WalletService(
            WalletAccountRepository walletAccountRepository,
            WalletTxnRepository walletTxnRepository,
            LedgerEntryRepository ledgerEntryRepository,
            IdempotencyRecordRepository idempotencyRecordRepository,
            StringRedisTemplate redisTemplate,
            NotificationPublisher notificationPublisher
    ) {
        this.walletAccountRepository = walletAccountRepository;
        this.walletTxnRepository = walletTxnRepository;
        this.ledgerEntryRepository = ledgerEntryRepository;
        this.idempotencyRecordRepository = idempotencyRecordRepository;
        this.redisTemplate = redisTemplate;
        this.notificationPublisher = notificationPublisher;
    }

    @Transactional
    public CreateWalletResponse createWallet(CreateWalletRequest request) {
        WalletAccount wallet = new WalletAccount();
        wallet.setWalletId(UUID.randomUUID());
        wallet.setUserId(request.userId());
        wallet.setCurrency(request.currency().toUpperCase());
        wallet.setKycLevel(KycLevel.BASIC);
        wallet.setStatus(WalletStatus.ACTIVE);
        wallet.setAvailableBalance(BigDecimal.ZERO);
        wallet.setPendingBalance(BigDecimal.ZERO);
        wallet.setCreatedAt(Instant.now());

        WalletAccount saved = walletAccountRepository.save(wallet);
        return new CreateWalletResponse(
                saved.getWalletId(),
                saved.getUserId(),
                saved.getStatus(),
                saved.getKycLevel(),
                saved.getCurrency()
        );
    }

    public WalletBalanceResponse getBalance(UUID walletId) {
        String cacheKey = cacheKey(walletId);
        String cached = null;
        try {
            cached = redisTemplate.opsForValue().get(cacheKey);
        } catch (RuntimeException ignored) {
            // Redis is an optimization layer; wallet reads must still work without it.
        }
        if (cached != null) {
            String[] parts = cached.split(":", 4);
            return new WalletBalanceResponse(
                    new BigDecimal(parts[0]),
                    new BigDecimal(parts[1]),
                    parts[2],
                    Instant.parse(parts[3])
            );
        }

        WalletAccount wallet = walletAccountRepository.findById(walletId)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Wallet not found"));

        Instant now = Instant.now();
        WalletBalanceResponse response = new WalletBalanceResponse(
                wallet.getAvailableBalance(),
                wallet.getPendingBalance(),
                wallet.getCurrency(),
                now
        );

        String payload = response.available().toPlainString() + ":"
                + response.pending().toPlainString() + ":"
                + response.currency() + ":"
                + response.asOf();
        try {
            redisTemplate.opsForValue().set(cacheKey, payload, Duration.ofSeconds(10));
        } catch (RuntimeException ignored) {
            // Best-effort cache populate.
        }

        return response;
    }

    @Transactional
    public TransferResponse transferP2P(P2PTransferRequest request) {
        if (request.fromWalletId().equals(request.toWalletId())) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Sender and receiver wallet cannot be same");
        }

        String recordId = IDEMPOTENCY_SCOPE + ":" + request.idempotencyKey();
        Optional<IdempotencyRecord> existing = idempotencyRecordRepository.findById(recordId);
        if (existing.isPresent()) {
            throw new ApiException(HttpStatus.CONFLICT, "Duplicate request with same idempotencyKey");
        }

        WalletAccount from = walletAccountRepository.findByWalletIdForUpdate(request.fromWalletId())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Sender wallet not found"));
        WalletAccount to = walletAccountRepository.findByWalletIdForUpdate(request.toWalletId())
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Receiver wallet not found"));

        validateTransferRequest(request, from, to);

        if (from.getAvailableBalance().compareTo(request.amount()) < 0) {
            throw new ApiException(HttpStatus.CONFLICT, "Insufficient funds");
        }

        from.setAvailableBalance(from.getAvailableBalance().subtract(request.amount()));
        to.setAvailableBalance(to.getAvailableBalance().add(request.amount()));

        UUID txnId = UUID.randomUUID();
        Instant now = Instant.now();

        WalletTxn txn = new WalletTxn();
        txn.setTxnId(txnId);
        txn.setTxnType(TxnType.P2P);
        txn.setFromWalletId(from.getWalletId());
        txn.setToWalletId(to.getWalletId());
        txn.setAmount(request.amount());
        txn.setCurrency(request.currency().toUpperCase());
        txn.setStatus(TxnStatus.SUCCESS);
        txn.setCreatedAt(now);
        walletTxnRepository.save(txn);

        LedgerEntry debit = new LedgerEntry();
        debit.setTxnId(txnId);
        debit.setWalletId(from.getWalletId());
        debit.setEntryType(EntryType.DEBIT);
        debit.setAmount(request.amount());
        debit.setCurrency(request.currency().toUpperCase());
        debit.setCreatedAt(now);

        LedgerEntry credit = new LedgerEntry();
        credit.setTxnId(txnId);
        credit.setWalletId(to.getWalletId());
        credit.setEntryType(EntryType.CREDIT);
        credit.setAmount(request.amount());
        credit.setCurrency(request.currency().toUpperCase());
        credit.setCreatedAt(now);

        ledgerEntryRepository.save(debit);
        ledgerEntryRepository.save(credit);
        walletAccountRepository.save(from);
        walletAccountRepository.save(to);

        IdempotencyRecord idempotencyRecord = new IdempotencyRecord();
        idempotencyRecord.setId(recordId);
        idempotencyRecord.setScope(IDEMPOTENCY_SCOPE);
        idempotencyRecord.setIdempotencyKey(request.idempotencyKey());
        idempotencyRecord.setResponseHash(sha256(txnId + ":" + TxnStatus.SUCCESS.name()));
        idempotencyRecord.setCreatedAt(now);
        idempotencyRecordRepository.save(idempotencyRecord);

        try {
            redisTemplate.delete(cacheKey(from.getWalletId()));
            redisTemplate.delete(cacheKey(to.getWalletId()));
        } catch (RuntimeException ignored) {
            // Best-effort cache invalidation.
        }

        notificationPublisher.publishTransactionCreated(txn);

        return new TransferResponse(txnId, TxnStatus.SUCCESS);
    }

    private void validateTransferRequest(P2PTransferRequest request, WalletAccount from, WalletAccount to) {
        if (from.getStatus() != WalletStatus.ACTIVE || to.getStatus() != WalletStatus.ACTIVE) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Both wallets must be active");
        }

        String currency = request.currency().toUpperCase();
        if (!from.getCurrency().equals(currency) || !to.getCurrency().equals(currency)) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "Currency mismatch for wallets");
        }
    }

    private String cacheKey(UUID walletId) {
        return "wallet:balance:" + walletId;
    }

    private String sha256(String input) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(input.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException exception) {
            throw new IllegalStateException("SHA-256 not available", exception);
        }
    }
}
