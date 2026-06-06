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
@RequestMapping("/services")
@CrossOrigin(origins = "*")
public class LocalServiceController {

    @Autowired
    private LocalServiceRepository serviceRepository;

    // 1. Startup Service Add Karne ki API
    @PostMapping("/add")
    public ResponseEntity<?> addLocalService(@RequestBody LocalService service) {
        if (service.getMaxDailyBookings() <= 0) {
            return new ResponseEntity<>("Error: Mandatory Field! Please set max daily customer capacity.", HttpStatus.BAD_REQUEST);
        }

        service.setCreatedAt(LocalDateTime.now());
        service.setAvailable(true);
        service.setCurrentDailyBookingsCount(0);

        LocalService savedService = serviceRepository.save(service);
        return new ResponseEntity<>(savedService, HttpStatus.CREATED);
    }

    // 2. Saari Services Ek Saath Dekhne ki API
    @GetMapping("/all")
    public ResponseEntity<List<LocalService>> getAllLocalService() {
        List<LocalService> services = serviceRepository.findAll();
        return new ResponseEntity<>(services, HttpStatus.OK);
    }

    // 3. Category ke base par Filter karne ki API
    @GetMapping("/category/{catName}")
    public ResponseEntity<List<LocalService>> getServicesByCategory(@PathVariable String catName) {
        List<LocalService> services = serviceRepository.findByCategory(catName);
        return new ResponseEntity<>(services, HttpStatus.OK);
    }

    // 4. Budget ke base par Filter karne ki API
    @GetMapping("/budget/{maxPrice}")
    public ResponseEntity<List<LocalService>> getServicesByBudget(@PathVariable double maxPrice) {
        List<LocalService> services = serviceRepository.findByPriceLessThanEqual(maxPrice);
        return new ResponseEntity<>(services, HttpStatus.OK);
    }
}