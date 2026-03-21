-- Database Seed Data Script
-- Set the database
USE booking_db;

-- Tắt kiểm tra khóa ngoại để có thể xóa bảng có ràng buộc
SET FOREIGN_KEY_CHECKS = 0;

-- Xóa dữ liệu cũ (Xóa bảng con trước, bảng cha sau)
TRUNCATE TABLE reviews;
TRUNCATE TABLE taxi_bookings;
TRUNCATE TABLE attraction_bookings;
TRUNCATE TABLE car_rental_bookings;
TRUNCATE TABLE flight_bookings;
TRUNCATE TABLE hotel_bookings;
TRUNCATE TABLE bookings;

TRUNCATE TABLE rooms;
TRUNCATE TABLE hotels;
TRUNCATE TABLE flights;
TRUNCATE TABLE cars;
TRUNCATE TABLE attractions;
TRUNCATE TABLE airport_taxis;

TRUNCATE TABLE car_locations;
TRUNCATE TABLE airports;
TRUNCATE TABLE users;

-- Bật lại kiểm tra khóa ngoại
SET FOREIGN_KEY_CHECKS = 1;


-- ==========================================
-- 1. Create Users
-- ==========================================
INSERT INTO users (id, email, password, full_name, phone_number, role) VALUES 
(1, 'customer1@example.com', '$2a$10$xyz...', 'Nguyen Van A', '0901234567', 'CUSTOMER'),
(2, 'hotelowner1@example.com', '$2a$10$xyz...', 'Tran Thi B', '0987654321', 'OWNER'),
(3, 'admin@example.com', '$2a$10$xyz...', 'Admin System', '0999999999', 'ADMIN'),
(4, 'customer2@example.com', '$2a$10$xyz...', 'Le Van C', '0912345678', 'CUSTOMER'),
(5, 'customer3@example.com', '$2a$10$xyz...', 'Pham Thi D', '0933333333', 'CUSTOMER'),
(6, 'customer4@example.com', '$2a$10$xyz...', 'Hoang Van E', '0944444444', 'CUSTOMER');


-- ==========================================
-- 2. Create Airports
-- ==========================================
INSERT INTO airports (code, name, city, country) VALUES 
('SGN', 'Sân bay Quốc tế Tân Sơn Nhất', 'Hồ Chí Minh', 'Việt Nam'),
('HAN', 'Sân bay Quốc tế Nội Bài', 'Hà Nội', 'Việt Nam'),
('DAD', 'Sân bay Quốc tế Đà Nẵng', 'Đà Nẵng', 'Việt Nam'),
('PQC', 'Sân bay Quốc tế Phú Quốc', 'Phú Quốc', 'Việt Nam'),
('CXR', 'Sân bay Quốc tế Cam Ranh', 'Nha Trang', 'Việt Nam'),
('HUI', 'Sân bay Quốc tế Phú Bài', 'Huế', 'Việt Nam'),
('VCA', 'Sân bay Quốc tế Cần Thơ', 'Cần Thơ', 'Việt Nam'),
('VDO', 'Sân bay Quốc tế Vân Đồn', 'Hạ Long', 'Việt Nam');


-- ==========================================
-- 3. Create Car Locations
-- ==========================================
INSERT INTO car_locations (id, name, city) VALUES 
(1, 'Quận 1, TP Hồ Chí Minh', 'Hồ Chí Minh'),
(2, 'Sân bay Tân Sơn Nhất (SGN)', 'Hồ Chí Minh'),
(3, 'Quận Hoàn Kiếm, Hà Nội', 'Hà Nội'),
(4, 'Sân bay Nội Bài (HAN)', 'Hà Nội'),
(5, 'Trung tâm Đà Nẵng', 'Đà Nẵng'),
(6, 'Sân bay Đà Nẵng (DAD)', 'Đà Nẵng'),
(7, 'Thị trấn Dương Đông, Phú Quốc', 'Phú Quốc'),
(8, 'Sân bay Phú Quốc (PQC)', 'Phú Quốc'),
(9, 'Đường Trần Phú, Nha Trang', 'Nha Trang'),
(10, 'Sân bay Cam Ranh (CXR)', 'Nha Trang'),
(11, 'Trung tâm Đà Lạt', 'Đà Lạt');


