import type { BlogPost } from "../data/blogPosts";
import type { Product } from "../data/products";

const API_BASE = (import.meta.env.VITE_CONTENT_API_BASE || "/api/content").replace(/\/$/, "");

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(detail || `Request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export interface ContentBootstrap {
  products: Product[];
  blogs: BlogPost[];
}

export function fetchContentBootstrap() {
  return request<ContentBootstrap>("/bootstrap");
}

export function fetchProducts() {
  return request<Product[]>("/products");
}

export function fetchBlogs() {
  return request<BlogPost[]>("/blogs");
}

export interface UploadedAsset {
  name: string;
  url: string;
  createdAt: number;
}

export function fetchUploadedAssets(target: "products" | "blogs") {
  return request<UploadedAsset[]>(`/assets?target=${encodeURIComponent(target)}`);
}

export function createProduct(product: Product) {
  return request<Product>("/products", {
    method: "POST",
    body: JSON.stringify(product),
  });
}

export function updateProduct(product: Product) {
  return request<Product>(`/products/${encodeURIComponent(product.id)}`, {
    method: "PUT",
    body: JSON.stringify(product),
  });
}

export function deleteProduct(id: string) {
  return request<{ ok: true }>(`/products/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}

export function createBlog(blog: BlogPost) {
  return request<BlogPost>("/blogs", {
    method: "POST",
    body: JSON.stringify(blog),
  });
}

export function updateBlog(blog: BlogPost) {
  return request<BlogPost>(`/blogs/${encodeURIComponent(blog.id)}`, {
    method: "PUT",
    body: JSON.stringify(blog),
  });
}

export function deleteBlog(id: string) {
  return request<{ ok: true }>(`/blogs/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}

export async function uploadAsset(file: File, target: "products" | "blogs") {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

  return request<{ url: string }>("/upload", {
    method: "POST",
    body: JSON.stringify({
      target,
      filename: file.name,
      dataUrl,
    }),
  });
}
