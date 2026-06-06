package com.hub.service_booking_hub.controller;

import com.hub.service_booking_hub.enums.BookingStatus;
import com.hub.service_booking_hub.models.Booking;
import com.hub.service_booking_hub.repository.BookingRepository;
import com.hub.service_booking_hub.repository.LocalServiceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/bookings")
@CrossOrigin(origins = "*")
public class BookingController {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private LocalServiceRepository serviceRepository;

    // 1. Nayi Booking Create Karna
    @PostMapping("/create")
    public ResponseEntity<?> createBooking(@RequestBody Booking booking) {
        if (booking.getUserId() == null || booking.getServiceId() == null) {
            return new ResponseEntity<>("Error: UserId and ServiceId are mandatory!", HttpStatus.BAD_REQUEST);
        }

        if (!serviceRepository.existsById(booking.getServiceId())) {
            return new ResponseEntity<>("Error: Yeh Service exist nahi karti!", HttpStatus.NOT_FOUND);
        }

        booking.setCreatedAt(LocalDateTime.now());
        booking.setStatus(BookingStatus.PENDING);

        Booking savedBooking = bookingRepository.save(booking);
        return new ResponseEntity<>(savedBooking, HttpStatus.CREATED);
    }

    // 2. User ki saari bookings dekhna
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Booking>> getUserBookings(@PathVariable String userId) {
        List<Booking> bookings = bookingRepository.findByUserId(userId);
        return new ResponseEntity<>(bookings, HttpStatus.OK);
    }

    // 3. Booking Accept Karna
    @PutMapping("/accept/{bookingId}")
    public ResponseEntity<?> acceptBooking(@PathVariable String bookingId) {
        java.util.Optional<Booking> optionalBooking = bookingRepository.findById(bookingId);
        if (optionalBooking.isEmpty()) {
            return new ResponseEntity<>("Error: Yeh Booking ID nahi mili!", HttpStatus.NOT_FOUND);
        }

        Booking booking = optionalBooking.get();
        booking.setStatus(BookingStatus.ACCEPTED);

        Booking updatedBooking = bookingRepository.save(booking);
        return new ResponseEntity<>(updatedBooking, HttpStatus.OK);
    }

    // 4. Booking Complete Karna
    @PutMapping("/complete/{bookingId}")
    public ResponseEntity<?> completeBooking(@PathVariable String bookingId) {
        java.util.Optional<Booking> optionalBooking = bookingRepository.findById(bookingId);
        if (optionalBooking.isEmpty()) {
            return new ResponseEntity<>("Error: Yeh Booking ID nahi mili!", HttpStatus.NOT_FOUND);
        }

        Booking booking = optionalBooking.get();
        booking.setStatus(BookingStatus.COMPLETED);

        Booking updatedBooking = bookingRepository.save(booking);
        return new ResponseEntity<>(updatedBooking, HttpStatus.OK);
    }

    // 5. 🔥 VENDOR DASHBOARD ANALYTICS API 🔥
    // Isse pata chalega ki kis service par kitni bookings pending/completed hain
    @GetMapping("/analytics/service/{serviceId}")
    public ResponseEntity<?> getServiceAnalytics(@PathVariable String serviceId) {
        if (!serviceRepository.existsById(serviceId)) {
            return new ResponseEntity<>("Error: Service nahi mili!", HttpStatus.NOT_FOUND);
        }

        int totalBookings = bookingRepository.findByServiceId(serviceId).size();
        int pendingBookings = bookingRepository.findByServiceIdAndStatus(serviceId, BookingStatus.PENDING).size();
        int acceptedBookings = bookingRepository.findByServiceIdAndStatus(serviceId, BookingStatus.ACCEPTED).size();
        int completedBookings = bookingRepository.findByServiceIdAndStatus(serviceId, BookingStatus.COMPLETED).size();

        // Response map banana data return karne ke liye
        Map<String, Object> analytics = new HashMap<>();
        analytics.put("serviceId", serviceId);
        analytics.put("totalBookings", totalBookings);
        analytics.put("pending", pendingBookings);
        analytics.put("accepted", acceptedBookings);
        analytics.put("completed", completedBookings);

        return new ResponseEntity<>(analytics, HttpStatus.OK);
    }
}