# AI Audit Log

## 1. Thông tin chung

| Thông tin | Nội dung |
|---|---|
| Môn học | Software Testing |
| Mã môn học | SWT301 |
| Lớp | SE20A11 |
| Học kỳ | Summer 2026 |
| Tên bài tập / Project | Restaurant Management System |
| Tên sinh viên / Nhóm | Phạm Văn Quyết |
| MSSV / Danh sách MSSV | DE190425 |
| Giảng viên hướng dẫn | Trịnh Thanh Bình |
| Ngày bắt đầu | 2026-07-17 |
| Ngày hoàn thành | 2026-07-17 |

---

## 2. Công cụ AI đã sử dụng

- [x] Antigravity (Gemini 3.5 Flash)

---

## 3. Mục tiêu sử dụng AI

- Phân tích luồng nghiệp vụ của Register.jsx và AuthContext.js
- Thiết kế các lớp tương đương và phân tích giá trị biên cho mật khẩu đăng ký
- Tạo khung các ca kiểm thử tự động (Unit Test) cho giao diện và logic
- Xử lý bất đồng bộ trong các bài test và mock dependencies
- Thiết lập tệp cấu hình CI GitHub Actions

---

## 4. Nhật ký sử dụng AI chi tiết

### Lần sử dụng AI số 1

| Nội dung | Thông tin |
|---|---|
| Ngày sử dụng | 2026-07-17 |
| Công cụ AI | Antigravity |
| Mục đích sử dụng | Thiết lập môi trường và cấu hình test suite, viết test cases cho Register.jsx và AuthContext.js |
| Phần việc liên quan | Testing / DevOps |
| Mức độ sử dụng | Hỗ trợ nhiều |

#### 4.1. Prompt đã sử dụng
```text
Bạn là Senior Software Testing Engineer, React Test Automation Engineer và GitHub Agent.
Hãy trực tiếp clone repository dưới đây, cập nhật code mới nhất từ branch main, phân tích source code thực tế, triển khai phần Unit Test cá nhân của sinh viên Phạm Văn Quyết trên một branch riêng...
```

#### 4.2. Kết quả AI gợi ý
- Cài đặt `@testing-library/react`, `@testing-library/jest-dom`, và `@testing-library/user-event`.
- Thêm cấu hình script test vào `package.json`.
- Viết 12 test cases cho `Register.test.jsx` và 5 test cases cho `AuthContext.test.jsx`.
- Cấu hình workflow `.github/workflows/frontend-test.yml`.

#### 4.3. Phần sinh viên/nhóm đã sử dụng từ AI
- Toàn bộ khung của các tệp tin test và tệp CI.

#### 4.4. Phần sinh viên/nhóm tự chỉnh sửa hoặc cải tiến
- Sửa lỗi import `./Register` sang `./Register.jsx` để tránh xung đột tải file cũ `Register.js`.
- Bổ sung `act()` bao bọc các cuộc gọi hàm async trong `AuthContext.test.jsx` để tránh cảnh báo từ React Test Renderer.

#### 4.5. Minh chứng
- Tệp tin: `srccode/frontend/src/pages/Register.test.jsx`
- Tệp tin: `srccode/frontend/src/context/AuthContext.test.jsx`
- Kết quả chạy: 17 passed.

#### 4.6. Nhận xét cá nhân/nhóm
- Giúp giảm thiểu thời gian viết code mẫu lặp lại, hỗ trợ tạo nhanh các ca mock phức tạp.

---

## 5. Bảng tổng hợp mức độ sử dụng AI

| Hạng mục | Không dùng AI | AI hỗ trợ ít | AI hỗ trợ nhiều | AI sinh chính | Ghi chú |
|---|:---:|:---:|:---:|:---:|---|
| Phân tích yêu cầu |  |  | [x] |  |  |
| Viết user story/use case |  |  | [x] |  |  |
| Thiết kế database | [x] |  |  |  | Có sẵn từ trước |
| Thiết kế kiến trúc hệ thống | [x] |  |  |  | Có sẵn từ trước |
| Thiết kế giao diện | [x] |  |  |  | Có sẵn từ trước |
| Code frontend | [x] |  |  |  | Có sẵn từ trước |
| Code backend | [x] |  |  |  | Có sẵn từ trước |
| Debug lỗi |  | [x] |  |  | Tự sửa lỗi import |
| Viết test case |  |  |  | [x] |  |
| Kiểm thử sản phẩm |  | [x] |  |  |  |
| Tối ưu code |  |  | [x] |  |  |
| Viết báo cáo |  |  |  | [x] |  |
| Làm slide thuyết trình |  |  |  | [x] |  |

