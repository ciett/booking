package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SystemDataService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    /**
     * Tịnh tiến ngày đối với những bản ghi demo (id <= 50 hoặc phù hợp với bảng).
     * Chỉ áp dụng cho các dữ liệu được tạo từ data.sql để không làm thay đổi
     * dữ liệu của người dùng thật đặt sau này.
     */
    @Transactional
    public int shiftDemoDates(int days) {
        int rowsAffected = 0;

        // 1. Flights (Chuyến bay)
        rowsAffected += jdbcTemplate.update(
            "UPDATE flights SET departure_time = DATE_ADD(departure_time, INTERVAL ? DAY), " +
            "arrival_time = DATE_ADD(arrival_time, INTERVAL ? DAY) WHERE id <= 50", 
            days, days
        );

        // 2. Hotel Bookings (Đặt phòng) - Dùng booking_id thay vì id
        rowsAffected += jdbcTemplate.update(
            "UPDATE hotel_bookings SET check_in_date = DATE_ADD(check_in_date, INTERVAL ? DAY), " +
            "check_out_date = DATE_ADD(check_out_date, INTERVAL ? DAY) WHERE booking_id <= 50", 
            days, days
        );

        // 3. Flight Bookings (Không có ngày riêng nhưng cập nhật phòng hờ nếu có entity khác)

        // 4. Car Rental Bookings (Thuê xe)
        rowsAffected += jdbcTemplate.update(
            "UPDATE car_rental_bookings SET pickup_datetime = DATE_ADD(pickup_datetime, INTERVAL ? DAY), " +
            "dropoff_datetime = DATE_ADD(dropoff_datetime, INTERVAL ? DAY) WHERE booking_id <= 50", 
            days, days
        );

        // 5. Attraction Bookings (Điểm tham quan)
        rowsAffected += jdbcTemplate.update(
            "UPDATE attraction_bookings SET visit_date = DATE_ADD(visit_date, INTERVAL ? DAY) WHERE booking_id <= 50", 
            days
        );

        // 6. Taxi Bookings (Taxi đưa đón)
        rowsAffected += jdbcTemplate.update(
            "UPDATE taxi_bookings SET pickup_datetime = DATE_ADD(pickup_datetime, INTERVAL ? DAY) WHERE booking_id <= 50", 
            days
        );

        // 7. Dynamic Prices (Giá động)
        rowsAffected += jdbcTemplate.update(
            "UPDATE dynamic_prices SET target_date = DATE_ADD(target_date, INTERVAL ? DAY) WHERE id <= 50", 
            days
        );
        
        // 8. Bookings (Tịnh tiến created_at cho hợp lý, nếu thời gian tạo booking cũ ở quá xa trong quá khứ)
        jdbcTemplate.update(
            "UPDATE bookings SET created_at = DATE_ADD(created_at, INTERVAL ? DAY) WHERE id <= 50",
            days
        );

        return rowsAffected;
    }
}
