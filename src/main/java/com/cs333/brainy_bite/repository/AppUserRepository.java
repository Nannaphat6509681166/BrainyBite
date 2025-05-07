package com.cs333.brainy_bite.repository;

import com.cs333.brainy_bite.model.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AppUserRepository extends JpaRepository<AppUser, String> { }