---

## 6. Các lỗi hoặc hạn chế từ AI

| STT | Lỗi/hạn chế từ AI | Cách phát hiện | Cách xử lý/cải tiến |
|---:|---|---|---|
| 1 | AI không xác định được xung đột resolve import giữa `Register.js` và `Register.jsx`. | Chạy test báo lỗi không tìm thấy phần tử DOM do Jest load file cũ `.js`. | Chỉ định đuôi mở rộng `.jsx` tường minh khi import. |
| 2 | Sử dụng cấu trúc `await expect(async IIFE)` dẫn đến việc không chờ đúng Promise trả về hoặc bị báo lỗi. | Hàm `register` của context trả về `undefined` khi assertion chạy. | Dùng `act(async () => { res = await ... })` thay thế. |

---

## 7. Kiểm chứng kết quả AI

- Chạy test suites: `npm test` và `npm run test:ci` đều trả về Passed 17/17.
- Kiểm tra tính đúng đắn của build: `npm run build` thành công.

---

## 8. Đóng góp cá nhân hoặc đóng góp nhóm

### 8.1. Đối với bài cá nhân (Phạm Văn Quyết)

Mô tả phần sinh viên tự làm, phần AI hỗ trợ và phần đã tự cải tiến:
- Tự làm: Kiểm chứng lại logic form, chạy thử cục bộ, xử lý xung đột tệp tin cũ.
- AI hỗ trợ: Thiết kế cấu trúc các test suite và test cases mẫu.
- Tự cải tiến: Thay đổi cơ chế async, act wrapper trong test context.

---

## 9. Reflection cuối bài

### 9.1. AI đã hỗ trợ em/nhóm ở điểm nào?
- Giúp tự động hóa việc viết các file cấu hình và tài liệu báo cáo nhanh chóng.

### 9.2. Phần nào em/nhóm không sử dụng theo gợi ý của AI? Vì sao?
- Phân đoạn async/await trong test hook. Do cơ chế của React Testing Library yêu cầu flush state bằng `act` để lấy kết quả chính xác thay vì chỉ mock trả về.

### 9.3. Em/nhóm đã kiểm tra tính đúng đắn của kết quả AI như thế nào?
- Chạy test suite và kiểm tra log chi tiết, chạy build thật.

### 9.4. Nếu không có AI, phần nào sẽ khó khăn nhất?
- Viết các bản báo cáo bằng tiếng Việt, kịch bản thuyết trình và bảng test case chi tiết vì tốn nhiều thời gian soạn thảo.

### 9.5. Sau bài tập/project này, em/nhóm học được gì về môn học?
- Hiểu sâu hơn về kỹ thuật phân tích giá trị biên (BVA) và kiểm thử bao phủ các nhánh xử lý lỗi của hệ thống.

### 9.6. Sau bài tập/project này, em/nhóm học được gì về cách sử dụng AI có trách nhiệm?
- Cần chạy lại và kiểm chứng toàn bộ mã nguồn do AI sinh ra thay vì tin tưởng và merge trực tiếp lên nhánh chính.

---

## 10. Cam kết học thuật

Sinh viên/nhóm cam kết rằng:
- Nội dung AI hỗ trợ đã được ghi nhận trung thực.
- Không nộp nguyên văn kết quả AI mà không kiểm tra.
- Có khả năng giải thích các phần đã nộp.
- Chịu trách nhiệm về tính đúng đắn của sản phẩm cuối cùng.

| Đại diện sinh viên/nhóm | Ngày xác nhận |
|---|---|
| Phạm Văn Quyết | 2026-07-17 |
