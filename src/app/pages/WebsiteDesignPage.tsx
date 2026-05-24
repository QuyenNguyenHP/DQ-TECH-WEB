import { Link } from "react-router";
import { motion } from "motion/react";
import {
  Globe, Code, Smartphone, Zap, Search, Shield, CheckCircle, ArrowRight,
  Star, Layers, BarChart, MessageSquare, ChevronRight, Monitor, Database, Server
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";

const features = [
  { icon: Smartphone, title: "Responsive Design", desc: "Hoàn hảo trên mọi thiết bị — máy tính, tablet, điện thoại", color: "text-purple-400", bg: "bg-purple-500/10" },
  { icon: Zap, title: "Tốc Độ Cao", desc: "Tối ưu performance, load time dưới 2 giây, Core Web Vitals đạt chuẩn", color: "text-yellow-400", bg: "bg-yellow-500/10" },
  { icon: Search, title: "Chuẩn SEO", desc: "Cấu trúc SEO kỹ thuật chuẩn, schema markup, sitemap tự động", color: "text-green-400", bg: "bg-green-500/10" },
  { icon: Shield, title: "Bảo Mật", desc: "HTTPS, chống DDoS, bảo vệ dữ liệu khách hàng tuyệt đối", color: "text-blue-400", bg: "bg-blue-500/10" },
  { icon: BarChart, title: "Phân Tích & Báo Cáo", desc: "Tích hợp Google Analytics, heatmap, theo dõi chuyển đổi", color: "text-orange-400", bg: "bg-orange-500/10" },
  { icon: MessageSquare, title: "Hỗ Trợ 24/7", desc: "Đội ngũ kỹ thuật hỗ trợ liên tục, bảo trì định kỳ", color: "text-pink-400", bg: "bg-pink-500/10" },
];

const packages = [
  {
    name: "Cơ Bản",
    price: "5.000.000",
    period: "dự án",
    badge: null,
    features: [
      "Thiết kế landing page 1 trang",
      "Responsive mobile-first",
      "SEO cơ bản (meta, title, alt)",
      "Tích hợp Google Maps",
      "Form liên hệ",
      "Bàn giao source code",
      "Hỗ trợ 30 ngày",
    ],
    cta: "Bắt Đầu",
    highlight: false,
  },
  {
    name: "Chuyên Nghiệp",
    price: "15.000.000",
    period: "dự án",
    badge: "Phổ Biến",
    features: [
      "Website đa trang (5-10 trang)",
      "Thiết kế UI/UX tùy chỉnh",
      "CMS quản lý nội dung",
      "SEO nâng cao + schema markup",
      "Tốc độ tải tối ưu",
      "Tích hợp mạng xã hội",
      "Google Analytics & Tag Manager",
      "SSL + bảo mật nâng cao",
      "Hỗ trợ 90 ngày",
    ],
    cta: "Chọn Gói Này",
    highlight: true,
  },
  {
    name: "Doanh Nghiệp",
    price: "Báo Giá",
    period: "theo yêu cầu",
    badge: null,
    features: [
      "Website không giới hạn trang",
      "E-commerce tích hợp thanh toán",
      "Thiết kế hệ thống design tokens",
      "Đa ngôn ngữ (i18n)",
      "API tích hợp bên thứ ba",
      "Dashboard quản trị tùy chỉnh",
      "Hiệu năng & CDN toàn cầu",
      "Bảo trì & cập nhật định kỳ",
      "Hỗ trợ ưu tiên không giới hạn",
    ],
    cta: "Liên Hệ Tư Vấn",
    highlight: false,
  },
];

const techStack = [
  { name: "React / Next.js", icon: Code, desc: "Frontend hiện đại" },
  { name: "Node.js", icon: Server, desc: "Backend mạnh mẽ" },
  { name: "PostgreSQL", icon: Database, desc: "Cơ sở dữ liệu" },
  { name: "Tailwind CSS", icon: Layers, desc: "UI nhất quán" },
  { name: "Vercel / VPS", icon: Globe, desc: "Hosting tốc độ cao" },
  { name: "Figma", icon: Monitor, desc: "Thiết kế chuyên nghiệp" },
];

const portfolio = [
  {
    name: "TechStore Pro",
    type: "E-commerce",
    img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&q=80",
    tags: ["React", "Next.js", "Stripe"],
  },
  {
    name: "MediCare Clinic",
    type: "Y Tế",
    img: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&q=80",
    tags: ["SEO", "CMS", "Booking"],
  },
  {
    name: "GreenFood Market",
    type: "Thực Phẩm",
    img: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=600&q=80",
    tags: ["Mobile-first", "PWA", "Payment"],
  },
];

const process = [
  { step: "01", title: "Tư Vấn & Phân Tích", desc: "Hiểu rõ mục tiêu, đối tượng khách hàng và yêu cầu kỹ thuật của bạn" },
  { step: "02", title: "Thiết Kế UI/UX", desc: "Tạo wireframe và mockup trên Figma, lấy phản hồi và chỉnh sửa" },
  { step: "03", title: "Phát Triển", desc: "Code frontend + backend với các công nghệ hiện đại, tối ưu hiệu năng" },
  { step: "04", title: "Kiểm Thử & Ra Mắt", desc: "QA toàn diện, test đa thiết bị, triển khai và bàn giao" },
];

export function WebsiteDesignPage() {
  return (
    <div className="min-h-screen bg-[#0F1115] text-white">
      {/* Hero */}
      <section className="relative pt-24 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1547658719-da2b51169166?w=1600&q=80"
            alt="Website design workspace"
            className="w-full h-full object-cover opacity-10"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-[#0F1115]/80 to-[#0F1115]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 mb-6 px-4 py-1.5">
                Dịch Vụ Thiết Kế Website
              </Badge>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl text-white mb-6 leading-tight">
                Website Đẹp,{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                  Chuyển Đổi Tốt
                </span>
              </h1>
              <p className="text-lg text-gray-400 mb-8 leading-relaxed">
                Chúng tôi thiết kế và phát triển website hiện đại, tối ưu SEO, tốc độ nhanh — giúp doanh nghiệp của bạn nổi bật và thu hút khách hàng 24/7.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/contact">
                  <Button className="bg-purple-600 hover:bg-purple-500 text-white border-0 px-8 h-12 rounded-xl shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all">
                    Nhận Báo Giá Miễn Phí
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
                <a href="#portfolio">
                  <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 h-12 rounded-xl px-8">
                    Xem Portfolio
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
              { value: "50+", label: "Dự Án Hoàn Thành" },
              { value: "98%", label: "Khách Hàng Hài Lòng" },
              { value: "<2s", label: "Tốc Độ Tải Trang" },
              { value: "5★", label: "Đánh Giá Trung Bình" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl text-purple-400 mb-1">{stat.value}</div>
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
            <h2 className="text-3xl text-white mb-4">Tại Sao Chọn Chúng Tôi?</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Mỗi website chúng tôi tạo ra đều được xây dựng với tiêu chuẩn kỹ thuật cao nhất
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
                className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/8 hover:border-white/20 transition-all"
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

      {/* Process */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl text-white mb-4">Quy Trình Làm Việc</h2>
            <p className="text-gray-400">Minh bạch, chuyên nghiệp từ đầu đến cuối</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {process.map((p, i) => (
              <motion.div
                key={p.step}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative"
              >
                {i < process.length - 1 && (
                  <div className="hidden lg:block absolute top-6 left-[calc(100%-12px)] w-full h-px border-t border-dashed border-purple-500/30 z-0" />
                )}
                <div className="relative bg-white/5 border border-white/10 rounded-2xl p-6">
                  <div className="text-4xl text-purple-500/30 mb-3">{p.step}</div>
                  <h3 className="text-white mb-2">{p.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{p.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-20 bg-[#0A0D11]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl text-white mb-4">Công Nghệ Sử Dụng</h2>
            <p className="text-gray-400">Luôn cập nhật công nghệ mới nhất và tốt nhất</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {techStack.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="bg-white/5 border border-white/10 rounded-xl p-4 text-center hover:border-purple-500/40 transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center mx-auto mb-3">
                  <t.icon className="w-5 h-5 text-purple-400" />
                </div>
                <p className="text-sm text-white">{t.name}</p>
                <p className="text-xs text-gray-500 mt-1">{t.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio */}
      <section id="portfolio" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl text-white mb-4">Portfolio</h2>
            <p className="text-gray-400">Một số dự án tiêu biểu chúng tôi đã thực hiện</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolio.map((p, i) => (
              <motion.div
                key={p.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5"
              >
                <div className="aspect-video overflow-hidden">
                  <img
                    src={p.img}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5">
                  <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-xs mb-3">{p.type}</Badge>
                  <h3 className="text-white mb-3">{p.name}</h3>
                  <div className="flex flex-wrap gap-2">
                    {p.tags.map((tag) => (
                      <span key={tag} className="text-xs px-2 py-1 bg-white/5 text-gray-400 rounded-lg border border-white/10">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-[#0A0D11]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl text-white mb-4">Bảng Giá Dịch Vụ</h2>
            <p className="text-gray-400">Lựa chọn gói phù hợp với nhu cầu và ngân sách của bạn</p>
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
                    ? "bg-purple-600/10 border-purple-500/50 shadow-xl shadow-purple-500/10"
                    : "bg-white/5 border-white/10"
                }`}
              >
                {pkg.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-purple-600 text-white border-0 px-4 py-1 shadow-lg shadow-purple-500/30">
                      {pkg.badge}
                    </Badge>
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="text-white mb-2">{pkg.name}</h3>
                  <div className="flex items-end gap-1">
                    <span className="text-3xl text-white">{pkg.price}</span>
                    {pkg.price !== "Báo Giá" && <span className="text-gray-500 mb-1">đ</span>}
                  </div>
                  <p className="text-sm text-gray-500">/ {pkg.period}</p>
                </div>
                <ul className="space-y-3 mb-8">
                  {pkg.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2.5 text-sm text-gray-300">
                      <CheckCircle className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                      {feat}
                    </li>
                  ))}
                </ul>
                <Link to="/contact">
                  <Button
                    className={`w-full rounded-xl border-0 h-11 ${
                      pkg.highlight
                        ? "bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-500/25"
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

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-purple-900/40 to-blue-900/20 border border-purple-500/20 rounded-3xl p-12"
          >
            <div className="flex justify-center mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              ))}
            </div>
            <h2 className="text-3xl text-white mb-4">Sẵn Sàng Bắt Đầu Dự Án?</h2>
            <p className="text-gray-400 mb-8 max-w-lg mx-auto">
              Liên hệ ngay để nhận tư vấn miễn phí và báo giá chi tiết theo yêu cầu của bạn.
            </p>
            <Link to="/contact">
              <Button className="bg-purple-600 hover:bg-purple-500 text-white border-0 px-10 h-12 rounded-xl shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all">
                Liên Hệ Tư Vấn Miễn Phí
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
