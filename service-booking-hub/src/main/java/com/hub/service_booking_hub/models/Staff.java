package com.hub.service_booking_hub.models;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "staff")
public class Staff {

    @Id
    private String id;
    private String shopId;       // Yeh barber kis shop ka hai
    private String name;         // Barber ka naam (e.g., Raju, Ramesh)
    private String specialty;    // Haircut, Shaving, Massage
    private boolean isAvailable; // 🟢 True (Khaali) ya 🔴 False (Busy)
}