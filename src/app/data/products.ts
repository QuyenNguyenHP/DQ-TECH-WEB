export type Condition = "Excellent" | "Good" | "Fair";

export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  originalPrice: number;
  condition: Condition;
  batteryHealth: number;
  image: string;
  images: string[];
  specs: {
    cpu: string;
    ram: string;
    ssd: string;
    gpu: string;
    screen: string;
    os: string;
    weight: string;
  };
  category: "student" | "gaming" | "business" | "creator";
  warranty: string;
  accessories: string[];
  description: string;
  inStock: boolean;
  featured?: boolean;
}

const LAPTOP_1 = "https://images.unsplash.com/photo-1583852703665-b76f45b3ee3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=800";
const LAPTOP_2 = "https://images.unsplash.com/photo-1542393545-10f5cde2c810?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=800";
const LAPTOP_3 = "https://images.unsplash.com/photo-1603302576837-37561b2e2302?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=800";
const LAPTOP_4 = "https://images.unsplash.com/photo-1771014846919-3a1cf73aeea1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=800";
const LAPTOP_5 = "https://images.unsplash.com/photo-1531297484001-80022131f5a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=800";
const LAPTOP_6 = "https://images.unsplash.com/photo-1773418517695-c3d0c21b7246?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=800";
const LAPTOP_7 = "https://images.unsplash.com/photo-1758979919845-9d688cceb7da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=800";
const LAPTOP_8 = "https://images.unsplash.com/photo-1754928864131-21917af96dfd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=800";

