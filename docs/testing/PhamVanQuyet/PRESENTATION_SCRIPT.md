# Kịch bản thuyết trình bảo vệ cá nhân - Phạm Văn Quyết (DE190425)
*Thời lượng thuyết trình tối đa: 8 phút*
*Ngôn ngữ: Tiếng Việt*

---

## ⏳ [0:00 – 0:45] Phần 1: Giới thiệu bản thân và vai trò
"Xin chào thầy và các bạn. Em tên là Phạm Văn Quyết, mã số sinh viên DE190425, học lớp SE20A11 môn học Software Testing (SWT301). 

Trong dự án thực tế xây dựng Hệ thống quản lý nhà hàng (Restaurant Management System) của nhóm 01, em đảm nhận vai trò là Backend & Security Lead. Trách nhiệm chính của em là thiết kế và triển khai cơ sở dữ liệu quan hệ, tích hợp các REST API và cơ chế bảo mật xác thực phân quyền dựa trên JSON Web Token (JWT). 

Hôm nay, em xin phép trình bày chi tiết phần bài làm kiểm thử cá nhân của mình cho tính năng: Đăng ký tài khoản (Authentication – Registration Validation and API Integration)."

---

## ⏳ [0:45 – 1:30] Phần 2: Mô tả chức năng Registration & Nghiệp vụ
"Chức năng Đăng ký tài khoản nằm ở phía Frontend tại component `Register.jsx`, kết nối tới Backend thông qua logic của `AuthContext.js`.

Nghiệp vụ cốt lõi của tính năng này gồm 4 quy tắc chính:
1. Người dùng cần điền đầy đủ các thông tin gồm Họ và tên, Email, Mật khẩu và Xác nhận mật khẩu.
2. Hệ thống kiểm tra tính trùng khớp của mật khẩu đầu vào. Nếu Mật khẩu và Xác nhận mật khẩu khác nhau, hệ thống lập tức hiển thị thông báo lỗi: 'Mật khẩu xác nhận không khớp'.
3. Mật khẩu phải đạt độ dài tối thiểu từ 6 ký tự trở lên. Nếu vi phạm, hệ thống hiển thị lỗi: 'Mật khẩu phải ít nhất 6 ký tự'.
4. Khi dữ liệu hoàn toàn hợp lệ, client sẽ ánh xạ trường `fullName` sang thuộc tính `username` và gửi lên API của Backend. Nếu đăng ký thành công, người dùng được chuyển hướng về trang đăng nhập. Nếu thất bại, hiển thị thông báo tương ứng."

---

## ⏳ [1:30 – 3:00] Phần 3: Thiết kế kiểm thử - Phân vùng tương đương (EP)
"Để kiểm thử chức năng này một cách khoa học, em đã áp dụng kỹ thuật Phân vùng tương đương (Equivalence Partitioning). Cụ thể, em chia các trường hợp kiểm thử thành các vùng dữ liệu hợp lệ và không hợp lệ:

*   **Về tính trùng khớp mật khẩu**:
    *   *Vùng hợp lệ*: Xác nhận mật khẩu trùng khớp với Mật khẩu chính.
    *   *Vùng không hợp lệ*: Xác nhận mật khẩu khác với Mật khẩu chính.
*   **Về phản hồi từ API**:
    *   *Vùng hợp lệ*: API trả về mã thành công (`success: true`).
    *   *Vùng không hợp lệ*: API trả về lỗi dạng chuỗi (String), lỗi dạng đối tượng có thông báo (`message` hoặc `detail`), hoặc lỗi mất kết nối mạng (Network Error).

Các trường hợp này đã được chuyển hóa thành các test cases từ `TC_REG_001` đến `TC_REG_007` và `TC_AUTH_REG_001` đến `TC_AUTH_REG_005` trong bộ test."

---

## ⏳ [3:00 – 4:15] Phần 4: Thiết kế kiểm thử - Phân tích giá trị biên (BVA)
"Bên cạnh phân vùng tương đương, em áp dụng kỹ thuật Phân tích giá trị biên (Boundary Value Analysis) cho thuộc tính độ dài của mật khẩu với giá trị biên quy định là 6 ký tự:

