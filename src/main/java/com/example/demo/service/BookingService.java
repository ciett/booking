package com.example.demo.service;

import com.example.demo.entity.Booking;
import com.example.demo.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    public List<Booking> getUserBookings(Long userId) {
        return bookingRepository.findByUserId(userId);
    }

    public java.util.Optional<Booking> getBookingByCode(String bookingCode) {
        List<Booking> list = bookingRepository.findByBookingCode(bookingCode);
        if (list != null && !list.isEmpty()) {
            return java.util.Optional.of(list.get(list.size() - 1));
        }
        return java.util.Optional.empty();
    }

    public Booking createBooking(Booking booking) {
        try {
            System.out.println("BookingService: Dang luu don hang voi ma: " + booking.getBookingCode());
            return bookingRepository.save(booking);
        } catch (Exception e) {
            System.err.println("DATABASE ERROR khi luu booking: " + e.getMessage());
            if (e.getCause() != null) {
                System.err.println("Root Cause: " + e.getCause().getMessage());
            }
            throw e;
        }
    }

    public Booking updateStatus(Long id, com.example.demo.entity.BookingStatus status) {
        return bookingRepository.findById(id).map(booking -> {
            booking.setStatus(status);
            return bookingRepository.save(booking);
        }).orElseThrow(() -> new RuntimeException("Booking not found: " + id));
    }

    public void cancelBooking(Long id) {
        updateStatus(id, com.example.demo.entity.BookingStatus.CANCELLED);
    }
}
