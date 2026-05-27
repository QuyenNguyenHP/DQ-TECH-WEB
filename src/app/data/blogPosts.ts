export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: "laptop" | "website" | "camera" | "tech-tips";
  author: string;
  date: string;
  readTime: string;
  image: string;
  tags: string[];
}

export const blogPosts: BlogPost[] = [
  {
    id: "1",
    title: "Top 5 Laptop Cũ Tốt Nhất Cho Sinh Viên Năm 2026",
    slug: "top-5-laptop-cu-tot-nhat-cho-sinh-vien-2026",
    excerpt:
      "Khám phá những mẫu laptop cũ giá rẻ nhưng vẫn đủ mạnh để phục vụ nhu cầu học tập, làm việc văn phòng và giải trí nhẹ.",
    content: `
# Top 5 Laptop Cũ Tốt Nhất Cho Sinh Viên Năm 2026

Là sinh viên, việc tìm một chiếc laptop vừa túi tiền nhưng vẫn đủ mạnh để phục vụ học tập là điều không hề dễ dàng. Trong bài viết này, chúng tôi sẽ giới thiệu 5 mẫu laptop cũ tốt nhất cho sinh viên năm 2026.

## 1. Dell Latitude 5400 (2019)

Dell Latitude 5400 là lựa chọn tuyệt vời với cấu hình Intel Core i5 Gen 8, RAM 8GB và SSD 256GB. Máy bền bỉ, pin tốt (6-7 tiếng), phù hợp cho học tập và làm việc văn phòng.

**Ưu điểm:**
- Bàn phím tốt, gõ êm
- Pin lâu, tối ưu cho di động
- Cổng kết nối đầy đủ (USB-C, HDMI, LAN)

**Giá tham khảo:** 7-9 triệu VNĐ

## 2. HP EliteBook 840 G5

EliteBook 840 G5 sở hữu thiết kế sang trọng, nhẹ chỉ 1.5kg. Cấu hình Core i5 Gen 8, RAM 16GB và SSD 256GB đáp ứng tốt các tác vụ đa nhiệm.

**Ưu điểm:**
- Thiết kế mỏng nhẹ, dễ mang theo
- Màn hình Full HD sắc nét
- Bảo mật tốt với vân tay và TPM

**Giá tham khảo:** 8-10 triệu VNĐ

## 3. Lenovo ThinkPad T480

ThinkPad T480 là "huyền thoại" trong dòng laptop doanh nghiệp. Bàn phím TrackPoint nổi tiếng, pin có thể thay thế, nâng cấp dễ dàng.

**Ưu điểm:**
- Bàn phím xuất sắc nhất phân khúc
- Pin rời, có thể mang thêm viên phụ
- Nâng cấp RAM và SSD dễ dàng

**Giá tham khảo:** 7-9 triệu VNĐ

## 4. MacBook Air 2017

Nếu bạn ưa thích hệ sinh thái Apple, MacBook Air 2017 vẫn là lựa chọn tốt. Thiết kế mỏng nhẹ, pin tốt, macOS mượt mà.

**Ưu điểm:**
- Hệ điều hành macOS ổn định
- Thiết kế cao cấp, sang trọng
- Pin cực tốt (10-12 tiếng)

**Giá tham khảo:** 10-12 triệu VNĐ

## 5. ASUS VivoBook S15 S530

VivoBook S530 phù hợp cho sinh viên thiết kế đồ họa nhẹ. Màn hình Full HD, card đồ họa rời MX150, thiết kế trẻ trung.

**Ưu điểm:**
- Card đồ họa rời, chạy Photoshop/Illustrator tốt
- Màn hình viền mỏng đẹp mắt
- Giá hợp lý

**Giá tham khảo:** 8-10 triệu VNĐ

## Kết Luận

Tất cả các mẫu laptop trên đều đã được LaptopHub.vn kiểm tra kỹ lưỡng, đo pin và kèm bảo hành. Hãy liên hệ chúng tôi để được tư vấn chi tiết hơn!
    `,
    category: "laptop",
    author: "LaptopHub Team",
    date: "2026-05-20",
    readTime: "5 phút đọc",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop",
    tags: ["Laptop cũ", "Sinh viên", "Mua laptop"],
  },
  {
    id: "2",
    title: "Thiết Kế Website Hiện Đại: Xu Hướng 2026",
    slug: "thiet-ke-website-hien-dai-xu-huong-2026",
    excerpt:
      "Tìm hiểu những xu hướng thiết kế website mới nhất năm 2026: từ glassmorphism, dark mode đến AI-powered design.",
    content: `
# Thiết Kế Website Hiện Đại: Xu Hướng 2026

Năm 2026 đánh dấu những bước tiến mạnh mẽ trong lĩnh vực thiết kế web. Hãy cùng khám phá những xu hướng đang thống trị.

## 1. Glassmorphism và Soft UI

Glassmorphism (hiệu ứng kính mờ) tiếp tục phổ biến với backdrop-blur, độ trong suốt và bóng mềm. Tạo cảm giác hiện đại, cao cấp.

## 2. Dark Mode là Mặc Định

Người dùng ngày càng ưa chuộng dark mode. Thiết kế nên ưu tiên dark mode hoặc hỗ trợ cả 2 chế độ.

## 3. Micro-interactions

Những tương tác nhỏ như hover effects, loading animations tạo trải nghiệm mượt mà và thú vị.

## 4. AI-Powered Personalization

AI giúp cá nhân hóa nội dung, gợi ý sản phẩm và tối ưu trải nghiệm người dùng theo thời gian thực.

## 5. Performance First

Core Web Vitals và tốc độ tải trang là yếu tố quyết định. Website cần tối ưu hình ảnh, lazy loading và code splitting.

## Kết Luận

LaptopHub.vn áp dụng tất cả xu hướng trên để mang đến trải nghiệm tốt nhất cho khách hàng. Liên hệ chúng tôi để thiết kế website theo chuẩn mới nhất!
    `,
    category: "website",
    author: "LaptopHub Team",
    date: "2026-05-18",
    readTime: "4 phút đọc",
    image: "https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&auto=format&fit=crop",
    tags: ["Thiết kế web", "UI/UX", "Web trends"],
  },
  {
    id: "3",
    title: "Lắp Đặt Camera Giám Sát: Những Điều Cần Biết",
    slug: "lap-dat-camera-giam-sat-nhung-dieu-can-biet",
    excerpt:
      "Hướng dẫn chi tiết về cách chọn và lắp đặt hệ thống camera giám sát cho nhà ở và cửa hàng.",
    content: `
# Lắp Đặt Camera Giám Sát: Những Điều Cần Biết

Hệ thống camera giám sát không chỉ giúp bảo vệ tài sản mà còn mang lại sự an tâm. Dưới đây là những kiến thức cơ bản.

## 1. Chọn Loại Camera Phù Hợp

### Camera Dome
- Thiết kế nhỏ gọn, khó bị phá hoại
- Phù hợp cho trong nhà, cửa hàng

### Camera Bullet
- Tầm xa tốt, chống nước tốt
- Phù hợp cho ngoài trời, sân vườn

### Camera PTZ
- Xoay 360 độ, zoom xa
- Phù hợp cho khu vực rộng

## 2. Độ Phân Giải

- **2MP (1080p):** Đủ dùng cho hầu hết trường hợp
- **4MP-5MP:** Rõ nét hơn, nhận diện tốt
- **8MP (4K):** Siêu nét, chi tiết cao

## 3. Tính Năng Cần Có

- **Night Vision:** Quay đêm hồng ngoại
- **Motion Detection:** Ghi hình khi phát hiện chuyển động
- **Cloud Storage:** Lưu trữ đám mây an toàn
- **Mobile App:** Xem từ xa qua điện thoại

## 4. Vị Trí Lắp Đặt

- Cổng ra vào chính
- Sân trước/sau
- Khu vực để xe
- Lối đi chính trong nhà

## Kết Luận

LaptopHub.vn cung cấp dịch vụ lắp đặt camera trọn gói, từ khảo sát, tư vấn đến lắp đặt và bảo hành. Liên hệ ngay để được báo giá!
    `,
    category: "camera",
    author: "LaptopHub Team",
    date: "2026-05-15",
    readTime: "6 phút đọc",
    image: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=800&auto=format&fit=crop",
    tags: ["Camera", "An ninh", "Giám sát"],
  },
  {
    id: "4",
    title: "Cách Kiểm Tra Sức Khỏe Pin Laptop Trước Khi Mua",
    slug: "cach-kiem-tra-suc-khoe-pin-laptop",
    excerpt:
      "Hướng dẫn chi tiết cách kiểm tra tình trạng pin laptop cũ để đảm bảo mua được máy chất lượng.",
    content: `
# Cách Kiểm Tra Sức Khỏe Pin Laptop Trước Khi Mua

Pin là một trong những bộ phận quan trọng nhất của laptop. Dưới đây là cách kiểm tra sức khỏe pin.

## 1. Sử Dụng Phần Mềm Kiểm Tra

### Windows: Battery Report
\`\`\`
powercfg /batteryreport
\`\`\`
Mở Command Prompt và chạy lệnh trên. File báo cáo sẽ được tạo ở thư mục User.

### macOS: System Information
Nhấn Option + Click vào biểu tượng pin để xem cycle count và condition.

## 2. Các Chỉ Số Quan Trọng

### Battery Health (Sức khỏe pin)
- **90-100%:** Xuất sắc
- **80-89%:** Tốt
- **70-79%:** Khá
- **<70%:** Cần thay pin

### Cycle Count (Số chu kỳ sạc)
- **<300:** Rất tốt
- **300-500:** Tốt
- **500-800:** Khá
- **>800:** Nên thay pin

## 3. Test Thực Tế

- Sạc đầy 100%
- Dùng liên tục xem thời gian sử dụng
- So với thời gian pin ban đầu của hãng

## 4. Kiểm Tra Vật Lý

- Pin có phồng, cong?
- Khe cắm pin có lỏng?
- Máy có nóng bất thường khi sạc?

## Cam Kết Của LaptopHub.vn

Tất cả laptop tại LaptopHub.vn đều được đo battery health bằng phần mềm chuyên nghiệp. Chúng tôi cam kết minh bạch về tình trạng pin và kèm bảo hành.
    `,
    category: "tech-tips",
    author: "LaptopHub Team",
    date: "2026-05-12",
    readTime: "5 phút đọc",
    image: "https://images.unsplash.com/photo-1601134991665-a020399422e3?w=800&auto=format&fit=crop",
    tags: ["Pin laptop", "Mẹo tech", "Kiểm tra laptop"],
  },
];

export const blogCategories = [
  { id: "all", label: "Tất Cả", count: blogPosts.length },
  {
    id: "laptop",
    label: "Laptop",
    count: blogPosts.filter((p) => p.category === "laptop").length,
  },
  {
    id: "website",
    label: "Website",
    count: blogPosts.filter((p) => p.category === "website").length,
  },
  {
    id: "camera",
    label: "Camera",
    count: blogPosts.filter((p) => p.category === "camera").length,
  },
  {
    id: "tech-tips",
    label: "Mẹo Tech",
    count: blogPosts.filter((p) => p.category === "tech-tips").length,
  },
];
