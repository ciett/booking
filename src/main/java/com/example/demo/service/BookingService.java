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

    public Booking createBooking(Booking booking) {
        // Logic check số phòng trống sẽ được implement thêm tại đây!
        return bookingRepository.save(booking);
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
