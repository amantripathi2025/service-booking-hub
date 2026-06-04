package com.hub.service_booking_hub.controller;

import com.hub.service_booking_hub.models.LocalService;
import com.hub.service_booking_hub.repository.LocalServiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;

import java.util.List;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/v1/services")
@CrossOrigin(origins = "*")
public class LocalServiceController {
    @Autowired
    private LocalServiceRepository serviceRepository;

    //1. ADD SERVICE: Shop owner apni nayi service add krega
    @PostMapping("/add")
    public ResponseEntity<LocalService> addLocalService(@RequestBody LocalService service) {
        service.setCreatedAt(LocalDateTime.now());
        service.setAvailable(true); //By default, service on rhega

        LocalService savedService = serviceRepository.save(service);
        return new ResponseEntity<>(savedService, HttpStatus.CREATED);

    }

    //2. GET ALL SERVICES: Customer ko app par saari service dikhane ke liye
    @GetMapping("/all")
    public ResponseEntity<List<LocalService>> getAllLocalService() {
        List<LocalService> services = serviceRepository.findAll();
        return new ResponseEntity<>(services, HttpStatus.OK);
    }
}