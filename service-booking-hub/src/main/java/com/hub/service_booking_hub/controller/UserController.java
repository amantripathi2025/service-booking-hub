package com.hub.service_booking_hub.controller;

import com.hub.service_booking_hub.models.User;
import com.hub.service_booking_hub.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/v1/users")
@CrossOrigin(origins = "*") // Ye aage chal kar React ko connect karne mein help karega
public class UserController {

    @Autowired
    private UserRepository userRepository;

    // 1. REGISTER API: Naya user banane ke liye
    @PostMapping("/register")
    public ResponseEntity<User> registerUser(@RequestBody User user) {

        // Agar pehle se is email se koi account hai toh error throw karenge (Aage add karenge)

        user.setCreatedAt(LocalDateTime.now());
        user.setVerified(false); // Shuru mein koi bhi verified nahi hoga

        // Database mein save kar rahe hain
        User savedUser = userRepository.save(user);

        return new ResponseEntity<>(savedUser, HttpStatus.CREATED);
    }
}