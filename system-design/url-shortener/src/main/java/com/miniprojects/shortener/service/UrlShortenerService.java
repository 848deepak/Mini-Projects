package com.miniprojects.shortener.service;

import com.miniprojects.shortener.dto.CreateLinkRequest;
import com.miniprojects.shortener.dto.LinkResponse;
import com.miniprojects.shortener.dto.LinkStatsResponse;
import com.miniprojects.shortener.exception.ConflictException;
import com.miniprojects.shortener.exception.NotFoundException;
import com.miniprojects.shortener.model.ShortLink;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.URISyntaxException;
import java.time.Duration;
import java.time.Instant;
import java.util.Collection;
import java.util.Comparator;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class UrlShortenerService {

  private static final String BASE_URL = "http://localhost:8083";
  private static final String[] BLOCKED_HOSTS = {"malware.test", "phishing.test"};

  private final Map<String, ShortLink> linksByCode = new ConcurrentHashMap<>();
  private final Map<String, String> codesByAlias = new ConcurrentHashMap<>();
  private final AtomicLong sequence = new AtomicLong(12_000);

  public synchronized LinkResponse createLink(CreateLinkRequest request) {
    String normalizedUrl = validateUrl(request.longUrl());
    String code = resolveCode(request.customAlias());
    Instant createdAt = Instant.now();
    Instant expiresAt = request.expiresInDays() == null ? createdAt.plus(Duration.ofDays(365)) : createdAt.plus(Duration.ofDays(request.expiresInDays()));

    ShortLink link = new ShortLink(code, normalizedUrl, request.customAlias(), request.ownerId(), createdAt, expiresAt);
    linksByCode.put(code, link);
    if (request.customAlias() != null && !request.customAlias().isBlank()) {
      codesByAlias.put(request.customAlias(), code);
    }

    return toResponse(link);
  }

  public String redirect(String code) {
    ShortLink link = findLink(code);
    if (!link.isEnabled()) {
      throw new ConflictException("Link has been disabled");
    }

    if (link.getExpiresAt().isBefore(Instant.now())) {
      throw new ConflictException("Link has expired");
    }

    link.incrementClickCount();
    return link.getLongUrl();
  }

  public LinkStatsResponse getStats(String code) {
    ShortLink link = findLink(code);
    return new LinkStatsResponse(link.getCode(), link.getClickCount(), link.isEnabled(), link.getCreatedAt(), link.getExpiresAt());
  }

  public Collection<LinkResponse> listLinks() {
    return linksByCode.values().stream().map(this::toResponse).sorted(Comparator.comparing(LinkResponse::createdAt).reversed()).toList();
  }

  public LinkResponse disable(String code) {
    ShortLink link = findLink(code);
    link.setEnabled(false);
    return toResponse(link);
  }

  private ShortLink findLink(String code) {
    ShortLink link = linksByCode.get(code);
    if (link == null) {
      throw new NotFoundException("Short link not found: " + code);
    }
    return link;
  }

  private String resolveCode(String customAlias) {
    if (customAlias != null && !customAlias.isBlank()) {
      if (linksByCode.containsKey(customAlias)) {
        throw new ConflictException("Custom alias already exists");
      }
      return customAlias;
    }

    return encodeBase62(sequence.incrementAndGet());
  }

  private String validateUrl(String longUrl) {
    try {
      URI uri = new URI(longUrl.trim());
      if (uri.getScheme() == null || uri.getHost() == null) {
        throw new IllegalArgumentException("URL must include scheme and host");
      }

      String host = uri.getHost().toLowerCase();
      for (String blockedHost : BLOCKED_HOSTS) {
        if (blockedHost.equals(host)) {
          throw new IllegalArgumentException("URL host is blocked");
        }
      }

      return uri.toString();
    } catch (URISyntaxException exception) {
      throw new IllegalArgumentException("Invalid URL");
    }
  }

  private LinkResponse toResponse(ShortLink link) {
    return new LinkResponse(
      link.getCode(),
      link.getLongUrl(),
      BASE_URL + "/" + link.getCode(),
      link.getCustomAlias(),
      link.isEnabled(),
      link.getClickCount(),
      link.getCreatedAt(),
      link.getExpiresAt()
    );
  }

  private String encodeBase62(long value) {
    final String alphabet = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    StringBuilder builder = new StringBuilder();
    long current = value;
    while (current > 0) {
      int index = (int) (current % 62);
      builder.insert(0, alphabet.charAt(index));
      current /= 62;
    }
    return builder.length() == 0 ? "0" : builder.toString();
  }
}
