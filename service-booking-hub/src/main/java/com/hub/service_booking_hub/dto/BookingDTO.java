package com.hub.service_booking_hub.dto;

import lombok.Data;

@Data
public class BookingDTO {
    private Long shopId;
    private String customerEmail;
    private String customerPhone;
    private String serviceName;
    private Double price;
    private String bookingDate;
    private String bookingTime;
    private String paymentMode;
    private String status;
}