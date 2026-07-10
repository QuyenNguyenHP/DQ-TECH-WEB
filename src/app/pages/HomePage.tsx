import { useState, useEffect } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import {
  Battery, ShieldCheck, Cpu, Wrench,
  Star, ArrowRight, ChevronLeft, ChevronRight,
  CheckCircle2, Zap, HeartHandshake, Award,
  Laptop, Globe, Camera, Calendar, Clock, Tag,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { ProductCard } from "../components/ProductCard";
import { testimonials } from "../data/products";
import { fetchContentBootstrap } from "../lib/contentApi";

const trustBadges = [
  { icon: Battery, label: "Kiểm Tra Pin", desc: "Đo sức khỏe pin từng máy" },
  { icon: Cpu, label: "Kiểm Tra Phần Cứng", desc: "Chạy chẩn đoán đầy đủ mỗi máy" },
  { icon: ShieldCheck, label: "Bảo Hành Đi Kèm", desc: "Tối đa 3 tháng bảo hành" },
  { icon: Wrench, label: "Có Thể Nâng Cấp", desc: "Hỗ trợ mở rộng RAM & SSD" },
];

const categoryColors: Record<string, string> = {
  laptop: "text-[#3B82F6] bg-blue-500/10 border-blue-500/20",
  website: "text-purple-400 bg-purple-500/10 border-purple-500/20",
  camera: "text-green-400 bg-green-500/10 border-green-500/20",
  "tech-tips": "text-amber-400 bg-amber-500/10 border-amber-500/20",
};

const heroSlides = [
  {
    id: "laptop",
    badge: "Được tin dùng bởi 500+ khách hàng",
    title: (
      <>
        Laptop Cũ
        <br />
        <span className="text-[#3B82F6]">Cao Cấp</span>
        <br />
        Đã Kiểm Tra,
        <br />
        <span className="text-gray-400">Sẵn Sàng Dùng</span>
      </>
    ),
    description:
      "Mỗi chiếc laptop đều được kiểm tra, phân loại và đo pin trước khi đăng bán. Mua công nghệ cao cấp với giá trung thực — kèm bảo hành.",
    primaryCTA: { label: "Xem Laptop", to: "/laptops" },
    secondaryCTA: { label: "Liên Hệ", to: "/contact" },
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop",
    glowColor: "bg-[#3B82F6]/20",
    accentColor: "text-[#3B82F6]",
    type: "product-showcase",
  },
  {
    id: "website",
    badge: "Công nghệ hiện đại & tối ưu SEO",
    title: (
      <>
        Thiết Kế
        <br />
        <span className="text-purple-400">Website</span>
        <br />
        Chuyên Nghiệp
      </>
    ),
    description:
      "Biến ý tưởng của bạn thành website tuyệt đẹp với công nghệ hiện đại nhất. Từ landing page đơn giản đến thương mại điện tử.",
    primaryCTA: { label: "Xem Dịch Vụ", to: "/thiet-ke-website" },
    secondaryCTA: { label: "Tư Vấn Miễn Phí", to: "/contact" },
    image: "https://images.unsplash.com/photo-1547658719-da2b51169166?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    glowColor: "bg-purple-500/20",
    accentColor: "text-purple-400",
    type: "service",
  },
  {
    id: "camera",
    badge: "Bảo vệ tài sản 24/7",
    title: (
      <>
        Camera
        <br />
        <span className="text-green-400">Giám Sát</span>
        <br />
        An Toàn Tuyệt Đối
      </>
    ),
    description:
      "Lắp đặt hệ thống camera chuyên nghiệp cho nhà ở và doanh nghiệp. Hình ảnh 4K sắc nét, xem từ xa qua điện thoại mọi lúc mọi nơi.",
    primaryCTA: { label: "Xem Giải Pháp", to: "/camera-giam-sat" },
    secondaryCTA: { label: "Khảo Sát Miễn Phí", to: "/contact" },
    image: "https://images.unsplash.com/photo-1496368077930-c1e31b4e5b44?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
    glowColor: "bg-green-500/20",
    accentColor: "text-green-400",
    type: "service",
  },
];

export function HomePage() {
  const [heroSlideIdx, setHeroSlideIdx] = useState(0);
  const [carouselIdx, setCarouselIdx] = useState(0);
  const [products, setProducts] = useState<any[]>([]);
  const [blogPosts, setBlogPosts] = useState<any[]>([]);

  // Load data from localStorage or use defaults
  useEffect(() => {
    fetchContentBootstrap()
      .then((data) => {
        setProducts(data.products);
        setBlogPosts(data.blogs);
      })
      .catch((error) => {
        console.error("Failed to load homepage content", error);
      });
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setHeroSlideIdx((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const featuredProducts = products.filter((p) => p.featured);
  const perPage = 3;
  const maxCarousel = Math.max(0, Math.ceil(products.length / perPage) - 1);

  const currentHeroSlide = heroSlides[heroSlideIdx];

  const handlePrevSlide = () => {
    setHeroSlideIdx((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1));
  };

  const handleNextSlide = () => {
    setHeroSlideIdx((prev) => (prev + 1) % heroSlides.length);
  };

  return (
    <div className="bg-white dark:bg-[#0F1115]">
      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-[#0F1115]">
        {/* Background grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:64px_64px]" />

        {/* Animated glow that changes color per slide */}
        <div className={`absolute top-1/3 right-1/4 w-96 h-96 ${currentHeroSlide.glowColor} rounded-full blur-3xl pointer-events-none transition-all duration-1000`} />
        <div className={`absolute bottom-1/4 left-1/4 w-64 h-64 ${currentHeroSlide.glowColor} rounded-full blur-3xl pointer-events-none transition-all duration-1000`} />

        {/* Navigation Arrows */}
        <button
          onClick={handlePrevSlide}
          className="absolute left-2 sm:left-4 lg:left-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
        <button
          onClick={handleNextSlide}
          className="absolute right-2 sm:right-4 lg:right-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 pb-12 sm:pb-16 grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Text */}
          <div className="text-center lg:text-left">
            <motion.div
              key={`badge-${heroSlideIdx}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 mb-4 sm:mb-6"
            >
              <div className={`w-1.5 h-1.5 rounded-full ${currentHeroSlide.accentColor.replace('text-', 'bg-')} animate-pulse`} />
              <span className={`text-[10px] sm:text-xs ${currentHeroSlide.accentColor} font-semibold tracking-wide uppercase`}>
                {currentHeroSlide.badge}
              </span>
            </motion.div>

            <motion.h1
              key={`title-${heroSlideIdx}`}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white leading-[1.05] tracking-tight mb-4 sm:mb-6"
            >
              {currentHeroSlide.title}
            </motion.h1>

            <motion.p
              key={`desc-${heroSlideIdx}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="text-gray-400 text-base sm:text-lg leading-relaxed mb-6 sm:mb-8 max-w-md mx-auto lg:mx-0"
            >
              {currentHeroSlide.description}
            </motion.p>

            <motion.div
              key={`cta-${heroSlideIdx}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="flex flex-col sm:flex-row flex-wrap gap-3 justify-center lg:justify-start"
            >
              <Link to={currentHeroSlide.primaryCTA.to}>
                <Button className={`w-full sm:w-auto ${currentHeroSlide.accentColor.replace('text-', 'bg-')} hover:opacity-90 text-white border-0 px-6 py-3 rounded-xl shadow-xl hover:shadow-2xl transition-all text-sm sm:text-base`}>
                  {currentHeroSlide.primaryCTA.label}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link to={currentHeroSlide.secondaryCTA.to}>
                <Button
                  variant="outline"
                  className="w-full sm:w-auto border-white/20 text-white hover:bg-white/10 hover:border-white/30 px-6 py-3 rounded-xl text-sm sm:text-base backdrop-blur-sm bg-transparent"
                >
                  {currentHeroSlide.secondaryCTA.label}
                </Button>
              </Link>
            </motion.div>

            {/* Quick stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex items-center justify-center lg:justify-start gap-4 sm:gap-6 md:gap-8 mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-white/10"
            >
              {[
                { num: "500+", label: "Khách Hàng" },
                { num: heroSlideIdx === 0 ? "100+" : "3", label: heroSlideIdx === 0 ? "Laptop" : "Dịch Vụ" },
                { num: "4.9★", label: "Đánh Giá" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-xl sm:text-2xl font-bold text-white">{stat.num}</p>
                  <p className="text-[10px] sm:text-xs text-gray-500">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Visual showcase */}
          <div className="relative mt-8 lg:mt-0">
            <div className="relative">
              {/* Glow behind image */}
              <div className={`absolute inset-0 ${currentHeroSlide.glowColor} rounded-2xl sm:rounded-3xl blur-2xl scale-110 transition-all duration-1000`} />
              <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-black/50 aspect-[4/3]">
                {/* Slide images */}
                {heroSlides.map((slide, i) => (
                  <motion.img
                    key={slide.id}
                    src={slide.image}
                    alt={slide.id}
                    initial={false}
                    animate={{
                      opacity: i === heroSlideIdx ? 1 : 0,
                      scale: i === heroSlideIdx ? 1 : 1.1,
                    }}
                    transition={{ duration: 0.7 }}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ))}

                {/* Overlay gradient */}
                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
                  <p className={`${currentHeroSlide.accentColor} text-[10px] sm:text-xs font-semibold uppercase tracking-widest mb-1`}>
                    {currentHeroSlide.id === "laptop" ? featuredProducts[0]?.brand : currentHeroSlide.id}
                  </p>
                  <p className="text-white text-sm sm:text-base font-bold">
                    {currentHeroSlide.id === "laptop"
                      ? featuredProducts[0]?.name
                      : currentHeroSlide.id === "website"
                      ? "Thiết Kế Website Chuyên Nghiệp"
                      : "Hệ Thống Camera Giám Sát"}
                  </p>
                </div>
              </div>

              {/* Slide dots */}
              <div className="flex items-center justify-center gap-2 mt-4">
                {heroSlides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setHeroSlideIdx(i)}
                    className={`rounded-full transition-all ${
                      i === heroSlideIdx
                        ? `w-6 h-2 ${currentHeroSlide.accentColor.replace('text-', 'bg-')}`
                        : "w-2 h-2 bg-white/20"
                    }`}
                  />
                ))}
              </div>

              {/* Floating badge - hidden on mobile */}
              {currentHeroSlide.id === "laptop" && (
                <>
                  <div className="hidden sm:block absolute -top-4 -right-4 bg-green-500/90 backdrop-blur-sm text-white px-3 py-2 rounded-xl shadow-lg border border-green-400/20 text-xs sm:text-sm font-semibold">
                    ✓ Đã Kiểm Tra Pin
                  </div>
                  <div className="hidden sm:flex absolute -bottom-4 -left-4 bg-white/10 backdrop-blur-sm text-white px-3 py-2 rounded-xl border border-white/20 shadow-lg text-xs sm:text-sm">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#3B82F6]" />
                      <span>Có Bảo Hành</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section className="py-16 sm:py-20 bg-[#0A0D11]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-xs sm:text-sm text-[#3B82F6] font-semibold uppercase tracking-widest mb-2 sm:mb-3">Dịch Vụ Của Chúng Tôi</p>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl text-white mb-3 sm:mb-4">Giải Pháp Công Nghệ Toàn Diện</h2>
              <p className="text-sm sm:text-base text-gray-400 max-w-2xl mx-auto px-4">
                Không chỉ laptop — chúng tôi còn cung cấp dịch vụ thiết kế website và lắp đặt camera giám sát chuyên nghiệp
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 sm:gap-6">
            {/* Laptop */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0 }}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-8 hover:border-[#3B82F6]/40 hover:bg-[#3B82F6]/5 transition-all"
            >
              <div className="w-14 h-14 rounded-2xl bg-[#3B82F6]/10 flex items-center justify-center mb-6 group-hover:bg-[#3B82F6]/20 transition-all">
                <Laptop className="w-7 h-7 text-[#3B82F6]" />
              </div>
              <h3 className="text-white mb-3">Laptop Cũ Cao Cấp</h3>
              <p className="text-sm text-gray-400 leading-relaxed mb-6">
                Hơn 100 mẫu laptop đã qua kiểm định kỹ lưỡng — MacBook, ThinkPad, Dell XPS và nhiều hơn. Kèm bảo hành, pin đo sẵn, giao hàng tận nơi.
              </p>
              <ul className="space-y-2 mb-8">
                {["Kiểm tra toàn bộ phần cứng", "Đo sức khỏe pin", "Bảo hành 1–3 tháng"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-gray-400">
                    <CheckCircle2 className="w-4 h-4 text-[#3B82F6] flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/laptops">
                <span className="inline-flex items-center gap-1.5 text-sm text-[#3B82F6] group-hover:gap-2.5 transition-all">
                  Xem Tất Cả Laptop <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            </motion.div>

            {/* Website Design */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-8 hover:border-purple-500/40 hover:bg-purple-500/5 transition-all"
            >
              <div className="w-14 h-14 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-6 group-hover:bg-purple-500/20 transition-all">
                <Globe className="w-7 h-7 text-purple-400" />
              </div>
              <h3 className="text-white mb-3">Thiết Kế Website</h3>
              <p className="text-sm text-gray-400 leading-relaxed mb-6">
                Website đẹp, chuẩn SEO, tốc độ cao — xây dựng bằng công nghệ hiện đại nhất. Từ landing page đơn giản đến hệ thống e-commerce phức tạp.
              </p>
              <ul className="space-y-2 mb-8">
                {["Responsive trên mọi thiết bị", "Tối ưu tốc độ & SEO", "Hỗ trợ sau bàn giao"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-gray-400">
                    <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/thiet-ke-website">
                <span className="inline-flex items-center gap-1.5 text-sm text-purple-400 group-hover:gap-2.5 transition-all">
                  Tìm Hiểu Thêm <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            </motion.div>

            {/* Camera */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-8 hover:border-green-500/40 hover:bg-green-500/5 transition-all"
            >
              <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center mb-6 group-hover:bg-green-500/20 transition-all">
                <Camera className="w-7 h-7 text-green-400" />
              </div>
              <h3 className="text-white mb-3">Camera Giám Sát</h3>
              <p className="text-sm text-gray-400 leading-relaxed mb-6">
                Lắp đặt hệ thống camera chuyên nghiệp cho nhà ở, cửa hàng và doanh nghiệp. Hình ảnh 4K sắc nét, xem từ xa qua điện thoại 24/7.
              </p>
              <ul className="space-y-2 mb-8">
                {["Khảo sát & tư vấn miễn phí", "Lắp đặt hoàn thiện trong ngày", "Bảo hành thiết bị 2 năm"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-gray-400">
                    <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/camera-giam-sat">
                <span className="inline-flex items-center gap-1.5 text-sm text-green-400 group-hover:gap-2.5 transition-all">
                  Tìm Hiểu Thêm <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── TRUST BADGES ── */}
      <section className="py-14 bg-gray-50 dark:bg-[#0F1115]/80 border-y border-gray-200 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {trustBadges.map((badge, i) => (
              <motion.div
                key={badge.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-5 rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 shadow-sm hover:shadow-md hover:border-[#3B82F6]/30 transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-[#3B82F6]/10 flex items-center justify-center flex-shrink-0">
                  <badge.icon className="w-5 h-5 text-[#3B82F6]" />
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-sm font-semibold text-[#0F1115] dark:text-white">{badge.label}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{badge.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS CAROUSEL ── */}
      <section className="py-20 bg-white dark:bg-[#0F1115]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-[#3B82F6] font-semibold text-sm uppercase tracking-widest mb-2">
                Nổi Bật
              </p>
              <h2 className="text-3xl lg:text-4xl font-bold text-[#0F1115] dark:text-white">
                Lựa Chọn Hàng Đầu Tuần Này
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCarouselIdx((p) => Math.max(0, p - 1))}
                disabled={carouselIdx === 0}
                className="w-10 h-10 rounded-xl border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:border-[#3B82F6] hover:text-[#3B82F6] disabled:opacity-30 transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCarouselIdx((p) => Math.min(maxCarousel, p + 1))}
                disabled={carouselIdx === maxCarousel}
                className="w-10 h-10 rounded-xl border border-gray-200 dark:border-white/10 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:border-[#3B82F6] hover:text-[#3B82F6] disabled:opacity-30 transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products
              .slice(carouselIdx * perPage, carouselIdx * perPage + perPage)
              .map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/laptops">
              <Button
                variant="outline"
                className="border-gray-200 dark:border-white/10 text-[#0F1115] dark:text-white hover:border-[#3B82F6] hover:text-[#3B82F6] px-8 rounded-xl"
              >
                Xem Tất Cả Laptop
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── LATEST BLOG POSTS ── */}
      <section className="py-20 bg-gray-50 dark:bg-[#0F1115]/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-[#3B82F6] font-semibold text-sm uppercase tracking-widest mb-2">
                Blog & Tin Tức
              </p>
              <h2 className="text-3xl lg:text-4xl font-bold text-[#0F1115] dark:text-white">
                Bài Viết Mới Nhất
              </h2>
            </div>
            <Link
              to="/blog"
              className="hidden sm:flex items-center gap-2 text-sm text-[#3B82F6] hover:gap-3 transition-all"
            >
              Xem Tất Cả <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {blogPosts.slice(0, 4).map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group bg-white dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10 overflow-hidden hover:border-[#3B82F6]/40 hover:shadow-xl hover:shadow-blue-500/10 transition-all"
              >
                <Link to={`/blog/${post.slug}`} className="block relative aspect-[16/9] overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div
                    className={`absolute top-2 sm:top-3 left-2 sm:left-3 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-semibold border ${
                      categoryColors[post.category]
                    }`}
                  >
                    {post.category === "laptop"
                      ? "Laptop"
                      : post.category === "website"
                      ? "Website"
                      : post.category === "camera"
                      ? "Camera"
                      : "Mẹo Tech"}
                  </div>
                </Link>

                <div className="p-4 sm:p-5">
                  <div className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mb-3">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      <span className="hidden xs:inline">{new Date(post.date).toLocaleDateString("vi-VN")}</span>
                      <span className="xs:hidden">{new Date(post.date).toLocaleDateString("vi-VN", { day: '2-digit', month: '2-digit' })}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                      {post.readTime}
                    </span>
                  </div>

                  <Link to={`/blog/${post.slug}`}>
                    <h3 className="text-sm sm:text-base font-bold text-[#0F1115] dark:text-white mb-2 group-hover:text-[#3B82F6] transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                  </Link>

                  <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-3 sm:mb-4 line-clamp-2">{post.excerpt}</p>

                  <Link
                    to={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-[#3B82F6] group-hover:gap-2.5 transition-all"
                  >
                    Đọc thêm <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>

          <div className="text-center mt-8 sm:hidden">
            <Link to="/blog">
              <Button
                variant="outline"
                className="border-gray-200 dark:border-white/10 text-[#0F1115] dark:text-white hover:border-[#3B82F6] hover:text-[#3B82F6] px-8 rounded-xl"
              >
                Xem Tất Cả Blog
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-16 sm:py-20 bg-[#0F1115] relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#3B82F6]/8 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12">
            <p className="text-xs sm:text-sm text-[#3B82F6] font-semibold uppercase tracking-widest mb-2">
              Đánh Giá Khách Hàng
            </p>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
              Nhận Xét Thật Từ Khách Hàng Của Chúng Tôi
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-[#3B82F6]/30 transition-all"
              >
                {/* Stars */}
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed mb-5">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#3B82F6]/20 border border-[#3B82F6]/30 flex items-center justify-center flex-shrink-0">
                    <span className="text-[#3B82F6] text-xs font-bold">{t.avatar}</span>
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">{t.name}</p>
                    <p className="text-gray-500 text-xs">{t.role}</p>
                  </div>
                </div>
                <p className="text-xs text-[#3B82F6] mt-3 font-medium">Đã mua: {t.product}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="py-20 bg-white dark:bg-[#0F1115]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl bg-[#3B82F6] p-12 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:32px_32px]" />
            <div className="relative">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                Sẵn Sàng Tìm Laptop Của Bạn?
              </h2>
              <p className="text-blue-100 mb-8">
                Khám phá toàn bộ danh mục và lọc theo cấu hình, ngân sách và nhu cầu sử dụng.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Link to="/laptops">
                  <Button className="bg-white text-[#3B82F6] hover:bg-blue-50 border-0 px-8 py-3 rounded-xl font-semibold shadow-lg">
                    Xem Tất Cả Laptop
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button
                    variant="outline"
                    className="border-white/30 text-white hover:bg-white/10 px-8 py-3 rounded-xl bg-transparent"
                  >
                    Liên Hệ Ngay
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
