# Hướng dẫn chạy và thông tin kiểm thử - Phạm Văn Quyết (DE190425)

## 📌 1. Thông tin chung
*   **Họ và tên**: Phạm Văn Quyết
*   **MSSV**: DE190425
*   **Lớp**: SE20A11
*   **Môn học**: SWT301 – Software Testing
*   **Vai trò**: Backend & Security Lead
*   **Chức năng kiểm thử**: Authentication – Registration Validation and API Integration

## 🌿 2. Nhánh kiểm thử (Branch)
*   **Personal Branch**: `test/de190425-registration-validation`
*   **Base Branch**: `main`

## 📁 3. Các tệp tin được bổ sung/chỉnh sửa
*   [Register.test.jsx](file:///d:/doc_ki5/SWT301/du_an_%20thuc_te/group-project-swt301_se20a11_su26__group01/srccode/frontend/src/pages/Register.test.jsx) (Tệp test component)
*   [AuthContext.test.jsx](file:///d:/doc_ki5/SWT301/du_an_%20thuc_te/group-project-swt301_se20a11_su26__group01/srccode/frontend/src/context/AuthContext.test.jsx) (Tệp test context logic)
*   [setupTests.js](file:///d:/doc_ki5/SWT301/du_an_%20thuc_te/group-project-swt301_se20a11_su26__group01/srccode/frontend/src/setupTests.js) (Cấu hình kiểm thử Jest DOM)
*   [package.json](file:///d:/doc_ki5/SWT301/du_an_%20thuc_te/group-project-swt301_se20a11_su26__group01/srccode/frontend/package.json) (Thêm các thư viện devDependencies và scripts test)
*   `.github/workflows/frontend-test.yml` (Cấu hình pipeline CI tự động)

## 🛠️ 4. Câu lệnh thực thi (Commands)
Tất cả các câu lệnh được chạy tại thư mục `srccode/frontend`:

```bash
# Cài đặt toàn bộ thư viện
npm ci

# Thực thi toàn bộ bộ Unit Test (17 cases)
npm test -- --watchAll=false

# Chạy test kiểm thử và kiểm tra tỷ lệ bao phủ code (Coverage report)
npm run test:ci

# Đóng gói ứng dụng production để kiểm tra tính ổn định build
npm run build
```

## 📊 5. Kết quả kiểm thử thực tế (Actual Result)
*   **Số lượng test case thành công**: 17 / 17 passed.
*   **Độ bao phủ dòng lệnh (Statement Coverage)** của `Register.jsx`: **100%**.
*   **Độ bao phủ dòng lệnh (Statement Coverage)** của `AuthContext.js` (phần register): **100%**.
*   **Kết quả Build**: Thành công hoàn toàn (**Compiled successfully**).

## 🔗 6. Pull Request Link
*   **PR Title**: `test: add registration unit tests for DE190425`
*   **Link**: [Được cập nhật sau khi tạo Pull Request]
