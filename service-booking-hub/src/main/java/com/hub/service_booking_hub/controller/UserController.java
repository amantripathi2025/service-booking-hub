package com.hub.service_booking_hub.controller;

import com.hub.service_booking_hub.dto.UserRegisterDTO;
import com.hub.service_booking_hub.models.User;
import com.hub.service_booking_hub.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/v1/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody UserRegisterDTO dto) {

        // 1. Basic Validation Rule
        if (dto.getEmail() == null || !dto.getEmail().contains("@")) {
            return new ResponseEntity<>("Error: Invalid Email Address!", HttpStatus.BAD_REQUEST);
        }
        if (dto.getPhone() == null || dto.getPhone().length() < 10) {
            return new ResponseEntity<>("Error: Phone number must be at least 10 digits!", HttpStatus.BAD_REQUEST);
        }

        // 2. Check if Email Already Exists
        // (Yahan standard repository custom query aage lagayenge, abhi save handle karte hain)

        User user = new User();
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setPassword(dto.getPassword()); // Aage isko BCrypt se encrypt karenge
        user.setPhone(dto.getPhone());
        user.setRole(dto.getRole());
        user.setCreatedAt(LocalDateTime.now());
        user.setVerified(false);

        User savedUser = userRepository.save(user);
        return new ResponseEntity<>(savedUser, HttpStatus.CREATED);
    }
}