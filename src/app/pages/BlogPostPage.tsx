import { useEffect, useState } from "react";
import { useParams, Link, Navigate } from "react-router";
import { motion } from "motion/react";
import { Calendar, Clock, Tag, ArrowLeft, Share2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Button } from "../components/ui/button";
import { toast } from "sonner";
import { fetchBlogs } from "../lib/contentApi";

export function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs()
      .then((items) => setPosts(items))
      .catch((error) => console.error("Failed to load blog post", error))
      .finally(() => setLoading(false));
  }, []);

  const post = posts.find((p) => p.slug === slug);

  if (!loading && !post) {
    return <Navigate to="/blog" replace />;
  }

  if (loading) {
    return <div className="min-h-screen bg-[#0F1115] pt-20 text-white flex items-center justify-center">Đang tải bài viết...</div>;
  }

  const blogCategories = [
    { id: "laptop", label: "Laptop" },
    { id: "website", label: "Website" },
    { id: "camera", label: "Camera" },
    { id: "tech-tips", label: "Mẹo Tech" },
  ];

  const relatedPosts = posts
    .filter((p) => p.category === post.category && p.id !== post.id)
    .slice(0, 3);

  const categoryColors: Record<string, string> = {
    laptop: "text-[#3B82F6] bg-blue-500/10 border-blue-500/20",
    website: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    camera: "text-green-400 bg-green-500/10 border-green-500/20",
    "tech-tips": "text-amber-400 bg-amber-500/10 border-amber-500/20",
  };

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator
        .share({
          title: post.title,
          text: post.excerpt,
          url: url,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(url);
      toast.success("Đã sao chép link bài viết!");
    }
  };

  return (
    <div className="bg-[#0F1115] min-h-screen">
      {/* Hero */}
      <section className="relative py-20 bg-[#0A0D11] overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:64px_64px]" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#3B82F6]/10 rounded-full blur-3xl" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Quay lại Blog
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold mb-4 border ${
                categoryColors[post.category]
              }`}
            >
              {blogCategories.find((c) => c.id === post.category)?.label}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-6">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {new Date(post.date).toLocaleDateString("vi-VN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                {post.readTime}
              </span>
              <span>Bởi {post.author}</span>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 text-xs text-gray-500 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10"
                >
                  <Tag className="w-3 h-3" />
                  {tag}
                </span>
              ))}
            </div>

            <Button
              onClick={handleShare}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 rounded-xl"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Chia sẻ
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Featured Image */}
      <section className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
          >
            <img src={post.image} alt={post.title} className="w-full aspect-[16/9] object-cover" />
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="prose prose-invert prose-lg max-w-none
              prose-headings:text-white prose-headings:font-bold
              prose-h2:text-2xl prose-h2:mb-4 prose-h2:mt-8
              prose-h3:text-xl prose-h3:mb-3 prose-h3:mt-6
              prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-4
              prose-strong:text-white prose-strong:font-semibold
              prose-ul:text-gray-300 prose-ul:list-disc prose-ul:pl-6
              prose-li:mb-2
              prose-code:text-[#3B82F6] prose-code:bg-white/5 prose-code:px-2 prose-code:py-1 prose-code:rounded"
          >
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </motion.article>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 p-8 bg-[#3B82F6]/10 border border-[#3B82F6]/20 rounded-2xl text-center"
          >
            <h3 className="text-xl font-bold text-white mb-2">Cần Tư Vấn Thêm?</h3>
            <p className="text-gray-400 mb-4">
              Liên hệ DQ TECH để được hỗ trợ chi tiết hơn về laptop, website hoặc camera giám sát
            </p>
            <Link to="/contact">
              <Button className="bg-[#3B82F6] hover:bg-blue-500 text-white border-0 rounded-xl shadow-lg shadow-blue-500/30">
                Liên Hệ Ngay
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-16 border-t border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-white mb-8">Bài Viết Liên Quan</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  to={`/blog/${relatedPost.slug}`}
                  className="group bg-white/5 rounded-2xl border border-white/10 overflow-hidden hover:border-[#3B82F6]/40 hover:shadow-xl hover:shadow-blue-500/10 transition-all"
                >
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <img
                      src={relatedPost.image}
                      alt={relatedPost.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-[#3B82F6] transition-colors line-clamp-2">
                      {relatedPost.title}
                    </h3>
                    <p className="text-sm text-gray-400 line-clamp-2">{relatedPost.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
