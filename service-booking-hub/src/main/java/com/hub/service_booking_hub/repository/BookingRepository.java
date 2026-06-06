package com.hub.service_booking_hub.repository;

import com.hub.service_booking_hub.enums.BookingStatus;
import com.hub.service_booking_hub.models.Booking;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BookingRepository extends MongoRepository<Booking, String> {

    // User ki bookings ke liye
    List<Booking> findByUserId(String userId);

    // Vendor ke dashboard ke liye: Service ID aur Status ke base par total bookings nikalna
    List<Booking> findByServiceIdAndStatus(String serviceId, BookingStatus status);

    // Kisi specific service ki saari bookings nikalna
    List<Booking> findByServiceId(String serviceId);
}