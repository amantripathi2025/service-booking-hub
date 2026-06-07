package com.hub.service_booking_hub.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.Arrays;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();

        // React application ka URL allow karo
        config.setAllowedOrigins(Arrays.asList("http://localhost:5173"));

        // Saare headers allow karo (Content-Type, Authorization, etc.)
        config.setAllowedHeaders(Arrays.asList("*"));

        // Saare HTTP methods allow karo (Post, Get, Options, etc.)
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));

        // Credentials allow karo (Cookies/Tokens ke liye useful hai)
        config.setAllowCredentials(true);

        // Puraane aur naye saare endpoints par apply karo
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}