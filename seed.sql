-- Database Seed Data Script
-- Tắt kiểm tra khóa ngoại để có thể xóa bảng có ràng buộc
SET FOREIGN_KEY_CHECKS = 0;

-- Xóa dữ liệu cũ (Xóa bảng con trước, bảng cha sau)
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
INSERT INTO users (id, email, password_hash, full_name, phone_number) VALUES 
(1, 'customer1@example.com', 'hashed_pw_1', 'Nguyen Van A', '0901234567'),
(2, 'hotelowner@example.com', 'hashed_pw_2', 'Tran Thi B', '0987654321'),
(3, 'admin@example.com', 'hashed_pw_3', 'Admin System', '0999999999');


-- ==========================================
-- 2. Create Airports
-- ==========================================
INSERT INTO airports (code, name, city, country) VALUES 
('SGN', 'Sân bay Quốc tế Tân Sơn Nhất', 'Hồ Chí Minh', 'Việt Nam'),
('HAN', 'Sân bay Quốc tế Nội Bài', 'Hà Nội', 'Việt Nam'),
('DAD', 'Sân bay Quốc tế Đà Nẵng', 'Đà Nẵng', 'Việt Nam'),
('PQC', 'Sân bay Quốc tế Phú Quốc', 'Phú Quốc', 'Việt Nam'),
('CXR', 'Sân bay Quốc tế Cam Ranh', 'Nha Trang', 'Việt Nam');


-- ==========================================
-- 3. Create Car Locations
-- ==========================================
INSERT INTO car_locations (id, name, city) VALUES 
(1, 'Quận 1, TP Hồ Chí Minh', 'TP Hồ Chí Minh'),
(2, 'Sân bay Tân Sơn Nhất (SGN)', 'TP Hồ Chí Minh'),
(3, 'Quận Hoàn Kiếm, Hà Nội', 'Hà Nội'),
(4, 'Sân bay Nội Bài (HAN)', 'Hà Nội'),
(5, 'Trung tâm Đà Nẵng', 'Đà Nẵng');


-- ==========================================
-- 4. Create Hotels (Lưu ý: database của bạn DB.sql KHÔNG có trường owner_id và image_url ở bảng hotels)
-- ==========================================
INSERT INTO hotels (id, name, description, address, city, rating) VALUES 
(1, 'Vinpearl Landmark 81', 'Khách sạn cao nhất Việt Nam với view toàn thành phố.', '720A Điện Biên Phủ, Vinhomes Tân Cảng, Bình Thạnh', 'Hồ Chí Minh', 5.0),
(2, 'InterContinental Hanoi Westlake', 'Khách sạn sang trọng nằm hoàn toàn trên mặt hồ Tây.', '5 Từ Hoa, Tây Hồ', 'Hà Nội', 5.0),
(3, 'Melia Danang Beach Resort', 'Khu nghỉ dưỡng lý tưởng với bãi biển cát trắng riêng biệt.', '19 Trường Sa, Ngũ Hành Sơn', 'Đà Nẵng', 4.5),
(4, 'Pullman Phu Quoc Beach Resort', 'Trung tâm giải trí nghỉ dưỡng hàng đầu tại Đảo Ngọc.', 'Tổ 6 xóm Bàn Quy, Bãi Trường, Dương Tơ', 'Phú Quốc', 5.0);


-- ==========================================
-- 5. Create Rooms for Hotels (Bảng này có image_url)
-- ==========================================
INSERT INTO rooms (id, hotel_id, room_type, price_per_night, max_adults, max_children) VALUES 
(1, 1, 'Standard Room', 1500000, 2, 1),
(2, 1, 'Deluxe City View', 2500000, 2, 2),
(3, 2, 'Lake View Suite', 3200000, 2, 2),
(4, 3, 'Ocean View Balcony', 2800000, 2, 1),
(5, 4, 'Pool Villa', 6500000, 4, 2);


-- ==========================================
-- 6. Create Flights (Sử dụng CURDATE)
-- ==========================================
INSERT INTO flights (id, airline, flight_number, departure_airport_code, arrival_airport_code, departure_time, arrival_time, price) VALUES 
(1, 'Vietnam Airlines', 'VN213', 'HAN', 'SGN', CONCAT(CURDATE(), ' 08:30:00'), CONCAT(CURDATE(), ' 10:45:00'), 1800000),
(2, 'Bamboo Airways', 'QH201', 'HAN', 'SGN', CONCAT(CURDATE(), ' 10:00:00'), CONCAT(CURDATE(), ' 12:10:00'), 1500000),
(3, 'Vietjet Air', 'VJ125', 'SGN', 'DAD', CONCAT(CURDATE(), ' 14:00:00'), CONCAT(CURDATE(), ' 15:20:00'), 850000),
(4, 'Vietnam Airlines', 'VN1201', 'SGN', 'PQC', CONCAT(CURDATE(), ' 09:15:00'), CONCAT(CURDATE(), ' 10:15:00'), 1200000),
(5, 'Vietjet Air', 'VJ221', 'SGN', 'HAN', CONCAT(ADDDATE(CURDATE(), 1), ' 07:00:00'), CONCAT(ADDDATE(CURDATE(), 1), ' 09:15:00'), 1100000);


-- ==========================================
-- 7. Create Cars for Rental
-- ==========================================
INSERT INTO cars (id, company_name, car_model, seats, price_per_day, location_id) VALUES 
(1, 'Avis', 'Toyota Vios 2023', 5, 800000, 2),
(2, 'Hertz', 'Honda CR-V', 7, 1200000, 1),
(3, 'Europcar', 'Mazda 3', 5, 900000, 2),
(4, 'Gocar', 'Ford Everest', 7, 1500000, 4),
(5, 'Avis', 'Kia Morning', 5, 500000, 3);


-- ==========================================
-- 8. Create Attractions
-- ==========================================
INSERT INTO attractions (id, name, city, category, price) VALUES 
(1, 'Dinh Độc Lập', 'Hồ Chí Minh', 'Văn hóa & Lịch sử', 40000),
(2, 'VinWonders Phú Quốc', 'Phú Quốc', 'Công viên giải trí', 950000),
(3, 'Bà Nà Hills', 'Đà Nẵng', 'Giải trí & Nghỉ dưỡng', 850000),
(4, 'Sun World Fansipan Legend', 'Hà Nội', 'Nghỉ dưỡng', 750000),
(5, 'Bảo tàng Tôn Đức Thắng', 'Hồ Chí Minh', 'Văn hóa & Lịch sử', 0);


-- ==========================================
-- 9. Create Airport Taxis 
-- ==========================================
INSERT INTO airport_taxis (id, airport_code, car_type, base_price) VALUES 
(1, 'SGN', 'Sedan 4 chỗ', 250000),
(2, 'SGN', 'SUV 7 chỗ', 350000),
(3, 'HAN', 'Sedan 4 chỗ', 300000),
(4, 'HAN', 'Limousine 9 chỗ', 600000),
(5, 'DAD', 'SUV 7 chỗ', 300000);
