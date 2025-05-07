package com.cs333.brainy_bite.service;

import com.cs333.brainy_bite.model.AppUser;
import com.cs333.brainy_bite.repository.AppUserRepository;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserService;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserRequest;
import org.springframework.stereotype.Service;

@Service
public class CustomOidcUserService extends OidcUserService{

    private AppUserRepository userRepository;

    public CustomOidcUserService(AppUserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public OidcUser loadUser(OidcUserRequest userRequest) {
        OidcUser user = super.loadUser(userRequest);

        String sub = user.getSubject();
        String email = user.getEmail();
        String username = user.getClaimAsString("cognito:username");

        userRepository.findById(sub).orElseGet(() -> {
            AppUser newUser = new AppUser();
            newUser.setSub(sub);
            newUser.setEmail(email);
            newUser.setUsername(username);
            return userRepository.save(newUser);
        });

        return user;
    }
}