-- ==========================================
-- 4. Create Hotels
-- ==========================================
INSERT INTO hotels (id, name, description, address, city, rating) VALUES 
-- HCM
(1, 'Vinpearl Landmark 81', 'Khách sạn cao nhất Việt Nam với view toàn thành phố.', '720A Điện Biên Phủ, Vinhomes Tân Cảng, Bình Thạnh', 'Hồ Chí Minh', 5.0),
(2, 'The Reverie Saigon', 'Tuyệt tác nghỉ dưỡng xa hoa bật nhất Sài Gòn mang phong cách hoàng gia Ý.', '22-36 Nguyễn Huệ, Quận 1', 'Hồ Chí Minh', 5.0),
(3, 'Caravelle Saigon', 'Khách sạn 5 sao mang tính biểu tượng nằm ngay trung tâm thành phố Sài Gòn.', '19 Công Trường Lam Sơn, Quận 1', 'Hồ Chí Minh', 4.8),

-- HN
(4, 'InterContinental Hanoi Westlake', 'Khách sạn sang trọng nằm hoàn toàn trên mặt hồ Tây.', '5 Từ Hoa, Tây Hồ', 'Hà Nội', 4.9),
(5, 'Sofitel Legend Metropole', 'Một ốc đảo lịch sử giữa trung tâm thành phố với nét quyến rũ cổ điển.', '15 Ngô Quyền, Hoàn Kiếm', 'Hà Nội', 5.0),
(6, 'Lotte Hotel Hanoi', 'Nằm ở phần trên của tòa nhà 65 tầng hoành tráng, tầm nhìn không hạn chế.', '54 Liễu Giai, Ba Đình', 'Hà Nội', 4.7),

-- DN
(7, 'Melia Danang Beach Resort', 'Khu nghỉ dưỡng lý tưởng với bãi biển cát trắng riêng biệt.', '19 Trường Sa, Ngũ Hành Sơn', 'Đà Nẵng', 4.5),
(8, 'Furama Resort Danang', 'Khu nghỉ dưỡng di sản bên bãi biển tuyệt đẹp tại Miền Trung Việt Nam.', '103 - 105 Võ Nguyên Giáp, Khuê Mỹ, Ngũ Hành Sơn', 'Đà Nẵng', 4.8),

-- PQ
(9, 'Pullman Phu Quoc Beach Resort', 'Trung tâm giải trí nghỉ dưỡng hàng đầu tại Đảo Ngọc.', 'Tổ 6 xóm Bàn Quy, Bãi Trường, Dương Tơ', 'Phú Quốc', 5.0),
(10, 'JW Marriott Phu Quoc', 'Trường Đại học giả tưởng do Bill Bensley thiết kế ở bãi Kem.', 'Bãi Khem, An Thới', 'Phú Quốc', 5.0),

-- NT
(11, 'Amiana Resort', 'Nơi hội tụ vẻ đẹp thiên nhiên với hồ bơi nước mặn khổng lồ.', 'Phạm Văn Đồng, Vĩnh Hòa', 'Nha Trang', 4.6),
(12, 'Vinpearl Resort Nha Trang', 'Điểm đến hoàn hảo của sự sang trọng, đẳng cấp và lãng mạn.', 'Đảo Hòn Tre', 'Nha Trang', 4.8),

-- Sapa / Hoi An / Ha Long
(13, 'Hotel de la Coupole Sapa', 'Sự pha trộn giữa Haute Couture thời trang và sắc màu dân tộc Tây Bắc.', '1 Hoàng Liên', 'Sa Pa', 4.9),
(14, 'Four Seasons Resort The Nam Hai', 'Biệt thự nghỉ dưỡng riêng tư tuyệt đối bên bờ biển Cửa Đại đẹp hoang sơ.', 'Block Ha My Dong B, Điện Bàn', 'Hội An', 5.0),
(15, 'Wyndham Legend Halong', 'Khách sạn đạt tiêu chuẩn 5 sao quốc tế đầu tiên tại khu du lịch Bãi Cháy.', '12 Hạ Long, Bãi Cháy', 'Hạ Long', 4.7);


