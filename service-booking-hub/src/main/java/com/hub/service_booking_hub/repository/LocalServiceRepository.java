package com.hub.service_booking_hub.repository;

import com.hub.service_booking_hub.models.LocalService;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LocalServiceRepository extends MongoRepository<LocalService, String> {
}