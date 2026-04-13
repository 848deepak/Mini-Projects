package com.miniprojects.onlinebanking.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class SeedDataConfig {

  @Bean
  CommandLineRunner warmup() {
    return args -> {
      // Accounts are seeded inside the service so the app starts with useful demo data.
    };
  }
}
