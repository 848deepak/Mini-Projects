package com.digitalwallet.config;

import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.DirectExchange;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.QueueBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMqConfig {

    @Bean
    public DirectExchange walletExchange(@Value("${wallet.notifications.exchange}") String exchangeName) {
        return new DirectExchange(exchangeName, true, false);
    }

    @Bean
    public Queue walletEventQueue() {
        return QueueBuilder.durable("wallet.events.queue").build();
    }

    @Bean
    public Binding walletBinding(
            Queue walletEventQueue,
            DirectExchange walletExchange,
            @Value("${wallet.notifications.routing-key}") String routingKey
    ) {
        return BindingBuilder.bind(walletEventQueue).to(walletExchange).with(routingKey);
    }
}
