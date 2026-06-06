package com.hub.service_booking_hub.repository;

import com.hub.service_booking_hub.models.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    // Ye custom method login ke time email se user check karne ke kaam aayega
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
}