-- ==========================================
-- 5. Create Rooms for Hotels
-- ==========================================
INSERT INTO rooms (id, hotel_id, room_type, price_per_night, max_adults, max_children) VALUES 
(1, 1, 'Standard Room', 1500000, 2, 1),
(2, 1, 'Deluxe City View', 2500000, 2, 2),
(3, 1, 'Presidential Suite', 10500000, 2, 2),
(4, 2, 'Luxury Twin', 3000000, 2, 1),
(5, 2, 'Romance Suite', 6000000, 2, 0),
(6, 3, 'Signature King', 2000000, 2, 1),
(7, 4, 'Overwater Pavilion', 4500000, 2, 1),
(8, 4, 'Classic Lake View', 3200000, 2, 2),
(9, 5, 'Premium Historical', 5500000, 2, 1),
(10, 5, 'Opera Wing Luxury', 4200000, 2, 2),
(11, 7, 'Melia Retreat Villa', 5500000, 4, 2),
(12, 7, 'Deluxe Ocean View', 2800000, 2, 1),
(13, 8, 'Ocean Studio Suite', 3500000, 2, 2),
(14, 9, 'Sunrise View Balcony', 2500000, 2, 2),
(15, 10, 'Emerald Bay View', 8500000, 2, 1),
(16, 10, 'Lamarck University Suite', 14000000, 2, 2),
(17, 11, 'Ocean Pool Villa', 7000000, 2, 1),
(18, 12, 'Grand Deluxe', 3000000, 2, 2),
(19, 13, 'Classic French', 4500000, 2, 1),
(20, 14, 'One Bedroom Villa Pool', 15000000, 2, 1),
(21, 15, 'Executive King', 2800000, 2, 2);


-- ==========================================
-- 6. Create Flights
-- ==========================================
INSERT INTO flights (id, airline, flight_number, departure_airport_code, arrival_airport_code, departure_time, arrival_time, price) VALUES 
-- HCM to HN
(1, 'Vietnam Airlines', 'VN213', 'HAN', 'SGN', CONCAT(CURDATE(), ' 08:30:00'), CONCAT(CURDATE(), ' 10:45:00'), 1800000),
(2, 'Bamboo Airways', 'QH201', 'HAN', 'SGN', CONCAT(CURDATE(), ' 10:00:00'), CONCAT(CURDATE(), ' 12:10:00'), 1500000),
(3, 'Vietjet Air', 'VJ125', 'SGN', 'HAN', CONCAT(CURDATE(), ' 14:00:00'), CONCAT(CURDATE(), ' 16:15:00'), 1050000),
(4, 'Vietnam Airlines', 'VN225', 'SGN', 'HAN', CONCAT(ADDDATE(CURDATE(), 1), ' 07:00:00'), CONCAT(ADDDATE(CURDATE(), 1), ' 09:15:00'), 1900000),

-- HCM to DAD
(5, 'Vietjet Air', 'VJ321', 'SGN', 'DAD', CONCAT(CURDATE(), ' 09:15:00'), CONCAT(CURDATE(), ' 10:35:00'), 850000),
(6, 'Vietnam Airlines', 'VN112', 'SGN', 'DAD', CONCAT(CURDATE(), ' 13:45:00'), CONCAT(CURDATE(), ' 15:10:00'), 1400000),
(7, 'Bamboo Airways', 'QH154', 'DAD', 'SGN', CONCAT(ADDDATE(CURDATE(), 1), ' 18:30:00'), CONCAT(ADDDATE(CURDATE(), 1), ' 20:00:00'), 1100000),

-- HCM to PQC
(8, 'Vietnam Airlines', 'VN1201', 'SGN', 'PQC', CONCAT(CURDATE(), ' 09:15:00'), CONCAT(CURDATE(), ' 10:15:00'), 1200000),
(9, 'Vietjet Air', 'VJ328', 'SGN', 'PQC', CONCAT(CURDATE(), ' 16:00:00'), CONCAT(CURDATE(), ' 17:05:00'), 750000),
(10, 'Vietnam Airlines', 'VN1202', 'PQC', 'SGN', CONCAT(ADDDATE(CURDATE(), 2), ' 11:30:00'), CONCAT(ADDDATE(CURDATE(), 2), ' 12:35:00'), 1250000),

