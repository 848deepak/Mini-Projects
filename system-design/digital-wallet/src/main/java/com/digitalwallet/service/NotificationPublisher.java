package com.digitalwallet.service;

import com.digitalwallet.domain.WalletTxn;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class NotificationPublisher {

    private final RabbitTemplate rabbitTemplate;
    private final String exchange;
    private final String routingKey;

    public NotificationPublisher(
            RabbitTemplate rabbitTemplate,
            @Value("${wallet.notifications.exchange}") String exchange,
            @Value("${wallet.notifications.routing-key}") String routingKey
    ) {
        this.rabbitTemplate = rabbitTemplate;
        this.exchange = exchange;
        this.routingKey = routingKey;
    }

    public void publishTransactionCreated(WalletTxn txn) {
        Map<String, Object> event = Map.of(
                "txnId", txn.getTxnId().toString(),
                "status", txn.getStatus().name(),
                "fromWalletId", txn.getFromWalletId().toString(),
                "toWalletId", txn.getToWalletId().toString(),
                "amount", txn.getAmount().toPlainString(),
                "currency", txn.getCurrency()
        );
        try {
            rabbitTemplate.convertAndSend(exchange, routingKey, event);
        } catch (RuntimeException ignored) {
            // Notifications are asynchronous side effects; keep core transfer path available.
        }
    }
}
