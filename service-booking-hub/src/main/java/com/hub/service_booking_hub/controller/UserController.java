package com.hub.service_booking_hub.controller;

import com.hub.service_booking_hub.dto.UserLoginDTO;
import com.hub.service_booking_hub.dto.UserRegisterDTO;
import com.hub.service_booking_hub.models.User;
import com.hub.service_booking_hub.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder; // Ye naya import hai
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    // 1. Password encrypt karne wale tool ko yahan bula liya
    @Autowired
    private PasswordEncoder passwordEncoder;

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
        if (userRepository.existsByEmail(dto.getEmail())) {
            return new ResponseEntity<>("Error: Yeh email pehle se registered hai!", HttpStatus.CONFLICT);
        }

        User user = new User();
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());

        // 2. Yahan direct password dalne ki jagah encode karke daal diya
        user.setPassword(passwordEncoder.encode(dto.getPassword()));

        user.setPhone(dto.getPhone());
        user.setRole(dto.getRole());
        user.setCreatedAt(LocalDateTime.now());
        user.setVerified(false);

        User savedUser = userRepository.save(user);
        return new ResponseEntity<>(savedUser, HttpStatus.CREATED);
    }

    // Naya import add kar lena agar IntelliJ pooche toh:
    // import java.util.Optional;

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody UserLoginDTO loginDto) {

        // 1. Database mein check karo ki ye email hai bhi ya nahi?
        java.util.Optional<User> optionalUser = userRepository.findByEmail(loginDto.getEmail());

        if (optionalUser.isEmpty()) {
            return new ResponseEntity<>("Error: Is email se koi account nahi mila!", HttpStatus.NOT_FOUND);
        }

        User user = optionalUser.get(); // Agar user mil gaya toh usko nikal lo

        // 2. Password compare karo (Plain vs Hashed)
        boolean isPasswordMatch = passwordEncoder.matches(loginDto.getPassword(), user.getPassword());

        if (isPasswordMatch) {
            // Aage chalkar hum yahan JWT Token return karenge, abhi sirf message bhej rahe hain
            return new ResponseEntity<>("Success: Login ekdum successful! Welcome " + user.getName(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Error: Password galat hai bhai!", HttpStatus.UNAUTHORIZED);
        }
    }
}