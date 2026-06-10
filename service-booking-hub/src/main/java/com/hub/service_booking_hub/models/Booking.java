package com.hub.service_booking_hub.models;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Data
@Document(collection = "bookings")
public class Booking {

    @Id
    private String id;

    // Customer aur Shop ki details
    private String customerEmail;
    private String shopId;
    private String shopName;

    // Konsi service book ki (e.g., Shaadi, Haircut) aur kitne ki
    private String serviceName;
    private Double price;

    // 🔥 TERA VIP LOGIC: Payment System
    private String paymentMode; // "CASH" ya "ONLINE"
    private String paymentStatus; // "PENDING" ya "PAID"

    // Booking ka status (Controller isi ko use kar raha hai)
    private String status; // "PENDING", "ACCEPTED", "COMPLETED", "REJECTED"
    private String serviceId;

    // Customer Contact
    private String customerPhone;

    // Queue & ETA System Variables
    private Integer estimatedTimeMinutes; // Kitna time lagega (e.g., 30)
    private Integer queuePosition;        // Line mein konsa number hai (e.g., 1, 2, 3)
    private LocalDateTime startTime;      // Jab vendor kaam shuru kare

    // 🔥 FIXED: Dono ko single declaration aur String format me rakha hai
    private String bookingDate;  // Frontend se "2026-06-12" handle karne ke liye
    private String bookingTime;  // Frontend se "10:00 AM" handle karne ke liye
}