├── index.html                     # File HTML chính, khai báo meta SEO và font chữ Nunito
├── metadata.json                  # Metadata định danh ứng dụng trên AI Studio
├── package.json                   # Danh sách thư viện (React 19, Firebase SDK, TailwindCSS v4, Lucide, Motion...)
├── vite.config.ts                 # Cấu hình Vite build và alias đường dẫn
├── tsconfig.json                  # Cấu hình TypeScript compiler
├── firebase-applet-config.json    # Cấu hình Firebase Authentication và OAuth Client ID
│
├── src/
│   ├── main.tsx                   # Điểm khởi chạy ứng dụng React
│   ├── App.tsx                    # Component chính: Quản lý Auth, tải dữ liệu Drive, xử lý sự kiện
│   ├── index.css                  # CSS toàn cục (Tailwind CSS, hiệu ứng hoạt họa tiểu học)
│   │
│   ├── types/
│   │   └── index.ts               # Khai báo kiểu dữ liệu: DriveFile, GradeInfo, DriveConfigState, v.v.
│   │
│   ├── services/
│   │   ├── firebaseAuth.ts        # Quản lý đăng nhập Google (Firebase Auth), cấp quyền Google Drive scope, lưu Access Token in-memory
│   │   └── driveService.ts        # Gọi Google Drive API v3: Lấy danh sách file, upload multipart kèm progress bar, tạo thư mục
│   │
│   ├── data/
│   │   └── mockCurriculum.ts      # Dữ liệu bài giảng mẫu cho 5 khối lớp (dùng khi thử nghiệm hoặc tham khảo)
│   │
│   └── components/
│       ├── Navbar.tsx             # Thanh điều hướng: Tên trường, ô tìm kiếm, nút Đăng nhập Google, Avatar
│       ├── HeroBanner.tsx         # Banner chào mừng phong cách tiểu học, linh vật Bé Cú Thông Thái, thống kê
│       ├── GradeSelector.tsx      # Bộ chọn 5 Khối Lớp (Lớp 1 đến Lớp 5) và "Xem tất cả"
│       ├── FileGrid.tsx           # Lưới hiển thị bài giảng, bộ lọc môn học và định dạng file (.pptx, .pdf, .docx)
│       ├── FileCard.tsx           # Thẻ hiển thị từng bài giảng: nút "Xem trước" và "Tải về"
│       ├── PreviewModal.tsx       # Cửa sổ trình chiếu bài giảng PowerPoint / xem file PDF trên trình duyệt
│       ├── UploadModal.tsx        # Cửa sổ tải lên bài giảng (dành cho Giáo viên) có thanh tiến trình %
│       ├── AccessDeniedNotice.tsx # Màn hình thông báo lỗi 403 Forbidden thân thiện khi Gmail chưa được cấp quyền
│       └── DriveSettingsModal.tsx # Cửa sổ cấu hình Folder ID Google Drive & tính năng 1-Click tự tạo thư mục