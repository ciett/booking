---
description: [Daily Backup Git Workflow]
---
# Quy trình Git: Lưu code theo ngày

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

## Đồng bộ và đẩy về nhánh chính
3. Quay lại nhánh chính và cập nhật bản mới nhất:
   ```bash
   git checkout main
   git pull origin main
   ```
4. Gộp code từ nhánh ngày vào chính và đẩy lên:
   ```bash
   git merge 2026-03-24
   git push origin main
   ```
