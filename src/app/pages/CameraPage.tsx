import { Link } from "react-router";
import { motion } from "motion/react";
import {
  Camera, Shield, Wifi, Eye, Clock, Wrench, CheckCircle, ArrowRight,
  ChevronRight, Phone, MapPin, AlertTriangle, Monitor, HardDrive, Radio
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";

const features = [
  { icon: Eye, title: "Hình Ảnh Sắc Nét", desc: "Camera 4K, góc rộng 120°, hình ảnh ban đêm rõ ràng với hồng ngoại 30m", color: "text-green-400", bg: "bg-green-500/10" },
  { icon: Wifi, title: "Xem Từ Xa", desc: "Giám sát trực tiếp qua điện thoại, máy tính bất kỳ lúc nào, bất kỳ đâu", color: "text-blue-400", bg: "bg-blue-500/10" },
  { icon: HardDrive, title: "Lưu Trữ Thông Minh", desc: "Lưu trữ đám mây và đầu ghi cục bộ, dữ liệu tự động 24/7", color: "text-purple-400", bg: "bg-purple-500/10" },
  { icon: AlertTriangle, title: "Cảnh Báo Thông Minh", desc: "Phát hiện chuyển động, nhận thông báo tức thì qua điện thoại", color: "text-yellow-400", bg: "bg-yellow-500/10" },
  { icon: Shield, title: "Bảo Mật Dữ Liệu", desc: "Mã hóa end-to-end, không chia sẻ với bên thứ ba", color: "text-red-400", bg: "bg-red-500/10" },
  { icon: Wrench, title: "Lắp Đặt Chuyên Nghiệp", desc: "Đội ngũ kỹ thuật viên lành nghề, lắp đặt đúng kỹ thuật, gọn gàng", color: "text-orange-400", bg: "bg-orange-500/10" },
];

const packages = [
  {
    name: "Gói Cơ Bản",
    cameras: "2 Camera",
    price: "3.500.000",
    badge: null,
    features: [
      "2 camera Full HD 1080p",
      "Đầu ghi 4 kênh",
      "Ổ cứng 500GB (lưu 30 ngày)",
      "Xem trực tiếp qua app",
      "Phát hiện chuyển động",
      "Cáp và phụ kiện đi kèm",
      "Bảo hành 12 tháng",
    ],
    highlight: false,
    cta: "Chọn Gói",
  },
  {
    name: "Gói Gia Đình",
    cameras: "4 Camera",
    price: "6.500.000",
    badge: "Phổ Biến",
    features: [
      "4 camera 2K Super HD",
      "Đầu ghi 8 kênh thông minh",
      "Ổ cứng 1TB (lưu 60 ngày)",
      "Hồng ngoại ban đêm 30m",
      "Xem xa qua điện thoại/PC",
      "Cảnh báo chuyển động AI",
      "Cài đặt & hướng dẫn sử dụng",
      "Bảo hành 24 tháng",
    ],
    highlight: true,
    cta: "Chọn Gói Này",
  },
  {
    name: "Gói Doanh Nghiệp",
    cameras: "8+ Camera",
    price: "Báo Giá",
    badge: null,
    features: [
      "8-32 camera 4K Ultra HD",
      "Đầu ghi NVR/DVR chuyên dụng",
      "Lưu trữ RAID không giới hạn",
      "AI nhận diện khuôn mặt/biển số",
      "Tích hợp hệ thống báo động",
      "Quản lý tập trung nhiều chi nhánh",
      "Kỹ thuật viên hỗ trợ 24/7",
      "Bảo trì định kỳ hàng năm",
    ],
    highlight: false,
    cta: "Liên Hệ Tư Vấn",
  },
];

const applications = [
  {
    icon: "🏠",
    title: "Nhà Ở",
    desc: "Bảo vệ gia đình và tài sản, quan sát con cái và người giúp việc từ xa",
    img: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=500&q=80",
  },
  {
    icon: "🏪",
    title: "Cửa Hàng & Siêu Thị",
    desc: "Ngăn chặn trộm cắp, quản lý nhân viên, theo dõi hành vi khách hàng",
    img: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=500&q=80",
  },
  {
    icon: "🏢",
    title: "Văn Phòng & Công Ty",
    desc: "Kiểm soát ra vào, bảo mật khu vực quan trọng, giám sát toàn bộ không gian",
    img: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=500&q=80",
  },
  {
    icon: "🏭",
    title: "Nhà Máy & Kho Xưởng",
    desc: "Giám sát dây chuyền sản xuất, kiểm soát hàng hóa, an toàn lao động",
    img: "https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=500&q=80",
  },
];

const brands = ["Hikvision", "Dahua", "Axis", "Hanwha", "Bosch", "Uniview"];

const process = [
  { icon: Phone, title: "Tư Vấn Miễn Phí", desc: "Khảo sát nhu cầu và tư vấn giải pháp phù hợp nhất" },
  { icon: MapPin, title: "Khảo Sát Thực Tế", desc: "Kỹ thuật viên đến tận nơi, khảo sát và lên phương án lắp đặt" },
  { icon: Wrench, title: "Lắp Đặt Chuyên Nghiệp", desc: "Thi công gọn gàng, đúng kỹ thuật, hoàn thành trong ngày" },
  { icon: Monitor, title: "Bàn Giao & Hỗ Trợ", desc: "Hướng dẫn sử dụng, bàn giao toàn bộ hệ thống và hỗ trợ sau lắp đặt" },
];

export function CameraPage() {
  return (
    <div className="min-h-screen bg-[#0F1115] text-white">
      {/* Hero */}
      <section className="relative pt-24 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1600&q=80"
            alt="Security camera system"
            className="w-full h-full object-cover opacity-10"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-green-900/20 via-[#0F1115]/80 to-[#0F1115]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Badge className="bg-green-500/20 text-green-300 border-green-500/30 mb-6 px-4 py-1.5">
                Lắp Đặt Camera Giám Sát
              </Badge>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl text-white mb-6 leading-tight">
                An Toàn Tuyệt Đối,{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-teal-400">
                  Giám Sát 24/7
                </span>
              </h1>
              <p className="text-lg text-gray-400 mb-8 leading-relaxed">
                Hệ thống camera giám sát chuyên nghiệp, lắp đặt tận nơi, hình ảnh sắc nét, xem từ xa mọi lúc mọi nơi — bảo vệ toàn diện cho gia đình và doanh nghiệp của bạn.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/contact">
                  <Button className="bg-green-600 hover:bg-green-500 text-white border-0 px-8 h-12 rounded-xl shadow-lg shadow-green-500/25 hover:shadow-green-500/40 transition-all">
                    Khảo Sát Miễn Phí
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
                <a href="#packages">
                  <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 h-12 rounded-xl px-8">
                    Xem Bảng Giá
                  </Button>
                </a>
              </div>
            </motion.div>
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-16 pt-16 border-t border-white/10"
          >
            {[
              { value: "200+", label: "Hệ Thống Đã Lắp" },
              { value: "24/7", label: "Hỗ Trợ Kỹ Thuật" },
              { value: "4K", label: "Độ Phân Giải Cao" },
              { value: "2 Năm", label: "Bảo Hành Thiết Bị" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl text-green-400 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-[#0A0D11]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl text-white mb-4">Giải Pháp Toàn Diện</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Công nghệ hiện đại, lắp đặt chuyên nghiệp — an tâm tuyệt đối
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all"
              >
                <div className={`w-11 h-11 rounded-xl ${f.bg} flex items-center justify-center mb-4`}>
                  <f.icon className={`w-5 h-5 ${f.color}`} />
                </div>
                <h3 className="text-white mb-2">{f.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Applications */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl text-white mb-4">Ứng Dụng Đa Dạng</h2>
            <p className="text-gray-400">Phù hợp cho mọi nhu cầu giám sát</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {applications.map((app, i) => (
              <motion.div
                key={app.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative overflow-hidden rounded-2xl border border-white/10"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={app.img}
                    alt={app.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-60"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F1115] via-[#0F1115]/40 to-transparent" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <div className="text-2xl mb-2">{app.icon}</div>
                  <h3 className="text-white mb-1">{app.title}</h3>
                  <p className="text-xs text-gray-400 leading-relaxed">{app.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Brands */}
      <section className="py-16 bg-[#0A0D11]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm mb-8">Đối Tác & Thương Hiệu Camera Uy Tín</p>
          <div className="flex flex-wrap justify-center gap-4">
            {brands.map((brand) => (
              <div key={brand} className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-5 py-3">
                <Radio className="w-4 h-4 text-green-400" />
                <span className="text-gray-300 text-sm">{brand}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Packages */}
      <section id="packages" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl text-white mb-4">Bảng Giá Lắp Đặt</h2>
            <p className="text-gray-400">Giá đã bao gồm thiết bị, công lắp đặt và bảo hành</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {packages.map((pkg, i) => (
              <motion.div
                key={pkg.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative rounded-2xl p-6 border transition-all ${
                  pkg.highlight
                    ? "bg-green-600/10 border-green-500/50 shadow-xl shadow-green-500/10"
                    : "bg-white/5 border-white/10"
                }`}
              >
                {pkg.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-green-600 text-white border-0 px-4 py-1 shadow-lg shadow-green-500/30">
                      {pkg.badge}
                    </Badge>
                  </div>
                )}
                <div className="mb-6">
                  <Badge className="bg-white/10 text-gray-300 border-0 text-xs mb-3">
                    <Camera className="w-3 h-3 mr-1" />
                    {pkg.cameras}
                  </Badge>
                  <h3 className="text-white mb-2">{pkg.name}</h3>
                  <div className="flex items-end gap-1">
                    <span className="text-3xl text-white">{pkg.price}</span>
                    {pkg.price !== "Báo Giá" && <span className="text-gray-500 mb-1">đ</span>}
                  </div>
                </div>
                <ul className="space-y-3 mb-8">
                  {pkg.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2.5 text-sm text-gray-300">
                      <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0 mt-0.5" />
                      {feat}
                    </li>
                  ))}
                </ul>
                <Link to="/contact">
                  <Button
                    className={`w-full rounded-xl border-0 h-11 ${
                      pkg.highlight
                        ? "bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-500/25"
                        : "bg-white/10 hover:bg-white/20 text-white"
                    }`}
                  >
                    {pkg.cta}
                    <ChevronRight className="ml-1 w-4 h-4" />
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 bg-[#0A0D11]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl text-white mb-4">Quy Trình Lắp Đặt</h2>
            <p className="text-gray-400">Nhanh chóng, chuyên nghiệp, hoàn thành trong ngày</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {process.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                  <p.icon className="w-6 h-6 text-green-400" />
                </div>
                <div className="text-xs text-green-500/70 mb-2">BƯỚC {i + 1}</div>
                <h3 className="text-white mb-2">{p.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-green-900/40 to-teal-900/20 border border-green-500/20 rounded-3xl p-12"
          >
            <div className="w-16 h-16 rounded-2xl bg-green-500/20 flex items-center justify-center mx-auto mb-6">
              <Shield className="w-8 h-8 text-green-400" />
            </div>
            <h2 className="text-3xl text-white mb-4">Bảo Vệ Ngay Hôm Nay</h2>
            <p className="text-gray-400 mb-8 max-w-lg mx-auto">
              Liên hệ để được khảo sát miễn phí và nhận báo giá tốt nhất cho hệ thống camera giám sát của bạn.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact">
                <Button className="bg-green-600 hover:bg-green-500 text-white border-0 px-10 h-12 rounded-xl shadow-lg shadow-green-500/25 hover:shadow-green-500/40 transition-all">
                  Khảo Sát Miễn Phí
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <a href="tel:0901234567">
                <Button variant="outline" className="border-green-500/30 text-green-300 hover:bg-green-500/10 h-12 rounded-xl px-8">
                  <Phone className="mr-2 w-4 h-4" />
                  Gọi Ngay: 090 123 4567
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
