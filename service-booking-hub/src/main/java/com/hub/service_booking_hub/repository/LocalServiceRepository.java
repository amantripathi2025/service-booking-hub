package com.hub.service_booking_hub.repository;

import com.hub.service_booking_hub.models.LocalService;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.geo.Point;
import org.springframework.data.geo.Distance;

import java.util.List;

public interface LocalServiceRepository extends MongoRepository<LocalService, String> {

    // Teri purani query jo pichli baar hat gayi thi
    List<LocalService> findByCategory(String category);

    // GeoSpatial Query: Customer ki location ke paas wali dukan dhoondhne ke liye
    List<LocalService> findByLocationNear(Point location, Distance distance);
}