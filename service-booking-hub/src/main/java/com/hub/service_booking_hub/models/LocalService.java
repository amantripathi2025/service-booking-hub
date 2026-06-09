package com.hub.service_booking_hub.models;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.GeoSpatialIndexed;
import org.springframework.data.mongodb.core.index.GeoSpatialIndexType;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Document(collection = "services")
public class LocalService {

    @Id
    private String id;

    // Vendor ki pehchaan
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

    // GeoJSON support ke liye location format: [longitude, latitude]
    @GeoSpatialIndexed(type = GeoSpatialIndexType.GEO_2DSPHERE)
    private double[] location;

    // Naya field QR code image save karne ke liye (Base64 format)
    private String upiQrImage;

    // Naya field UPI ID text save karne ke liye (paise@ybl)
    private String upiQrCode;

    // 🔥 YE RAHI TERI MISSING CLASS (Iske andar aayega estimatedTime)
    @Data
    public static class MenuItem {
        private String name;
        private double price;
        private Integer estimatedTime; // NAYA: Time (minutes mein) save karne ke liye
    }
}