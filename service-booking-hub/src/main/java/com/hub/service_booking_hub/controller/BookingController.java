package com.hub.service_booking_hub.controller;

import com.hub.service_booking_hub.models.Booking;
import com.hub.service_booking_hub.models.LocalService;
import com.hub.service_booking_hub.repository.BookingRepository;
import com.hub.service_booking_hub.repository.LocalServiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/bookings")
@CrossOrigin(origins = "*")
public class BookingController {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private LocalServiceRepository serviceRepository;

    // 1. CREATE BOOKING (Fixed Date Issue)
    @PostMapping("/create")
    public ResponseEntity<?> createBooking(@RequestBody Booking booking) {

        // Default Payment configuration setup
        if (booking.getPaymentMode() == null) {
            booking.setPaymentMode("CASH");
        }
        booking.setPaymentStatus("PENDING");
        booking.setStatus("PENDING"); // Safe Fallback Default

        try {
            // 1. Shop details dhoondo limit check karne ke liye
            Optional<LocalService> shopOpt = serviceRepository.findById(booking.getShopId());

            if (shopOpt.isPresent()) {
                LocalService shop = shopOpt.get();
                List<Booking> existingBookings = bookingRepository.findByShopId(booking.getShopId());

                // Auto-Accept Logic (Based on Shop limits)
                long acceptedToday = existingBookings.stream()
                        .filter(b -> "ACCEPTED".equals(b.getStatus()))
                        .count();

                if (acceptedToday < shop.getMaxDailyBookings()) {
                    booking.setStatus("ACCEPTED");
                } else {
                    booking.setStatus("WAITING"); // Limit exceed hone par waiting list
                }
            }

            Booking savedBooking = bookingRepository.save(booking);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedBooking);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Booking fail ho gayi bhai: " + e.getMessage());
        }
    }

    // 🔥 NEW: 2. GET CUSTOMER SPECIFIC BOOKINGS (Frontend isko dhoondh raha tha)
    @GetMapping("/customer/{email}")
    public ResponseEntity<List<Booking>> getCustomerBookings(@PathVariable String email) {
        // Hum saari bookings fetch karke customer ki email se filter kar rahe hain
        // taaki tumhe Repository me naya method na likhna pade
        List<Booking> allBookings = bookingRepository.findAll();
        List<Booking> myBookings = allBookings.stream()
                .filter(b -> email.equals(b.getCustomerEmail()))
                .collect(Collectors.toList());
        return ResponseEntity.ok(myBookings);
    }

    // 🔥 NEW: 3. GET ALL BOOKINGS (Fallback Engine for Frontend)
    @GetMapping("/all")
    public ResponseEntity<List<Booking>> getAllBookings() {
        return ResponseEntity.ok(bookingRepository.findAll());
    }

    // 4. GET VENDOR SPECIFIC BOOKINGS
    @GetMapping("/shop/{shopId}")
    public ResponseEntity<List<Booking>> getBookingsForShop(@PathVariable String shopId) {
        List<Booking> bookings = bookingRepository.findByShopId(shopId);
        return ResponseEntity.ok(bookings);
    }

    // 5. ACCEPT BOOKING
    @PutMapping("/{id}/accept")
    public ResponseEntity<?> acceptBooking(@PathVariable String id) {
        return updateBookingStatus(id, "ACCEPTED");
    }

    // 6. REJECT BOOKING
    @PutMapping("/{id}/reject")
    public ResponseEntity<?> rejectBooking(@PathVariable String id) {
        return updateBookingStatus(id, "REJECTED");
    }

    // 7. COMPLETE BOOKING
    @PutMapping("/{id}/complete")
    public ResponseEntity<?> completeBooking(@PathVariable String id) {
        return updateBookingStatus(id, "COMPLETED");
    }

    // HELPER: STATUS UPDATER
    private ResponseEntity<Object> updateBookingStatus(String id, String status) {
        Optional<Booking> bookingOpt = bookingRepository.findById(id);
        if (bookingOpt.isPresent()) {
            Booking booking = bookingOpt.get();
            booking.setStatus(status);

            // Agar vendor kaam complete kar deta hai toh payment PAID ho jaye
            if ("COMPLETED".equals(status)) {
                booking.setPaymentStatus("PAID");
            }

            bookingRepository.save(booking);
            return ResponseEntity.ok(booking);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Booking nahi mili bhai!");
    }

    // 8. UPDATE SHOP DELAY
    @PutMapping("/shop/{shopId}/delay")
    public ResponseEntity<?> updateShopDelay(@PathVariable String shopId, @RequestParam int minutes) {
        try {
            Optional<LocalService> shopOpt = serviceRepository.findById(shopId);
            if (shopOpt.isPresent()) {
                LocalService shop = shopOpt.get();
                shop.setCurrentDelayMinutes(minutes);
                serviceRepository.save(shop);
                return ResponseEntity.ok("Shop delay successfully updated to " + minutes + " mins!");
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Shop nahi mili bhai!");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Delay update failed: " + e.getMessage());
        }
    }
}