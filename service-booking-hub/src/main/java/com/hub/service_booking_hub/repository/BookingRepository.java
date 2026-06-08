package com.hub.service_booking_hub.repository;

import com.hub.service_booking_hub.models.Booking;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BookingRepository extends MongoRepository<Booking, String> {

    // 🔥 Yeh line add karte hi Controller ki red line gayab ho jayegi
    List<Booking> findByShopId(String shopId);

    List<Booking> findByCustomerEmail(String customerEmail);
}