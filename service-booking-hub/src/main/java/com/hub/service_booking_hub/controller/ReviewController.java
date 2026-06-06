package com.hub.service_booking_hub.controller;

import com.hub.service_booking_hub.models.Review;
import com.hub.service_booking_hub.repository.ReviewRepository;
import com.hub.service_booking_hub.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/reviews")
@CrossOrigin(origins = "*")
public class ReviewController {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private BookingRepository bookingRepository;

    // 1. Naya Review Add karne ki API
    @PostMapping("/add")
    public ResponseEntity<?> addReview(@RequestBody Review review) {
        // Validation: Rating 1 se 5 ke beech honi chahiye
        if (review.getRating() < 1 || review.getRating() > 5) {
            return new ResponseEntity<>("Error: Rating sirf 1 se 5 ke beech ho sakti hai!", HttpStatus.BAD_REQUEST);
        }

        // Validation: Check karo ki booking sach mein exist karti hai ya nahi
        if (!bookingRepository.existsById(review.getBookingId())) {
            return new ResponseEntity<>("Error: Yeh Booking ID valid nahi hai!", HttpStatus.NOT_FOUND);
        }

        review.setCreatedAt(LocalDateTime.now());
        Review savedReview = reviewRepository.save(review);
        return new ResponseEntity<>(savedReview, HttpStatus.CREATED);
    }

    // 2. Kisi Service ke saare reviews dekhne ki API
    @GetMapping("/service/{serviceId}")
    public ResponseEntity<List<Review>> getServiceReviews(@PathVariable String serviceId) {
        List<Review> reviews = reviewRepository.findByServiceId(serviceId);
        return new ResponseEntity<>(reviews, HttpStatus.OK);
    }
}