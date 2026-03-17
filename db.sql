CREATE DATABASE IF NOT EXISTS booking_db;
USE booking_db;
-- =========================================================
-- 1. BẢNG NGƯỜI DÙNG (Từ Register.jsx & Login.jsx)
-- =========================================================
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- =========================================================
-- 2. DỮ LIỆU CƠ SỞ ĐỊA LÝ / VỊ TRÍ
-- =========================================================
-- Bảng Sân bay (Dùng cho Flights & AirportTaxis)
CREATE TABLE airports (
    code VARCHAR(10) PRIMARY KEY, -- Ví dụ: HAN, SGN, DAD
    name VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    country VARCHAR(100) DEFAULT 'Vietnam'
);
-- Bảng Địa điểm/Trạm thuê xe (Dùng cho CarRental)
CREATE TABLE car_locations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL, -- Vd: Sân bay Tân Sơn Nhất, Ga Hà Nội
    city VARCHAR(255) NOT NULL
);
-- =========================================================
-- 3. CÁC THỰC THỂ DỊCH VỤ CỐT LÕI
-- =========================================================
-- 3.1 Khách sạn (Từ Home.jsx: Tìm kiếm theo Destination)
CREATE TABLE hotels (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    address VARCHAR(500) NOT NULL,
    description TEXT,
    rating DECIMAL(2,1) DEFAULT 0.0
);
-- Các loại phòng trong khách sạn
CREATE TABLE rooms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    hotel_id INT,
    room_type VARCHAR(100) NOT NULL, -- Standard, Deluxe, Studio...
    price_per_night DECIMAL(10, 2) NOT NULL,
    max_adults INT DEFAULT 2,
    max_children INT DEFAULT 0,
    FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE
);
-- 3.2 Chuyến bay (Từ Flights.jsx)
CREATE TABLE flights (
    id INT AUTO_INCREMENT PRIMARY KEY,
    airline VARCHAR(100) NOT NULL, -- Vd: Vietnam Airlines, Vietjet
    flight_number VARCHAR(50) NOT NULL,
    departure_airport_code VARCHAR(10),
    arrival_airport_code VARCHAR(10),
    departure_time DATETIME NOT NULL,
    arrival_time DATETIME NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (departure_airport_code) REFERENCES airports(code),
    FOREIGN KEY (arrival_airport_code) REFERENCES airports(code)
);
-- 3.3 Xe cho thuê (Từ CarRental.jsx)
CREATE TABLE cars (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company_name VARCHAR(100) NOT NULL, -- Hertz, Avis, Europcar...
    car_model VARCHAR(100) NOT NULL, -- Vd: Toyota Vios, Ford Transit
    seats INT DEFAULT 4,
    price_per_day DECIMAL(10, 2) NOT NULL,
    location_id INT, -- Nơi xe đang đậu/Có thể đón
    FOREIGN KEY (location_id) REFERENCES car_locations(id)
);
-- 3.4 Điểm tham quan / Hoạt động (Từ Attractions.jsx)
CREATE TABLE attractions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    category VARCHAR(50), -- Văn hóa, Ẩm thực, Thiên nhiên, Giải trí
    price DECIMAL(10, 2) NOT NULL
);
-- 3.5 Xe đưa đón sân bay (Từ AirportTaxis.jsx)
CREATE TABLE airport_taxis (
    id INT AUTO_INCREMENT PRIMARY KEY,
    airport_code VARCHAR(10),
    car_type VARCHAR(50) NOT NULL, -- Vd: Sedan 4 chỗ, SUV 7 chỗ
    base_price DECIMAL(10, 2) NOT NULL, -- Giá cơ bản trọn gói
    FOREIGN KEY (airport_code) REFERENCES airports(code)
);
-- =========================================================
-- 4. BẢNG QUẢN LÝ GIAO DỊCH & PRE-BOOKING (GIỎ HÀNG CHUNG)
-- =========================================================
-- Mỗi khi người dùng đặt bất kỳ dịch vụ nào, tạo 1 Record ở bảng này
-- Giúp dễ dàng cộng tổng tiền hoặc phát triển tính năng Giỏ Hàng (Cart) / Thanh toán gộp (Combo)
CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    booking_type ENUM('FLIGHT', 'HOTEL', 'CAR_RENTAL', 'ATTRACTION', 'TAXI', 'COMBO') NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    status ENUM('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED') DEFAULT 'PENDING',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
-- =========================================================
-- 5. CHI TIẾT CÁC LOẠI ĐẶT CHỖ (ÁNH XẠ TỚI BOOKINGS)
-- =========================================================
-- 5.1 Chi tiết đặt phòng Khách sạn
CREATE TABLE hotel_bookings (
    booking_id INT PRIMARY KEY,
    room_id INT NOT NULL,
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    adults INT DEFAULT 1,
    children INT DEFAULT 0,
    rooms_count INT DEFAULT 1,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    FOREIGN KEY (room_id) REFERENCES rooms(id)
);
-- 5.2 Chi tiết vé Máy bay (Bao gồm khứ hồi)
CREATE TABLE flight_bookings (
    booking_id INT PRIMARY KEY,
    flight_id INT NOT NULL,
    seat_class ENUM('ECONOMY', 'BUSINESS', 'FIRST_CLASS') DEFAULT 'ECONOMY',
    is_roundtrip BOOLEAN DEFAULT FALSE,
    return_flight_id INT NULL, -- Nếu có chiều về
    passengers_count INT DEFAULT 1,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    FOREIGN KEY (flight_id) REFERENCES flights(id),
    FOREIGN KEY (return_flight_id) REFERENCES flights(id)
);
-- 5.3 Chi tiết đặt Thuê xe tự lái
CREATE TABLE car_rental_bookings (
    booking_id INT PRIMARY KEY,
    car_id INT NOT NULL,
    pickup_location_id INT NOT NULL,
    dropoff_location_id INT NOT NULL,
    pickup_datetime DATETIME NOT NULL,
    dropoff_datetime DATETIME NOT NULL,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    FOREIGN KEY (car_id) REFERENCES cars(id),
    FOREIGN KEY (pickup_location_id) REFERENCES car_locations(id),
    FOREIGN KEY (dropoff_location_id) REFERENCES car_locations(id)
);
-- 5.4 Chi tiết đặt vé Điểm tham quan
CREATE TABLE attraction_bookings (
    booking_id INT PRIMARY KEY,
    attraction_id INT NOT NULL,
    visit_date DATE NOT NULL,
    tickets_count INT DEFAULT 1,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    FOREIGN KEY (attraction_id) REFERENCES attractions(id)
);
-- 5.5 Chi tiết đặt Xe Taxi đưa đón sân bay
CREATE TABLE taxi_bookings (
    booking_id INT PRIMARY KEY,
    taxi_id INT NOT NULL,
    pickup_datetime DATETIME NOT NULL,
    dropoff_address VARCHAR(500) NOT NULL,
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
    FOREIGN KEY (taxi_id) REFERENCES airport_taxis(id)
);