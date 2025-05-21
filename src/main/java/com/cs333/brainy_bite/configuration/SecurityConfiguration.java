package com.cs333.brainy_bite.configuration;

import com.cs333.brainy_bite.security.CognitoLogoutHandler;
import com.cs333.brainy_bite.security.CustomAuthenticationSuccessHandler;
import com.cs333.brainy_bite.service.CustomOidcUserService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfiguration {

    private final CustomOidcUserService customOidcUserService;
    private final CustomAuthenticationSuccessHandler customAuthenticationSuccessHandler;

    public SecurityConfiguration(CustomOidcUserService customOidcUserService,
                                 CustomAuthenticationSuccessHandler customAuthenticationSuccessHandler) {
        this.customOidcUserService = customOidcUserService;
        this.customAuthenticationSuccessHandler = customAuthenticationSuccessHandler;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        CognitoLogoutHandler cognitoLogoutHandler = new CognitoLogoutHandler();

        http
                .csrf(csrf -> csrf.ignoringRequestMatchers("/api/**"))
                .authorizeHttpRequests(authz -> authz
                        .requestMatchers("/", "/index.html", "/css/**", "/script/**", "/api/**", "/category.html", "/user.html", "/search.html", "/article-detail.html").permitAll()
                        .requestMatchers("/article-add.html").hasRole("ADMIN")  // ป้องกันหน้าผู้ดูแล
                        .anyRequest().authenticated())
                .oauth2Login(oauth2 -> oauth2
                        .userInfoEndpoint(userInfo -> userInfo.oidcUserService(customOidcUserService))
                        .successHandler(customAuthenticationSuccessHandler)
                )
                .logout(logout -> logout.logoutSuccessHandler(cognitoLogoutHandler));

        return http.build();
    }

}
