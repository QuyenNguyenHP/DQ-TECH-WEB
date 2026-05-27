import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
  ChevronUp,
  LayoutGrid,
  List,
  Laptop,
  CheckCircle2,
  Battery,
  ShieldCheck,
  Zap,
  HeartHandshake,
  Award,
} from "lucide-react";
import { ProductCard } from "../components/ProductCard";
import { Button } from "../components/ui/button";
import { fetchProducts } from "../lib/contentApi";
import { formatCatalogPriceVnd } from "../lib/currency";

const whyUs = [
  {
    icon: CheckCircle2,
    title: "Đánh giá trung thực",
    desc: "Mỗi laptop được phân loại rõ ràng theo tình trạng thực tế.",
  },
  {
    icon: Battery,
    title: "Cam kết sức khỏe pin",
    desc: "Pin được kiểm tra trước khi đăng bán để bạn dễ đánh giá.",
  },
  {
    icon: ShieldCheck,
    title: "Bảo hành cho từng máy",
    desc: "Tất cả laptop đều đi kèm bảo hành từ 1 đến 3 tháng.",
  },
  {
    icon: Zap,
    title: "Giao hàng nhanh",
    desc: "Hỗ trợ giao nhanh trong ngày với nội thành TP.HCM.",
  },
  {
    icon: HeartHandshake,
    title: "Tư vấn tận tình",
    desc: "Hỗ trợ trước và sau khi mua qua các kênh liên lạc phổ biến.",
  },
  {
    icon: Award,
    title: "500+ khách hàng hài lòng",
    desc: "Nhiều khách hàng quay lại và đánh giá tích cực cho dịch vụ.",
  },
];

const brands = ["Apple", "Dell", "Lenovo", "HP", "MSI"];
const ramList = ["8GB", "16GB", "32GB"];
const ssdList = ["256GB", "512GB", "1TB"];
const conditionList = [
  { value: "Excellent", label: "Tuyệt vời" },
  { value: "Good", label: "Tốt" },
  { value: "Fair", label: "Khá" },
];

type SortKey = "price-asc" | "price-desc" | "newest";

function FilterSection({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-100 dark:border-white/10 pb-4 mb-4 last:border-0 last:pb-0 last:mb-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full text-left mb-3"
      >
        <span className="text-sm font-semibold text-[#0F1115] dark:text-white">{title}</span>
        {open ? (
          <ChevronUp className="w-4 h-4 text-gray-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400" />
        )}
      </button>
      {open && <div>{children}</div>}
    </div>
  );
}

