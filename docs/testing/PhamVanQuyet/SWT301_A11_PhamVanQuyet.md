# SWT301 Personal Test Report - Phạm Văn Quyết (DE190425)

## 1. Student Information
*   **Họ và tên**: Phạm Văn Quyết
*   **MSSV**: DE190425
*   **Lớp**: SE20A11
*   **Môn học**: SWT301 – Software Testing
*   **Nhóm**: Group 01
*   **Học kỳ**: Summer 2026

## 2. Role in Project
*   **Vai trò**: Backend & Security Lead
*   **Nhiệm vụ chính**: Quản lý thiết kế backend, bảo mật phân quyền JWT và triển khai Unit Test giao diện Đăng ký (Register) cùng với AuthContext.

## 3. Tested Function
*   **Chức năng kiểm thử**: Authentication – Registration Validation and API Integration (Đăng ký tài khoản, kiểm tra hợp lệ dữ liệu đầu vào và tích hợp API).

## 4. Source Code Analysis
*   **Register Component**: [Register.jsx](file:///d:/doc_ki5/SWT301/du_an_%20thuc_te/group-project-swt301_se20a11_su26__group01/srccode/frontend/src/pages/Register.jsx). Sử dụng state để quản lý form đầu vào (`fullName`, `email`, `password`, `confirm`, `phone`).
*   **Authentication Context**: [AuthContext.js](file:///d:/doc_ki5/SWT301/du_an_%20thuc_te/group-project-swt301_se20a11_su26__group01/srccode/frontend/src/context/AuthContext.js). Chứa hàm `register` gọi POST request tới `/auth/register` qua API Client.
*   **API Client**: [api.js](file:///d:/doc_ki5/SWT301/du_an_%20thuc_te/group-project-swt301_se20a11_su26__group01/srccode/frontend/src/services/api.js). Cấu hình Axios Client.

## 5. Registration Business Rules
1.  Nhập đầy đủ thông tin: Họ và tên, Email, Mật khẩu, Xác nhận mật khẩu.
2.  Mật khẩu xác nhận và Mật khẩu chính phải trùng khớp. Nếu không, báo lỗi: `"Mật khẩu xác nhận không khớp"`.
3.  Độ dài mật khẩu tối thiểu phải từ 6 ký tự trở lên. Nếu ngắn hơn, báo lỗi: `"Mật khẩu phải ít nhất 6 ký tự"`.
4.  Khi submit hợp lệ:
    *   Bật trạng thái `loading = true`.
    *   Map `fullName` thành thuộc tính `username` gửi lên API.
    *   Gọi hàm `register` gửi yêu cầu đăng ký lên endpoint `/auth/register`.
    *   Tắt trạng thái `loading = false`.
    *   Nếu thành công, chuyển hướng người dùng về trang `/login`.
    *   Nếu thất bại, hiển thị thông báo lỗi trả về từ API hoặc `"Đăng ký thất bại"`.

## 6. Test Objectives
*   Xác minh tính đúng đắn của logic kiểm tra hợp lệ phía client (mật khẩu ngắn, mật khẩu không khớp).
*   Đảm bảo luồng xử lý bất đồng bộ (Loading state, gọi API mock, chuyển trang khi thành công) hoạt động chính xác.
*   Đảm bảo hàm `register` của `AuthContext` xử lý đúng tất cả các cấu trúc lỗi của API (lỗi chuỗi, đối tượng có message/detail hoặc lỗi kết nối mạng).
*   Đạt tỷ lệ bao phủ mã nguồn (Statement & Branch Coverage) cho tính năng đăng ký tối đa (100%).

## 7. Test Environment
*   **Hệ điều hành**: Windows 11
*   **Node.js**: v20.x
*   **NPM**: v10.x

## 8. Test Framework
*   **Jest**: Test runner chính.
*   **React Testing Library**: Hỗ trợ render component và truy vấn DOM.
*   **@testing-library/jest-dom**: Cung cấp các bộ so khớp mở rộng.
*   **@testing-library/user-event**: Giả lập hành vi người dùng chính xác.

## 9. Equivalence Partitioning (EP)
Phân vùng các lớp tương đương cho dữ liệu kiểm thử đăng ký:

| Tham số kiểm thử | Phân vùng hợp lệ (Valid EP) | Phân vùng không hợp lệ (Invalid EP) |
| :--- | :--- | :--- |
| **Độ dài Mật khẩu** | Mật khẩu >= 6 ký tự | Mật khẩu < 6 ký tự |
| **Xác nhận mật khẩu** | Trùng khớp với Mật khẩu | Khác với Mật khẩu |
| **API Response** | Trả về `success: true` | Trả về `success: false` hoặc API Error |

## 10. Boundary Value Analysis (BVA)
Áp dụng BVA cho độ dài mật khẩu (Độ dài tối thiểu = 6):
*   **Giá trị Biên dưới (Min - 1)**: 5 ký tự (Ví dụ: `abcde`) -> Kết quả mong đợi: Lỗi hiển thị.
*   **Giá trị Biên (Min)**: 6 ký tự (Ví dụ: `abcdef`) -> Kết quả mong đợi: Hợp lệ.
*   **Giá trị Biên trên (Min + 1)**: 7 ký tự (Ví dụ: `abcdefg`) -> Kết quả mong đợi: Hợp lệ.

## 11. Statement Coverage
*   Bao phủ 100% tất cả các dòng mã nguồn của `Register.jsx`.
*   Bao phủ 100% tất cả các dòng mã nguồn liên quan đến phương thức `register` trong `AuthContext.js`.

## 12. Decision/Branch Coverage
Bao phủ các nhánh rẽ nhánh quyết định:
*   Nhánh `form.password !== form.confirm` (đúng/sai).
*   Nhánh `form.password.length < 6` (đúng/sai).
*   Nhánh `result.success` (đúng/sai).
*   Nhánh `result.message` (tồn tại/không tồn tại).
*   Nhánh `showPass` và `showConfirm` (ẩn/hiện mật khẩu).
*   Các nhánh kiểm tra cấu trúc lỗi API trong `getApiMessage` (string, object message, object detail, undefined).

## 13. Test Case Summary
Tổng cộng có **17** test cases được thiết kế và thực thi:
*   **12** test cases cho giao diện `Register.jsx` (`TC_REG_001` đến `TC_REG_012`).
*   **5** test cases cho phương thức `register` của `AuthContext.js` (`TC_AUTH_REG_001` đến `TC_AUTH_REG_005`).

## 14. Actual Test Execution Result
*   **Tổng số Test Suites**: 2 passed, 2 total.
*   **Tổng số Test Cases**: 17 passed, 17 total.
*   **Trạng thái**: 100% PASSED (Không có test case nào bị skip hoặc thất bại).

## 15. Actual Coverage Result
*   **`Register.jsx`**:
    *   Statements: **100%**
    *   Branches: **100%**
    *   Functions: **100%**
    *   Lines: **100%**
*   **`AuthContext.js` (Hàm register)**:
    *   Đạt **100%** bao phủ cho tất cả các dòng nghiệp vụ đăng ký (Dòng 64-88).

## 16. Build Result
*   Quá trình build production (`npm run build`) hoàn thành thành công: **Compiled successfully**.

## 17. Defects Found
1.  **Lỗi thứ tự Validation**: Trong một số tài liệu nháp, thông báo lỗi độ dài mật khẩu được đề xuất kiểm tra trước, nhưng trong mã nguồn thực tế, kiểm tra trùng khớp mật khẩu (`form.password !== form.confirm`) được ưu tiên thực hiện trước. Bài viết test đã sửa đổi khớp đúng logic nghiệp vụ thực tế này.
2.  **Lỗi xung đột trùng tên tệp**: Thư mục chứa đồng thời `Register.js` và `Register.jsx` làm cho cơ chế import mặc định của Jest ưu tiên lấy tệp `.js` (bản cũ). Cần chỉ định tường minh đuôi `.jsx` trong câu lệnh import test để tải đúng component.

## 18. Changes Made
*   Thêm mới tệp test: [Register.test.jsx](file:///d:/doc_ki5/SWT301/du_an_%20thuc_te/group-project-swt301_se20a11_su26__group01/srccode/frontend/src/pages/Register.test.jsx).
*   Thêm mới tệp test: [AuthContext.test.jsx](file:///d:/doc_ki5/SWT301/du_an_%20thuc_te/group-project-swt301_se20a11_su26__group01/srccode/frontend/src/context/AuthContext.test.jsx).
*   Tạo tệp cấu hình kiểm thử: [setupTests.js](file:///d:/doc_ki5/SWT301/du_an_%20thuc_te/group-project-swt301_se20a11_su26__group01/srccode/frontend/src/setupTests.js).
*   Cập nhật cấu hình script kiểm thử trong [package.json](file:///d:/doc_ki5/SWT301/du_an_%20thuc_te/group-project-swt301_se20a11_su26__group01/srccode/frontend/package.json).
*   Tạo mới cấu hình CI: `.github/workflows/frontend-test.yml`.

## 19. Conclusion
Các bài Unit Test viết ra đã bao phủ đầy đủ tất cả các luồng xử lý và nghiệp vụ của giao diện đăng ký tài khoản. Tính năng đã hoạt động đúng theo các đặc tả nghiệp vụ đề ra và đạt yêu cầu tích hợp.

## 20. How to Run Tests
Chạy kiểm thử cục bộ tại thư mục `srccode/frontend`:
```bash
# Chạy toàn bộ test suite một lần
npm test -- --watchAll=false

# Chạy test và xuất báo cáo coverage
npm run test:ci
```
