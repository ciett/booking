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
-- 1. Create Users (20 users)
-- ==========================================
-- Password format for demo is a bcrypt hash (or dummy as before)
INSERT INTO users (id, email, password, full_name, phone_number, role) VALUES 
(1, 'customer1@example.com', '$2a$10$xyz...', 'Nguyen Van A', '0901234567', 'CUSTOMER'),
(2, 'hotelowner1@example.com', '$2a$10$xyz...', 'Tran Thi B', '0987654321', 'OWNER'),
(3, 'admin@example.com', '$2a$10$xyz...', 'Admin System', '0999999999', 'ADMIN'),
(4, 'customer2@example.com', '$2a$10$xyz...', 'Le Van C', '0912345678', 'CUSTOMER'),
(5, 'customer3@example.com', '$2a$10$xyz...', 'Pham Thi D', '0933333333', 'CUSTOMER'),
(6, 'customer4@example.com', '$2a$10$xyz...', 'Hoang Van E', '0944444444', 'CUSTOMER'),
(7, 'owner_dn@example.com', '$2a$10$xyz...', 'Tran Quang F', '0922222222', 'OWNER'),
(8, 'owner_pq@example.com', '$2a$10$xyz...', 'Le Thi G', '0955555555', 'OWNER'),
(9, 'cus_hanoi1@example.com', '$2a$10$xyz...', 'Vu Hoang H', '0966666666', 'CUSTOMER'),
(10, 'cus_hanoi2@example.com', '$2a$10$xyz...', 'Dang Thu I', '0977777777', 'CUSTOMER'),
(11, 'cus_sg1@example.com', '$2a$10$xyz...', 'Nguyen Khac K', '0988888888', 'CUSTOMER'),
(12, 'cus_sg2@example.com', '$2a$10$xyz...', 'Tran Ngoc L', '0900000000', 'CUSTOMER'),
(13, 'cus_dn1@example.com', '$2a$10$xyz...', 'Le Hoang M', '0911111111', 'CUSTOMER'),
(14, 'cus_dn2@example.com', '$2a$10$xyz...', 'Pham Van N', '0902222222', 'CUSTOMER'),
(15, 'cus_vt1@example.com', '$2a$10$xyz...', 'Vu Thi O', '0903333333', 'CUSTOMER'),
(16, 'cus_vt2@example.com', '$2a$10$xyz...', 'Bui Van P', '0904444444', 'CUSTOMER'),
(17, 'cus_nt1@example.com', '$2a$10$xyz...', 'Doan Q', '0905555555', 'CUSTOMER'),
(18, 'cus_nt2@example.com', '$2a$10$xyz...', 'Ha Thi R', '0906666666', 'CUSTOMER'),
(19, 'car_owner@example.com', '$2a$10$xyz...', 'Trinh S', '0907777777', 'OWNER'),
(20, 'tour_agent@example.com', '$2a$10$xyz...', 'Dinh T', '0908888888', 'OWNER');


-- ==========================================
-- 2. Create Airports (10 airports)
-- ==========================================
INSERT INTO airports (code, name, city, country) VALUES 
('SGN', 'Sân bay Quốc tế Tân Sơn Nhất', 'Hồ Chí Minh', 'Việt Nam'),
('HAN', 'Sân bay Quốc tế Nội Bài', 'Hà Nội', 'Việt Nam'),
('DAD', 'Sân bay Quốc tế Đà Nẵng', 'Đà Nẵng', 'Việt Nam'),
('PQC', 'Sân bay Quốc tế Phú Quốc', 'Phú Quốc', 'Việt Nam'),
('CXR', 'Sân bay Quốc tế Cam Ranh', 'Nha Trang', 'Việt Nam'),
('HUI', 'Sân bay Quốc tế Phú Bài', 'Huế', 'Việt Nam'),
('VCA', 'Sân bay Quốc tế Cần Thơ', 'Cần Thơ', 'Việt Nam'),
('VDO', 'Sân bay Quốc tế Vân Đồn', 'Hạ Long', 'Việt Nam'),
('VII', 'Sân bay Quốc tế Vinh', 'Vinh', 'Việt Nam'),
('BMV', 'Sân bay Buôn Ma Thuột', 'Buôn Ma Thuột', 'Việt Nam');


-- ==========================================
-- 3. Create Car Locations (15 locations)
-- ==========================================
INSERT INTO car_locations (id, name, city) VALUES 
(1, 'Quận 1, TPHCM', 'Hồ Chí Minh'),
(2, 'Sân bay Tân Sơn Nhất (SGN)', 'Hồ Chí Minh'),
(3, 'Quận 7, TPHCM', 'Hồ Chí Minh'),
(4, 'Quận Hoàn Kiếm, Hà Nội', 'Hà Nội'),
(5, 'Sân bay Nội Bài (HAN)', 'Hà Nội'),
(6, 'Trung tâm Đà Nẵng', 'Đà Nẵng'),
(7, 'Sân bay Đà Nẵng (DAD)', 'Đà Nẵng'),
(8, 'Thị trấn Dương Đông, Phú Quốc', 'Phú Quốc'),
(9, 'Sân bay Phú Quốc (PQC)', 'Phú Quốc'),
(10, 'Đường Trần Phú, Nha Trang', 'Nha Trang'),
(11, 'Sân bay Cam Ranh (CXR)', 'Nha Trang'),
(12, 'Trung tâm Đà Lạt', 'Đà Lạt'),
(13, 'Bãi Cháy, Hạ Long', 'Hạ Long'),
(14, 'Trung tâm TP Cần Thơ', 'Cần Thơ'),
(15, 'Sân bay Phú Bài (HUI)', 'Huế');


