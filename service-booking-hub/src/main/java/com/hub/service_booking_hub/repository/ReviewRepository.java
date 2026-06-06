package com.hub.service_booking_hub.repository;

import com.hub.service_booking_hub.models.Review;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ReviewRepository extends MongoRepository<Review, String> {

    // Kisi specific service ke saare reviews nikalne ke liye
    List<Review> findByServiceId(String serviceId);
}