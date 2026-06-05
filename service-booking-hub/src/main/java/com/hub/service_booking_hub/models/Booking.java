package com.hub.service_booking_hub.models;

import com.hub.service_booking_hub.enums.BookingStatus;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document(collection = "bookings")
public class Booking {

    @Id
    private String id;
    private String userId;       // Kis customer ne book kiya
    private String serviceId;    // Kaun si service book ki (Barber/Plumber)
    private LocalDateTime createdAt; // 👈 Ye field aur iska data type zaroori hai
    private BookingStatus status;   // PENDING, ACCEPTED, COMPLETED
}