-- ==========================================
-- 4. Create Hotels (30 hotels)
-- ==========================================
INSERT INTO hotels (id, name, description, address, city, rating, image_url) VALUES 
-- HCM
(1, 'Vinpearl Landmark 81', 'Khách sạn cao nhất Việt Nam với view toàn thành phố.', '720A Điện Biên Phủ, Vinhomes Tân Cảng, Quận Bình Thạnh', 'Hồ Chí Minh', 5.0, 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800'),
(2, 'The Reverie Saigon', 'Tuyệt tác nghỉ dưỡng xa hoa bật nhất Sài Gòn mang phong cách hoàng gia Ý.', '22-36 Nguyễn Huệ, Quận 1', 'Hồ Chí Minh', 5.0, 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800'),
(3, 'Caravelle Saigon', 'Khách sạn 5 sao mang tính biểu tượng nằm ngay trung tâm thành phố Sài Gòn.', '19 Công Trường Lam Sơn, Quận 1', 'Hồ Chí Minh', 4.8, 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800'),
(4, 'New World Saigon Hotel', 'Nằm ở khu vực nhộn nhịp của Quận 1 với đầy đủ tiện nghi.', '76 Lê Lai, Quận 1', 'Hồ Chí Minh', 4.6, 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800'),
(5, 'Rex Hotel Saigon', 'Một trong những khách sạn lâu đời và danh tiếng nhất Sài Gòn.', '141 Nguyễn Huệ, Quận 1', 'Hồ Chí Minh', 4.5, 'https://images.unsplash.com/photo-1551882547-ff43c63faf76?w=800'),

-- HN
(6, 'InterContinental Hanoi Westlake', 'Khách sạn sang trọng nằm hoàn toàn trên mặt hồ Tây.', '5 Từ Hoa, Tây Hồ', 'Hà Nội', 4.9, 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800'),
(7, 'Sofitel Legend Metropole', 'Một ốc đảo lịch sử giữa trung tâm thành phố với nét quyến rũ cổ điển.', '15 Ngô Quyền, Hoàn Kiếm', 'Hà Nội', 5.0, 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800'),
(8, 'Lotte Hotel Hanoi', 'Nằm ở phần trên của tòa nhà 65 tầng hoành tráng, tầm nhìn không hạn chế.', '54 Liễu Giai, Ba Đình', 'Hà Nội', 4.7, 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800'),
(9, 'JW Marriott Hotel Hanoi', 'Tòa nhà có kiến trúc hình con rồng uốn lượn cạnh trung tâm hội nghị quốc gia.', '8 Đỗ Đức Dục, Nam Từ Liêm', 'Hà Nội', 4.9, 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800'),
(10, 'Pan Pacific Hanoi', 'Tầm nhìn tuyệt đẹp bao quát cả Hồ Tây và Hồ Trúc Bạch.', '1 Thanh Niên, Ba Đình', 'Hà Nội', 4.6, 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800'),

-- DN
(11, 'Melia Danang Beach Resort', 'Khu nghỉ dưỡng lý tưởng với bãi biển cát trắng riêng biệt.', '19 Trường Sa, Ngũ Hành Sơn', 'Đà Nẵng', 4.5, 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800'),
(12, 'Furama Resort Danang', 'Khu nghỉ dưỡng di sản bên bãi biển tuyệt đẹp tại Miền Trung Việt Nam.', '103 - 105 Võ Nguyên Giáp, Khuê Mỹ, Ngũ Hành Sơn', 'Đà Nẵng', 4.8, 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800'),
(13, 'InterContinental Danang Sun Peninsula', 'Khu nghỉ dưỡng sang trọng bậc nhất trên bán đảo Sơn Trà do Bill Bensley thiết kế.', 'Bãi Bắc, Bán đảo Sơn Trà', 'Đà Nẵng', 5.0, 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800'),
(14, 'Naman Retreat', 'Khu nghỉ dưỡng 5 sao giao thoa giữa văn hóa cổ truyền và kiến trúc đương đại.', 'Đường Trường Sa, Ngũ Hành Sơn', 'Đà Nẵng', 4.7, 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800'),
(15, 'Novotel Danang Premier Han River', 'Vị trí đắc địa cạnh sông Hàn với Sky36 bar trên đỉnh.', '36 Bạch Đằng, Hải Châu', 'Đà Nẵng', 4.6, 'https://images.unsplash.com/photo-1551882547-ff43c63faf76?w=800'),

-- PQ
(16, 'Pullman Phu Quoc Beach Resort', 'Trung tâm giải trí nghỉ dưỡng hàng đầu tại Đảo Ngọc.', 'Tổ 6 xóm Bàn Quy, Bãi Trường, Dương Tơ', 'Phú Quốc', 4.8, 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800'),
(17, 'JW Marriott Phu Quoc Emerald Bay', 'Trường Đại học giả tưởng do Bill Bensley thiết kế ở bãi Kem.', 'Bãi Khem, An Thới', 'Phú Quốc', 5.0, 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800'),
(18, 'Vinpearl Resort & Spa Phu Quoc', 'Trải nghiệm nghỉ dưỡng All-in-one hoàn hảo, phù hợp cho mọi gia đình.', 'Bãi Dài, Gành Dầu', 'Phú Quốc', 4.6, 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800'),
(19, 'InterContinental Phu Quoc Long Beach Resort', 'Biểu tượng của sự sang trọng bên bãi Trường hoang sơ.', 'Bãi Trường, Dương Tơ', 'Phú Quốc', 4.9, 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800'),

-- NT
(20, 'Amiana Resort', 'Nơi hội tụ vẻ đẹp thiên nhiên với hồ bơi nước mặn khổng lồ.', 'Phạm Văn Đồng, Vĩnh Hòa', 'Nha Trang', 4.6, 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800'),
(21, 'Vinpearl Resort Nha Trang', 'Điểm đến hoàn hảo của sự sang trọng, đẳng cấp và lãng mạn.', 'Đảo Hòn Tre', 'Nha Trang', 4.8, 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800'),
(22, 'InterContinental Nha Trang', 'Mang đến trải nghiệm nghỉ dưỡng 5 sao ven biển Trần Phú.', '32-34 Trần Phú', 'Nha Trang', 4.7, 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800'),

-- DL
(23, 'Ana Mandara Villas Dalat', 'Khu nghỉ dưỡng mang đậm nét cổ kính thời Pháp thuộc với các biệt thự ẩn trong rừng thông.', 'Đường Lê Lai, Phường 5', 'Đà Lạt', 4.7, 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800'),
(24, 'Dalat Palace Heritage Hotel', 'Khách sạn lâu đời nhất mang chuẩn mực thượng lưu châu Âu.', '2 Trần Phú, Phường 3', 'Đà Lạt', 4.8, 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800'),
(25, 'Swiss-Belresort Tuyen Lam', 'Bao quanh bởi sân Golf 18 lỗ và rừng thông lãng mạn.', 'Khu du lịch Hồ Tuyền Lâm, Phường 3', 'Đà Lạt', 4.5, 'https://images.unsplash.com/photo-1551882547-ff43c63faf76?w=800'),

-- Sapa / Hoi An / Ha Long
(26, 'Hotel de la Coupole Sapa - MGallery', 'Sự pha trộn giữa Haute Couture thời trang và sắc màu dân tộc Tây Bắc.', '1 Hoàng Liên', 'Sa Pa', 4.9, 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800'),
(27, 'Four Seasons Resort The Nam Hai', 'Biệt thự nghỉ dưỡng riêng tư tuyệt đối bên bờ biển Cửa Đại đẹp hoang sơ.', 'Block Ha My Dong B, Điện Bàn', 'Hội An', 5.0, 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800'),
(28, 'Wyndham Legend Halong', 'Khách sạn đạt tiêu chuẩn 5 sao quốc tế đầu tiên tại khu du lịch Bãi Cháy.', '12 Hạ Long, Bãi Cháy', 'Hạ Long', 4.7, 'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=800'),
(29, 'Vinpearl Resort & Spa Ha Long', 'Đảo nghỉ dưỡng tráng lệ 100% hướng nhìn ra vịnh kỳ quan.', 'Đảo Rều, Bãi Cháy', 'Hạ Long', 4.8, 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800'),
(30, 'Silk Sense Hoi An River Resort', 'Khu nghỉ dưỡng sinh thái nằm tĩnh lặng bên dòng sông Cổ Cò thơ mộng.', 'Khu Tân Thịnh, Cẩm An', 'Hội An', 4.6, 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800'),

-- Dữ liệu mở rộng có phổ điểm thấp & đa dạng
(31, 'Ocean View Apartment', 'Căn hộ view biển tiện nghi giá rẻ.', 'Phạm Văn Đồng', 'Đà Nẵng', 3.2, 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800'),
(32, 'Sunny Villa Nha Trang', 'Biệt thự riêng tư cho tiệc BBQ gia đình.', 'Vĩnh Nguyên', 'Nha Trang', 2.8, 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800'),
(33, 'Green Pine Resort', 'Khu nghỉ dưỡng yên bình giữa rừng thông.', 'Phường 3', 'Đà Lạt', 3.5, 'https://images.unsplash.com/photo-1505843513577-22bb7d21e455?w=800'),
(34, 'Riverside Serviced Apartment', 'Căn hộ dịch vụ cạnh sông Sài Gòn.', 'Bến Vân Đồn, Quận 4', 'Hồ Chí Minh', 3.9, 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800'),
(35, 'Luxury Beach Villa', 'Hồ bơi vô cực sát biển tuyệt đẹp nhưng thiếu chăm sóc.', 'Bãi Trường', 'Phú Quốc', 3.1, 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'),
(36, 'Cozy Studio Apartment', 'Căn hộ nhỏ xinh nằm giữa phố cổ.', 'Hàng Bông, Hoàn Kiếm', 'Hà Nội', 4.0, 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'),
(37, 'Eco Nature Resort', 'Khu nghỉ sinh thái hoang sơ.', 'Cẩm Thanh', 'Hội An', 2.5, 'https://images.unsplash.com/photo-1587061949409-02df41d5e562?w=800'),
(38, 'Pearl Bay Resort & Spa', 'Resort cổ kính nhưng nội thất hơi cũ.', 'Bãi Cháy', 'Hạ Long', 3.3, 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800'),
(39, 'Sunset Pool Villa', 'Không gian yên tĩnh tuyệt đối cho cặp đôi.', 'Bán đảo Sơn Trà', 'Đà Nẵng', 4.3, 'https://images.unsplash.com/photo-1613490908736-69ebfce34703?w=800'),
(40, 'Downtown City Apartment', 'Căn hộ sạch sẽ nằm cạnh Vincom.', 'Lê Thánh Tôn, Quận 1', 'Hồ Chí Minh', 4.2, 'https://images.unsplash.com/photo-1502672260266-1c1de24244fe?w=800');


-- ==========================================
-- 5. Create Rooms for Hotels (approx. 90 rooms)
-- ==========================================
INSERT INTO rooms (id, hotel_id, room_type, price_per_night, max_adults, max_children) VALUES 
-- HCM 1-5
(1, 1, 'Standard Room', 1500000, 2, 1),
(2, 1, 'Deluxe City View', 2500000, 2, 2),
(3, 1, 'Presidential Suite', 10500000, 2, 2),
(4, 2, 'Luxury Twin', 3000000, 2, 1),
(5, 2, 'Romance Suite', 6000000, 2, 0),
(6, 3, 'Signature King', 2000000, 2, 1),
(7, 3, 'Opera View Suite', 3500000, 2, 1),
(8, 4, 'Superior King', 1800000, 2, 1),
(9, 4, 'Executive Club', 3200000, 2, 2),
(10, 5, 'Premium City View', 1600000, 2, 1),
(11, 5, 'Governor Suite', 4000000, 2, 2),

-- HN 6-10
(12, 6, 'Overwater Pavilion', 4500000, 2, 1),
(13, 6, 'Classic Lake View', 3200000, 2, 2),
(14, 7, 'Premium Historical', 5500000, 2, 1),
(15, 7, 'Opera Wing Luxury', 4200000, 2, 2),
(16, 7, 'Charlie Chaplin Suite', 15000000, 2, 1),
(17, 8, 'Deluxe High Floor', 2600000, 2, 1),
(18, 8, 'Club InterContinental', 4500000, 2, 2),
(19, 9, 'Executive Lake View', 3800000, 2, 2),
(20, 9, 'Vice Presidential', 18000000, 2, 2),
(21, 10, 'Pacific Club Studio', 2900000, 2, 1),
(22, 10, 'Premier Lake View', 2400000, 2, 2),

-- DN 11-15
(23, 11, 'Melia Retreat Villa', 5500000, 4, 2),
(24, 11, 'Deluxe Ocean View', 2800000, 2, 1),
(25, 12, 'Ocean Studio Suite', 3500000, 2, 2),
(26, 12, 'Garden Superior', 2200000, 2, 1),
(27, 13, 'Son Tra Peninsula Room', 8000000, 2, 1),
(28, 13, 'Heaven Penthouse', 25000000, 4, 2),
(29, 14, 'Babylon Room', 3200000, 2, 1),
(30, 14, 'Pool Villa 2 Bedrooms', 9500000, 4, 2),
(31, 15, 'Corner Suite', 3100000, 2, 2),

-- PQ 16-19
(32, 16, 'Sunrise View Balcony', 2500000, 2, 2),
(33, 16, 'Beachfront Pool Villa', 6800000, 2, 2),
(34, 17, 'Emerald Bay View', 8500000, 2, 1),
(35, 17, 'Lamarck University Suite', 14000000, 2, 2),
(36, 18, 'Ocean View King Room', 3000000, 2, 1),
(37, 18, 'Safari Villa 3 Bedrooms', 12000000, 6, 3),
(38, 19, 'Resort Classic Ocean', 4100000, 2, 1),
(39, 19, 'Club InterContinental Suite', 7500000, 2, 2),

-- NT 20-22
(40, 20, 'Ocean Pool Villa', 7000000, 2, 1),
(41, 20, 'Family Villa 2 Bedrooms', 9500000, 4, 2),
(42, 21, 'Grand Deluxe', 3000000, 2, 2),
(43, 21, 'Vinpearl Waterpark Suite', 5500000, 2, 2),
(44, 22, 'Deluxe Ocean View', 2800000, 2, 1),
(45, 22, 'Executive Club Ocean', 4500000, 2, 1),

-- DL 23-25
(46, 23, 'Le Petit Villa Room', 1800000, 2, 0),
(47, 23, 'Villa Suite', 3500000, 2, 1),
(48, 24, 'Classic French', 4500000, 2, 1),
(49, 24, 'Royal Suite', 8500000, 2, 2),
(50, 25, 'Golf View Deluxe', 2100000, 2, 1),
(51, 25, 'Valley View Suite', 3200000, 2, 2),

-- Sapa / Hoi An / Ha Long 26-30
(52, 26, 'Classic French', 4500000, 2, 1),
(53, 26, 'Executive Suite Mountain', 6500000, 2, 2),
(54, 27, 'One Bedroom Villa Pool', 15000000, 2, 1),
(55, 27, 'Three Bedroom Ocean Villa', 35000000, 6, 3),
(56, 28, 'Executive King', 2800000, 2, 2),
(57, 28, 'Family Suite', 4200000, 4, 2),
(58, 29, 'Deluxe Ocean View Island', 3100000, 2, 2),
(59, 29, 'Presidential Ocean Suite', 18000000, 2, 2),
(60, 30, 'River View Superior', 1900000, 2, 1),
(61, 30, 'Silk Family Suite', 3500000, 4, 2),

-- Rooms cho các khách sạn mở rộng bổ sung
(62, 31, 'Căn hộ Studio Biển', 800000, 2, 2),
(63, 31, 'Căn hộ 2 Phòng Ngủ', 1500000, 4, 2),
(64, 32, 'Biệt thự vườn 3 PN', 2500000, 6, 3),
(65, 33, 'Phòng Bungalow gỗ', 1200000, 2, 1),
(66, 34, 'Căn hộ 1 phòng ngủ', 1300000, 2, 0),
(67, 35, 'Biệt thự hướng biển', 3200000, 4, 2),
(68, 36, 'Căn hộ Studio nhỏ', 600000, 2, 0),
(69, 37, 'Nhà chòi sinh thái', 700000, 2, 1),
(70, 38, 'Phòng Cổ Điển', 1100000, 2, 1),
(71, 39, 'Villa có hồ bơi riêng', 4500000, 2, 1),
(72, 40, 'Căn hộ Cao Cấp Tầng 20', 1800000, 2, 1);


-- ==========================================
-- 6. Create Flights (approx. 50 flights)
-- ==========================================
INSERT INTO flights (id, airline, flight_number, departure_airport_code, arrival_airport_code, departure_time, arrival_time, price) VALUES 
-- HCM to HN (Roundtrips today and tomorrow)
(1, 'Vietnam Airlines', 'VN213', 'HAN', 'SGN', CONCAT(CURDATE(), ' 08:30:00'), CONCAT(CURDATE(), ' 10:45:00'), 1800000),
(2, 'Bamboo Airways', 'QH201', 'HAN', 'SGN', CONCAT(CURDATE(), ' 10:00:00'), CONCAT(CURDATE(), ' 12:10:00'), 1500000),
(3, 'Vietjet Air', 'VJ125', 'SGN', 'HAN', CONCAT(CURDATE(), ' 14:00:00'), CONCAT(CURDATE(), ' 16:15:00'), 1050000),
(4, 'Vietnam Airlines', 'VN225', 'SGN', 'HAN', CONCAT(ADDDATE(CURDATE(), 1), ' 07:00:00'), CONCAT(ADDDATE(CURDATE(), 1), ' 09:15:00'), 1900000),
(5, 'Vietjet Air', 'VJ127', 'SGN', 'HAN', CONCAT(ADDDATE(CURDATE(), 1), ' 18:00:00'), CONCAT(ADDDATE(CURDATE(), 1), ' 20:15:00'), 950000),
(6, 'Vietnam Airlines', 'VN226', 'HAN', 'SGN', CONCAT(ADDDATE(CURDATE(), 2), ' 09:00:00'), CONCAT(ADDDATE(CURDATE(), 2), ' 11:15:00'), 1750000),
(7, 'Bamboo Airways', 'QH203', 'SGN', 'HAN', CONCAT(ADDDATE(CURDATE(), 2), ' 15:30:00'), CONCAT(ADDDATE(CURDATE(), 2), ' 17:40:00'), 1450000),

-- HCM to DAD
(8, 'Vietjet Air', 'VJ321', 'SGN', 'DAD', CONCAT(CURDATE(), ' 09:15:00'), CONCAT(CURDATE(), ' 10:35:00'), 850000),
(9, 'Vietnam Airlines', 'VN112', 'SGN', 'DAD', CONCAT(CURDATE(), ' 13:45:00'), CONCAT(CURDATE(), ' 15:10:00'), 1400000),
(10, 'Bamboo Airways', 'QH154', 'DAD', 'SGN', CONCAT(ADDDATE(CURDATE(), 1), ' 18:30:00'), CONCAT(ADDDATE(CURDATE(), 1), ' 20:00:00'), 1100000),
(11, 'Vietjet Air', 'VJ323', 'SGN', 'DAD', CONCAT(ADDDATE(CURDATE(), 2), ' 06:15:00'), CONCAT(ADDDATE(CURDATE(), 2), ' 07:35:00'), 750000),
(12, 'Vietnam Airlines', 'VN115', 'DAD', 'SGN', CONCAT(ADDDATE(CURDATE(), 2), ' 11:00:00'), CONCAT(ADDDATE(CURDATE(), 2), ' 12:25:00'), 1350000),

-- HCM to PQC
(13, 'Vietnam Airlines', 'VN1201', 'SGN', 'PQC', CONCAT(CURDATE(), ' 09:15:00'), CONCAT(CURDATE(), ' 10:15:00'), 1200000),
(14, 'Vietjet Air', 'VJ328', 'SGN', 'PQC', CONCAT(CURDATE(), ' 16:00:00'), CONCAT(CURDATE(), ' 17:05:00'), 750000),
(15, 'Vietnam Airlines', 'VN1202', 'PQC', 'SGN', CONCAT(ADDDATE(CURDATE(), 1), ' 11:30:00'), CONCAT(ADDDATE(CURDATE(), 1), ' 12:35:00'), 1250000),
(16, 'Bamboo Airways', 'QH161', 'SGN', 'PQC', CONCAT(ADDDATE(CURDATE(), 2), ' 08:30:00'), CONCAT(ADDDATE(CURDATE(), 2), ' 09:30:00'), 1100000),
(17, 'Vietjet Air', 'VJ330', 'PQC', 'SGN', CONCAT(ADDDATE(CURDATE(), 2), ' 19:00:00'), CONCAT(ADDDATE(CURDATE(), 2), ' 20:05:00'), 800000),

-- HN to DAD
(18, 'Bamboo Airways', 'QH103', 'HAN', 'DAD', CONCAT(CURDATE(), ' 06:30:00'), CONCAT(CURDATE(), ' 07:55:00'), 1300000),
(19, 'Vietjet Air', 'VJ501', 'HAN', 'DAD', CONCAT(CURDATE(), ' 11:10:00'), CONCAT(CURDATE(), ' 12:30:00'), 950000),
(20, 'Vietnam Airlines', 'VN159', 'HAN', 'DAD', CONCAT(ADDDATE(CURDATE(), 1), ' 16:45:00'), CONCAT(ADDDATE(CURDATE(), 1), ' 18:10:00'), 1600000),
(21, 'Vietjet Air', 'VJ503', 'DAD', 'HAN', CONCAT(ADDDATE(CURDATE(), 2), ' 09:00:00'), CONCAT(ADDDATE(CURDATE(), 2), ' 10:20:00'), 900000),
(22, 'Bamboo Airways', 'QH104', 'DAD', 'HAN', CONCAT(ADDDATE(CURDATE(), 2), ' 19:30:00'), CONCAT(ADDDATE(CURDATE(), 2), ' 20:55:00'), 1250000),

-- HN to PQC
(23, 'Vietnam Airlines', 'VN1233', 'HAN', 'PQC', CONCAT(ADDDATE(CURDATE(), 1), ' 08:00:00'), CONCAT(ADDDATE(CURDATE(), 1), ' 10:15:00'), 2500000),
(24, 'Vietjet Air', 'VJ458', 'HAN', 'PQC', CONCAT(ADDDATE(CURDATE(), 2), ' 13:20:00'), CONCAT(ADDDATE(CURDATE(), 2), ' 15:30:00'), 1850000),
(25, 'Vietnam Airlines', 'VN1234', 'PQC', 'HAN', CONCAT(ADDDATE(CURDATE(), 3), ' 11:00:00'), CONCAT(ADDDATE(CURDATE(), 3), ' 13:15:00'), 2400000),

-- HN to CXR (Nha Trang)
(26, 'Vietjet Air', 'VJ773', 'HAN', 'CXR', CONCAT(CURDATE(), ' 15:20:00'), CONCAT(CURDATE(), ' 17:15:00'), 1150000),
(27, 'Vietnam Airlines', 'VN1553', 'HAN', 'CXR', CONCAT(ADDDATE(CURDATE(), 1), ' 09:10:00'), CONCAT(ADDDATE(CURDATE(), 1), ' 11:05:00'), 1900000),
(28, 'Bamboo Airways', 'QH175', 'CXR', 'HAN', CONCAT(ADDDATE(CURDATE(), 2), ' 12:30:00'), CONCAT(ADDDATE(CURDATE(), 2), ' 14:25:00'), 1400000),

-- SGN to CXR (Nha Trang)
(29, 'Bamboo Airways', 'QH274', 'SGN', 'CXR', CONCAT(ADDDATE(CURDATE(), 1), ' 16:30:00'), CONCAT(ADDDATE(CURDATE(), 1), ' 17:40:00'), 800000),
(30, 'Vietjet Air', 'VJ778', 'SGN', 'CXR', CONCAT(CURDATE(), ' 06:15:00'), CONCAT(CURDATE(), ' 07:20:00'), 650000),
(31, 'Vietnam Airlines', 'VN1344', 'CXR', 'SGN', CONCAT(ADDDATE(CURDATE(), 2), ' 18:00:00'), CONCAT(ADDDATE(CURDATE(), 2), ' 19:10:00'), 1050000),

-- HN to VCA / HUI / VDO
(32, 'Vietnam Airlines', 'VN1371', 'HAN', 'HUI', CONCAT(CURDATE(), ' 14:00:00'), CONCAT(CURDATE(), ' 15:15:00'), 1300000),
(33, 'Vietjet Air', 'VJ601', 'HAN', 'VDO', CONCAT(ADDDATE(CURDATE(), 1), ' 08:30:00'), CONCAT(ADDDATE(CURDATE(), 1), ' 09:20:00'), 550000),
(34, 'Bamboo Airways', 'QH189', 'HAN', 'VCA', CONCAT(ADDDATE(CURDATE(), 2), ' 10:10:00'), CONCAT(ADDDATE(CURDATE(), 2), ' 12:20:00'), 1750000),

-- SGN to VCA / HUI / VDO
(35, 'Vietnam Airlines', 'VN1374', 'SGN', 'HUI', CONCAT(CURDATE(), ' 07:00:00'), CONCAT(CURDATE(), ' 08:25:00'), 1150000),
(36, 'Vietjet Air', 'VJ688', 'SGN', 'VDO', CONCAT(ADDDATE(CURDATE(), 1), ' 13:00:00'), CONCAT(ADDDATE(CURDATE(), 1), ' 15:05:00'), 1600000);


-- ==========================================
-- 7. Create Cars for Rental (30 cars)
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
(11, 'Europcar', 'Toyota Innova', 7, 1100000, 11),
(12, 'Gocar', 'Kia Carnival', 7, 1800000, 9),
(13, 'Avis', 'Hyundai Tucson', 5, 1150000, 12),
(14, 'Hertz', 'Ford Ranger Wildtrak', 5, 1350000, 13),
(15, 'Europcar', 'VinFast VF e34', 5, 950000, 14),
(16, 'Gocar', 'Toyota Camry', 5, 1600000, 15),
(17, 'Avis', 'Hyundai Santafe', 7, 1500000, 1),
(18, 'Hertz', 'Kia Seltos', 5, 900000, 2),
(19, 'Europcar', 'Honda City', 5, 800000, 4),
(20, 'Gocar', 'Mazda CX-5', 5, 1200000, 5),
(21, 'Avis', 'Toyota Cross', 5, 1250000, 6),
(22, 'Hertz', 'Kia K3', 5, 850000, 7),
(23, 'Europcar', 'Mitsubishi Outlander', 7, 1250000, 8),
(24, 'Gocar', 'Hyundai Creta', 5, 850000, 9),
(25, 'Avis', 'Ford Territory', 5, 1100000, 10),
(26, 'Hertz', 'Isuzu Mux', 7, 1300000, 11),
(27, 'Europcar', 'Toyota Raize', 5, 700000, 12),
(28, 'Gocar', 'Honda HR-V', 5, 1050000, 13),
(29, 'Avis', 'Suzuki XL7', 7, 950000, 14),
(30, 'Hertz', 'Mazda 2', 5, 600000, 15);


-- ==========================================
-- 8. Create Attractions (30 attractions)
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
(14, 'Cầu Vàng', 'Đà Nẵng', 'Kiến trúc & Cảnh quan', 900000),
(15, 'Chợ Bến Thành', 'Hồ Chí Minh', 'Tham quan, Mua sắm', 0),
(16, 'Nhà thờ Đức Bà', 'Hồ Chí Minh', 'Văn hóa & Lịch sử', 0),
(17, 'Bờ Hồ Hoàn Kiếm', 'Hà Nội', 'Tham quan, Cảnh quan', 0),
(18, 'Chùa Một Cột', 'Hà Nội', 'Văn hóa & Lịch sử', 25000),
(19, 'Khu du lịch sinh thái Tràng An', 'Ninh Bình', 'Thiên nhiên', 250000),
(20, 'Chùa Bái Đính', 'Ninh Bình', 'Văn hóa, Tôn giáo', 50000),
(21, 'Tháp Bà Ponagar', 'Nha Trang', 'Văn hóa & Lịch sử', 30000),
(22, 'Đảo Khỉ', 'Nha Trang', 'Thiên nhiên', 150000),
(23, 'Bán đảo Sơn Trà', 'Đà Nẵng', 'Thiên nhiên', 0),
(24, 'Chợ 야 Night Market', 'Phú Quốc', 'Tham quan, Mua sắm', 0),
(25, 'Núi Bão - Langbiang', 'Đà Lạt', 'Thiên nhiên', 100000),
(26, 'Thác Datanla', 'Đà Lạt', 'Thiên nhiên', 200000),
(27, 'Làng gốm Thanh Hà', 'Hội An', 'Văn hóa & Nghệ thuật', 35000),
(28, 'Mũi Né - Đồi Cát Bay', 'Phan Thiết', 'Thiên nhiên', 0),
(29, 'Sun World Halong Complex', 'Hạ Long', 'Công viên giải trí', 850000),
(30, 'Chợ nổi Cái Răng', 'Cần Thơ', 'Văn hóa địa phương', 200000);


-- ==========================================
-- 9. Create Airport Taxis (20 taxis)
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
(9, 'CXR', 'Minivan 16 chỗ', 800000),
(10, 'SGN', 'Minivan 16 chỗ', 700000),
(11, 'HAN', 'SUV 7 chỗ (Gia đình)', 400000),
(12, 'HAN', 'Sedan 4 chỗ (Hạng sang)', 500000),
(13, 'DAD', 'Limousine 9 chỗ (Cao cấp)', 550000),
(14, 'PQC', 'Sedan 4 chỗ', 180000),
(15, 'CXR', 'SUV 7 chỗ (Gia đình)', 450000),
(16, 'HUI', 'Sedan 4 chỗ', 200000),
(17, 'HUI', 'SUV 7 chỗ', 300000),
(18, 'VDO', 'Sedan 4 chỗ', 350000),
(19, 'VCA', 'Sedan 4 chỗ', 250000),
(20, 'BMV', 'Sedan 4 chỗ', 200000);


-- ==========================================
-- 10. Create Bookings & Details
-- ==========================================
INSERT INTO bookings (id, user_id, booking_type, total_price, status, created_at) VALUES 
(1,  1,  'HOTEL',      3000000,  'CONFIRMED',  ADDDATE(CURRENT_TIMESTAMP, -10)),
(2,  1,  'FLIGHT',     1800000,  'COMPLETED',  ADDDATE(CURRENT_TIMESTAMP, -9)),
(3,  4,  'CAR_RENTAL', 1600000,  'COMPLETED',  ADDDATE(CURRENT_TIMESTAMP, -5)),
(4,  5,  'ATTRACTION', 1700000,  'CONFIRMED',  ADDDATE(CURRENT_TIMESTAMP, -2)),
(5,  6,  'TAXI',        350000,  'COMPLETED',  ADDDATE(CURRENT_TIMESTAMP, -1)),
(6,  4,  'HOTEL',      4500000,  'COMPLETED',  ADDDATE(CURRENT_TIMESTAMP, -15)),
(7,  9,  'FLIGHT',     2400000,  'CONFIRMED',  CURRENT_TIMESTAMP),
(8,  10, 'HOTEL',      8500000,  'CONFIRMED',  ADDDATE(CURRENT_TIMESTAMP, -3)),
(9,  11, 'CAR_RENTAL', 3200000,  'PENDING',    CURRENT_TIMESTAMP),
(10, 12, 'ATTRACTION',  450000,  'CONFIRMED',  ADDDATE(CURRENT_TIMESTAMP, -1)),
(11, 13, 'TAXI',        600000,  'COMPLETED',  ADDDATE(CURRENT_TIMESTAMP, -4)),
(12, 14, 'HOTEL',      5500000,  'CANCELLED',  ADDDATE(CURRENT_TIMESTAMP, -20)),
(13, 15, 'FLIGHT',     1050000,  'COMPLETED',  ADDDATE(CURRENT_TIMESTAMP, -8)),
(14, 16, 'CAR_RENTAL', 2100000,  'CONFIRMED',  CURRENT_TIMESTAMP),
(15, 17, 'ATTRACTION',  850000,  'COMPLETED',  ADDDATE(CURRENT_TIMESTAMP, -7)),
(16, 18, 'HOTEL',      6000000,  'CONFIRMED',  ADDDATE(CURRENT_TIMESTAMP, -6)),
(17, 5,  'FLIGHT',     1900000,  'COMPLETED',  ADDDATE(CURRENT_TIMESTAMP, -11)),
(18, 6,  'CAR_RENTAL', 2700000,  'COMPLETED',  ADDDATE(CURRENT_TIMESTAMP, -14)),
(19, 9,  'ATTRACTION', 1200000,  'CONFIRMED',  ADDDATE(CURRENT_TIMESTAMP, -3)),
(20, 10, 'TAXI',        700000,  'CONFIRMED',  ADDDATE(CURRENT_TIMESTAMP, -2)),
(21, 11, 'HOTEL',      9500000,  'PENDING',    CURRENT_TIMESTAMP),
(22, 12, 'FLIGHT',     2500000,  'CONFIRMED',  ADDDATE(CURRENT_TIMESTAMP, -5)),
(23, 13, 'CAR_RENTAL', 1350000,  'COMPLETED',  ADDDATE(CURRENT_TIMESTAMP, -18)),
(24, 14, 'ATTRACTION',  880000,  'CONFIRMED',  ADDDATE(CURRENT_TIMESTAMP, -1)),
(25, 15, 'TAXI',        300000,  'COMPLETED',  ADDDATE(CURRENT_TIMESTAMP, -9)),
(26, 16, 'HOTEL',      3500000,  'CONFIRMED',  ADDDATE(CURRENT_TIMESTAMP, -4)),
(27, 17, 'FLIGHT',      950000,  'COMPLETED',  ADDDATE(CURRENT_TIMESTAMP, -13)),
(28, 18, 'CAR_RENTAL', 4800000,  'CONFIRMED',  ADDDATE(CURRENT_TIMESTAMP, -2)),
(29, 1,  'ATTRACTION',  650000,  'COMPLETED',  ADDDATE(CURRENT_TIMESTAMP, -16)),
(30, 4,  'TAXI',        550000,  'COMPLETED',  ADDDATE(CURRENT_TIMESTAMP, -7));

-- ==========================================
-- Chi tiết đặt khách sạn (hotel_bookings - 12 records)
-- ==========================================
-- HOTEL bookings: id 1,6,8,12,16,21,26
INSERT INTO hotel_bookings (booking_id, room_id, check_in_date, check_out_date, adults, children, rooms_count) VALUES 
(1,  1,  ADDDATE(CURDATE(),  5),  ADDDATE(CURDATE(),  7),  2, 0, 1),
(6,  9,  ADDDATE(CURDATE(), -10), ADDDATE(CURDATE(), -8),  2, 1, 1),
(8,  34, ADDDATE(CURDATE(),  2),  ADDDATE(CURDATE(),  3),  2, 0, 1),
(12, 23, ADDDATE(CURDATE(), -15), ADDDATE(CURDATE(), -12), 4, 1, 1),
(16, 38, ADDDATE(CURDATE(),  3),  ADDDATE(CURDATE(),  6),  2, 0, 1),
(21, 28, ADDDATE(CURDATE(),  7),  ADDDATE(CURDATE(), 10),  4, 2, 1),
(26, 14, ADDDATE(CURDATE(),  1),  ADDDATE(CURDATE(),  4),  2, 1, 1);

-- ==========================================
-- Chi tiết đặt máy bay (flight_bookings - 12 records)
-- ==========================================
-- FLIGHT bookings: id 2,7,13,17,22,27
INSERT INTO flight_bookings (booking_id, flight_id, seat_class, is_roundtrip, return_flight_id, passengers_count) VALUES 
(2,  1,  'ECONOMY',     FALSE, NULL, 1),
(7,  23, 'BUSINESS',    TRUE,  25,   1),
(13, 3,  'ECONOMY',     FALSE, NULL, 1),
(17, 4,  'ECONOMY',     TRUE,  5,    2),
(22, 24, 'BUSINESS',    FALSE, NULL, 1),
(27, 8,  'ECONOMY',     FALSE, NULL, 1);

-- ==========================================
-- Chi tiết đặt thuê xe (car_rental_bookings - 10 records)
-- ==========================================
-- CAR_RENTAL bookings: id 3,9,14,18,23,28
INSERT INTO car_rental_bookings (booking_id, car_id, pickup_location_id, dropoff_location_id, pickup_datetime, dropoff_datetime) VALUES 
(3,  1,  2,  2,  CONCAT(CURDATE(), ' 08:00:00'),            CONCAT(ADDDATE(CURDATE(),  2), ' 18:00:00')),
(9,  16, 5,  4,  CONCAT(ADDDATE(CURDATE(), 1), ' 07:00:00'), CONCAT(ADDDATE(CURDATE(),  3), ' 07:00:00')),
(14, 27, 12, 12, CONCAT(ADDDATE(CURDATE(), 2), ' 10:00:00'), CONCAT(ADDDATE(CURDATE(),  5), ' 10:00:00')),
(18, 6,  6,  7,  CONCAT(ADDDATE(CURDATE(), 1), ' 09:00:00'), CONCAT(ADDDATE(CURDATE(),  4), ' 09:00:00')),
(23, 10, 10, 11, CONCAT(CURDATE(), ' 07:30:00'),            CONCAT(ADDDATE(CURDATE(),  1), ' 19:30:00')),
(28, 23, 8,  9,  CONCAT(ADDDATE(CURDATE(), 3), ' 11:00:00'), CONCAT(ADDDATE(CURDATE(),  7), ' 11:00:00'));

-- ==========================================
-- Chi tiết đặt điểm tham quan (attraction_bookings - 12 records)
-- ==========================================
-- ATTRACTION bookings: id 4,10,15,19,24,29
INSERT INTO attraction_bookings (booking_id, attraction_id, visit_date, tickets_count) VALUES 
(4,  3,  ADDDATE(CURDATE(),  1), 2),
(10, 6,  ADDDATE(CURDATE(),  2), 4),
(15, 29, ADDDATE(CURDATE(), -2), 1),
(19, 14, ADDDATE(CURDATE(),  3), 2),
(24, 2,  ADDDATE(CURDATE(),  5), 3),
(29, 8,  ADDDATE(CURDATE(), -5), 2);

-- ==========================================
-- Chi tiết đặt taxi sân bay (taxi_bookings - 10 records)
-- ==========================================
-- TAXI bookings: id 5,11,20,25,30
INSERT INTO taxi_bookings (booking_id, taxi_id, pickup_datetime, dropoff_address) VALUES 
(5,  2,  CONCAT(CURDATE(), ' 14:00:00'),             '22 Nguyễn Huệ, Quận 1, TPHCM'),
(11, 4,  CONCAT(ADDDATE(CURDATE(), -1), ' 09:00:00'), '5 Từ Hoa, Tây Hồ, Hà Nội'),
(20, 10, CONCAT(ADDDATE(CURDATE(),  1), ' 16:30:00'), '76 Lê Lai, Quận 1, TPHCM'),
(25, 6,  CONCAT(CURDATE(), ' 08:00:00'),             '19 Trường Sa, Ngũ Hành Sơn, Đà Nẵng'),
(30, 7,  CONCAT(ADDDATE(CURDATE(),  2), ' 11:00:00'), 'Thị trấn Dương Đông, Phú Quốc');


-- ==========================================
-- 11. Create Reviews (20 records)
-- ==========================================
INSERT INTO reviews (user_id, hotel_id, rating, comment, created_at) VALUES 
(1,  1,  5, 'Tuyệt vời! View Landmark 81 thật sự ấn tượng. Dịch vụ quá tốt, xứng đáng chuẩn 5 sao.', ADDDATE(CURRENT_TIMESTAMP, -5)),
(4,  1,  4, 'Phòng sạch sẽ, phục vụ tận tình đáng đồng tiền bát gạo.', ADDDATE(CURRENT_TIMESTAMP, -10)),
(1,  6,  5, 'Bữa sáng rất ngon, view hồ Tây cực chill, chụp hình sống ảo siêu đỉnh.', ADDDATE(CURRENT_TIMESTAMP, -1)),
(4,  11, 4, 'Hồ bơi đẹp tuyệt vời nhưng đồ ăn tại nhà hàng hơi đắt.', CURRENT_TIMESTAMP),
(5,  17, 5, 'Bill Bensley thiết kế quá ấn tượng, resort mang lại cảm giác xa xỉ và độc đáo.', ADDDATE(CURRENT_TIMESTAMP, -20)),
(6,  2,  5, 'Dịch vụ hoàng gia, sảnh khách sạn tráng lệ bậc nhất Việt Nam.', ADDDATE(CURRENT_TIMESTAMP, -8)),
(9,  7,  5, 'Sofitel Legend Metropole mang nét cổ điển cực kỳ cuốn hút, nhân viên siêu nhiệt tình!', ADDDATE(CURRENT_TIMESTAMP, -3)),
(10, 26, 5, 'Hotel de la Coupole Sapa đẹp như một giấc mơ, từ decor đến ẩm thực đều hoàn hảo.', ADDDATE(CURRENT_TIMESTAMP, -15)),
(11, 23, 4, 'Trải nghiệm không gian hoài cổ tại Ana Mandara Đà Lạt rất thú vị. Hơi xa trung tâm một chút.', ADDDATE(CURRENT_TIMESTAMP, -2)),
(12, 29, 5, 'Vinpearl Resort Hạ Long nằm trên đảo riêng biệt, vô cùng yên tĩnh và view vịnh rất xuất sắc.', CURRENT_TIMESTAMP),
(13, 21, 4, 'Khu vui chơi trẻ em của Vinpearl Nha Trang rất tốt, gia đình tôi đã có một kỳ nghỉ vui vẻ.', ADDDATE(CURRENT_TIMESTAMP, -7)),
(14, 27, 5, 'Four Seasons Hội An đắt xắt ra miếng, căn biệt thự sát biển khiến tôi không muốn về.', ADDDATE(CURRENT_TIMESTAMP, -30)),
(15, 19, 4, 'Phòng ốc InterContinental Phú Quốc hiện đại, tuy nhiên hồ bơi hơi đông vào buổi chiều.', ADDDATE(CURRENT_TIMESTAMP, -12)),
(16, 9,  5, 'JW Marriott Hà Nội rộng rãi, thiết kế đẹp và buffet hải sản quá đỉnh.', ADDDATE(CURRENT_TIMESTAMP, -4)),
(17, 13, 5, 'Tuyệt tác của InterContinental Đà Nẵng, ngắm khỉ từ ban công là một trải nghiệm đáng nhớ.', ADDDATE(CURRENT_TIMESTAMP, -9)),
(18, 3,  4, 'Caravelle Saigon mang nét cổ điển nhưng vẫn hiện đại, vị trí trung tâm rất thuận tiện.', ADDDATE(CURRENT_TIMESTAMP, -6)),
(5,  28, 5, 'Wyndham Legend Hạ Long có view vịnh Hạ Long từ phòng rất tuyệt, dịch vụ chuyên nghiệp.', ADDDATE(CURRENT_TIMESTAMP, -22)),
(9,  16, 4, 'Pullman Phú Quốc có bãi biển riêng đẹp lắm, tiện nghi đầy đủ, xứng đáng nghỉ dưỡng.', ADDDATE(CURRENT_TIMESTAMP, -18)),
(10, 12, 5, 'Furama Resort Đà Nẵng tuyệt vời, bãi biển sạch và nhân viên phục vụ rất thân thiện.', ADDDATE(CURRENT_TIMESTAMP, -11)),
(12, 24, 4, 'Dalat Palace là khách sạn di sản tuyệt đẹp, không khí lãng mạn rất phù hợp cho cặp đôi.', ADDDATE(CURRENT_TIMESTAMP, -25));
