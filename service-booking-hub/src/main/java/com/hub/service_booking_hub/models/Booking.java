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

    // Booking ka status
    private String status; // "PENDING", "ACCEPTED", "COMPLETED"
    private LocalDateTime bookingDate;
    private String serviceId; // Yeh add karte hi error chala jayega
}