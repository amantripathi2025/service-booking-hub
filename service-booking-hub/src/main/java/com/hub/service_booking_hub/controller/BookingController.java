package com.hub.service_booking_hub.controller;

import com.hub.service_booking_hub.enums.BookingStatus;
import com.hub.service_booking_hub.models.Booking;
import com.hub.service_booking_hub.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/bookings")
@CrossOrigin(origins = "*")
public class BookingController {
    @Autowired
    private BookingRepository bookingRepository;

    //1. CREATE BOOKING: Customer service book krega
    @PostMapping("/create")
    public ResponseEntity<Booking> createBooking(@RequestBody Booking booking){
        booking.setCreatedAT(LocalDateTime.now());
        booking.setStatus(BookingStatus.PENDING);

        //Yaha abhi smart queue wala logic lgaenge
        //ki next customer ka time kya hoga durationInMinutes ko jod kar
        Booking savedBooking = bookingRepository.save(booking);
        return new ResponseEntity<>(savedBooking, HttpStatus.CREATED);
    }

    //2. GET BOOKINGS BY PROVIDER: SOP OWNER SAARI BOOKINGS DEKH PAEGA
    //NOTE: YE ABHI BASIC RKHA HAI AAGE CHALKAR ISKO PROVIDERID SE FILTER KARNA SIKHENGE

    @GetMapping("/all")
    public ResponseEntity<List<Booking>> getAllBooking(){
        List<Booking> bookings = bookingRepository.findAll();
        return new ResponseEntity<>(bookings, HttpStatus.OK);
    }
}