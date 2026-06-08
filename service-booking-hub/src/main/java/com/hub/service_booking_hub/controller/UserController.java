package com.hub.service_booking_hub.controller;

import com.hub.service_booking_hub.dto.UserLoginDTO;
import com.hub.service_booking_hub.dto.UserRegisterDTO;
import com.hub.service_booking_hub.models.User;
import com.hub.service_booking_hub.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody UserRegisterDTO dto) {
        if (dto.getEmail() == null || !dto.getEmail().contains("@")) {
            return new ResponseEntity<>("Error: Invalid Email Address!", HttpStatus.BAD_REQUEST);
        }
        if (dto.getPhone() == null || dto.getPhone().length() < 10) {
            return new ResponseEntity<>("Error: Phone number must be at least 10 digits!", HttpStatus.BAD_REQUEST);
        }
        if (userRepository.existsByEmail(dto.getEmail())) {
            return new ResponseEntity<>("Error: Yeh email pehle se registered hai!", HttpStatus.CONFLICT);
        }

        User user = new User();
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setPhone(dto.getPhone());
        user.setRole(dto.getRole());
        user.setCreatedAt(LocalDateTime.now());
        user.setVerified(false);

        User savedUser = userRepository.save(user);
        return new ResponseEntity<>(savedUser, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody UserLoginDTO loginDto) {
        Optional<User> optionalUser = userRepository.findByEmail(loginDto.getEmail());

        if (optionalUser.isEmpty()) {
            return new ResponseEntity<>("Error: Is email se koi account nahi mila!", HttpStatus.NOT_FOUND);
        }

        User user = optionalUser.get();
        boolean isPasswordMatch = passwordEncoder.matches(loginDto.getPassword(), user.getPassword());

        if (isPasswordMatch) {
            // 🔥 UPDATE: Ab login par poora User object return kar rahe hain taaki frontend role aur name padh sake
            return new ResponseEntity<>(user, HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Error: Password galat hai bhai!", HttpStatus.UNAUTHORIZED);
        }
    }

    // 🔥 NAYA DARWAZA: Edit Profile API
    @PutMapping("/update")
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, String> updates) {
        String email = updates.get("email"); // Kis user ko update karna hai?

        if (email == null) {
            return new ResponseEntity<>("Error: Email provide karna zaroori hai!", HttpStatus.BAD_REQUEST);
        }

        Optional<User> optionalUser = userRepository.findByEmail(email);
        if (optionalUser.isEmpty()) {
            return new ResponseEntity<>("Error: User nahi mila!", HttpStatus.NOT_FOUND);
        }

        User user = optionalUser.get();

        // Agar frontend se naya naam aaya hai, toh update karo
        if (updates.containsKey("name") && !updates.get("name").isBlank()) {
            user.setName(updates.get("name"));
        }

        // Agar frontend se naya phone aaya hai, toh update karo
        if (updates.containsKey("phone") && !updates.get("phone").isBlank()) {
            user.setPhone(updates.get("phone"));
        }

        // Aage chalkar Bio, Shop Location, Profile Pic sab yahi add honge
        // if (updates.containsKey("bio")) { user.setBio(updates.get("bio")); }

        User updatedUser = userRepository.save(user);
        return new ResponseEntity<>(updatedUser, HttpStatus.OK);
    }
}