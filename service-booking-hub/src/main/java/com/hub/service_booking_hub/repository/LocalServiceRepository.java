package com.hub.service_booking_hub.repository;

import com.hub.service_booking_hub.models.LocalService;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface LocalServiceRepository extends MongoRepository<LocalService, String> {

    // Category ke base par search karne ke liye
    List<LocalService> findByCategory(String category);

    // Budget ke base par search karne ke liye
    List<LocalService> findByPriceLessThanEqual(double price);
}