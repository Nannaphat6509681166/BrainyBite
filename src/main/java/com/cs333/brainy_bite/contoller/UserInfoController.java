package com.cs333.brainy_bite.contoller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class UserInfoController {

    @GetMapping(path = "/me")
    public Map<String, Object> getUserInfo(@AuthenticationPrincipal OidcUser principal) {
        return principal.getClaims();
    }
}
