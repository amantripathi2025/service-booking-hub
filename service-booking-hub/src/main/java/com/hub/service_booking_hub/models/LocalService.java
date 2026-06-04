package com.hub.service_booking_hub.models;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "services")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LocalService {

    @Id
    private String id;

    private String providerId; // Ye batayega ki kis shop owner ne ye service banayi hai

    private String name; // e.g., "Men's Haircut", "Kitchen Pipe Repair"

    private String description;

    private String category; // e.g., barber, plumbing, electrician (Filter karne ke liye)

    private double price;

    private int durationInMinutes; // AI Queue aur automated next-customer notification ke liye

    private boolean isAvailable;

    private LocalDateTime createdAt;
}