function CheckItem({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer group py-1">
      <div
        onClick={onChange}
        className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${
          checked
            ? "bg-[#3B82F6] border-[#3B82F6]"
            : "border-gray-300 dark:border-gray-600 group-hover:border-[#3B82F6]"
        }`}
      >
        {checked && (
          <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </div>
      <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-[#0F1115] dark:group-hover:text-white transition-colors">
        {label}
      </span>
    </label>
  );
}

export function ProductListingPage() {
  const [query, setQuery] = useState("");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [sortBy, setSortBy] = useState<SortKey>("newest");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedRam, setSelectedRam] = useState<string[]>([]);
  const [selectedSsd, setSelectedSsd] = useState<string[]>([]);
  const [selectedCondition, setSelectedCondition] = useState<string[]>([]);

  useEffect(() => {
    fetchProducts()
      .then((items) => setProducts(items))
      .catch((error) => console.error("Failed to load products", error))
      .finally(() => setIsLoading(false));
  }, []);

  const toggle = (arr: string[], setArr: React.Dispatch<React.SetStateAction<string[]>>, val: string) => {
    setArr((prev) => (prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]));
  };

  const filtered = useMemo(() => {
    let list = products;

    if (query) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.specs.cpu.toLowerCase().includes(q)
      );
    }

    if (selectedBrands.length) list = list.filter((p) => selectedBrands.includes(p.brand));
    if (selectedRam.length) list = list.filter((p) => selectedRam.some((r) => p.specs.ram.includes(r)));
    if (selectedSsd.length) list = list.filter((p) => selectedSsd.some((s) => p.specs.ssd.includes(s)));
    if (selectedCondition.length) list = list.filter((p) => selectedCondition.includes(p.condition));

    return [...list].sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      return 0;
    });
  }, [query, selectedBrands, selectedRam, selectedSsd, selectedCondition, products, sortBy]);

  const activeFilterCount =
    selectedBrands.length +
    selectedRam.length +
    selectedSsd.length +
    selectedCondition.length;

  const clearAll = () => {
    setSelectedBrands([]);
    setSelectedRam([]);
    setSelectedSsd([]);
    setSelectedCondition([]);
    setQuery("");
  };

  const FilterPanel = () => (
    <aside className="w-full">
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-bold text-[#0F1115] dark:text-white">Bộ lọc</h3>
        {activeFilterCount > 0 && (
          <button
            onClick={clearAll}
            className="text-xs text-[#3B82F6] hover:text-blue-700 flex items-center gap-1"
          >
            <X className="w-3 h-3" />
            Xóa tất cả ({activeFilterCount})
          </button>
        )}
      </div>

      <FilterSection title="Thương hiệu">
        {brands.map((brand) => (
          <CheckItem
            key={brand}
            label={brand}
            checked={selectedBrands.includes(brand)}
            onChange={() => toggle(selectedBrands, setSelectedBrands, brand)}
          />
        ))}
      </FilterSection>

      <FilterSection title="Tình trạng">
        {conditionList.map((cond) => (
          <CheckItem
            key={cond.value}
            label={cond.label}
            checked={selectedCondition.includes(cond.value)}
            onChange={() => toggle(selectedCondition, setSelectedCondition, cond.value)}
          />
        ))}
      </FilterSection>

      <FilterSection title="RAM">
        {ramList.map((ram) => (
          <CheckItem
            key={ram}
            label={ram}
            checked={selectedRam.includes(ram)}
            onChange={() => toggle(selectedRam, setSelectedRam, ram)}
          />
        ))}
      </FilterSection>

      <FilterSection title="SSD">
        {ssdList.map((ssd) => (
          <CheckItem
            key={ssd}
            label={ssd}
            checked={selectedSsd.includes(ssd)}
            onChange={() => toggle(selectedSsd, setSelectedSsd, ssd)}
          />
        ))}
      </FilterSection>
    </aside>
  );

  return (
    <div className="min-h-screen bg-white dark:bg-[#0F1115] pt-20">
      <div className="bg-gray-50 dark:bg-[#0F1115]/80 border-b border-gray-200 dark:border-white/10 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
            <span>Trang chủ</span>
            <span>/</span>
            <span className="text-[#3B82F6]">Tất cả laptop</span>
          </div>
          <h1 className="text-3xl font-bold text-[#0F1115] dark:text-white mb-2">Xem laptop</h1>
          <p className="text-gray-500 dark:text-gray-400">
            {products.length} laptop - tất cả đã kiểm tra, phân loại và có bảo hành
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm laptop, thương hiệu, cấu hình..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-[#0F1115] dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 transition-all text-sm"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2"
              >
                <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortKey)}
              className="pl-3 pr-8 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#0F1115] text-[#0F1115] dark:text-white text-sm focus:outline-none focus:border-[#3B82F6] cursor-pointer appearance-none [&>option]:bg-white dark:[&>option]:bg-[#0F1115] [&>option]:text-[#0F1115] dark:[&>option]:text-white"
            >
              <option value="newest">Mới nhất</option>
              <option value="price-asc">Giá: thấp đến cao</option>
              <option value="price-desc">Giá: cao đến thấp</option>
            </select>

            <div className="flex rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2.5 transition-all ${
                  viewMode === "grid"
                    ? "bg-[#3B82F6] text-white"
                    : "text-gray-500 hover:text-[#0F1115] dark:hover:text-white"
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2.5 transition-all ${
                  viewMode === "list"
                    ? "bg-[#3B82F6] text-white"
                    : "text-gray-500 hover:text-[#0F1115] dark:hover:text-white"
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            <Button
              variant="outline"
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden flex items-center gap-2 border-gray-200 dark:border-white/10 rounded-xl"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Bộ lọc
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-[#3B82F6] text-white text-xs flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </Button>
          </div>
        </div>

        <div className="flex gap-8">
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-white/10 p-5">
              <FilterPanel />
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Hiển thị <span className="font-semibold text-[#0F1115] dark:text-white">{filtered.length}</span> kết quả
              </p>
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <p className="text-gray-500 text-sm">Đang tải sản phẩm...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <Laptop className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-4" />
                <h3 className="text-lg font-semibold text-[#0F1115] dark:text-white mb-2">Không tìm thấy laptop</h3>
                <p className="text-gray-500 text-sm mb-4">Thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm.</p>
                <Button onClick={clearAll} className="bg-[#3B82F6] text-white border-0 rounded-xl">
                  Xóa bộ lọc
                </Button>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                <AnimatePresence mode="popLayout">
                  {filtered.map((product, i) => (
                    <motion.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: i * 0.04 }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <AnimatePresence mode="popLayout">
                  {filtered.map((product, i) => (
                    <motion.div
                      key={product.id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: i * 0.04 }}
                    >
                      <a
                        href={`/laptops/${product.id}`}
                        className="flex gap-5 bg-white dark:bg-white/3 rounded-2xl border border-gray-200 dark:border-white/10 overflow-hidden hover:border-[#3B82F6]/40 hover:shadow-lg hover:shadow-blue-500/5 transition-all p-4 group"
                      >
                        <div className="w-36 h-28 rounded-xl overflow-hidden flex-shrink-0 bg-gray-50 dark:bg-white/5">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-xs text-[#3B82F6] font-semibold mb-0.5">{product.brand}</p>
                              <h3 className="font-semibold text-[#0F1115] dark:text-white group-hover:text-[#3B82F6] transition-colors">
                                {product.name}
                              </h3>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <p className="text-lg font-bold text-[#0F1115] dark:text-white">
                                {formatCatalogPriceVnd(product.price)}
                              </p>
                              <p className="text-sm text-gray-400 line-through">
                                {formatCatalogPriceVnd(product.originalPrice)}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-1.5 mt-2">
                            {[product.specs.cpu, product.specs.ram, product.specs.ssd, product.specs.screen].map(
                              (spec) => (
                                <span
                                  key={spec}
                                  className="text-xs bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-md"
                                >
                                  {spec}
                                </span>
                              )
                            )}
                          </div>
                        </div>
                      </a>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileFiltersOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50 lg:hidden"
              onClick={() => setMobileFiltersOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-80 bg-white dark:bg-[#0F1115] z-50 overflow-y-auto p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg text-[#0F1115] dark:text-white">Bộ lọc</h3>
                <button onClick={() => setMobileFiltersOpen(false)}>
                  <X className="w-5 h-5 text-gray-500 hover:text-[#0F1115] dark:hover:text-white" />
                </button>
              </div>
              <FilterPanel />
              <div className="mt-6 pt-4 border-t border-gray-100 dark:border-white/10">
                <Button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="w-full bg-[#3B82F6] text-white border-0 rounded-xl"
                >
                  Xem {filtered.length} kết quả
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <section className="py-20 bg-gray-50 dark:bg-[#0F1115]/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-[#3B82F6] font-semibold text-sm uppercase tracking-widest mb-2">
              Tại sao chọn DQ TECH
            </p>
            <h2 className="text-3xl lg:text-4xl font-bold text-[#0F1115] dark:text-white mb-4">
              Tiêu chuẩn vàng cho laptop cũ
            </h2>
            <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
              Chúng tôi không chỉ bán lại laptop. Mỗi sản phẩm đều được kiểm tra và đánh giá trước khi đến tay khách hàng.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyUs.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="p-6 rounded-2xl bg-white dark:bg-white/3 border border-gray-100 dark:border-white/8 hover:border-[#3B82F6]/30 hover:shadow-lg hover:shadow-blue-500/5 transition-all group"
              >
                <div className="w-11 h-11 rounded-xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center mb-4 group-hover:bg-[#3B82F6]/15 transition-colors">
                  <item.icon className="w-5 h-5 text-[#3B82F6]" />
                </div>
                <h3 className="text-[#0F1115] dark:text-white font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
