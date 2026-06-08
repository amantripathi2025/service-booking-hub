package com.hub.service_booking_hub.controller;

import com.hub.service_booking_hub.models.Booking;
import com.hub.service_booking_hub.models.LocalService;
import com.hub.service_booking_hub.repository.BookingRepository;
import com.hub.service_booking_hub.repository.LocalServiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/bookings")
@CrossOrigin(origins = "*")
public class BookingController {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private LocalServiceRepository serviceRepository;

    @PostMapping("/create")
    public ResponseEntity<?> createBooking(@RequestBody Booking booking) {
        // Default time set karo
        booking.setBookingDate(LocalDateTime.now());

        // 1. Shop details dhoondo database se limit check karne ke liye
        Optional<LocalService> shopOpt = serviceRepository.findById(booking.getShopId());

        if (shopOpt.isPresent()) {
            LocalService shop = shopOpt.get();

            // 2. Aaj ki pure shop ki ACCEPTED bookings fetch karo
            List<Booking> existingBookings = bookingRepository.findByShopId(booking.getShopId());
            long acceptedToday = existingBookings.stream()
                    .filter(b -> "ACCEPTED".equals(b.getStatus()))
                    .count();

            // 3. 🔥 AUTO-ACCEPT LOGIC (Using your LocalService maxDailyBookings field) 🔥
            if (acceptedToday < shop.getMaxDailyBookings()) {
                booking.setStatus("ACCEPTED");
            } else {
                booking.setStatus("WAITING"); // Limit exceed hone par seedha waiting list
            }
        } else {
            booking.setStatus("PENDING"); // Safe fallback agar shop exist na kare
        }

        // Default Payment configuration setup
        if (booking.getPaymentMode() == null) {
            booking.setPaymentMode("CASH");
        }
        booking.setPaymentStatus("PENDING");

        try {
            Booking savedBooking = bookingRepository.save(booking);
            return new ResponseEntity<>(savedBooking, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>("Booking fail ho gayi: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Vendor apni saari bookings dekh sake uske liye API
    @GetMapping("/shop/{shopId}")
    public ResponseEntity<List<Booking>> getBookingsForShop(@PathVariable String shopId) {
        List<Booking> bookings = bookingRepository.findByShopId(shopId);
        return new ResponseEntity<>(bookings, HttpStatus.OK);
    }

    // 1. Booking ko Accept karne ke liye
    @PutMapping("/{id}/accept")
    public ResponseEntity<?> acceptBooking(@PathVariable String id) {
        return updateBookingStatus(id, "ACCEPTED");
    }

    // 2. Booking ko Reject karne ke liye
    @PutMapping("/{id}/reject")
    public ResponseEntity<?> rejectBooking(@PathVariable String id) {
        return updateBookingStatus(id, "REJECTED");
    }

    // 3. Kaam khatam hone par Completed mark karne ke liye (Revenue count isi se hoga)
    @PutMapping("/{id}/complete")
    public ResponseEntity<?> completeBooking(@PathVariable String id) {
        return updateBookingStatus(id, "COMPLETED");
    }

    // Helper method status sync up rakhne ke liye
    private ResponseEntity<?> updateBookingStatus(String id, String status) {
        Optional<Booking> bookingOpt = bookingRepository.findById(id);
        if (bookingOpt.isPresent()) {
            Booking booking = bookingOpt.get();
            booking.setStatus(status);

            // Agar vendor kaam complete kar deta hai toh payment status bhi automatic PAID ho jaye (For QR/Cash)
            if ("COMPLETED".equals(status)) {
                booking.setPaymentStatus("PAID");
            }

            bookingRepository.save(booking);
            return new ResponseEntity<>(booking, HttpStatus.OK);
        }
        return new ResponseEntity<>("Booking nahi mili bhai!", HttpStatus.NOT_FOUND);
    }
}