*   **Biên dưới (Min - 1)**: Kiểm thử với mật khẩu dài 5 ký tự (Ví dụ: `abcde`). Kết quả mong đợi là hệ thống báo lỗi và không cho phép đăng ký. Đây là `TC_REG_002`.
*   **Giá trị Biên (Min)**: Kiểm thử với mật khẩu dài đúng 6 ký tự (Ví dụ: `abcdef`). Kết quả mong đợi là hệ thống chấp nhận và thực hiện gửi yêu cầu. Đây là `TC_REG_003`.
*   **Biên trên (Min + 1)**: Kiểm thử với mật khẩu dài 7 ký tự (Ví dụ: `abcdefg`). Kết quả mong đợi là hệ thống xử lý hợp lệ. Đây là `TC_REG_004`.

Việc kiểm tra chính xác các giá trị quanh biên giúp chúng ta tự tin loại bỏ lỗi lập trình lớn hơn hoặc nhỏ hơn (off-by-one errors) của lập trình viên."

---

## ⏳ [4:15 – 5:30] Phần 5: Độ bao phủ kiểm thử (Statement & Branch Coverage)
"Mục tiêu tối thượng của em khi viết Unit Test là đạt độ bao phủ tối đa mã nguồn (Statement & Branch Coverage) để không bỏ sót bất kỳ dòng lệnh hay nhánh quyết định nào.

*   Tại component `Register.jsx`, bộ kiểm thử đã bao phủ toàn bộ các lệnh kiểm tra form, quá trình chuyển đổi type của input khi toggle ẩn/hiện mật khẩu (`TC_REG_010`, `TC_REG_011`), việc hiển thị và tự động ẩn của popup thông báo liên kết mạng xã hội (`TC_REG_012`), cũng như trạng thái vô hiệu hóa nút bấm khi loading (`TC_REG_008`).
*   Tại `AuthContext.js`, bộ kiểm thử bao phủ toàn bộ nhánh quyết định cấu trúc dữ liệu lỗi của API trong hàm trợ giúp `getApiMessage` bao gồm: dữ liệu trống, dữ liệu lỗi dạng chuỗi, dạng đối tượng chứa message, và dạng đối tượng chứa detail.

Kết quả đo lường thực tế từ Jest Coverage đạt **100%** đối với cả Statement, Branch, Function và Line cho cấu trúc kiểm thử Đăng ký này."

---

## ⏳ [5:30 – 7:00] Phần 6: Demo chạy thử Unit Test và Build
"Sau đây, em xin trình bày quá trình chạy kiểm thử cục bộ. 

Khi thực thi câu lệnh kiểm thử:
`npm test -- --watchAll=false`
Hệ thống chạy 2 Test Suites chứa toàn bộ 17 Test Cases. Kết quả hiển thị **17 passed, 17 total**. Không có bất kỳ test case nào bị bỏ qua (skipped) hay bị lỗi.

Tiếp theo là câu lệnh xuất báo cáo độ bao phủ:
`npm run test:ci`
Kết quả xuất ra bảng tỷ lệ bao phủ chi tiết của Jest, xác nhận file `Register.jsx` đạt mức bao phủ tuyệt đối **100%**.

Cuối cùng, em kiểm tra khả năng build đóng gói ứng dụng bằng lệnh:
`npm run build`
Kết quả ghi nhận ứng dụng được đóng gói thành công mà không gặp bất kỳ lỗi biên dịch nào."

---

## ⏳ [7:00 – 8:00] Phần 7: Tổng kết kết quả và bài học
"Tóm lại, thông qua hoạt động viết Unit Test lần này cho chức năng Đăng ký:
1. Em đã kiểm chứng được tính năng hoạt động ổn định và chính xác theo đúng đặc tả yêu cầu của dự án.
2. Phát hiện và xử lý được vấn đề import nhầm tệp tin cũ (.js thay vì .jsx) do xung đột cơ chế ưu tiên giải quyết phần mở rộng của Jest.
3. Bản thân em đã nâng cao kỹ năng viết mock cho React Context, Axios API Client và React Router DOM.
4. Xây dựng thành công pipeline CI trên GitHub Actions giúp đảm bảo mọi thay đổi sau này trên branch đều được tự động kiểm tra test và build trước khi được phép merge vào nhánh chính `main`.

Em xin cảm ơn thầy và các bạn đã lắng nghe phần trình bày bảo vệ cá nhân của em. Em xin nhận các câu hỏi góp ý từ thầy."
