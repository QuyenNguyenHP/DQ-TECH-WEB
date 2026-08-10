import { Link } from "react-router";
import { Battery, ShieldCheck, ArrowRight, Tag } from "lucide-react";
import { Button } from "./ui/button";
import type { Product } from "../data/products";
import { formatCatalogPriceVnd } from "../lib/currency";

const conditionColor: Record<string, string> = {
  Excellent: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
  Good: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  Fair: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
};

const conditionLabel: Record<string, string> = {
  Excellent: "Tuyệt Vời",
  Good: "Tốt",
  Fair: "Khá",
};

const batteryColor = (health: number) => {
  if (health >= 90) return "text-green-500";
  if (health >= 80) return "text-blue-500";
  return "text-amber-500";
};

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  return (
    <Link
      to={`/laptops/${product.id}`}
      className="group block bg-white dark:bg-[#0F1115]/60 rounded-2xl border border-gray-200/80 dark:border-white/10 overflow-hidden hover:border-[#3B82F6]/40 hover:shadow-xl hover:shadow-blue-500/10 dark:hover:shadow-blue-500/5 transition-all duration-300"
    >
      <div className="relative overflow-hidden bg-gray-50 dark:bg-white/5 aspect-[4/3]">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${conditionColor[product.condition]}`}
          >
            {conditionLabel[product.condition]}
          </span>
          {discount > 0 && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-500 border border-red-500/20">
              <Tag className="w-3 h-3" />
              -{discount}%
            </span>
          )}
        </div>
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-semibold bg-black/60 px-4 py-2 rounded-lg text-sm">Hết Hàng</span>
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="mb-3">
          <p className="text-xs text-[#3B82F6] font-semibold uppercase tracking-wide mb-1">{product.brand}</p>
          <h3 className="text-[#0F1115] dark:text-white font-semibold leading-snug group-hover:text-[#3B82F6] transition-colors">
            {product.name}
          </h3>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-3">
          {[product.specs.cpu.split(" ").slice(0, 3).join(" "), product.specs.ram, product.specs.ssd].map((spec) => (
            <span
              key={spec}
              className="text-xs bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 px-2 py-0.5 rounded-md"
            >
              {spec}
            </span>
          ))}
        </div>

        <div className="flex items-center mb-4">
          <div className="flex items-center gap-1.5">
            <Battery className={`w-3.5 h-3.5 ${batteryColor(product.batteryHealth)}`} />
            <span className={`text-xs font-medium ${batteryColor(product.batteryHealth)}`}>Pin {product.batteryHealth}%</span>
          </div>
        </div>

        <div className="flex items-end justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold text-[#0F1115] dark:text-white">{formatCatalogPriceVnd(product.price)}</span>
              <span className="text-sm text-gray-400 line-through">{formatCatalogPriceVnd(product.originalPrice)}</span>
            </div>
            <div className="flex items-center gap-1 mt-0.5">
              <ShieldCheck className="w-3 h-3 text-green-500" />
              <span className="text-xs text-gray-500 dark:text-gray-400">Bảo hành {product.warranty}</span>
            </div>
          </div>
          <Button
            size="sm"
            className="rounded-lg bg-[#3B82F6] hover:bg-blue-600 text-white border-0 shadow-md shadow-blue-500/20 group-hover:shadow-blue-500/30 transition-all"
          >
            Xem
            <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-0.5 transition-transform" />
          </Button>
        </div>
      </div>
    </Link>
  );
}
