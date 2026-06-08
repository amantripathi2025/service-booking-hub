package com.hub.service_booking_hub.repository;

import com.hub.service_booking_hub.models.LocalService;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface LocalServiceRepository extends MongoRepository<LocalService, String> {

    // 1. Yeh method category filter ke liye zaroori hai
    List<LocalService> findByCategory(String category);

    // 2. Price wala filter filhal hata de kyunki humara structure ab 'menuItems' list hai
    // Hum baad mein custom Query use karenge price filter ke liye.
}