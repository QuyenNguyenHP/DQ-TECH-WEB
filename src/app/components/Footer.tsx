import { Link } from "react-router";
import { Laptop, MapPin, Phone, Mail, Facebook, MessageCircle, Globe, Camera } from "lucide-react";
import logoImage from "../../imports/logo.png";

export function Footer() {
  return (
    <footer className="bg-[#0F1115] text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <img
                src={logoImage}
                alt="DQ TECH Logo"
                className="w-10 h-10"
              />
              <span className="text-white">
                <span className="font-bold text-lg">DQ</span>
                <span className="text-[#3B82F6] font-bold text-lg">TECH</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed mb-6">
              Laptop cũ cao cấp — kiểm tra kỹ lưỡng, có chứng nhận và sẵn sàng sử dụng. Chúng tôi tin rằng công nghệ tuyệt vời phải dành cho tất cả mọi người.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-white/5 hover:bg-blue-500/20 hover:text-[#3B82F6] flex items-center justify-center transition-all"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-white/5 hover:bg-green-500/20 hover:text-green-400 flex items-center justify-center transition-all"
                aria-label="Zalo"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-white/5 hover:bg-blue-500/20 hover:text-[#3B82F6] flex items-center justify-center transition-all"
                aria-label="Messenger"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Liên Kết Nhanh</h4>
            <ul className="space-y-3">
              {[
                { label: "Trang Chủ", to: "/" },
                { label: "Xem Laptop", to: "/laptops" },
                { label: "Blog & Tin Tức", to: "/blog" },
                { label: "Liên Hệ", to: "/contact" },
                { label: "Chính Sách Bảo Hành", to: "/contact" },
                { label: "Câu Hỏi Thường Gặp", to: "/contact" },
              ].map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm hover:text-white transition-colors hover:translate-x-0.5 inline-flex items-center gap-1"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold mb-4">Dịch Vụ</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/laptops" className="flex items-center gap-2 text-sm hover:text-white transition-colors">
                  <Laptop className="w-3.5 h-3.5 text-[#3B82F6]" />
                  Laptop Cũ Cao Cấp
                </Link>
              </li>
              <li>
                <Link to="/thiet-ke-website" className="flex items-center gap-2 text-sm hover:text-white transition-colors">
                  <Globe className="w-3.5 h-3.5 text-purple-400" />
                  Thiết Kế Website
                </Link>
              </li>
              <li>
                <Link to="/camera-giam-sat" className="flex items-center gap-2 text-sm hover:text-white transition-colors">
                  <Camera className="w-3.5 h-3.5 text-green-400" />
                  Camera Giám Sát
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Liên Hệ</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm">
                <MapPin className="w-4 h-4 mt-0.5 text-[#3B82F6] flex-shrink-0" />
                <span> Số 1, ngõ 115 Máng Nước, Phường An Hải, TP Hải Phòng </span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Phone className="w-4 h-4 text-[#3B82F6] flex-shrink-0" />
                <a href="tel:+84901234567" className="hover:text-white transition-colors">
                  +84 8585 13197
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Mail className="w-4 h-4 text-[#3B82F6] flex-shrink-0" />
                <a href="mailto:info@dqtech.vn" className="hover:text-white transition-colors">
                  dqtech131@gmail.com
                </a>
              </li>
            </ul>
            <div className="mt-4 p-3 rounded-xl bg-white/5 border border-white/10">
              <p className="text-xs text-gray-500 mb-1">Giờ Làm Việc</p>
              <p className="text-sm text-white">Thứ 2 – Thứ 7: 8:00 – 18:00</p>
              <p className="text-sm text-white">Chủ Nhật: 9:00 – 16:00</p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm">© 2026 DQ TECH .</p>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs text-green-400">Đang Mở Cửa</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
