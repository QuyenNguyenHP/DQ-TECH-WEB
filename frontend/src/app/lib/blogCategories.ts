// Single source of truth for blog categories (filters, badges, admin select).

export interface BlogCategory {
  id: string;
  label: string;
  /** Tailwind classes for the category badge. */
  color: string;
}

/** Current categories, in display order. */
export const BLOG_CATEGORIES: BlogCategory[] = [
  { id: "tech-tips", label: "Tech Tip", color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
  { id: "robotic", label: "Robotic", color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20" },
  { id: "ai", label: "AI", color: "text-green-400 bg-green-500/10 border-green-500/20" },
  { id: "laptop", label: "Laptop", color: "text-[#3B82F6] bg-blue-500/10 border-blue-500/20" },
];

/** Retired categories: old posts still show a badge but there is no filter for them. */
const LEGACY_CATEGORIES: BlogCategory[] = [
  { id: "website", label: "Website", color: "text-purple-400 bg-purple-500/10 border-purple-500/20" },
  { id: "camera", label: "Camera", color: "text-gray-300 bg-white/10 border-white/20" },
];

const FALLBACK_COLOR = "text-gray-300 bg-white/10 border-white/20";

export function getBlogCategory(id: string | undefined): BlogCategory {
  const found = [...BLOG_CATEGORIES, ...LEGACY_CATEGORIES].find((c) => c.id === id);
  return found ?? { id: id ?? "", label: id || "Khác", color: FALLBACK_COLOR };
}

export function isLegacyBlogCategory(id: string | undefined): boolean {
  return !BLOG_CATEGORIES.some((c) => c.id === id);
}
