package com.example.demo.controller;

import com.example.demo.service.PaypalService;
import com.example.demo.service.BookingService;
import com.example.demo.entity.BookingStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/paypal")
@CrossOrigin(origins = "*")
public class PaypalController {

    @Autowired
    private PaypalService paypalService;

    @Autowired
    private BookingService bookingService;

    @PostMapping("/create-order")
    public ResponseEntity<?> createOrder(@RequestBody Map<String, Object> payload) {
        try {
            // Nhận tiền giỏ hàng (giả định USD) từ frontend
            String totalAmount = payload.get("amount").toString();
            Map<String, Object> order = paypalService.createOrder(totalAmount);
            return ResponseEntity.ok(order); // Trả về Order JSON (có chứa orderId)
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error creating order: " + e.getMessage());
        }
    }

    @PostMapping("/capture-order")
    public ResponseEntity<?> captureOrder(@RequestBody Map<String, Object> payload) {
        try {
            String orderId = payload.get("orderId").toString();
            Map<String, Object> captureResponse = paypalService.captureOrder(orderId);
            
            // Nếu capture thành công (status COMPLETED), cập nhật trạng thái Booking
            if ("COMPLETED".equals(captureResponse.get("status"))) {
                if (payload.containsKey("bookingId")) {
                    Long bookingId = Long.parseLong(payload.get("bookingId").toString());
                    bookingService.updateStatus(bookingId, BookingStatus.CONFIRMED);
                }
            }
            
            return ResponseEntity.ok(captureResponse);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Error capturing order: " + e.getMessage());
        }
    }
}
