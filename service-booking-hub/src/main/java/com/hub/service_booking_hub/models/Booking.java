package com.hub.service_booking_hub.models;

import com.hub.service_booking_hub.enums.BookingStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "bookings")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Booking {

    @Id
    private String id;

    private String customerId; // Jisne book kiya (User ID)

    private String providerId; // Jiski shop hai (User ID)

    private String serviceId; // Jo service book hui hai (LocalService ID)

    private BookingStatus status;

    private LocalDateTime appointmentTime; // Date and Time

    private double finalPrice;

    private String specializedNotes; // E.g., "Ghar ke piche wale door se aana"

    private LocalDateTime createdAt;

    public void setCreatedAT(LocalDateTime now) {
    }
}