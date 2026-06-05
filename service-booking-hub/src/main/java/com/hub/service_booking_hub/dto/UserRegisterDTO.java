package com.hub.service_booking_hub.dto;

import com.hub.service_booking_hub.enums.Role;
import lombok.Data;

@Data
public class UserRegisterDTO {
    private String name;
    private String email;
    private String password;
    private String phone;
    private Role role;
}