-- HN to DAD
(11, 'Bamboo Airways', 'QH103', 'HAN', 'DAD', CONCAT(CURDATE(), ' 06:30:00'), CONCAT(CURDATE(), ' 07:55:00'), 1300000),
(12, 'Vietjet Air', 'VJ501', 'HAN', 'DAD', CONCAT(CURDATE(), ' 11:10:00'), CONCAT(CURDATE(), ' 12:30:00'), 950000),

-- HN to PQC
(13, 'Vietnam Airlines', 'VN1233', 'HAN', 'PQC', CONCAT(ADDDATE(CURDATE(), 1), ' 08:00:00'), CONCAT(ADDDATE(CURDATE(), 1), ' 10:15:00'), 2500000),

-- HN to CXR (Nha Trang)
(14, 'Vietjet Air', 'VJ773', 'HAN', 'CXR', CONCAT(CURDATE(), ' 15:20:00'), CONCAT(CURDATE(), ' 17:15:00'), 1150000),

-- SGN to CXR (Nha Trang)
(15, 'Bamboo Airways', 'QH274', 'SGN', 'CXR', CONCAT(ADDDATE(CURDATE(), 1), ' 16:30:00'), CONCAT(ADDDATE(CURDATE(), 1), ' 17:40:00'), 800000);


-- ==========================================
-- 7. Create Cars for Rental
-- ==========================================
INSERT INTO cars (id, company_name, car_model, seats, price_per_day, location_id) VALUES 
(1, 'Avis', 'Toyota Vios 2023', 5, 800000, 2),
(2, 'Hertz', 'Honda CR-V 2024', 7, 1300000, 1),
(3, 'Europcar', 'Mazda 3', 5, 900000, 2),
(4, 'Gocar', 'Ford Everest', 7, 1500000, 4),
(5, 'Avis', 'Kia Morning', 5, 500000, 3),
(6, 'Hertz', 'Mitsubishi Xpander', 7, 1000000, 6),
(7, 'Europcar', 'Toyota Fortuner', 7, 1400000, 5),
(8, 'Gocar', 'VinFast VF8', 5, 1200000, 8),
(9, 'Avis', 'Peugeot 3008', 5, 1100000, 7),
(10, 'Hertz', 'Hyundai Accent', 5, 750000, 10),
(11, 'Europcar', 'Toyota Innova', 7, 1100000, 11);


-- ==========================================
-- 8. Create Attractions
-- ==========================================
INSERT INTO attractions (id, name, city, category, price) VALUES 
(1, 'Dinh Độc Lập', 'Hồ Chí Minh', 'Văn hóa & Lịch sử', 40000),
(2, 'VinWonders Phú Quốc', 'Phú Quốc', 'Công viên giải trí', 950000),
(3, 'Bà Nà Hills', 'Đà Nẵng', 'Giải trí & Nghỉ dưỡng', 850000),
(4, 'Sun World Fansipan Legend', 'Sa Pa', 'Nghỉ dưỡng', 750000),
(5, 'Bảo tàng Chứng tích Chiến tranh', 'Hồ Chí Minh', 'Văn hóa & Lịch sử', 40000),
(6, 'Địa Đạo Củ Chi', 'Hồ Chí Minh', 'Lịch sử', 110000),
(7, 'Phố Cổ Hội An', 'Hội An', 'Văn hóa & Di sản', 120000),
(8, 'Vịnh Hạ Long (Tour du thuyền)', 'Hạ Long', 'Thiên nhiên', 1500000),
(9, 'Lăng Bác', 'Hà Nội', 'Lịch sử', 0),
(10, 'Văn Miếu Quốc Tử Giám', 'Hà Nội', 'Giáo dục & Lịch sử', 30000),
(11, 'Safari Phú Quốc', 'Phú Quốc', 'Khám phá thiên nhiên', 650000),
(12, 'VinWonders Nha Trang', 'Nha Trang', 'Công viên giải trí', 880000),
(13, 'Cố Đô Huế', 'Huế', 'Văn hóa & Di sản', 200000),
(14, 'Cầu Vàng', 'Đà Nẵng', 'Kiến trúc & Cảnh quan', 900000); -- (Đã gộp vào vé Bà Nà, giá mẫu tưng trưng)


