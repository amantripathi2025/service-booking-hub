package com.hub.service_booking_hub.controller;

import com.hub.service_booking_hub.models.LocalService;
import com.hub.service_booking_hub.repository.LocalServiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/services")
@CrossOrigin(origins = "*")
public class LocalServiceController {

    @Autowired
    private LocalServiceRepository serviceRepository;

    @PostMapping("/add")
    public ResponseEntity<?> addLocalService(@RequestBody LocalService service) {
        // Validation: Owner limit set karna bhool toh nahi gaya?
        if (service.getMaxDailyBookings() <= 0) {
            return new ResponseEntity<>("Error: Mandatory Field! Please set max daily customer capacity.", HttpStatus.BAD_REQUEST);
        }

        service.setCreatedAt(LocalDateTime.now());
        service.setAvailable(true);
        service.setCurrentDailyBookingsCount(0); // Shuru mein zero bookings hui hain

        LocalService savedService = serviceRepository.save(service);
        return new ResponseEntity<>(savedService, HttpStatus.CREATED);
    }

    @GetMapping("/all")
    public ResponseEntity<List<LocalService>> getAllLocalService() {
        List<LocalService> services = serviceRepository.findAll();
        return new ResponseEntity<>(services, HttpStatus.OK);
    }
}