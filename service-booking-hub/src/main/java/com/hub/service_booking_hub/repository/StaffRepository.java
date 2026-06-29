package com.hub.service_booking_hub.repository;

import com.hub.service_booking_hub.models.Staff;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StaffRepository extends MongoRepository<Staff, String> {

    // Specific shop ke saare barbers nikalne ke liye
    List<Staff> findByShopId(String shopId);

    // Kisi shop ke sirf khali (available) barbers nikalne ke liye
    List<Staff> findByShopIdAndIsAvailable(String shopId, boolean isAvailable);
}
