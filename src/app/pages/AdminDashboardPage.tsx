import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router";
import { motion } from "motion/react";
import { LogOut, Laptop, FileText, LayoutDashboard, Plus, Edit, Trash2, Search } from "lucide-react";
import { Button } from "../components/ui/button";
import { isAuthenticated, logout } from "../utils/auth";
import { toast } from "sonner";
import { ProductModal } from "../components/admin/ProductModal";
import { BlogModal } from "../components/admin/BlogModal";
import {
  fetchProducts,
  fetchBlogs,
  createProduct,
  updateProduct,
  deleteProduct,
  createBlog,
  updateBlog,
  deleteBlog,
} from "../lib/contentApi";
import { formatCatalogPriceVnd } from "../lib/currency";

export function AdminDashboardPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"products" | "blogs">("products");

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/admin/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    logout();
    toast.success("Đã đăng xuất!");
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-[#0F1115]">
      <header className="bg-[#0A0D11] border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#3B82F6] rounded-xl flex items-center justify-center">
                <LayoutDashboard className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
                <p className="text-xs text-gray-400">DQ TECH</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link to="/">
                <Button variant="outline" className="border-white/10 text-white hover:bg-white/5 rounded-xl">
                  Xem website
                </Button>
              </Link>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="border-red-500/20 text-red-400 hover:bg-red-500/10 rounded-xl"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Đăng xuất
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-2 mb-8 bg-white/5 border border-white/10 rounded-xl p-1">
          <button
            onClick={() => setActiveTab("products")}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all ${
              activeTab === "products"
                ? "bg-[#3B82F6] text-white shadow-lg shadow-blue-500/30"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <Laptop className="w-4 h-4" />
            <span className="font-medium">Quản lý laptop</span>
          </button>
          <button
            onClick={() => setActiveTab("blogs")}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all ${
              activeTab === "blogs"
                ? "bg-[#3B82F6] text-white shadow-lg shadow-blue-500/30"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <FileText className="w-4 h-4" />
            <span className="font-medium">Quản lý blog</span>
          </button>
        </div>

        {activeTab === "products" && <ProductsManager />}
        {activeTab === "blogs" && <BlogsManager />}
      </div>
    </div>
  );
}

function ProductsManager() {
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setProducts(await fetchProducts());
    } catch (error) {
      toast.error("Không tải được danh sách laptop.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadProducts();
  }, []);

  const handleSaveProduct = async (product: any) => {
    try {
      if (editingProduct) {
        await updateProduct(product);
      } else {
        await createProduct(product);
      }
      await loadProducts();
      setShowModal(false);
      setEditingProduct(null);
    } catch (error) {
      toast.error("Không lưu được laptop.");
      console.error(error);
      throw error;
    }
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa laptop này?")) return;

    try {
      await deleteProduct(id);
      await loadProducts();
      toast.success("Đã xóa laptop!");
    } catch (error) {
      toast.error("Không xóa được laptop.");
      console.error(error);
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Danh sách laptop</h2>
          <p className="text-gray-400 text-sm mt-1">{products.length} sản phẩm</p>
        </div>
        <Button
          onClick={() => {
            setEditingProduct(null);
            setShowModal(true);
          }}
          className="bg-[#3B82F6] hover:bg-blue-500 text-white border-0 rounded-xl shadow-lg shadow-blue-500/30"
        >
          <Plus className="w-4 h-4 mr-2" />
          Thêm laptop mới
        </Button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Tìm kiếm laptop..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20"
        />
      </div>

      <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
        {loading ? (
          <div className="px-4 py-12 text-center text-gray-400">Đang tải dữ liệu...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/5 border-b border-white/10">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Sản phẩm</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Thương hiệu</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Giá</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-400 uppercase">Tình trạng</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-400 uppercase">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <img src={product.image} alt={product.name} className="w-12 h-12 rounded-lg object-cover bg-white/5" />
                        <span className="text-white font-medium">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-gray-400">{product.brand}</td>
                    <td className="px-4 py-4 text-white font-semibold">{formatCatalogPriceVnd(product.price)}</td>
                    <td className="px-4 py-4">
                      <span className="px-2 py-1 bg-green-500/10 text-green-400 text-xs font-medium rounded-lg border border-green-500/20">
                        {product.condition}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleEdit(product)} className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(product.id)} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <ProductModal
          product={editingProduct}
          onClose={() => {
            setShowModal(false);
            setEditingProduct(null);
          }}
          onSave={handleSaveProduct}
        />
      )}
    </div>
  );
}

function BlogsManager() {
  const [searchQuery, setSearchQuery] = useState("");
  const [blogs, setBlogs] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadBlogs = async () => {
    try {
      setLoading(true);
      setBlogs(await fetchBlogs());
    } catch (error) {
      toast.error("Không tải được danh sách bài viết.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadBlogs();
  }, []);

  const handleSaveBlog = async (blog: any) => {
    try {
      if (editingBlog) {
        await updateBlog(blog);
      } else {
        await createBlog(blog);
      }
      await loadBlogs();
      setShowModal(false);
      setEditingBlog(null);
    } catch (error) {
      toast.error("Không lưu được bài viết.");
      console.error(error);
      throw error;
    }
  };

  const handleEdit = (blog: any) => {
    setEditingBlog(blog);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa bài viết này?")) return;

    try {
      await deleteBlog(id);
      await loadBlogs();
      toast.success("Đã xóa bài viết!");
    } catch (error) {
      toast.error("Không xóa được bài viết.");
      console.error(error);
    }
  };

  const filteredBlogs = blogs.filter((blog) => blog.title.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Danh sách blog</h2>
          <p className="text-gray-400 text-sm mt-1">{blogs.length} bài viết</p>
        </div>
        <Button
          onClick={() => {
            setEditingBlog(null);
            setShowModal(true);
          }}
          className="bg-[#3B82F6] hover:bg-blue-500 text-white border-0 rounded-xl shadow-lg shadow-blue-500/30"
        >
          <Plus className="w-4 h-4 mr-2" />
          Thêm bài viết mới
        </Button>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Tìm kiếm bài viết..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20"
        />
      </div>

      {loading ? (
        <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-12 text-center text-gray-400">Đang tải dữ liệu...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredBlogs.map((blog) => (
            <motion.div
              key={blog.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-[#3B82F6]/40 transition-all group"
            >
              <div className="relative aspect-[16/9] overflow-hidden">
                <img src={blog.image} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute top-3 left-3 px-2 py-1 bg-[#3B82F6]/80 backdrop-blur-sm rounded-lg text-xs font-medium text-white">
                  {blog.category}
                </div>
              </div>

              <div className="p-4">
                <h3 className="text-white font-semibold mb-2 line-clamp-2">{blog.title}</h3>
                <p className="text-gray-400 text-sm mb-4 line-clamp-2">{blog.excerpt}</p>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">{new Date(blog.date).toLocaleDateString("vi-VN")}</span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleEdit(blog)} className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(blog.id)} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {showModal && (
        <BlogModal
          blog={editingBlog}
          onClose={() => {
            setShowModal(false);
            setEditingBlog(null);
          }}
          onSave={handleSaveBlog}
        />
      )}
    </div>
  );
}
