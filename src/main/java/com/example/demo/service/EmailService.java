package com.example.demo.service;

import com.example.demo.entity.Booking;
import com.example.demo.entity.BookingStatus;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.text.NumberFormat;
import java.time.format.DateTimeFormatter;
import java.util.Locale;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private TemplateEngine templateEngine;

    private static final String FROM_EMAIL = "danghainguyen212@gmail.com";
    private static final String FROM_NAME = "DentalTrip Booking";

    /**
     * Gửi email xác nhận đặt chỗ khi booking mới được tạo (PENDING).
     */
    @Async
    public void sendBookingConfirmation(Booking booking, String recipientEmail, String recipientName) {
        try {
            Context context = buildEmailContext(booking, recipientName);
            context.setVariable("emailTitle", "Xác Nhận Đặt Chỗ");
            context.setVariable("statusMessage", "Đơn đặt chỗ của bạn đã được tiếp nhận và đang chờ thanh toán.");
            context.setVariable("statusColor", "#f59e0b"); // Amber for pending
            context.setVariable("statusText", "Chờ Thanh Toán");

            String htmlContent = templateEngine.process("booking-email", context);
            sendHtmlEmail(recipientEmail, "✈️ Xác nhận đặt chỗ #" + booking.getBookingCode(), htmlContent);

            System.out.println("EMAIL: Da gui email xac nhan dat cho toi " + recipientEmail);
        } catch (Exception e) {
            System.err.println("EMAIL ERROR: Khong the gui email xac nhan: " + e.getMessage());
            e.printStackTrace();
        }
    }

    /**
     * Gửi email thông báo thanh toán thành công.
     */
    @Async
    public void sendPaymentSuccess(Booking booking, String recipientEmail, String recipientName) {
        try {
            Context context = buildEmailContext(booking, recipientName);
            context.setVariable("emailTitle", "Thanh Toán Thành Công");
            context.setVariable("statusMessage", "Thanh toán của bạn đã được xác nhận thành công! Đơn hàng đã được xử lý.");
            context.setVariable("statusColor", "#10b981"); // Green for success
            context.setVariable("statusText", "Đã Thanh Toán");

            String htmlContent = templateEngine.process("booking-email", context);
            sendHtmlEmail(recipientEmail, "✅ Thanh toán thành công #" + booking.getBookingCode(), htmlContent);

            System.out.println("EMAIL: Da gui email thanh toan thanh cong toi " + recipientEmail);
        } catch (Exception e) {
            System.err.println("EMAIL ERROR: Khong the gui email thanh toan: " + e.getMessage());
            e.printStackTrace();
        }
    }

    /**
     * Gửi email thông báo hủy đơn.
     */
    @Async
    public void sendBookingCancellation(Booking booking, String recipientEmail, String recipientName) {
        try {
            Context context = buildEmailContext(booking, recipientName);
            context.setVariable("emailTitle", "Đơn Đặt Chỗ Đã Hủy");
            context.setVariable("statusMessage", "Đơn đặt chỗ của bạn đã được hủy theo yêu cầu.");
            context.setVariable("statusColor", "#ef4444"); // Red for cancelled
            context.setVariable("statusText", "Đã Hủy");

            String htmlContent = templateEngine.process("booking-email", context);
            sendHtmlEmail(recipientEmail, "❌ Đơn đặt chỗ đã hủy #" + booking.getBookingCode(), htmlContent);

            System.out.println("EMAIL: Da gui email huy don toi " + recipientEmail);
        } catch (Exception e) {
            System.err.println("EMAIL ERROR: Khong the gui email huy don: " + e.getMessage());
            e.printStackTrace();
        }
    }

    /**
     * Xây dựng context chung cho email template.
     */
    private Context buildEmailContext(Booking booking, String recipientName) {
        Context context = new Context();
        context.setVariable("customerName", recipientName != null ? recipientName : "Quý Khách");
        context.setVariable("bookingCode", booking.getBookingCode());
        context.setVariable("bookingType", translateBookingType(booking.getBookingType().name()));
        context.setVariable("totalPrice", formatCurrency(booking.getTotalPrice()));
        context.setVariable("createdAt", booking.getCreatedAt() != null
                ? booking.getCreatedAt().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm"))
                : "N/A");
        return context;
    }

    /**
     * Gửi email HTML thông qua Gmail SMTP.
     */
    private void sendHtmlEmail(String to, String subject, String htmlContent) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        helper.setFrom(FROM_EMAIL);
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(htmlContent, true);
        mailSender.send(message);
    }

    /**
     * Dịch loại booking sang tiếng Việt.
     */
    private String translateBookingType(String type) {
        return switch (type) {
            case "FLIGHT" -> "Vé Máy Bay";
            case "HOTEL" -> "Phòng Khách Sạn";
            case "CAR_RENTAL" -> "Thuê Xe";
            case "ATTRACTION" -> "Vé Tham Quan";
            case "TAXI" -> "Taxi Sân Bay";
            case "COMBO" -> "Combo Du Lịch";
            default -> type;
        };
    }

    /**
     * Định dạng tiền tệ VNĐ.
     */
    private String formatCurrency(java.math.BigDecimal amount) {
        if (amount == null) return "0 ₫";
        NumberFormat formatter = NumberFormat.getInstance(new Locale("vi", "VN"));
        return formatter.format(amount) + " ₫";
    }
}
