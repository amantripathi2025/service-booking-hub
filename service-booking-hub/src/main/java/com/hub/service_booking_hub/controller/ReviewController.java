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
@RequestMapping("/reviews") // Postman wale URL se match karne ke liye /api/v1 lagaya hai
@CrossOrigin(origins = "*")
public class ReviewController {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private BookingRepository bookingRepository;

    // 1. Customer naya review dega
    @PostMapping("/add")
    public ResponseEntity<?> addReview(@RequestBody Review review) {

        // Null Check for Booking ID (Crash bachane ke liye)
        if (review.getBookingId() != null && !review.getBookingId().isEmpty()) {
            // Validation: Check karo ki booking sach mein exist karti hai ya nahi
            if (!bookingRepository.existsById(review.getBookingId())) {
                return new ResponseEntity<>("Error: Yeh Booking ID valid nahi hai!", HttpStatus.NOT_FOUND);
            }
        }

        review.setCreatedAt(LocalDateTime.now());

        try {
            // Naya review insert kar rahe hain
            Review savedReview = reviewRepository.insert(review);
            return new ResponseEntity<>(savedReview, HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>("Error aa gaya: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // 2. Kisi Service/Shop ke saare reviews dekhne ki API
    @GetMapping("/shop/{shopId}")
    public ResponseEntity<List<Review>> getServiceReviews(@PathVariable String shopId) {
        // Note: Yahan frontend "shopId" bhej raha hai URL mein, toh usko handle kiya hai
        List<Review> reviews = reviewRepository.findByServiceId(shopId);
        return new ResponseEntity<>(reviews, HttpStatus.OK);
    }

    // 3. Vendor Reply karega
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