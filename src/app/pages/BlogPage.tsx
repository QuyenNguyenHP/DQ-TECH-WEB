import { useState, useEffect } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import { Calendar, Clock, Tag, ArrowRight, Search } from "lucide-react";
import { fetchBlogs } from "../lib/contentApi";

export function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [blogPosts, setBlogPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBlogs()
      .then((items) => setBlogPosts(items))
      .catch((error) => console.error("Failed to load blogs", error))
      .finally(() => setIsLoading(false));
  }, []);

  const blogCategories = [
    { id: "all", label: "Tất cả", count: blogPosts.length },
    { id: "laptop", label: "Laptop", count: blogPosts.filter((post) => post.category === "laptop").length },
    { id: "website", label: "Website", count: blogPosts.filter((post) => post.category === "website").length },
    { id: "camera", label: "Camera", count: blogPosts.filter((post) => post.category === "camera").length },
    { id: "tech-tips", label: "Mẹo Tech", count: blogPosts.filter((post) => post.category === "tech-tips").length },
  ];

  const filteredPosts = blogPosts.filter((post) => {
    const matchesCategory = selectedCategory === "all" || post.category === selectedCategory;
    const matchesSearch =
      searchQuery === "" ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const categoryColors: Record<string, string> = {
    laptop: "text-[#3B82F6] bg-blue-500/10 border-blue-500/20",
    website: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    camera: "text-green-400 bg-green-500/10 border-green-500/20",
    "tech-tips": "text-amber-400 bg-amber-500/10 border-amber-500/20",
  };

  return (
    <div className="bg-[#0F1115] min-h-screen">
      {/* Hero */}
      <section className="relative py-20 bg-[#0A0D11] overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:64px_64px]" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-[#3B82F6]/10 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <p className="text-[#3B82F6] font-semibold text-sm uppercase tracking-widest mb-3">
              Blog & Tin Tức
            </p>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
              Chia Sẻ Kiến Thức Công Nghệ
            </h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Khám phá các bài viết hữu ích về laptop, thiết kế website, camera giám sát và nhiều mẹo công nghệ khác
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters & Search */}
      <section className="py-8 border-b border-white/10 bg-[#0F1115]/50 sticky top-16 lg:top-20 z-40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Categories */}
            <div className="flex flex-wrap gap-2 justify-center md:justify-start">
              {blogCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    selectedCategory === cat.id
                      ? "bg-[#3B82F6] text-white shadow-lg shadow-blue-500/30"
                      : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10"
                  }`}
                >
                  {cat.label} ({cat.count})
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Tìm kiếm bài viết..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full md:w-64 pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#3B82F6] focus:bg-white/10 transition-all"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="text-center py-20">
              <p className="text-gray-400">Đang tải bài viết...</p>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400">Không tìm thấy bài viết nào phù hợp.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group bg-white/5 rounded-2xl border border-white/10 overflow-hidden hover:border-[#3B82F6]/40 hover:shadow-xl hover:shadow-blue-500/10 transition-all"
                >
                  {/* Image */}
                  <Link to={`/blog/${post.slug}`} className="block relative aspect-[16/9] overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div
                      className={`absolute top-3 left-3 px-3 py-1.5 rounded-lg text-xs font-semibold border ${
                        categoryColors[post.category]
                      }`}
                    >
                      {blogCategories.find((c) => c.id === post.category)?.label}
                    </div>
                  </Link>

                  {/* Content */}
                  <div className="p-6">
                    {/* Meta */}
                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(post.date).toLocaleDateString("vi-VN")}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {post.readTime}
                      </span>
                    </div>

                    {/* Title */}
                    <Link to={`/blog/${post.slug}`}>
                      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#3B82F6] transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                    </Link>

                    {/* Excerpt */}
                    <p className="text-sm text-gray-400 mb-4 line-clamp-3">{post.excerpt}</p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 text-xs text-gray-500 bg-white/5 px-2 py-1 rounded-lg"
                        >
                          <Tag className="w-3 h-3" />
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Read More */}
                    <Link
                      to={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-1.5 text-sm text-[#3B82F6] group-hover:gap-2.5 transition-all"
                    >
                      Đọc thêm <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
