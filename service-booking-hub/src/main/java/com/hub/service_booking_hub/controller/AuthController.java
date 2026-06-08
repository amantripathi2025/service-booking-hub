package com.hub.service_booking_hub.controller;

import com.hub.service_booking_hub.models.User;
import com.hub.service_booking_hub.enums.Role;
import com.hub.service_booking_hub.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/v1/users") // 🔥 Frontend ab direct connect hoga is path se!
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {

        // 1. Tera existsByEmail wala smart function use kar rahe hain
        if (userRepository.existsByEmail(user.getEmail())) {
            return new ResponseEntity<>("Bhai, yeh email pehle se register hai!", HttpStatus.BAD_REQUEST);
        }

        // Default values set kar rahe hain jo tere User model mein hain
        user.setCreatedAt(LocalDateTime.now());
        user.setVerified(false);

        // 2. 🔥 VENDOR (SHOP_OWNER) KA 30-DAYS TRIAL START KARO (Enum fix)
        if (user.getRole() == Role.VENDOR) {
            user.setTrialExpiryDate(LocalDateTime.now().plusDays(30));
            user.setSubscribed(false);
        }

        try {
            User savedUser = userRepository.save(user);
            return new ResponseEntity<>(savedUser, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>("Registration fail: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}