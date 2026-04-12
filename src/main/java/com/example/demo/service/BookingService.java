package com.example.demo.service;

import com.example.demo.entity.Booking;
import com.example.demo.entity.BookingStatus;
import com.example.demo.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private EmailService emailService;

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
            Booking savedBooking = bookingRepository.save(booking);

            // Gửi email xác nhận đặt chỗ tự động
            sendBookingEmail(savedBooking, "CREATED");

            return savedBooking;
        } catch (Exception e) {
            System.err.println("DATABASE ERROR khi luu booking: " + e.getMessage());
            if (e.getCause() != null) {
                System.err.println("Root Cause: " + e.getCause().getMessage());
            }
            throw e;
        }
    }

    public Booking updateStatus(Long id, BookingStatus status) {
        return bookingRepository.findById(id).map(booking -> {
            booking.setStatus(status);
            Booking updatedBooking = bookingRepository.save(booking);

            // Gửi email thông báo khi trạng thái thay đổi
            if (status == BookingStatus.CONFIRMED) {
                sendBookingEmail(updatedBooking, "CONFIRMED");
            } else if (status == BookingStatus.CANCELLED) {
                sendBookingEmail(updatedBooking, "CANCELLED");
            }

            return updatedBooking;
        }).orElseThrow(() -> new RuntimeException("Booking not found: " + id));
    }

    public void cancelBooking(Long id) {
        updateStatus(id, BookingStatus.CANCELLED);
    }

    /**
     * Gửi email tương ứng với sự kiện booking.
     */
    private void sendBookingEmail(Booking booking, String event) {
        try {
            // Lấy thông tin user từ booking
            if (booking.getUser() == null) {
                System.out.println("EMAIL: Khong gui email vi booking khong co thong tin user");
                return;
            }

            String email = booking.getUser().getEmail();
            String name = booking.getUser().getFullName();

            if (email == null || email.isEmpty()) {
                System.out.println("EMAIL: Khong gui email vi user khong co email");
                return;
            }

            switch (event) {
                case "CREATED" -> emailService.sendBookingConfirmation(booking, email, name);
                case "CONFIRMED" -> emailService.sendPaymentSuccess(booking, email, name);
                case "CANCELLED" -> emailService.sendBookingCancellation(booking, email, name);
            }
        } catch (Exception e) {
            // Không throw lỗi email để không ảnh hưởng đến luồng booking chính
            System.err.println("EMAIL: Loi khi gui email (khong anh huong booking): " + e.getMessage());
        }
    }

    public Booking saveBooking(Booking booking) {
        return bookingRepository.save(booking);
    }
}