-- ==========================================
-- 9. Create Airport Taxis 
-- ==========================================
INSERT INTO airport_taxis (id, airport_code, car_type, base_price) VALUES 
(1, 'SGN', 'Sedan 4 chỗ (Tiêu chuẩn)', 250000),
(2, 'SGN', 'SUV 7 chỗ (Gia đình)', 350000),
(3, 'HAN', 'Sedan 4 chỗ (Tiêu chuẩn)', 300000),
(4, 'HAN', 'Limousine 9 chỗ (Cao cấp)', 600000),
(5, 'DAD', 'SUV 7 chỗ (Gia đình)', 300000),
(6, 'DAD', 'Sedan 4 chỗ', 200000),
(7, 'PQC', 'SUV 7 chỗ', 250000),
(8, 'CXR', 'Sedan 4 chỗ', 350000),
(9, 'CXR', 'Minivan 16 chỗ', 800000);


-- ==========================================
-- 10. Create Bookings
-- ==========================================
INSERT INTO bookings (id, user_id, booking_type, total_price, status) VALUES 
(1, 1, 'HOTEL', 3000000, 'CONFIRMED'),
(2, 1, 'FLIGHT', 1800000, 'PENDING'),
(3, 4, 'CAR_RENTAL', 1600000, 'COMPLETED'),
(4, 5, 'ATTRACTION', 1700000, 'CONFIRMED'),
(5, 6, 'TAXI', 350000, 'COMPLETED'),
(6, 4, 'HOTEL', 4500000, 'COMPLETED');


-- ==========================================
-- 11. Create Booking Details
-- ==========================================
INSERT INTO hotel_bookings (booking_id, room_id, check_in_date, check_out_date, adults, children, rooms_count) VALUES 
(1, 1, ADDDATE(CURDATE(), 5), ADDDATE(CURDATE(), 7), 2, 0, 1),
(6, 4, ADDDATE(CURDATE(), -10), ADDDATE(CURDATE(), -8), 2, 1, 1);

INSERT INTO flight_bookings (booking_id, flight_id, seat_class, is_roundtrip, passengers_count) VALUES 
(2, 1, 'ECONOMY', FALSE, 1);

INSERT INTO car_rental_bookings (booking_id, car_id, pickup_location_id, dropoff_location_id, pickup_datetime, dropoff_datetime) VALUES 
(3, 1, 2, 2, CONCAT(CURDATE(), ' 08:00:00'), CONCAT(ADDDATE(CURDATE(), 2), ' 18:00:00'));

INSERT INTO attraction_bookings (booking_id, attraction_id, visit_date, tickets_count) VALUES 
(4, 3, ADDDATE(CURDATE(), 1), 2);

INSERT INTO taxi_bookings (booking_id, taxi_id, pickup_datetime, dropoff_address) VALUES 
(5, 2, CONCAT(CURDATE(), ' 14:00:00'), '22 Nguyễn Huệ, Quận 1, TPHCM');


-- ==========================================
-- 12. Create Reviews
-- ==========================================
INSERT INTO reviews (user_id, hotel_id, rating, comment) VALUES 
(1, 1, 5, 'Tuyệt vời! View Landmark 81 thật sự ấn tượng. Dịch vụ quá tốt, xứng đáng chuẩn 5 sao.'),
(4, 1, 4, 'Phòng sạch sẽ, phục vụ tận tình đáng đồng tiền bát gạo.'),
(1, 4, 5, 'Bữa sáng rất ngon, view hồ Tây cực chill, chụp hình sống ảo siêu đỉnh.'),
(4, 7, 4, 'Hồ bơi đẹp tuyệt vời nhưng đồ ăn tại nhà hàng hơi đắt.'),
(5, 10, 5, 'Bill Bensley thiết kế quá ấn tượng, resort mang lại cảm giác xa xỉ và độc đáo.'),
(6, 2, 5, 'Dịch vụ hoàng gia, sảnh khách sạn tráng lệ bậc nhất Việt Nam.');
