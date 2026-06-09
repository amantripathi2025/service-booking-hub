package com.hub.service_booking_hub.controller;

import com.hub.service_booking_hub.models.LocalService;
import com.hub.service_booking_hub.repository.LocalServiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.geo.Distance;
import org.springframework.data.geo.Metrics;
import org.springframework.data.geo.Point;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/services")
@CrossOrigin(origins = "*")
public class LocalServiceController {

    @Autowired
    private LocalServiceRepository serviceRepository;

    @GetMapping("/all")
    public ResponseEntity<List<LocalService>> getAllServices() {
        try {
            List<LocalService> services = serviceRepository.findAll();
            return ResponseEntity.ok(services);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping("/nearby")
    public ResponseEntity<List<LocalService>> getNearbyServices(
            @RequestParam double lat,
            @RequestParam double lng,
            @RequestParam(defaultValue = "10") double radiusKm) {

        try {
            Point customerLocation = new Point(lng, lat);
            Distance distance = new Distance(radiusKm, Metrics.KILOMETERS);

            List<LocalService> nearbyShops = serviceRepository.findByLocationNear(customerLocation, distance);
            return ResponseEntity.ok(nearbyShops);

        } catch (Exception e) {
            // 🔥 AMBIGUITY FIXED: No more new ResponseEntity<>(null, ...) syntax error
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateService(@PathVariable String id, @RequestBody LocalService updatedService) {
        try {
            if (!serviceRepository.existsById(id)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Shop nahi mili!");
            }
            updatedService.setId(id);
            LocalService saved = serviceRepository.save(updatedService);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Update fail: " + e.getMessage());
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteService(@PathVariable String id) {
        try {
            serviceRepository.deleteById(id);
            return ResponseEntity.ok("Shop deleted successfully!");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Delete fail: " + e.getMessage());
        }
    }
}