package com.hub.service_booking_hub.controller;

import com.hub.service_booking_hub.enums.BookingStatus;
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
@RequestMapping("/api/v1/bookings")
@CrossOrigin(origins = "*")
public class BookingController {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private LocalServiceRepository serviceRepository;

    @PostMapping("/create")
    public ResponseEntity<?> createBooking(@RequestBody Booking booking) {
        Optional<LocalService> serviceOpt = serviceRepository.findById(booking.getServiceId());
        if (serviceOpt.isEmpty()) {
            return new ResponseEntity<>("Error: Targeted Local Service not found!", HttpStatus.NOT_FOUND);
        }

        LocalService service = serviceOpt.get();

        if (service.getCurrentDailyBookingsCount() >= service.getMaxDailyBookings()) {
            return new ResponseEntity<>("Sorry! This partner is fully booked for today according to owner's daily limit.", HttpStatus.BAD_REQUEST);
        }

        booking.setCreatedAt(LocalDateTime.now());
        booking.setStatus(BookingStatus.PENDING);

        Booking savedBooking = bookingRepository.save(booking);

        service.setCurrentDailyBookingsCount(service.getCurrentDailyBookingsCount() + 1);
        serviceRepository.save(service);

        return new ResponseEntity<>(savedBooking, HttpStatus.CREATED);
    }

    @GetMapping("/all")
    public ResponseEntity<List<Booking>> getAllBookings() {
        List<Booking> bookings = bookingRepository.findAll();
        return new ResponseEntity<>(bookings, HttpStatus.OK);
    }
}