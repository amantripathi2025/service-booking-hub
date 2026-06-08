package com.hub.service_booking_hub.models;

import com.hub.service_booking_hub.enums.Role;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data // 👈 Ye annotation saare getters aur setters (setName, setEmail etc.) automatic generate karega
@Document(collection = "users")
public class User {

    @Id
    private String id;
    private String name;
    private String email;
    private String password;
    private String phone;
    private Role role; // CUSTOMER ya SHOP_OWNER
    private boolean isVerified; // Shuru mein false rahega
    private LocalDateTime createdAt;
    // Vendor Onboarding & Trial Logic
    private LocalDateTime trialExpiryDate;
    private boolean isSubscribed;
    // Vendor Specific Configurations
    private String upiQrCode; // QR code image ka data ya URL save karne ke liye
    private int dailyAcceptLimit = 5; // Default limit 5 bookings roj ki
    private int todayAcceptedCount = 0; // Aaj kitni accept ho chuki hain track karne ke liye
}