import { useEffect, useRef, useState } from "react";
import { X, Upload, Images } from "lucide-react";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { fetchUploadedAssets, uploadAsset, type UploadedAsset } from "../../lib/contentApi";

interface BlogModalProps {
  blog?: any;
  onClose: () => void;
  onSave: (blog: any) => Promise<void> | void;
}

export function BlogModal({ blog, onClose, onSave }: BlogModalProps) {
  const [formData, setFormData] = useState({
    id: blog?.id || `${Date.now()}`,
    title: blog?.title || "",
    slug: blog?.slug || "",
    excerpt: blog?.excerpt || "",
    content: blog?.content || "",
    category: blog?.category || "laptop",
    author: blog?.author || "DQ TECH Team",
    date: blog?.date || new Date().toISOString().slice(0, 10),
    readTime: blog?.readTime || "5 phút đọc",
    image: blog?.image || "",
    tags: blog?.tags || [],
  });

  const [imagePreview, setImagePreview] = useState(blog?.image || "");
  const [tagInput, setTagInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [libraryAssets, setLibraryAssets] = useState<UploadedAsset[]>([]);
  const [loadingLibrary, setLoadingLibrary] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadLibraryAssets = async () => {
    try {
      setLoadingLibrary(true);
      setLibraryAssets(await fetchUploadedAssets("blogs"));
    } catch (error) {
      toast.error("Không tải được thư viện ảnh blog.");
      console.error(error);
    } finally {
      setLoadingLibrary(false);
    }
  };

  useEffect(() => {
    void loadLibraryAssets();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Vui lòng chọn file hình ảnh.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Kích thước ảnh phải nhỏ hơn 5MB.");
      return;
    }

    try {
      setUploadingImage(true);
      const { url } = await uploadAsset(file, "blogs");
      setImagePreview(url);
      setFormData((prev) => ({ ...prev, image: url }));
      toast.success("Đã upload ảnh bài viết.");
      void loadLibraryAssets();
    } catch (error) {
      toast.error("Không upload được ảnh bài viết.");
      console.error(error);
    } finally {
      setUploadingImage(false);
      e.target.value = "";
    }
  };

  const handleAddTag = () => {
    if (!tagInput.trim() || formData.tags.includes(tagInput.trim())) return;
    setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] });
    setTagInput("");
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter((item: string) => item !== tag) });
  };

  const generateSlug = (title: string) =>
    title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();

  const handleTitleChange = (title: string) => {
    setFormData((prev) => ({
      ...prev,
      title,
      slug: generateSlug(title),
    }));
  };

  const applySelectedImage = (url: string) => {
    setFormData((prev) => ({ ...prev, image: url }));
    setImagePreview(url);
    setShowLibrary(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.excerpt || !formData.content) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc.");
      return;
    }

    try {
      setSaving(true);
      await onSave({
        ...formData,
        image: formData.image.trim(),
      });
      toast.success(blog ? "Đã cập nhật bài viết." : "Đã thêm bài viết mới.");
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-[#0F1115] border border-white/10 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-[#0F1115] border-b border-white/10 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-bold text-white">{blog ? "Sửa bài viết" : "Thêm bài viết mới"}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Hình ảnh đại diện</label>
            <div className="flex gap-4">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-48 h-32 rounded-xl border-2 border-dashed border-white/20 flex items-center justify-center cursor-pointer hover:border-[#3B82F6] transition-colors overflow-hidden group"
              >
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2 group-hover:text-[#3B82F6]" />
                    <p className="text-xs text-gray-400">Upload ảnh</p>
                  </div>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <div className="flex-1">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <p className="text-sm text-gray-400">Nhập đường dẫn ảnh hoặc chọn từ thư viện:</p>
                  <Button
                    type="button"
                    onClick={() => setShowLibrary((prev) => !prev)}
                    className="bg-white/5 border border-white/10 text-white hover:bg-white/10 rounded-xl"
                  >
                    <Images className="w-4 h-4 mr-2" />
                    Thư viện ảnh
                  </Button>
                </div>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => {
                    setFormData({ ...formData, image: e.target.value });
                    setImagePreview(e.target.value);
                  }}
                  placeholder="/uploads/blogs/ten-file.jpg hoặc https://..."
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#3B82F6]"
                />
                {uploadingImage && <p className="text-xs text-gray-500 mt-2">Đang upload ảnh bài viết...</p>}
                {showLibrary && (
                  <div className="mt-3 rounded-xl border border-white/10 bg-white/5 p-3 space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm text-gray-300">Ảnh trong `backend/uploads/blogs`</p>
                      <Button
                        type="button"
                        onClick={() => void loadLibraryAssets()}
                        className="bg-white/5 border border-white/10 text-white hover:bg-white/10 rounded-xl"
                      >
                        Tải lại
                      </Button>
                    </div>
                    {loadingLibrary ? (
                      <p className="text-sm text-gray-500">Đang tải thư viện ảnh...</p>
                    ) : libraryAssets.length === 0 ? (
                      <p className="text-sm text-gray-500">Chưa có ảnh nào trong thư viện.</p>
                    ) : (
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-72 overflow-y-auto">
                        {libraryAssets.map((asset) => (
                          <button
                            key={asset.url}
                            type="button"
                            onClick={() => applySelectedImage(asset.url)}
                            className="rounded-xl border border-white/10 overflow-hidden bg-black/20 text-left hover:border-[#3B82F6] transition-colors"
                          >
                            <img src={asset.url} alt={asset.name} className="w-full h-24 object-cover" />
                            <div className="p-2">
                              <p className="text-[11px] text-gray-400 truncate" title={asset.name}>
                                {asset.name}
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Tiêu đề *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              required
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#3B82F6]"
            />
            <p className="text-xs text-gray-500 mt-1">Slug: {formData.slug}</p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Danh mục</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#3B82F6] [&>option]:bg-[#0F1115] [&>option]:text-white"
              >
                <option value="laptop">Laptop</option>
                <option value="website">Website</option>
                <option value="camera">Camera</option>
                <option value="tech-tips">Mẹo tech</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Ngày đăng</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#3B82F6]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Thời gian đọc</label>
              <input
                type="text"
                value={formData.readTime}
                onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#3B82F6]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Mô tả ngắn *</label>
            <textarea
              rows={3}
              value={formData.excerpt}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              required
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#3B82F6] resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Nội dung (Markdown) *</label>
            <textarea
              rows={12}
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              required
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#3B82F6] resize-none font-mono text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Tags</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key !== "Enter") return;
                  e.preventDefault();
                  handleAddTag();
                }}
                placeholder="Nhập tag và Enter"
                className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#3B82F6]"
              />
              <Button
                type="button"
                onClick={handleAddTag}
                className="bg-white/5 border border-white/10 text-white hover:bg-white/10 rounded-xl"
              >
                Thêm
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-2 px-3 py-1 bg-[#3B82F6]/10 text-[#3B82F6] rounded-lg text-sm border border-[#3B82F6]/20"
                >
                  {tag}
                  <button type="button" onClick={() => handleRemoveTag(tag)} className="hover:text-red-400 transition-colors">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="border-white/10 text-white hover:bg-white/5 rounded-xl"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="bg-[#3B82F6] hover:bg-blue-500 text-white border-0 rounded-xl shadow-lg shadow-blue-500/30"
            >
              {saving ? "Đang lưu..." : blog ? "Cập nhật" : "Thêm mới"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
