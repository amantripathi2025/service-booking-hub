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
import java.util.Optional;

@RestController
@RequestMapping("/reviews")
@CrossOrigin(origins = "*")
public class ReviewController {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @PostMapping("/add")
    public ResponseEntity<?> addReview(@RequestBody Review review) {
        if (review.getBookingId() != null && !review.getBookingId().isEmpty()) {
            if (!bookingRepository.existsById(review.getBookingId())) {
                return new ResponseEntity<>("Error: Yeh Booking ID valid nahi hai!", HttpStatus.NOT_FOUND);
            }
        }

        review.setCreatedAt(LocalDateTime.now());

        try {
            Review savedReview = reviewRepository.insert(review);
            return new ResponseEntity<>(savedReview, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>("Error aa gaya: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping("/shop/{shopId}")
    public ResponseEntity<List<Review>> getServiceReviews(@PathVariable String shopId) {
        // 🔥 YAHAN CHANGE KIYA HAI: findByServiceId ko findByShopId kar diya hai
        List<Review> reviews = reviewRepository.findByShopId(shopId);
        return new ResponseEntity<>(reviews, HttpStatus.OK);
    }

    @PutMapping("/{id}/reply")
    public ResponseEntity<?> replyToReview(@PathVariable String id, @RequestBody String vendorReply) {
        Optional<Review> optReview = reviewRepository.findById(id);
        if (optReview.isPresent()) {
            Review review = optReview.get();
            review.setVendorReply(vendorReply);
            reviewRepository.save(review);
            return new ResponseEntity<>(review, HttpStatus.OK);
        }
        return new ResponseEntity<>("Review nahi mila!", HttpStatus.NOT_FOUND);
    }
}