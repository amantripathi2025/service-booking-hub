package com.hub.service_booking_hub.models;

import com.hub.service_booking_hub.enums.Role;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data // 👈 Ye annotation saare getters aur setters (setName, setEmail etc.) automatic generate karega
@Document(collection = "users")
public class User {

    @Id
    private String id;
    private String name;
    private String email;
    private String password;
    private String phone;
    private Role role; // CUSTOMER ya SHOP_OWNER
    private boolean isVerified; // Shuru mein false rahega
    private LocalDateTime createdAt;
}