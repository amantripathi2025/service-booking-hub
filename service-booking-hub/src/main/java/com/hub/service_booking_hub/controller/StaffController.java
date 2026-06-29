package com.hub.service_booking_hub.controller;

import com.hub.service_booking_hub.models.Staff;
import com.hub.service_booking_hub.repository.StaffRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/staff")
@CrossOrigin(origins = "*")
public class StaffController {

    @Autowired
    private StaffRepository staffRepository;

    // 1. Naya barber add karne ke liye (Shop Owner ke dashboard se)
    @PostMapping("/add")
    public Staff addStaff(@RequestBody Staff staff) {
        // Naya staff hamesha by default available (khaali) rahega
        staff.setAvailable(true);
        return staffRepository.save(staff);
    }

    // 2. Kisi shop ke saare barbers dekhne ke liye (Customer UI ke liye)
    @GetMapping("/shop/{shopId}")
    public List<Staff> getStaffByShop(@PathVariable String shopId) {
        return staffRepository.findByShopId(shopId);
    }
}