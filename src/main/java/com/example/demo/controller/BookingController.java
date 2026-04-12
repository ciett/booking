package com.example.demo.controller;

import com.example.demo.entity.Booking;
import com.example.demo.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @GetMapping("/user/{userId}")
    public List<Booking> getUserBookings(@PathVariable Long userId) {
        return bookingService.getUserBookings(userId);
    }

    @GetMapping("/status/{code}")
    public org.springframework.http.ResponseEntity<String> getBookingStatus(@PathVariable String code) {
        return bookingService.getBookingByCode(code)
                .map(booking -> org.springframework.http.ResponseEntity.ok(booking.getStatus().toString()))
                .orElse(org.springframework.http.ResponseEntity.status(404).body("NOT_FOUND"));
    }

    @PostMapping
    public Booking createBooking(@RequestBody Booking booking) {
        return bookingService.createBooking(booking);
    }

    @PutMapping("/{id}/cancel")
    public void cancelBooking(@PathVariable Long id) {
        bookingService.cancelBooking(id);
    }

    @PatchMapping("/confirm-by-code/{code}")
    public org.springframework.http.ResponseEntity<?> confirmByCode(@PathVariable String code) {
        return bookingService.getBookingByCode(code)
            .map(booking -> {
                booking.setStatus(com.example.demo.entity.BookingStatus.CONFIRMED);
                bookingService.saveBooking(booking);
                return org.springframework.http.ResponseEntity.ok(booking);
            })
            .orElse(org.springframework.http.ResponseEntity.notFound().build());
    }
}
