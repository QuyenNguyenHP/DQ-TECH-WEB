import { useEffect, useRef, useState } from "react";
import { Images, Trash2, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { deleteUploadedAsset, fetchUploadedAssets, uploadAsset, type UploadedAsset } from "../../lib/contentApi";
import { normalizeCatalogPriceVnd } from "../../lib/currency";
import { Button } from "../ui/button";

interface ProductModalProps {
  product?: any;
  onClose: () => void;
  onSave: (product: any) => Promise<void> | void;
  onAssetsChanged?: () => Promise<void> | void;
}

export function ProductModal({ product, onClose, onSave, onAssetsChanged }: ProductModalProps) {
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
    customerName: product?.customerName || "",
    customerPhone: product?.customerPhone || "",
    sellerName: product?.sellerName || "",
    soldAt: product?.soldAt || "",
    accessories: product?.accessories || [],
  });

  const [imagePreview, setImagePreview] = useState(product?.image || "");
  const [accessoryInput, setAccessoryInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [uploadingMainImage, setUploadingMainImage] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [libraryAssets, setLibraryAssets] = useState<UploadedAsset[]>([]);
  const [loadingLibrary, setLoadingLibrary] = useState(false);
  const [showMainLibrary, setShowMainLibrary] = useState(false);
  const [showGalleryLibrary, setShowGalleryLibrary] = useState(false);
  const [deletingAssetUrl, setDeletingAssetUrl] = useState<string | null>(null);
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
      setShowMainLibrary(false);
      return;
    }

    setShowGalleryLibrary(false);
  };

  const removeImageFromForm = (url: string) => {
    setLibraryAssets((prev) => prev.filter((item) => item.url !== url));
    setFormData((prev) => {
      const nextImages = prev.images.filter((item: string) => item !== url);
      const nextMain = prev.image === url ? nextImages[0] || "" : prev.image;
      if (prev.image === url) {
        setImagePreview(nextMain);
      }

      return {
        ...prev,
        image: nextMain,
        images: nextImages,
      };
    });
  };

  const isUploadedProductAsset = (url: string) => url.startsWith("/uploads/products/");

  const handleDeleteLibraryAsset = async (asset: UploadedAsset) => {
    if (!confirm(`Bạn có chắc muốn xóa ảnh "${asset.name}" khỏi thư viện?`)) return;

    try {
      setDeletingAssetUrl(asset.url);
      await deleteUploadedAsset("products", asset.url);
      removeImageFromForm(asset.url);
      await onAssetsChanged?.();
      toast.success("Đã xóa ảnh khỏi thư viện.");
    } catch (error) {
      toast.error("Không xóa được ảnh khỏi thư viện.");
      console.error(error);
    } finally {
      setDeletingAssetUrl(null);
    }
  };

  const handleDeleteAlbumImage = async (imageUrl: string) => {
    if (!confirm("Bạn có chắc muốn xóa ảnh này khỏi album?")) return;

    try {
      setDeletingAssetUrl(imageUrl);
      if (isUploadedProductAsset(imageUrl)) {
        await deleteUploadedAsset("products", imageUrl);
      }
      removeImageFromForm(imageUrl);
      await onAssetsChanged?.();
      toast.success(isUploadedProductAsset(imageUrl) ? "Đã xóa ảnh khỏi album và máy chủ." : "Đã xóa ảnh khỏi album.");
    } catch (error) {
      toast.error("Không xóa được ảnh khỏi album.");
      console.error(error);
    } finally {
      setDeletingAssetUrl(null);
    }
  };

  const renderLibraryGrid = (mode: "main" | "gallery") => {
    if (loadingLibrary) {
      return <p className="text-sm text-gray-500">Đang tải thư viện ảnh...</p>;
    }

    if (libraryAssets.length === 0) {
      return <p className="text-sm text-gray-500">Chưa có ảnh nào trong thư viện.</p>;
    }

    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 max-h-72 overflow-y-auto">
        {libraryAssets.map((asset) => (
          <div key={asset.url} className="overflow-hidden rounded-xl border border-white/10 bg-black/20">
            <img src={asset.url} alt={asset.name} className="h-24 w-full object-cover" />
            <div className="space-y-2 p-2">
              <p className="truncate text-[11px] text-gray-400" title={asset.name}>
                {asset.name}
              </p>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  onClick={() => applySelectedImage(asset.url, mode)}
                  className={
                    mode === "main"
                      ? "rounded-lg bg-[#3B82F6] text-white hover:bg-blue-500"
                      : "rounded-lg border border-white/10 bg-white/5 text-white hover:bg-white/10"
                  }
                >
                  {mode === "main" ? "Ảnh chính" : "Thêm ảnh"}
                </Button>
                <Button
                  type="button"
                  onClick={() => void handleDeleteLibraryAsset(asset)}
                  disabled={deletingAssetUrl === asset.url}
                  className="rounded-lg border border-red-500/20 bg-red-500/10 text-red-300 hover:bg-red-500/20"
                >
                  <Trash2 className="mr-1 h-4 w-4" />
                  {deletingAssetUrl === asset.url ? "Đang xóa" : "Xóa"}
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.brand || !formData.price) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc.");
      return;
    }

    if (
      !formData.inStock &&
      (!formData.customerName.trim() ||
        !formData.customerPhone.trim() ||
        !formData.sellerName.trim() ||
        !formData.soldAt)
    ) {
      toast.error("Vui lòng nhập đầy đủ thông tin khách hàng, người bán và ngày bán.");
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
      customerName: formData.inStock ? "" : formData.customerName.trim(),
      customerPhone: formData.inStock ? "" : formData.customerPhone.trim(),
      sellerName: formData.inStock ? "" : formData.sellerName.trim(),
      soldAt: formData.inStock ? "" : formData.soldAt,
      updatedAt: new Date().toISOString(),
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-white/10 bg-[#0F1115]">
        <div className="sticky top-0 flex items-center justify-between border-b border-white/10 bg-[#0F1115] px-6 py-4">
          <h2 className="text-xl font-bold text-white">{product ? "Sửa laptop" : "Thêm laptop mới"}</h2>
          <button onClick={onClose} className="text-gray-400 transition-colors hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">Hình ảnh</label>
            <div className="flex gap-4">
              <div
                onClick={() => mainFileInputRef.current?.click()}
                className="group flex h-32 w-32 cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-white/20 transition-colors hover:border-[#3B82F6]"
              >
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                ) : (
                  <div className="text-center">
                    <Upload className="mx-auto mb-2 h-8 w-8 text-gray-400 group-hover:text-[#3B82F6]" />
                    <p className="text-xs text-gray-400">Upload</p>
                  </div>
                )}
              </div>
              <input ref={mainFileInputRef} type="file" accept="image/*" onChange={handleMainImageUpload} className="hidden" />
              <div className="flex-1">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <p className="text-sm text-gray-400">Nhập đường dẫn ảnh hoặc chọn từ thư viện:</p>
                  <Button
                    type="button"
                    onClick={() => setShowMainLibrary((prev) => !prev)}
                    className="rounded-xl border border-white/10 bg-white/5 text-white hover:bg-white/10"
                  >
                    <Images className="mr-2 h-4 w-4" />
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
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white placeholder-gray-500 focus:border-[#3B82F6] focus:outline-none"
                />
                {uploadingMainImage && <p className="mt-2 text-xs text-gray-500">Đang upload ảnh chính...</p>}
                {showMainLibrary && (
                  <div className="mt-3 space-y-3 rounded-xl border border-white/10 bg-white/5 p-3">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm text-gray-300">Ảnh trong `backend/uploads/products`</p>
                      <Button
                        type="button"
                        onClick={() => void loadLibraryAssets()}
                        className="rounded-xl border border-white/10 bg-white/5 text-white hover:bg-white/10"
                      >
                        Tải lại
                      </Button>
                    </div>
                    {renderLibraryGrid("main")}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-300">Ảnh chi tiết sản phẩm</label>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  onClick={() => setShowGalleryLibrary((prev) => !prev)}
                  className="rounded-xl border border-white/10 bg-white/5 text-white hover:bg-white/10"
                >
                  <Images className="mr-2 h-4 w-4" />
                  Chọn từ thư viện
                </Button>
                <Button
                  type="button"
                  onClick={() => galleryFileInputRef.current?.click()}
                  className="rounded-xl border border-white/10 bg-white/5 text-white hover:bg-white/10"
                >
                  <Upload className="mr-2 h-4 w-4" />
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
            </div>
            {uploadingGallery && <p className="mb-2 text-xs text-gray-500">Đang upload ảnh chi tiết...</p>}
            {showGalleryLibrary && (
              <div className="mb-3 space-y-3 rounded-xl border border-white/10 bg-white/5 p-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm text-gray-300">Chọn ảnh chi tiết từ thư viện `backend/uploads/products`</p>
                  <Button
                    type="button"
                    onClick={() => void loadLibraryAssets()}
                    className="rounded-xl border border-white/10 bg-white/5 text-white hover:bg-white/10"
                  >
                    Tải lại
                  </Button>
                </div>
                {renderLibraryGrid("gallery")}
              </div>
            )}
            <div className="grid grid-cols-4 gap-3">
              {formData.images.map((imageUrl: string, index: number) => (
                <div key={`${imageUrl}-${index}`} className="relative overflow-hidden rounded-xl border border-white/10 bg-white/5">
                  <img src={imageUrl} alt={`Gallery ${index + 1}`} className="h-24 w-full object-cover" />
                  <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-black/60 px-2 py-1 text-[10px] text-white">
                    <span>{index === 0 ? "Ảnh đầu" : `Ảnh ${index + 1}`}</span>
                    <button
                      type="button"
                      onClick={() => void handleDeleteAlbumImage(imageUrl)}
                      disabled={deletingAssetUrl === imageUrl}
                      aria-label={`Xóa ảnh ${index + 1}`}
                      className="text-red-300 hover:text-red-200 disabled:cursor-wait disabled:opacity-50"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">Tên sản phẩm *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white focus:border-[#3B82F6] focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">Thương hiệu *</label>
              <select
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                required
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white focus:border-[#3B82F6] focus:outline-none [&>option]:bg-[#0F1115] [&>option]:text-white"
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
              <label className="mb-2 block text-sm font-medium text-gray-300">Giá hiện tại (VND) *</label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white focus:border-[#3B82F6] focus:outline-none"
              />
              <p className="mt-1 text-xs text-gray-500">Nhập trực tiếp số tiền Việt Nam, ví dụ: 18990000</p>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">Giá gốc (VND)</label>
              <input
                type="number"
                value={formData.originalPrice}
                onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white focus:border-[#3B82F6] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">Tình trạng</label>
              <select
                value={formData.condition}
                onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white focus:border-[#3B82F6] focus:outline-none [&>option]:bg-[#0F1115] [&>option]:text-white"
              >
                <option value="Excellent">Tuyệt vời</option>
                <option value="Good">Tốt</option>
                <option value="Fair">Khá</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">Pin (%)</label>
              <input
                type="number"
                value={formData.batteryHealth}
                onChange={(e) => setFormData({ ...formData, batteryHealth: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white focus:border-[#3B82F6] focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">Bảo hành</label>
              <input
                type="text"
                value={formData.warranty}
                onChange={(e) => setFormData({ ...formData, warranty: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white focus:border-[#3B82F6] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">Mô tả</label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white focus:border-[#3B82F6] focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">Cấu hình</label>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="CPU"
                value={formData.specs.cpu}
                onChange={(e) => setFormData({ ...formData, specs: { ...formData.specs, cpu: e.target.value } })}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white placeholder-gray-500 focus:border-[#3B82F6] focus:outline-none"
              />
              <input
                type="text"
                placeholder="RAM"
                value={formData.specs.ram}
                onChange={(e) => setFormData({ ...formData, specs: { ...formData.specs, ram: e.target.value } })}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white placeholder-gray-500 focus:border-[#3B82F6] focus:outline-none"
              />
              <input
                type="text"
                placeholder="SSD"
                value={formData.specs.ssd}
                onChange={(e) => setFormData({ ...formData, specs: { ...formData.specs, ssd: e.target.value } })}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white placeholder-gray-500 focus:border-[#3B82F6] focus:outline-none"
              />
              <input
                type="text"
                placeholder="GPU"
                value={formData.specs.gpu}
                onChange={(e) => setFormData({ ...formData, specs: { ...formData.specs, gpu: e.target.value } })}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white placeholder-gray-500 focus:border-[#3B82F6] focus:outline-none"
              />
              <input
                type="text"
                placeholder="Màn hình"
                value={formData.specs.screen}
                onChange={(e) => setFormData({ ...formData, specs: { ...formData.specs, screen: e.target.value } })}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white placeholder-gray-500 focus:border-[#3B82F6] focus:outline-none"
              />
              <input
                type="text"
                placeholder="Hệ điều hành"
                value={formData.specs.os}
                onChange={(e) => setFormData({ ...formData, specs: { ...formData.specs, os: e.target.value } })}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white placeholder-gray-500 focus:border-[#3B82F6] focus:outline-none"
              />
              <input
                type="text"
                placeholder="Trọng lượng"
                value={formData.specs.weight}
                onChange={(e) => setFormData({ ...formData, specs: { ...formData.specs, weight: e.target.value } })}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white placeholder-gray-500 focus:border-[#3B82F6] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">Phụ kiện đi kèm</label>
            <div className="mb-2 flex gap-2">
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
                className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white placeholder-gray-500 focus:border-[#3B82F6] focus:outline-none"
              />
              <Button
                type="button"
                onClick={() => {
                  if (!accessoryInput.trim() || formData.accessories.includes(accessoryInput.trim())) return;
                  setFormData({ ...formData, accessories: [...formData.accessories, accessoryInput.trim()] });
                  setAccessoryInput("");
                }}
                className="rounded-xl border border-white/10 bg-white/5 text-white hover:bg-white/10"
              >
                Thêm
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.accessories.map((acc: string, idx: number) => (
                <span
                  key={`${acc}-${idx}`}
                  className="inline-flex items-center gap-2 rounded-lg border border-green-500/20 bg-green-500/10 px-3 py-1 text-sm text-green-400"
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
                    className="transition-colors hover:text-red-400"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="flex items-center gap-2 text-sm text-gray-300">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="h-4 w-4 rounded border-white/10 bg-white/5 text-[#3B82F6] focus:ring-[#3B82F6]"
              />
              Sản phẩm nổi bật
            </label>
            <label className="flex items-center gap-2 text-sm text-gray-300">
              <input
                type="checkbox"
                checked={formData.inStock}
                onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                className="h-4 w-4 rounded border-white/10 bg-white/5 text-[#3B82F6] focus:ring-[#3B82F6]"
              />
              Còn hàng
            </label>
          </div>

          {!formData.inStock && (
            <div className="space-y-4 rounded-xl border border-red-500/20 bg-red-500/5 p-4">
              <div>
                <h3 className="font-semibold text-white">Thông tin bán hàng</h3>
                <p className="mt-1 text-xs text-gray-400">Bắt buộc nhập khi sản phẩm đã bán.</p>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">Tên khách hàng *</label>
                  <input
                    type="text"
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                    required={!formData.inStock}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white focus:border-[#3B82F6] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">Số điện thoại khách hàng *</label>
                  <input
                    type="tel"
                    value={formData.customerPhone}
                    onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                    required={!formData.inStock}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white focus:border-[#3B82F6] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">Người bán *</label>
                  <input
                    type="text"
                    value={formData.sellerName}
                    onChange={(e) => setFormData({ ...formData, sellerName: e.target.value })}
                    required={!formData.inStock}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white focus:border-[#3B82F6] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-300">Ngày bán *</label>
                  <input
                    type="date"
                    value={formData.soldAt}
                    onChange={(e) => setFormData({ ...formData, soldAt: e.target.value })}
                    required={!formData.inStock}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-white focus:border-[#3B82F6] focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-3 border-t border-white/10 pt-4">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="rounded-xl border-white/10 text-white hover:bg-white/5"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="rounded-xl border-0 bg-[#3B82F6] text-white shadow-lg shadow-blue-500/30 hover:bg-blue-500"
            >
              {saving ? "Đang lưu..." : product ? "Cập nhật" : "Thêm mới"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
