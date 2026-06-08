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

    // React se aane wala data yahan hit karega
    @PostMapping
    public ResponseEntity<?> addLocalService(@RequestBody LocalService service) {
        service.setCreatedAt(LocalDateTime.now());
        service.setAvailable(true);
        service.setCurrentDailyBookingsCount(0);

        if (service.getMaxDailyBookings() <= 0) {
            service.setMaxDailyBookings(10); // Default set kar diya taaki error na aaye
        }

        LocalService savedService = serviceRepository.save(service);
        return new ResponseEntity<>(savedService, HttpStatus.CREATED);
    }

    // Saari Services dekhne ke liye API
    @GetMapping("/all")
    public ResponseEntity<List<LocalService>> getAllLocalService() {
        List<LocalService> services = serviceRepository.findAll();
        return new ResponseEntity<>(services, HttpStatus.OK);
    }

    // Category filter API
    @GetMapping("/category/{catName}")
    public ResponseEntity<List<LocalService>> getServicesByCategory(@PathVariable String catName) {
        List<LocalService> services = serviceRepository.findByCategory(catName);
        return new ResponseEntity<>(services, HttpStatus.OK);
    }
    // 5. Shop aur Menu Update karne ki API
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateLocalService(@PathVariable String id, @RequestBody LocalService updatedService) {
        java.util.Optional<LocalService> existingService = serviceRepository.findById(id);

        if(existingService.isPresent()) {
            LocalService serviceToUpdate = existingService.get();
            // Naya data set kar rahe hain
            serviceToUpdate.setShopName(updatedService.getShopName());
            serviceToUpdate.setCategory(updatedService.getCategory());
            serviceToUpdate.setDescription(updatedService.getDescription());
            serviceToUpdate.setMenuItems(updatedService.getMenuItems());

            // Database mein save
            LocalService saved = serviceRepository.save(serviceToUpdate);
            return new ResponseEntity<>(saved, HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Shop nahi mili bhai!", HttpStatus.NOT_FOUND);
        }
    }

    // 6. Shop Delete karne ki API (Agar vendor dukan band kar de)
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteLocalService(@PathVariable String id) {
        try {
            serviceRepository.deleteById(id);
            return new ResponseEntity<>("Shop successfully delete ho gayi!", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Delete nahi ho paya: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}