export const products: Product[] = [
  {
    id: "macbook-air-m2",
    name: "MacBook Air M2 13\"",
    brand: "Apple",
    price: 899,
    originalPrice: 1299,
    condition: "Excellent",
    batteryHealth: 92,
    image: LAPTOP_6,
    images: [LAPTOP_6, LAPTOP_7, LAPTOP_3],
    specs: {
      cpu: "Apple M2 8-Core",
      ram: "16GB Unified Memory",
      ssd: "512GB NVMe SSD",
      gpu: "10-Core GPU",
      screen: "13.6\" Liquid Retina",
      os: "macOS Sonoma",
      weight: "1.24 kg",
    },
    category: "creator",
    warranty: "3 tháng",
    accessories: ["Sạc Chính Hãng", "Cáp USB-C", "Hộp"],
    description: "Siêu mỏng nhẹ với chip Apple M2. Hoàn hảo cho người sáng tạo và chuyên gia cần pin cả ngày và hiệu năng yên tĩnh tuyệt đối.",
    inStock: true,
    featured: true,
  },
  {
    id: "dell-xps-15",
    name: "Dell XPS 15 9520",
    brand: "Dell",
    price: 750,
    originalPrice: 1199,
    condition: "Good",
    batteryHealth: 85,
    image: LAPTOP_1,
    images: [LAPTOP_1, LAPTOP_5, LAPTOP_8],
    specs: {
      cpu: "Intel Core i7-12700H",
      ram: "16GB DDR5",
      ssd: "512GB NVMe SSD",
      gpu: "NVIDIA RTX 3050 Ti",
      screen: "15.6\" OLED 3.5K",
      os: "Windows 11 Pro",
      weight: "1.86 kg",
    },
    category: "creator",
    warranty: "3 tháng",
    accessories: ["Sạc 130W", "USB-C Hub"],
    description: "Màn hình OLED tuyệt đẹp kết hợp sức mạnh xử lý đỉnh cao. Lý tưởng cho lập trình viên, dựng phim và người dùng chuyên nghiệp.",
    inStock: true,
    featured: true,
  },
  {
    id: "asus-rog-zephyrus",
    name: "ASUS ROG Zephyrus G14",
    brand: "ASUS",
    price: 1099,
    originalPrice: 1599,
    condition: "Good",
    batteryHealth: 88,
    image: LAPTOP_4,
    images: [LAPTOP_4, LAPTOP_2, LAPTOP_1],
    specs: {
      cpu: "AMD Ryzen 9 6900HS",
      ram: "32GB DDR5",
      ssd: "1TB NVMe SSD",
      gpu: "NVIDIA RTX 3060 6GB",
      screen: "14\" QHD 120Hz",
      os: "Windows 11 Home",
      weight: "1.65 kg",
    },
    category: "gaming",
    warranty: "3 tháng",
    accessories: ["Sạc 240W", "Balo ROG"],
    description: "Máy gaming compact mạnh nhất phân khúc. Chiến tất cả game AAA và tác vụ sáng tạo nặng với Ryzen 9 và RTX 3060.",
    inStock: true,
    featured: true,
  },
  {
    id: "thinkpad-x1-carbon",
    name: "ThinkPad X1 Carbon Gen 10",
    brand: "Lenovo",
    price: 650,
    originalPrice: 1099,
    condition: "Excellent",
    batteryHealth: 91,
    image: LAPTOP_5,
    images: [LAPTOP_5, LAPTOP_8, LAPTOP_7],
    specs: {
      cpu: "Intel Core i7-1265U",
      ram: "16GB LPDDR5",
      ssd: "512GB NVMe SSD",
      gpu: "Intel Iris Xe",
      screen: "14\" IPS 2.8K",
      os: "Windows 11 Pro",
      weight: "1.12 kg",
    },
    category: "business",
    warranty: "3 tháng",
    accessories: ["Sạc USB-C 65W", "Hộp Chính Hãng"],
    description: "Ultrabook văn phòng đỉnh cao. Vỏ siêu nhẹ chuẩn quân sự, pin cả ngày — dành cho doanh nhân bận rộn.",
    inStock: true,
    featured: true,
  },
  {
    id: "hp-spectre-x360",
    name: "HP Spectre x360 14\"",
    brand: "HP",
    price: 599,
    originalPrice: 999,
    condition: "Good",
    batteryHealth: 82,
    image: LAPTOP_8,
    images: [LAPTOP_8, LAPTOP_6, LAPTOP_3],
    specs: {
      cpu: "Intel Core i7-1255U",
      ram: "16GB LPDDR4X",
      ssd: "512GB NVMe SSD",
      gpu: "Intel Iris Xe",
      screen: "13.5\" OLED 3:2",
      os: "Windows 11 Home",
      weight: "1.38 kg",
    },
    category: "business",
    warranty: "3 tháng",
    accessories: ["Sạc 65W", "Bút Stylus"],
    description: "Laptop 2-in-1 sang trọng với màn hình OLED cảm ứng. Thiết kế cao cấp kết hợp linh hoạt — vẽ, thuyết trình hoặc gõ phím theo phong cách riêng.",
    inStock: true,
  },
  {
    id: "lenovo-ideapad-5",
    name: "Lenovo IdeaPad 5 Pro",
    brand: "Lenovo",
    price: 399,
    originalPrice: 699,
    condition: "Fair",
    batteryHealth: 74,
    image: LAPTOP_2,
    images: [LAPTOP_2, LAPTOP_5, LAPTOP_1],
    specs: {
      cpu: "AMD Ryzen 5 5600H",
      ram: "8GB DDR4",
      ssd: "256GB NVMe SSD",
      gpu: "AMD Radeon RX Vega 7",
      screen: "16\" IPS 2.5K",
      os: "Windows 11 Home",
      weight: "1.85 kg",
    },
    category: "student",
    warranty: "1 tháng",
    accessories: ["Sạc 65W"],
    description: "Trợ thủ đắc lực cho sinh viên với giá phải chăng. Màn hình 2.5K rộng và hiệu năng AMD ổn định — hoàn hảo cho học tập, làm bài và giải trí.",
    inStock: true,
  },
  {
    id: "framework-laptop-13",
    name: "Framework Laptop 13",
    brand: "Framework",
    price: 849,
    originalPrice: 1049,
    condition: "Excellent",
    batteryHealth: 96,
    image: LAPTOP_3,
    images: [LAPTOP_3, LAPTOP_8, LAPTOP_6],
    specs: {
      cpu: "Intel Core i7-1280P",
      ram: "32GB DDR4",
      ssd: "1TB NVMe SSD",
      gpu: "Intel Iris Xe",
      screen: "13.5\" IPS 2256x1504",
      os: "Windows 11 Pro",
      weight: "1.3 kg",
    },
    category: "creator",
    warranty: "3 tháng",
    accessories: ["Sạc 60W", "Cáp USB-C", "Tua Vít"],
    description: "Laptop có thể sửa chữa nhất thế giới. Nâng cấp RAM, SSD hoặc thay cổng kết nối bất cứ lúc nào — thiết kế hướng tới tương lai. Hoàn hảo cho lập trình viên đam mê công nghệ.",
    inStock: true,
  },
  {
    id: "msi-gs66-stealth",
    name: "MSI GS66 Stealth 15\"",
    brand: "MSI",
    price: 950,
    originalPrice: 1499,
    condition: "Good",
    batteryHealth: 80,
    image: LAPTOP_7,
    images: [LAPTOP_7, LAPTOP_4, LAPTOP_2],
    specs: {
      cpu: "Intel Core i7-12700H",
      ram: "32GB DDR5",
      ssd: "1TB NVMe SSD",
      gpu: "NVIDIA RTX 3070 Ti 8GB",
      screen: "15.6\" QHD 240Hz",
      os: "Windows 11 Home",
      weight: "2.1 kg",
    },
    category: "gaming",
    warranty: "3 tháng",
    accessories: ["Sạc 230W", "Chuột MSI"],
    description: "Vẻ ngoài bí ẩn, sức mạnh khủng khiếp. RTX 3070 Ti trong vỏ đen bóng. Thống trị mọi trận chiến ở 240Hz.",
    inStock: false,
  },
];

