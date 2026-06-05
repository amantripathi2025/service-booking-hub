package com.hub.service_booking_hub.models;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Data
@Document(collection = "services")
public class LocalService {

    @Id
    private String id;
    private String name;
    private String providerId;
    private String category;
    private double price;
    private int durationInMinutes;
    private boolean isAvailable;
    private LocalDateTime createdAt;

    private int maxDailyBookings;
    private int currentDailyBookingsCount;
}