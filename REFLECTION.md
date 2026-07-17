# Reflection Log

## Phạm Văn Quyết – DE190425

### 1. Chức năng đã kiểm thử
- Giao diện đăng ký tài khoản `Register.jsx` và hàm xử lý đăng ký trong `AuthContext.js`.

### 2. Kỹ thuật đã áp dụng
- Phân vùng tương đương (EP): Kiểm thử lỗi password, các lỗi API mock.
- Phân tích giá trị biên (BVA): Biên độ dài mật khẩu 5, 6, 7 ký tự.
- Kiểm thử độ bao phủ (Branch/Statement Coverage): Đạt 100% bao phủ mã nguồn nghiệp vụ đăng ký.

### 3. Khó khăn khi mock useAuth, API và navigation
- Khó khăn lớn nhất là đồng bộ hóa trạng thái bất đồng bộ. Jest load nhầm tệp tin `Register.js` cũ do trùng tên với `Register.jsx`. Xử lý bằng cách import rõ ràng đuôi mở rộng `.jsx`.
- Khi mock `useAuth()`, nếu gọi async trực tiếp mà không dùng `act` wrapper sẽ nhận giá trị `undefined` từ hook state. Đã giải quyết bằng cách bọc hàm thực thi trong `act(async () => { ... })`.

### 4. AI hỗ trợ phần nào
- AI hỗ trợ sinh khung cấu trúc test cases ban đầu, thiết lập kịch bản thuyết trình và các báo cáo markdown.

### 5. Những nội dung AI cần chỉnh sửa
- Import của file `Register` cần chỉnh sửa thành `./Register.jsx`.
- Cách thức await các lời gọi hàm của hooks cần chuyển sang `act()` của React Testing Library.

### 6. Cách kiểm chứng
- Thực thi cục bộ `npm test` và `npm run test:ci` đều hiển thị Passed 17/17 cases.
- `npm run build` thành công không có warning hay lỗi nào nghiêm trọng.

### 7. Defect phát hiện
- Phát hiện xung đột resolve import giữa 2 file `Register.js` và `Register.jsx`. Việc này nếu không phát hiện sẽ dẫn đến tình trạng viết test cho một file cũ không còn được sử dụng trong định tuyến ứng dụng.

### 8. Bài học rút ra
- Cần chỉ định tường minh định dạng file (.jsx) đối với các dự án React có cấu trúc mã nguồn lịch sử phức tạp.
- Luôn kiểm chứng kết quả chạy test và tỷ lệ bao phủ độc lập thay vì chỉ xem xét code tĩnh do AI tạo ra.
