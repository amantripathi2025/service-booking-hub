package com.hub.service_booking_hub;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class ServiceBookingHubApplication {

	public static void main(String[] args) {
		SpringApplication.run(ServiceBookingHubApplication.class, args);
	}

	@Bean
	public MongoClient mongoClient() {
		// Ab Java 17 hai, toh ye bina SSL error ke seedha Atlas cloud par connect hoga!
		return MongoClients.create("mongodb+srv://amantripathi7550_db_user:tripathi456@ai-internship-portal.ftfkc7h.mongodb.net/service_hub?retryWrites=true&w=majority&appName=ai-internship-portal");
	}
}