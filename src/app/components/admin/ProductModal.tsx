import { useEffect, useRef, useState } from "react";
import { X, Upload, Images } from "lucide-react";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { fetchUploadedAssets, uploadAsset, type UploadedAsset } from "../../lib/contentApi";
import { normalizeCatalogPriceVnd } from "../../lib/currency";

interface ProductModalProps {
  product?: any;
  onClose: () => void;
  onSave: (product: any) => Promise<void> | void;
}

export function ProductModal({ product, onClose, onSave }: ProductModalProps) {
  const [formData, setFormData] = useState({
    id: product?.id || `laptop-${Date.now()}`,
    name: product?.name || "",
    brand: product?.brand || "",
    price: String(product?.price != null ? normalizeCatalogPriceVnd(product.price) : ""),
    originalPrice: String(product?.originalPrice != null ? normalizeCatalogPriceVnd(product.originalPrice) : ""),
    condition: product?.condition || "Good",
    category: product?.category || "business",
    image: product?.image || "",
    images: product?.images?.length ? product.images : product?.image ? [product.image] : [],
    specs: {
      cpu: product?.specs?.cpu || "",
      ram: product?.specs?.ram || "",
      ssd: product?.specs?.ssd || "",
      gpu: product?.specs?.gpu || "",
      screen: product?.specs?.screen || "",
      os: product?.specs?.os || "",
      weight: product?.specs?.weight || "",
    },
    batteryHealth: String(product?.batteryHealth ?? ""),
    warranty: product?.warranty || "3 tháng",
    description: product?.description || "",
    featured: product?.featured || false,
    inStock: product?.inStock ?? true,
    accessories: product?.accessories || [],
  });

  const [imagePreview, setImagePreview] = useState(product?.image || "");
  const [accessoryInput, setAccessoryInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploadingMainImage, setUploadingMainImage] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [libraryAssets, setLibraryAssets] = useState<UploadedAsset[]>([]);
  const [loadingLibrary, setLoadingLibrary] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);
  const mainFileInputRef = useRef<HTMLInputElement>(null);
  const galleryFileInputRef = useRef<HTMLInputElement>(null);

  const loadLibraryAssets = async () => {
    try {
      setLoadingLibrary(true);
      setLibraryAssets(await fetchUploadedAssets("products"));
    } catch (error) {
      toast.error("Không tải được thư viện ảnh.");
      console.error(error);
    } finally {
      setLoadingLibrary(false);
    }
  };

  useEffect(() => {
    void loadLibraryAssets();
  }, []);

  const validateImageFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Vui lòng chọn file hình ảnh.");
      return false;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Kích thước ảnh phải nhỏ hơn 5MB.");
      return false;
    }

    return true;
  };

  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!validateImageFile(file)) return;

    try {
      setUploadingMainImage(true);
      const { url } = await uploadAsset(file, "products");
      setImagePreview(url);
      setFormData((prev) => ({
        ...prev,
        image: url,
        images: [url, ...prev.images.filter((item: string) => item !== url)].slice(0, 8),
      }));
      toast.success("Đã upload ảnh chính.");
      void loadLibraryAssets();
    } catch (error) {
      toast.error("Không upload được ảnh chính.");
      console.error(error);
    } finally {
      setUploadingMainImage(false);
      e.target.value = "";
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const validFiles = files.filter(validateImageFile);
    if (!validFiles.length) return;

    try {
      setUploadingGallery(true);
      const uploadedUrls: string[] = [];

      for (const file of validFiles) {
        const { url } = await uploadAsset(file, "products");
        uploadedUrls.push(url);
      }

      setFormData((prev) => {
        const merged = [...prev.images, ...uploadedUrls].filter(Boolean);
        const deduped = Array.from(new Set(merged));
        return {
          ...prev,
          image: prev.image || uploadedUrls[0] || "",
          images: deduped.slice(0, 8),
        };
      });

      if (!formData.image && uploadedUrls[0]) {
        setImagePreview(uploadedUrls[0]);
      }

      toast.success("Đã upload ảnh chi tiết.");
      void loadLibraryAssets();
    } catch (error) {
      toast.error("Không upload được ảnh chi tiết.");
      console.error(error);
    } finally {
      setUploadingGallery(false);
      e.target.value = "";
    }
  };

  const applySelectedImage = (url: string, mode: "main" | "gallery") => {
    setFormData((prev) => {
      if (mode === "main") {
        return {
          ...prev,
          image: url,
          images: [url, ...prev.images.filter((item: string) => item !== url)].slice(0, 8),
        };
      }

      const merged = Array.from(new Set([prev.image, ...prev.images, url].filter(Boolean)));
      return {
        ...prev,
        image: prev.image || url,
        images: merged.slice(0, 8),
      };
    });

    if (mode === "main") {
      setImagePreview(url);
    }

    setShowLibrary(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.brand || !formData.price) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc.");
      return;
    }

    const normalizedImage = formData.image.trim();
    const normalizedImages = [
      normalizedImage,
      ...formData.images.filter((item: string) => item && item !== normalizedImage),
    ].filter(Boolean);

    const productData = {
      ...formData,
      category: formData.category || "business",
      price: parseFloat(formData.price),
      originalPrice: parseFloat(formData.originalPrice || formData.price),
      batteryHealth: parseInt(formData.batteryHealth || "0", 10),
      image: normalizedImage,
      images: normalizedImages.length ? normalizedImages : [normalizedImage],
    };

    try {
      setSaving(true);
      await onSave(productData);
      toast.success(product ? "Đã cập nhật laptop." : "Đã thêm laptop mới.");
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-[#0F1115] border border-white/10 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-[#0F1115] border-b border-white/10 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">{product ? "Sửa laptop" : "Thêm laptop mới"}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Hình ảnh</label>
            <div className="flex gap-4">
              <div
                onClick={() => mainFileInputRef.current?.click()}
                className="w-32 h-32 rounded-xl border-2 border-dashed border-white/20 flex items-center justify-center cursor-pointer hover:border-[#3B82F6] transition-colors overflow-hidden group"
              >
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center">
                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2 group-hover:text-[#3B82F6]" />
                    <p className="text-xs text-gray-400">Upload</p>
                  </div>
                )}
              </div>
              <input
                ref={mainFileInputRef}
                type="file"
                accept="image/*"
                onChange={handleMainImageUpload}
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
                    const nextImage = e.target.value;
                    setFormData((prev) => ({
                      ...prev,
                      image: nextImage,
                      images: nextImage
                        ? [nextImage, ...prev.images.filter((item: string) => item !== nextImage)].slice(0, 8)
                        : prev.images,
                    }));
                    setImagePreview(nextImage);
                  }}
                  placeholder="/uploads/products/ten-file.jpg hoặc https://..."
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#3B82F6]"
                />
                {uploadingMainImage && <p className="text-xs text-gray-500 mt-2">Đang upload ảnh chính...</p>}
                {showLibrary && (
                  <div className="mt-3 rounded-xl border border-white/10 bg-white/5 p-3 space-y-3">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm text-gray-300">Ảnh trong `backend/uploads/products`</p>
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
                          <div key={asset.url} className="rounded-xl border border-white/10 overflow-hidden bg-black/20">
                            <img src={asset.url} alt={asset.name} className="w-full h-24 object-cover" />
                            <div className="p-2 space-y-2">
                              <p className="text-[11px] text-gray-400 truncate" title={asset.name}>
                                {asset.name}
                              </p>
                              <div className="grid grid-cols-2 gap-2">
                                <Button
                                  type="button"
                                  onClick={() => applySelectedImage(asset.url, "main")}
                                  className="bg-[#3B82F6] hover:bg-blue-500 text-white rounded-lg"
                                >
                                  Ảnh chính
                                </Button>
                                <Button
                                  type="button"
                                  onClick={() => applySelectedImage(asset.url, "gallery")}
                                  className="bg-white/5 border border-white/10 text-white hover:bg-white/10 rounded-lg"
                                >
                                  Gallery
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-300">Ảnh chi tiết sản phẩm</label>
              <Button
                type="button"
                onClick={() => galleryFileInputRef.current?.click()}
                className="bg-white/5 border border-white/10 text-white hover:bg-white/10 rounded-xl"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload ảnh chi tiết
              </Button>
              <input
                ref={galleryFileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleGalleryUpload}
                className="hidden"
              />
            </div>
            {uploadingGallery && <p className="text-xs text-gray-500 mb-2">Đang upload ảnh chi tiết...</p>}
            <div className="grid grid-cols-4 gap-3">
              {formData.images.map((imageUrl: string, index: number) => (
                <div key={`${imageUrl}-${index}`} className="relative rounded-xl overflow-hidden border border-white/10 bg-white/5">
                  <img src={imageUrl} alt={`Gallery ${index + 1}`} className="w-full h-24 object-cover" />
                  <div className="absolute inset-x-0 bottom-0 flex justify-between items-center px-2 py-1 bg-black/60 text-[10px] text-white">
                    <span>{index === 0 ? "Ảnh đầu" : `Ảnh ${index + 1}`}</span>
                    <button
                      type="button"
                      onClick={() => {
                        const nextImages = formData.images.filter((_: string, i: number) => i !== index);
                        const nextMain = index === 0 ? nextImages[0] || "" : formData.image;
                        setFormData((prev) => ({
                          ...prev,
                          image: nextMain,
                          images: nextImages,
                        }));
                        if (index === 0) {
                          setImagePreview(nextMain);
                        }
                      }}
                      className="text-red-300 hover:text-red-200"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Tên sản phẩm *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#3B82F6]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Thương hiệu *</label>
              <select
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                required
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#3B82F6] [&>option]:bg-[#0F1115] [&>option]:text-white"
              >
                <option value="">Chọn thương hiệu</option>
                <option value="Apple">Apple</option>
                <option value="Dell">Dell</option>
                <option value="Lenovo">Lenovo</option>
                <option value="HP">HP</option>
                <option value="MSI">MSI</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Giá hiện tại (VND) *</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#3B82F6]"
              />
              <p className="text-xs text-gray-500 mt-1">Nhập trực tiếp số tiền Việt Nam, ví dụ: 18990000</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Giá gốc (VND)</label>
              <input
                type="number"
                value={formData.originalPrice}
                onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#3B82F6]"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Tình trạng</label>
              <select
                value={formData.condition}
                onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#3B82F6] [&>option]:bg-[#0F1115] [&>option]:text-white"
              >
                <option value="Excellent">Tuyệt vời</option>
                <option value="Good">Tốt</option>
                <option value="Fair">Khá</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Pin (%)</label>
              <input
                type="number"
                value={formData.batteryHealth}
                onChange={(e) => setFormData({ ...formData, batteryHealth: e.target.value })}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#3B82F6]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Bảo hành</label>
              <input
                type="text"
                value={formData.warranty}
                onChange={(e) => setFormData({ ...formData, warranty: e.target.value })}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#3B82F6]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Mô tả</label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-[#3B82F6] resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Cấu hình</label>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="CPU"
                value={formData.specs.cpu}
                onChange={(e) => setFormData({ ...formData, specs: { ...formData.specs, cpu: e.target.value } })}
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#3B82F6]"
              />
              <input
                type="text"
                placeholder="RAM"
                value={formData.specs.ram}
                onChange={(e) => setFormData({ ...formData, specs: { ...formData.specs, ram: e.target.value } })}
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#3B82F6]"
              />
              <input
                type="text"
                placeholder="SSD"
                value={formData.specs.ssd}
                onChange={(e) => setFormData({ ...formData, specs: { ...formData.specs, ssd: e.target.value } })}
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#3B82F6]"
              />
              <input
                type="text"
                placeholder="GPU"
                value={formData.specs.gpu}
                onChange={(e) => setFormData({ ...formData, specs: { ...formData.specs, gpu: e.target.value } })}
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#3B82F6]"
              />
              <input
                type="text"
                placeholder="Màn hình"
                value={formData.specs.screen}
                onChange={(e) => setFormData({ ...formData, specs: { ...formData.specs, screen: e.target.value } })}
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#3B82F6]"
              />
              <input
                type="text"
                placeholder="Hệ điều hành"
                value={formData.specs.os}
                onChange={(e) => setFormData({ ...formData, specs: { ...formData.specs, os: e.target.value } })}
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#3B82F6]"
              />
              <input
                type="text"
                placeholder="Trọng lượng"
                value={formData.specs.weight}
                onChange={(e) => setFormData({ ...formData, specs: { ...formData.specs, weight: e.target.value } })}
                className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#3B82F6]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Phụ kiện đi kèm</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={accessoryInput}
                onChange={(e) => setAccessoryInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key !== "Enter") return;
                  e.preventDefault();
                  if (!accessoryInput.trim() || formData.accessories.includes(accessoryInput.trim())) return;
                  setFormData({ ...formData, accessories: [...formData.accessories, accessoryInput.trim()] });
                  setAccessoryInput("");
                }}
                placeholder="Nhập phụ kiện và Enter"
                className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-[#3B82F6]"
              />
              <Button
                type="button"
                onClick={() => {
                  if (!accessoryInput.trim() || formData.accessories.includes(accessoryInput.trim())) return;
                  setFormData({ ...formData, accessories: [...formData.accessories, accessoryInput.trim()] });
                  setAccessoryInput("");
                }}
                className="bg-white/5 border border-white/10 text-white hover:bg-white/10 rounded-xl"
              >
                Thêm
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.accessories.map((acc: string, idx: number) => (
                <span
                  key={`${acc}-${idx}`}
                  className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/10 text-green-400 rounded-lg text-sm border border-green-500/20"
                >
                  {acc}
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        accessories: formData.accessories.filter((_: string, i: number) => i !== idx),
                      })
                    }
                    className="hover:text-red-400 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <label className="flex items-center gap-2 text-sm text-gray-300">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-4 h-4 rounded border-white/10 bg-white/5 text-[#3B82F6] focus:ring-[#3B82F6]"
              />
              Sản phẩm nổi bật
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-300">
              <input
                type="checkbox"
                checked={formData.inStock}
                onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                className="w-4 h-4 rounded border-white/10 bg-white/5 text-[#3B82F6] focus:ring-[#3B82F6]"
              />
              Còn hàng
            </label>
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
              {saving ? "Đang lưu..." : product ? "Cập nhật" : "Thêm mới"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
