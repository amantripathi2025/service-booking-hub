package com.hub.service_booking_hub.models;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Data
@Document(collection = "reviews")
public class Review {

    @Id
    private String id;
    private String bookingId;   // Kis booking ke liye review hai
    private String serviceId;   // Kis service ko rating mil rahi hai
    private String userId;      // Kis user ne review diya
    private int rating;         // 1 se 5 ke beech star rating
    private String comment;     // Customer ka feedback text
    private LocalDateTime createdAt;
}