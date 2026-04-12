package com.example.demo.controller;

import com.example.demo.entity.Booking;
import com.example.demo.entity.BookingStatus;
import com.example.demo.repository.BookingRepository;
import com.example.demo.service.EmailService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.payos.PayOS;
import vn.payos.model.v2.paymentRequests.CreatePaymentLinkRequest;
import vn.payos.model.v2.paymentRequests.CreatePaymentLinkResponse;
import vn.payos.model.webhooks.Webhook;
import vn.payos.model.webhooks.WebhookData;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin("*")
public class PayOSController {

    @Value("${payos.client.id}")
    private String clientId;

    @Value("${payos.api.key}")
    private String apiKey;

    @Value("${payos.checksum.key}")
    private String checksumKey;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private EmailService emailService;

    private PayOS payOS;

    // Khởi tạo PayOS SDK
    private void initPayOS() {
        if (payOS == null) {
            payOS = new PayOS(clientId, apiKey, checksumKey);
        }
    }

    @PostMapping("/create-link")
    public ResponseEntity<?> createPaymentLink(@RequestBody Map<String, Object> request) {
        try {
            initPayOS();
            
            String bookingCode = (String) request.get("bookingCode");
            System.out.println("PayOS: Dang tao link cho don hang: " + bookingCode);
            
            // Tìm booking trong DB để lấy thông tin chính xác nhất (bao gồm giá tiền)
            java.util.List<Booking> bookings = bookingRepository.findByBookingCode(bookingCode);
            
            if (bookings.isEmpty()) {
                System.err.println("PayOS ERROR: Khong tim thay don hang trong Database voi ma: " + bookingCode);
                return ResponseEntity.badRequest().body("Booking not found in database: " + bookingCode);
            }
            Booking booking = bookings.get(bookings.size() - 1); // Lấy bản ghi mới nhất bị lặp lại
            
            // Lấy số tiền từ Database (BigDecimal -> long)
            long amount = booking.getTotalPrice().longValue();
            String description = "Thanh toan " + bookingCode.substring(0, Math.min(bookingCode.length(), 10));
            
            System.out.println("PayOS: Gui yeu cau thanh toan voi so tien: " + amount + " VND");

            // PayOS orderCode phải là số. Ta tạo một số từ Timestamp + ID 
            // để đảm bảo không bao giờ trùng trên hệ thống PayOS
            String timeStr = String.valueOf(System.currentTimeMillis()).substring(6); 
            long orderCode = Long.parseLong(timeStr + booking.getId());

            String returnUrl = "http://localhost:5173/checkout?status=success&bookingCode=" + bookingCode; 
            String cancelUrl = "http://localhost:5173/checkout?status=cancel";         

            // Thêm danh sách hàng hóa để QR code đầy đủ thông tin hơn
            vn.payos.model.v2.paymentRequests.PaymentLinkItem item = vn.payos.model.v2.paymentRequests.PaymentLinkItem.builder()
                    .name("Dich vu dat cho")
                    .quantity(1)
                    .price(amount)
                    .build();

            CreatePaymentLinkRequest paymentData = CreatePaymentLinkRequest.builder()
                    .orderCode(orderCode)
                    .amount(amount)
                    .description(description)
                    .returnUrl(returnUrl)
                    .cancelUrl(cancelUrl)
                    .items(java.util.List.of(item)) // Thêm danh sách mặt hàng
                    .build();

            CreatePaymentLinkResponse data = payOS.paymentRequests().create(paymentData);
            
            // Lưu mã định danh thanh toán và mã số đơn hàng vào Database
            booking.setPaymentLinkId(data.getPaymentLinkId());
            booking.setOrderCode(orderCode);
            bookingRepository.save(booking);

            return ResponseEntity.ok(data);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(e.getMessage());
        }
    }

    @PostMapping("/webhook")
    public ResponseEntity<?> receiveWebhook(@RequestBody ObjectNode body) {
        try {
            initPayOS();
            
            ObjectMapper objectMapper = new ObjectMapper();
            Webhook webhookBody = objectMapper.treeToValue(body, Webhook.class);
            
            // Xác thực dữ liệu và trích xuất thông tin (Bản 2.0.1 dùng webhooks().verify)
            WebhookData data = payOS.webhooks().verify(webhookBody);
            Long orderCode = data.getOrderCode();
            
            // Tìm booking theo orderCode chuẩn từ PayOS
            Optional<Booking> bookingOpt = bookingRepository.findByOrderCode(orderCode);
            if (bookingOpt.isPresent()) {
                Booking booking = bookingOpt.get();
                booking.setStatus(BookingStatus.CONFIRMED);
                bookingRepository.save(booking);
                System.out.println("Webhook: Da tu dong xac nhan don hang " + booking.getBookingCode() + " thanh cong!");

                // Gửi email thông báo thanh toán thành công
                if (booking.getUser() != null && booking.getUser().getEmail() != null) {
                    emailService.sendPaymentSuccess(
                        booking,
                        booking.getUser().getEmail(),
                        booking.getUser().getFullName()
                    );
                }
            }

            return ResponseEntity.ok(Map.of("success", true));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.ok(Map.of("success", false, "error", e.getMessage()));
        }
    }
}

