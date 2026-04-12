package com.example.demo.controller;

import com.example.demo.entity.Booking;
import com.example.demo.service.BookingService;
import com.example.demo.service.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/email")
@CrossOrigin(origins = "*")
public class EmailController {

    @Autowired
    private EmailService emailService;

    @Autowired
    private BookingService bookingService;

    /**
     * API gửi lại email xác nhận cho một booking cụ thể.
     * POST /api/email/resend/{bookingCode}
     */
    @PostMapping("/resend/{bookingCode}")
    public ResponseEntity<?> resendBookingEmail(@PathVariable String bookingCode) {
        try {
            return bookingService.getBookingByCode(bookingCode)
                    .map(booking -> {
                        if (booking.getUser() == null || booking.getUser().getEmail() == null) {
                            return ResponseEntity.badRequest()
                                    .body(Map.of("success", false, "message", "Booking không có thông tin email"));
                        }

                        String email = booking.getUser().getEmail();
                        String name = booking.getUser().getFullName();

                        switch (booking.getStatus()) {
                            case PENDING -> emailService.sendBookingConfirmation(booking, email, name);
                            case CONFIRMED -> emailService.sendPaymentSuccess(booking, email, name);
                            case CANCELLED -> emailService.sendBookingCancellation(booking, email, name);
                            default -> emailService.sendBookingConfirmation(booking, email, name);
                        }

                        return ResponseEntity.ok(Map.of(
                                "success", true,
                                "message", "Đã gửi lại email tới " + email
                        ));
                    })
                    .orElse(ResponseEntity.status(404)
                            .body(Map.of("success", false, "message", "Không tìm thấy đơn hàng: " + bookingCode)));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }

    /**
     * API test gửi email nhanh (dùng để kiểm tra cấu hình SMTP).
     * POST /api/email/test?to=email@example.com
     */
    @PostMapping("/test")
    public ResponseEntity<?> testEmail(@RequestParam String to) {
        try {
            Booking testBooking = Booking.builder()
                    .bookingCode("TEST-" + System.currentTimeMillis())
                    .bookingType(com.example.demo.entity.BookingType.HOTEL)
                    .totalPrice(java.math.BigDecimal.valueOf(1500000))
                    .status(com.example.demo.entity.BookingStatus.PENDING)
                    .createdAt(java.time.LocalDateTime.now())
                    .build();

            emailService.sendBookingConfirmation(testBooking, to, "Khách Hàng Test");

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Đã gửi email test tới " + to
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("success", false, "message", e.getMessage()));
        }
    }
}
