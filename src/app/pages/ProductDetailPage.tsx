import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { motion } from "motion/react";
import {
  Battery,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Phone,
  ArrowLeft,
  Check,
  Package,
  Cpu,
  HardDrive,
  Monitor,
  Weight,
  Zap,
  ArrowRight,
  Facebook,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { ProductCard } from "../components/ProductCard";
import { fetchProducts } from "../lib/contentApi";
import { formatCatalogPriceVnd } from "../lib/currency";

const conditionConfig = {
  Excellent: { label: "Tuyệt Vời", color: "text-green-600 dark:text-green-400", bg: "bg-green-50 dark:bg-green-500/10 border-green-200 dark:border-green-500/20", stars: 5 },
  Good: { label: "Tốt", color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20", stars: 4 },
  Fair: { label: "Khá", color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20", stars: 3 },
};

const batteryColor = (h: number) =>
  h >= 90 ? "text-green-500" : h >= 80 ? "text-blue-500" : "text-amber-500";
const batteryBg = (h: number) =>
  h >= 90 ? "bg-green-500" : h >= 80 ? "bg-blue-500" : "bg-amber-500";

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const product = products.find((p) => p.id === id);

  const [activeImage, setActiveImage] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  useEffect(() => {
    fetchProducts()
      .then((items) => setProducts(items))
      .catch((error) => console.error("Failed to load product detail", error))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0F1115] pt-20">
        <div className="text-center text-gray-500 dark:text-gray-400">Đang tải sản phẩm...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0F1115] pt-20">
        <div className="text-center">
          <p className="text-4xl mb-4">💻</p>
          <h2 className="text-xl font-bold text-[#0F1115] dark:text-white mb-2">Không tìm thấy laptop</h2>
          <p className="text-gray-500 mb-6">Máy này có thể đã được bán rồi.</p>
          <Button onClick={() => navigate("/laptops")} className="bg-[#3B82F6] text-white border-0 rounded-xl">
            Quay Lại Danh Sách
          </Button>
        </div>
      </div>
    );
  }

  const cond = conditionConfig[product.condition as keyof typeof conditionConfig];
  const related = products.filter((p) => p.id !== product.id && p.category === product.category).slice(0, 3);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  const specs = [
    { icon: Cpu, label: "Bộ Vi Xử Lý", value: product.specs.cpu },
    { icon: Zap, label: "RAM", value: product.specs.ram },
    { icon: HardDrive, label: "Ổ Cứng", value: product.specs.ssd },
    { icon: Monitor, label: "Màn Hình", value: product.specs.screen },
    { icon: Zap, label: "Card Đồ Họa", value: product.specs.gpu },
    { icon: Weight, label: "Trọng Lượng", value: product.specs.weight },
    { icon: Monitor, label: "Hệ Điều Hành", value: product.specs.os },
    { icon: Battery, label: "Pin", value: `${product.batteryHealth}% sức khỏe`, valueClassName: batteryColor(product.batteryHealth) },
  ];

  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  return (
    <div className="min-h-screen bg-white dark:bg-[#0F1115] pt-20">
      <div className="border-b border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-[#0F1115]/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link to="/" className="hover:text-[#3B82F6] transition-colors">Trang Chủ</Link>
            <span>/</span>
            <Link to="/laptops" className="hover:text-[#3B82F6] transition-colors">Laptop</Link>
            <span>/</span>
            <span className="text-[#0F1115] dark:text-white">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-[#3B82F6] text-sm mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay Lại
        </button>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <div className="space-y-4">
            <div
              className="relative rounded-2xl overflow-hidden border border-gray-200 dark:border-white/10 aspect-[4/3] bg-gray-50 dark:bg-white/5 cursor-zoom-in"
              onMouseEnter={() => setZoomed(true)}
              onMouseLeave={() => setZoomed(false)}
              onMouseMove={handleMouseMove}
            >
              <img
                src={product.images[activeImage]}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-100"
                style={
                  zoomed
                    ? {
                        transform: "scale(1.8)",
                        transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
                      }
                    : {}
                }
              />

              {product.images.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImage((p) => Math.max(0, p - 1))}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-all"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setActiveImage((p) => Math.min(product.images.length - 1, p + 1))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/60 transition-all"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold border ${cond.bg} ${cond.color}`}>
                {product.condition}
              </div>
              {!product.inStock && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-white font-bold text-xl">Hết Hàng</span>
                </div>
              )}
              {zoomed && (
                <div className="absolute bottom-3 right-3 text-xs text-white bg-black/50 px-2 py-1 rounded-lg">
                  Di chuột để phóng to
                </div>
              )}
            </div>

            <div className="flex gap-3">
              {product.images.map((img: string, i: number) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`w-20 h-16 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                    i === activeImage
                      ? "border-[#3B82F6] shadow-lg shadow-blue-500/20"
                      : "border-gray-200 dark:border-white/10 hover:border-[#3B82F6]/50"
                  }`}
                >
                  <img src={img} alt={`View ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
              <div className="flex items-center gap-2 flex-wrap mb-2">
                <span className="text-sm font-semibold text-[#3B82F6] uppercase tracking-widest">
                  {product.brand}
                </span>
                <span className="text-gray-300 dark:text-gray-600">·</span>
                <div className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${cond.bg} ${cond.color}`}>
                  Tình Trạng: {cond.label}
                </div>
              </div>

              <h1 className="text-3xl lg:text-4xl font-bold text-[#0F1115] dark:text-white mb-4">
                {product.name}
              </h1>

              <div className="flex items-baseline gap-3 mb-5">
                <span className="text-4xl font-black text-[#0F1115] dark:text-white">
                  {formatCatalogPriceVnd(product.price)}
                </span>
                <span className="text-xl text-gray-400 line-through">
                  {formatCatalogPriceVnd(product.originalPrice)}
                </span>
                <span className="px-2.5 py-1 rounded-full bg-red-50 dark:bg-red-500/10 text-red-500 text-sm font-bold border border-red-200 dark:border-red-500/20">
                  -{discount}% OFF
                </span>
              </div>

              <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">{product.description}</p>

              <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 mb-5">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Battery className={`w-4 h-4 ${batteryColor(product.batteryHealth)}`} />
                    <span className="text-sm font-semibold text-[#0F1115] dark:text-white">Sức Khỏe Pin</span>
                  </div>
                  <span className={`text-sm font-bold ${batteryColor(product.batteryHealth)}`}>
                    {product.batteryHealth}%
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${batteryBg(product.batteryHealth)}`}
                    style={{ width: `${product.batteryHealth}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1.5">
                  {product.batteryHealth >= 90
                    ? "Tuyệt vời - thời lượng pin như mới"
                    : product.batteryHealth >= 80
                      ? "Tốt - sử dụng hàng ngày bình thường, không vấn đề"
                      : "Khá - có thể cần sạc thường xuyên hơn"}
                </p>
              </div>

              <div className="flex items-center gap-3 p-4 rounded-2xl bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 mb-6">
                <ShieldCheck className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-green-700 dark:text-green-400">
                    Bảo hành {product.warranty}
                  </p>
                  <p className="text-xs text-green-600/70 dark:text-green-500/70">
                    Sửa chữa hoặc đổi máy miễn phí cho lỗi phần cứng
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Package className="w-4 h-4 text-gray-500" />
                  <span className="text-sm font-semibold text-[#0F1115] dark:text-white">Phụ Kiện Đi Kèm</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.accessories.map((acc: string) => (
                    <div
                      key={acc}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm text-gray-700 dark:text-gray-300"
                    >
                      <Check className="w-3 h-3 text-green-500" />
                      {acc}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                {product.inStock ? (
                  <>
                    <Link to="/contact">
                      <Button className="w-full bg-[#3B82F6] hover:bg-blue-600 text-white border-0 py-3.5 rounded-xl shadow-xl shadow-blue-500/25 hover:shadow-blue-500/40 transition-all text-base">
                        Liên Hệ Để Mua
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                    <div className="grid grid-cols-3 gap-2">
                      <a
                        href="https://zalo.me/0901234567"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-sm text-gray-700 dark:text-gray-300 hover:border-blue-400 hover:text-blue-500 transition-all"
                      >
                        <MessageCircle className="w-4 h-4" />
                        Zalo
                      </a>
                      <a
                        href="https://m.me/laptophubvn"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-sm text-gray-700 dark:text-gray-300 hover:border-blue-400 hover:text-blue-500 transition-all"
                      >
                        <Facebook className="w-4 h-4" />
                        Messenger
                      </a>
                      <a
                        href="tel:+84901234567"
                        className="flex items-center justify-center gap-2 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-sm text-gray-700 dark:text-gray-300 hover:border-green-400 hover:text-green-500 transition-all"
                      >
                        <Phone className="w-4 h-4" />
                        Gọi Điện
                      </a>
                    </div>
                  </>
                ) : (
                  <div className="p-4 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-center">
                    <p className="text-gray-500 font-medium mb-2">Sản phẩm hiện đã hết hàng</p>
                    <Link to="/contact">
                      <Button variant="outline" className="border-gray-200 dark:border-white/10 rounded-xl">
                        Báo Khi Có Hàng
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        <section className="mb-16">
          <h2 className="text-2xl font-bold text-[#0F1115] dark:text-white mb-6">Thông Số Kỹ Thuật</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {specs.map((spec, i) => (
              <div
                key={spec.label}
                className={`flex items-center gap-4 px-6 py-5 rounded-2xl border ${
                  i % 2 === 0
                    ? "bg-white dark:bg-white/2 border-gray-200 dark:border-white/10"
                    : "bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10"
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center flex-shrink-0">
                  <spec.icon className="w-4 h-4 text-[#3B82F6]" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{spec.label}</p>
                  <p className={`text-sm font-medium text-[#0F1115] dark:text-white ${spec.valueClassName ?? ""}`}>
                    {spec.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {related.length > 0 && (
          <section>
            <div className="flex items-end justify-between mb-6">
              <h2 className="text-2xl font-bold text-[#0F1115] dark:text-white">Bạn Cũng Có Thể Thích</h2>
              <Link
                to="/laptops"
                className="text-sm text-[#3B82F6] hover:text-blue-700 flex items-center gap-1 font-medium"
              >
                Xem tất cả <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
