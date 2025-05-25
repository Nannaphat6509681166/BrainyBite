package com.cs333.brainy_bite.contoller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api")
public class VersionController {
    private final String serverStartupId = UUID.randomUUID().toString();

    @GetMapping("/version")
    public Map<String, String> getVersion() {
        return Map.of("serverId", serverStartupId);
    }

    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("OK");
    }
}


