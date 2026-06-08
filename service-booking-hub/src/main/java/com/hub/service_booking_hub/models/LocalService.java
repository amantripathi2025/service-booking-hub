package com.hub.service_booking_hub.models;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.List; // Naya import list ke liye

@Data
@Document(collection = "services")
public class LocalService {

    @Id
    private String id;

    // Vendor ki pehchaan (Tera purana solid logic)
    private String providerId;

    // Naye Frontend Form se aane wala data
    private String shopName;
    private String category;
    private String description;

    // 🔥 ASLI JADOO: Menu items ki poori list
    private List<MenuItem> menuItems;

    // Tere purane advanced features
    private boolean isAvailable;
    private LocalDateTime createdAt;
    private int maxDailyBookings;
    private int currentDailyBookingsCount;
}