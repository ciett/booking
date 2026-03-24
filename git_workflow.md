# Quy trình Git: Lưu code theo ngày

## Phần 1: Lưu vào nhánh mới (Backup)
1. Tạo và chuyển sang nhánh ngày hôm nay:
   ```bash
   git checkout -b 2026-03-24
   ```
2. Lưu và đẩy code lên nhánh này:
   ```bash
   git add .
   git commit -m "Backup code 24/03/2026"
   git push origin 2026-03-24
   ```

## Phần 2: Đồng bộ và đẩy về nhánh chính
1. Quay lại nhánh chính và cập nhật bản mới nhất:
   ```bash
   git checkout main
   git pull origin main
   ```
2. Gộp code từ nhánh ngày vào chính và đẩy lên:
   ```bash
   git merge 2026-03-24
   git push origin main
   ```

**Mẹo nhỏ:** Nếu sau này bạn muốn xóa nhánh phụ ở máy sau khi đã xong việc, hãy dùng lệnh `git branch -d 2026-03-24`.

---
**Repository:** https://github.com/NguyenDang182005/Demo.git
