# Design System Inspired by Booking.com

Tài liệu này quy định hệ thống thiết kế (Design System) chuẩn hóa cho toàn nền tảng, bao gồm cả trang khách hàng (Client) và bảng điều khiển quản trị (Admin Dashboard). Giao diện được lấy cảm hứng từ sự chuyên nghiệp, tin cậy và tối ưu chuyển đổi của Booking.com.

## 1. Visual Theme & Atmosphere

Nền tảng sử dụng phong cách thiết kế phẳng, hiện đại với sự phối hợp chặt chẽ giữa màu **Xanh Navy đậm** (Tạo sự tĩnh lặng, tin tưởng cho phần Header) và màu **Xanh lam sáng** (Kích thích hành động cho các Nút/Liên kết). Các khối tìm kiếm hoặc cảnh báo quan trọng sẽ được bao bọc bởi màu **Vàng đặc trưng**. Toàn nền tảng sử dụng duy nhất font chữ `Inter` để đảm bảo tốc độ tải trang và sự rõ ràng trên mọi thiết bị.

Hệ thống bo góc tập trung ở mức `rounded-xl` (12px) cho các thẻ/nút bấm, mang lại cảm giác thân thiện nhưng vẫn cứng cáp cho các ứng dụng tài chính/đặt chỗ.

**Key Characteristics:**
- **Navy Header & Bright Blue UI**: Sự phân cấp màu sắc rõ ràng.
- **Font chữ duy nhất**: `Inter` (Google Fonts), sans-serif.
- **Bo góc 12px - 24px**: Dành cho Component và Container. Không sử dụng Pill-shaped (bo tròn hoàn toàn) ngoại trừ các icon tròn hoặc badge.
- **Max-width cố định**: `1140px` cho các container chính để đảm bảo sự đồng bộ tuyệt đối trên màn hình lớn.

## 2. Color Palette & Roles

### Hệ màu Chính (Primary)
- **Primary Blue (CB)** (`#006ce4`): Màu chủ đạo số một. Dùng cho Nút bấm chính (CTA), đường dẫn (Link), viền input khi focus, màu icon đang active.
- **Header Navy** (`#003580`): Dùng cho Thanh điều hướng (Navbar), Nền Hero Banner, Nền Footer. Mang lại sự tương phản mạnh với chữ màu trắng.
- **Accent Yellow** (`#febb02`): Viền bao quanh khung tìm kiếm, hộp cảnh báo quan trọng, hoặc các thẻ "Best Seller".
- **Pure White** (`#ffffff`): Nền chính của các Thẻ (Card), Nút phụ, Box tìm kiếm nội bộ.

### Hệ màu Bề mặt & Chữ (Surface & Text)
- **Nền trang (Background)** (`#f2f2f2` hoặc `#f5f5f5`): Nền xám nhạt để làm nổi bật các Card màu trắng.
- **Text Chính** (`#1a1a1a` hoặc `gray-900`): Chữ body thông thường.
- **Text Phụ/Mô tả** (`#5b616e` hoặc `gray-500`): Phụ đề, Placeholder của Input.
- **Hover Transitions**: 
  - Nút Blue (`#006ce4`) hover sang Navy (`#003580`)
  - Item danh sách hover sang Light Blue (`rgba(0, 108, 228, 0.05)`)

### Hệ màu Trạng thái (Admin Dashboard specific)
- **Success** (`#008234`): Xác nhận thành công, màu xanh lá cây đậm tin cậy.
- **Danger** (`#d4111e`): Báo lỗi, thao tác xoá, cảnh báo đỏ.

## 3. Typography Rules

### Font Family
- **Toàn cục**: `'Inter', sans-serif` (Trọng tâm: Đọc số liệu và dữ liệu quản trị dễ dàng).

### Trọng số và Cấu trúc
- **H1 (Page Title)**: `24px - 32px`, font-weight `bold` (700)
- **H2 (Section/Card Title)**: `20px - 22px`, font-weight `bold` (700)
- **Body Text**: `14px - 16px`, font-weight `medium` (500) hoặc `regular` (400)
- **Small/Metadata**: `12px - 13px`, font-weight `regular`
- **Button Text**: Tối thiểu `14px`, font-weight `bold` (700) hoặc `semibold` (600)

## 4. Component Stylings (For Admin/Frontend)

### Buttons (Nút bấm)
**Primary Button (Nút chính)**
- Background: `#006ce4`
- Radius: `12px` (hoặc Tailwind `rounded-xl`)
- Padding: `px-4 py-2.5` hoặc cao hơn tuỳ ngữ cảnh
- Hover: Trở thành `#003580`
- Chữ: Trắng, `font-bold`

**Secondary/Ghost Button (Nút phụ)**
- Background: `transparent` hoặc `#ffffff`
- Border: `1px solid #006ce4`
- Text: `#006ce4`
- Hover: Nền mờ `rgba(0, 108, 228, 0.05)`

### Input & Form Fields
- Radius: `rounded-xl`
- Border: `1px solid #e5e7eb` (Gray-200)
- Focus: Đổi viền sang `#006ce4` và thêm ring nhỏ màu xanh (`focus:ring-2 focus:ring-[#006ce420]`)
- Chiều cao thư chuẩn: `48px` (py-3) để dễ chạm trên mobile.

### Cards & Layout Containers
- Radius: Thường là `8px` hoặc `24px` cho box lớn.
- Shadow: `shadow-md` hoặc `shadow-lg` nhỏ nhẹ, không làm lạm dụng Drop Shadow gắt.
- Viền (Border): `1px solid rgba(91,97,110,0.12)` để tách bạch với nền xám.

## 5. Layout & Admin Grid

- **Max-width toàn trang (Trang chủ/Tìm kiếm)**: `1140px` (Dùng class `max-w-[1140px] mx-auto`) để tránh giãn chữ trên màn 4K.
- **Admin Dashboard Layout**: Nên thiết kế dạng 2 cột:
  - Cột Sidebar trái: Cố định, nền Navy (`#003580`) với chữ Trắng.
  - Vùng Body phải: Nền Xám nhạt (`#f2f2f2`), chứa các Data Tables (Bảng dữ liệu) có nền Trắng, góc bo `rounded-lg`, viền mịn. Thích hợp cho việc đọc báo cáo, bảng kê.

## 6. Lời khuyên cho nhà phát triển Admin (Do's and Don'ts)

### Cần làm (Do):
- Sử dụng đúng mã màu `#006ce4` cho tất cả các hành động Submit, Lưu, Xác nhận.
- Căn chỉnh mọi khung nội dung quản trị viên sao cho có Margin/Padding thoải mái (ít nhất `p-6` cho một thẻ Card lớn).
- Giữ các Bảng dữ liệu (Tables) đơn giản: Nền trắng, viền phân cách mỏng màu `gray-100` hoặc `gray-200`.

### Tránh làm (Don't):
- Tuyệt đối không dùng các màu tự thiết kế như đỏ mận, đen tuyền làm Nút bấm.
- Không dùng bo góc tròn xoe (pill-shape) cho các bảng Admin form. Hãy giữ độ vuông vắn nhẹ (`rounded-lg` hoặc `rounded-xl`) để tôn lên tính nghiêm túc của hệ thống quản trị.
