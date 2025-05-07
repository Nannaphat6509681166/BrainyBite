package com.cs333.brainy_bite.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

@Entity
public class AppUser {
    @Id
    private String sub;

    private String email;
    private String username;

    public AppUser(String sub, String email, String username) {
        this.sub = sub;
        this.email = email;
        this.username = username;
    }

    public AppUser() {}

    public String getSub() {
        return sub;
    }

    public void setSub(String sub) {
        this.sub = sub;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}
