# Prompt Log

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
| Ngày cập nhật gần nhất | 2026-07-17 |

---

## 2. Mục đích của file Prompt Log

File này dùng để ghi lại các prompt quan trọng đã sử dụng trong quá trình thực hiện viết Unit Test và cấu hình CI cho dự án của sinh viên Phạm Văn Quyết.

---

## 3. Công cụ AI đã sử dụng

- [x] Antigravity

---

## 4. Bảng tổng hợp prompt đã sử dụng

| STT | Ngày | Công cụ AI | Mục đích | Prompt tóm tắt | Kết quả chính | Có sử dụng vào bài không? | Minh chứng |
|---:|---|---|---|---|---|---|---|
| 1 | 2026-07-17 | Antigravity | Clone, viết test và tài liệu | "Hãy trực tiếp clone repository..." | Tạo các file test, CI, báo cáo kiểm thử và kịch bản | Có | Tệp test và tệp md |

---

## 5. Prompt chi tiết

### Prompt số 1

| Nội dung | Thông tin |
|---|---|
| Ngày sử dụng | 2026-07-17 |
| Công cụ AI | Antigravity |
| Mục đích | Viết unit test cho trang Register và AuthContext |
| Phần việc liên quan | Coding / Testing / Report |
| Mức độ sử dụng | Hỏi sinh code / Hỏi tối ưu |

#### 5.1. Prompt nguyên văn
```text
Bạn là Senior Software Testing Engineer, React Test Automation Engineer và GitHub Agent.
Hãy trực tiếp clone repository dưới đây, cập nhật code mới nhất từ branch main, phân tích source code thực tế, triển khai phần Unit Test cá nhân của sinh viên Phạm Văn Quyết trên một branch riêng, tạo Pull Request và chỉ merge vào main khi không có conflict, toàn bộ test pass, build pass và GitHub Actions pass.
[Các thông tin bối cảnh dự án đi kèm...]
```

#### 5.2. Bối cảnh khi viết prompt
- Cần tự động hóa việc khởi tạo bộ Unit Test cho Register và AuthContext theo 17 test cases đã định nghĩa sẵn.

#### 5.3. Kết quả AI trả về
- Sinh cấu trúc tệp tin `Register.test.jsx` và `AuthContext.test.jsx`.
- Tạo tệp tin `setupTests.js` và cập nhật script test trong `package.json`.
- Cấu hình workflow GitHub Actions.

#### 5.4. Kết quả đã áp dụng vào bài
- Toàn bộ nội dung tệp test được sử dụng và chạy thành công cục bộ.

#### 5.5. Phần sinh viên/nhóm đã chỉnh sửa hoặc cải tiến
- Sửa lỗi import đuôi mở rộng `.jsx` cho trang `Register` do Jest load nhầm file `.js` cũ cùng tên.
- Chuyển cấu trúc async/IIFE trong test hook sang sử dụng `act` wrapper.

#### 5.6. Đánh giá chất lượng prompt
- [x] Prompt rõ ràng
- [x] Prompt có đủ bối cảnh
- [ ] Prompt còn thiếu thông tin
- [x] Prompt tạo ra kết quả tốt
- [ ] Prompt tạo ra kết quả chưa phù hợp
- [ ] Cần hỏi lại AI nhiều lần
- [x] Cần tự kiểm tra và chỉnh sửa nhiều
- [ ] Kết quả AI có lỗi hoặc chưa chính xác

#### 5.7. Minh chứng liên quan
- Files: `Register.test.jsx`, `AuthContext.test.jsx`, `frontend-test.yml`.

---

## 6. Prompt quan trọng nhất

### 6.1. Prompt được chọn
Mục 5.1 (Prompt yêu cầu ban đầu của dự án).

### 6.2. Vì sao prompt này quan trọng?
Nó định hình toàn bộ cấu trúc kiểm thử, đặt ra các biên kiểm thử quan trọng và liên kết chặt chẽ với CI pipeline.

### 6.3. Kết quả prompt này mang lại
Bộ test suite hoàn chỉnh chạy thành công 17/17 cases và đạt độ bao phủ tuyệt đối.

### 6.4. Sinh viên/nhóm đã kiểm tra kết quả như thế nào?
- Chạy lệnh test và build cục bộ thành công.

### 6.5. Sinh viên/nhóm đã cải tiến gì từ kết quả AI?
- Sửa đổi cơ chế load module và đồng bộ trạng thái hook bằng `act`.

---

## 7. Prompt chưa hiệu quả

### 7.1. Prompt chưa hiệu quả
Không có.

---

## 8. Bài học về cách viết prompt

### 8.1. Khi viết prompt, em/nhóm cần cung cấp thông tin gì để AI trả lời tốt hơn?
- Cấu trúc thư mục hiện tại.
- Code thật của các file liên quan để AI mock chính xác.
- Quy tắc biên dịch và thiết lập môi trường.

### 8.2. Em/nhóm đã học được gì về cách đặt câu hỏi cho AI?
- Nên chia nhỏ vấn đề hoặc cung cấp ngữ cảnh chi tiết thay vì để AI tự phỏng đoán.

### 8.3. Lần sau em/nhóm sẽ cải thiện prompt như thế nào?
- Sẽ đưa trực tiếp nội dung các hàm cần test vào prompt để AI phân tích chính xác hơn.

---

## 9. Phân loại prompt đã sử dụng

| Loại prompt | Số lượng | Ví dụ prompt tiêu biểu |
|---|---:|---|
| Prompt thiết kế giải pháp | 1 | Prompt số 1 |

---

## 10. Checklist chất lượng prompt

| Tiêu chí | Đã đạt? | Ghi chú |
|---|:---:|---|
| Prompt có mục tiêu rõ ràng | [x] | |
| Prompt có đủ bối cảnh | [x] | |
| Prompt có nêu công nghệ/ngôn ngữ sử dụng | [x] | |
| Prompt có nêu yêu cầu đầu ra | [x] | |
| Prompt không yêu cầu AI làm toàn bộ bài một cách máy móc | [x] | |
| Prompt có yêu cầu AI giải thích hoặc phân tích | [x] | |
| Kết quả AI được kiểm tra lại | [x] | |
| Kết quả AI được chỉnh sửa trước khi sử dụng | [x] | |
| Prompt quan trọng được ghi lại đầy đủ | [x] | |
| Prompt sai/chưa hiệu quả được rút kinh nghiệm | [x] | Không có prompt lỗi |

---

## 11. Cam kết sử dụng prompt minh bạch

Sinh viên/nhóm cam kết rằng:
- Các prompt quan trọng đã được ghi lại trung thực.
- Không che giấu việc sử dụng AI trong các phần quan trọng của bài.
- Không nộp nguyên văn kết quả AI nếu chưa kiểm tra và chỉnh sửa.
- Có khả năng giải thích các phần đã sử dụng từ AI.
- Chịu trách nhiệm với sản phẩm cuối cùng.

| Đại diện sinh viên/nhóm | Ngày xác nhận |
|---|---|
| Phạm Văn Quyết | 2026-07-17 |