export const categories = [
  {
    id: "student",
    label: "Sinh Viên",
    description: "Nhẹ nhàng & tiết kiệm cho cuộc sống đại học",
    icon: "GraduationCap",
    image: "https://images.unsplash.com/photo-1620829813573-7c9e1877706f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=600",
    color: "from-blue-500/20 to-indigo-500/20",
    count: products.filter(p => p.category === "student").length,
  },
  {
    id: "gaming",
    label: "Gaming",
    description: "Tần số cao, GPU mạnh, sẵn sàng RGB",
    icon: "Gamepad2",
    image: "https://images.unsplash.com/photo-1771014846919-3a1cf73aeea1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=600",
    color: "from-red-500/20 to-orange-500/20",
    count: products.filter(p => p.category === "gaming").length,
  },
  {
    id: "business",
    label: "Văn Phòng",
    description: "Mỏng nhẹ, chuyên nghiệp, pin bền lâu",
    icon: "Briefcase",
    image: "https://images.unsplash.com/photo-1570215171424-f74325192b55?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=600",
    color: "from-slate-500/20 to-gray-500/20",
    count: products.filter(p => p.category === "business").length,
  },
  {
    id: "creator",
    label: "Đồ Hoạ",
    description: "Màn hình chuẩn màu, hiệu năng vượt trội",
    icon: "Palette",
    image: "https://images.unsplash.com/photo-1583852703665-b76f45b3ee3e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=600",
    color: "from-purple-500/20 to-pink-500/20",
    count: products.filter(p => p.category === "creator").length,
  },
];

export const testimonials = [
  {
    id: 1,
    name: "Nguyễn Minh Tuấn",
    role: "Lập Trình Viên",
    avatar: "NM",
    rating: 5,
    text: "Mua ThinkPad X1 Carbon với giá bằng nửa hàng mới. Pin đúng như mô tả, máy đến kèm Windows cài sẵn sạch sẽ. Hài lòng tuyệt đối với lần mua hàng này.",
    product: "ThinkPad X1 Carbon Gen 10",
  },
  {
    id: 2,
    name: "Lê Thị Hoa",
    role: "Sinh Viên Đại Học",
    avatar: "LH",
    rating: 5,
    text: "IdeaPad 5 rất phù hợp cho việc học của mình. Giao hàng nhanh, máy sạch sẽ, và bảo hành 3 tháng giúp mình yên tâm hoàn toàn. Rất khuyến khích cho sinh viên tiết kiệm!",
    product: "Lenovo IdeaPad 5 Pro",
  },
  {
    id: 3,
    name: "Trần Văn Đức",
    role: "Designer Freelance",
    avatar: "TD",
    rating: 5,
    text: "MacBook Air M2 tình trạng xuất sắc — màn hình đẹp xuất sắc cho công việc thiết kế. Tiết kiệm hơn 9 triệu so với mua mới. Đội ngũ hỗ trợ nhiệt tình qua Zalo.",
    product: "MacBook Air M2 13\"",
  },
  {
    id: 4,
    name: "Phạm Quốc Hùng",
    role: "Game Thủ",
    avatar: "PH",
    rating: 5,
    text: "ROG Zephyrus chạy mượt mọi game ở setting cao nhất. Pin 88% vẫn rất tốt. Giao hàng nhanh, mô tả trung thực — sẽ mua lại lần nữa!",
    product: "ASUS ROG Zephyrus G14",
  },
];
