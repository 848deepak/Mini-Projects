package com.miniprojects.shortener.controller;

import com.miniprojects.shortener.dto.CreateLinkRequest;
import com.miniprojects.shortener.dto.LinkResponse;
import com.miniprojects.shortener.dto.LinkStatsResponse;
import com.miniprojects.shortener.service.UrlShortenerService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;
import java.util.Collection;

@RestController
@RequestMapping("/api")
public class LinkController {

  private final UrlShortenerService shortenerService;

  public LinkController(UrlShortenerService shortenerService) {
    this.shortenerService = shortenerService;
  }

  @PostMapping("/shorten")
  @ResponseStatus(HttpStatus.CREATED)
  public LinkResponse create(@Valid @RequestBody CreateLinkRequest request) {
    return shortenerService.createLink(request);
  }

  @GetMapping("/{code}")
  public ResponseEntity<Void> redirect(@PathVariable String code, HttpServletRequest request) {
    String longUrl = shortenerService.redirect(code);
    return ResponseEntity.status(HttpStatus.FOUND).location(URI.create(longUrl)).build();
  }

  @GetMapping("/links")
  public Collection<LinkResponse> listLinks() {
    return shortenerService.listLinks();
  }

  @GetMapping("/links/{code}/analytics")
  public LinkStatsResponse stats(@PathVariable String code) {
    return shortenerService.getStats(code);
  }

  @DeleteMapping("/links/{code}")
  public LinkResponse disable(@PathVariable String code) {
    return shortenerService.disable(code);
  }
}
