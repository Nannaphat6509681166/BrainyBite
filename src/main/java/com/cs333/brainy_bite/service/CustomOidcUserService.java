package com.cs333.brainy_bite.service;

import com.cs333.brainy_bite.model.AppUser;
import com.cs333.brainy_bite.repository.AppUserRepository;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.core.oidc.user.DefaultOidcUser;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserService;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserRequest;
import org.springframework.stereotype.Service;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CustomOidcUserService extends OidcUserService{

    private final AppUserRepository userRepository;

    public CustomOidcUserService(AppUserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public OidcUser loadUser(OidcUserRequest userRequest) {
        OidcUser oidcUser = super.loadUser(userRequest);

        // ดึงข้อมูลจาก token
        String sub = oidcUser.getSubject();
        String email = oidcUser.getEmail();
        String username = oidcUser.getClaimAsString("cognito:username");

        // ✅ บันทึก user ลง DB หากยังไม่มี
        userRepository.findById(sub).orElseGet(() -> {
            AppUser newUser = new AppUser();
            newUser.setSub(sub);
            newUser.setEmail(email);
            newUser.setUsername(username);
            return userRepository.save(newUser);
        });

        // ✅ ดึง groups จาก token แล้วแปลงเป็น ROLE_XXX
        List<String> groups = oidcUser.getClaimAsStringList("cognito:groups");

        Collection<GrantedAuthority> mappedAuthorities = (groups != null)
                ? groups.stream()
                .map(group -> new SimpleGrantedAuthority("ROLE_" + group.toUpperCase()))
                .collect(Collectors.toSet())
                : (Collection<GrantedAuthority>) oidcUser.getAuthorities();  // fallback เดิม

        // ✅ คืน DefaultOidcUser พร้อม authority ที่เราแก้
        return new DefaultOidcUser(mappedAuthorities, oidcUser.getIdToken(), oidcUser.getUserInfo());
    }
}
