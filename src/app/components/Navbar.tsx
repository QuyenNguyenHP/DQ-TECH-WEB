import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router";
import { Search, Menu, X, Laptop, ShoppingBag, ChevronDown, Globe, Camera } from "lucide-react";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "motion/react";
import logoImage from "../../imports/5.png";

const services = [
  {
    to: "/laptops",
    icon: Laptop,
    label: "Laptop Cũ Cao Cấp",
    desc: "Đã kiểm tra, bảo hành đi kèm",
    color: "text-[#3B82F6]",
    bg: "bg-[#3B82F6]/10",
  },
  {
    to: "/thiet-ke-website",
    icon: Globe,
    label: "Thiết Kế Website",
    desc: "Giao diện đẹp, chuẩn SEO, tốc độ cao",
    color: "text-purple-400",
    bg: "bg-purple-500/10",
  },
  {
    to: "/camera-giam-sat",
    icon: Camera,
    label: "Camera Giám Sát",
    desc: "Lắp đặt chuyên nghiệp, tư vấn miễn phí",
    color: "text-green-400",
    bg: "bg-green-500/10",
  },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setServicesOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setServicesOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const isServicesActive = ["/laptops", "/thiet-ke-website", "/camera-giam-sat"].some((p) =>
    location.pathname.startsWith(p)
  );

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#0F1115]/95 backdrop-blur-xl shadow-lg shadow-black/20 border-b border-white/10"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0">
              <img
                src={logoImage}
                alt="DQ TECH Logo"
                className="w-10 h-10 group-hover:scale-105 transition-transform"
              />
              <span className="text-white">
                <span className="font-bold tracking-tight text-xl">DQ</span>
                <span className="text-[#3B82F6] font-bold text-xl">TECH</span>
              </span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1">
              <Link
                to="/"
                className={`px-4 py-2 rounded-lg text-sm transition-all ${
                  location.pathname === "/"
                    ? "text-[#3B82F6] bg-blue-500/10 font-semibold"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                Trang Chủ
              </Link>

              {/* Services dropdown */}
              <div ref={dropdownRef} className="relative">
                <button
                  onClick={() => setServicesOpen(!servicesOpen)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm transition-all ${
                    isServicesActive
                      ? "text-[#3B82F6] bg-blue-500/10 font-semibold"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  Dịch Vụ
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform ${servicesOpen ? "rotate-180" : ""}`}
                  />
                </button>

                <AnimatePresence>
                  {servicesOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-72 bg-[#0F1115]/98 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-black/50 p-2 z-50"
                    >
                      {services.map((svc) => (
                        <Link
                          key={svc.to}
                          to={svc.to}
                          className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all group"
                        >
                          <div className={`w-9 h-9 rounded-xl ${svc.bg} flex items-center justify-center flex-shrink-0`}>
                            <svc.icon className={`w-4.5 h-4.5 ${svc.color}`} />
                          </div>
                          <div>
                            <p className={`text-sm font-semibold text-white group-hover:${svc.color} transition-colors`}>
                              {svc.label}
                            </p>
                            <p className="text-xs text-gray-500">{svc.desc}</p>
                          </div>
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link
                to="/blog"
                className={`px-4 py-2 rounded-lg text-sm transition-all ${
                  location.pathname.startsWith("/blog")
                    ? "text-[#3B82F6] bg-blue-500/10 font-semibold"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                Blog
              </Link>

              <Link
                to="/contact"
                className={`px-4 py-2 rounded-lg text-sm transition-all ${
                  location.pathname === "/contact"
                    ? "text-[#3B82F6] bg-blue-500/10 font-semibold"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                Liên Hệ
              </Link>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Link
                to="/laptops"
                className="hidden sm:flex w-9 h-9 rounded-lg items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                aria-label="Tìm kiếm"
              >
                <Search className="w-4.5 h-4.5" />
              </Link>

              <Link to="/contact" className="hidden sm:block">
                <Button
                  size="sm"
                  className="bg-[#3B82F6] hover:bg-blue-500 text-white rounded-lg px-4 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all border-0"
                >
                  Liên Hệ Ngay
                </Button>
              </Link>

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 hover:bg-white/10 transition-all"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 md:hidden bg-black/50 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed top-16 left-0 right-0 z-40 md:hidden bg-[#0F1115] border-b border-white/10 p-4"
            >
              <nav className="flex flex-col gap-1">
                <Link
                  to="/"
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    location.pathname === "/"
                      ? "text-[#3B82F6] bg-blue-500/10"
                      : "text-gray-300 hover:bg-white/5"
                  }`}
                >
                  Trang Chủ
                </Link>

                {/* Mobile services accordion */}
                <div>
                  <button
                    onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      isServicesActive ? "text-[#3B82F6] bg-blue-500/10" : "text-gray-300 hover:bg-white/5"
                    }`}
                  >
                    <span>Dịch Vụ</span>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${mobileServicesOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  <AnimatePresence>
                    {mobileServicesOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden pl-2"
                      >
                        {services.map((svc) => (
                          <Link
                            key={svc.to}
                            to={svc.to}
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-all mt-1"
                          >
                            <div className={`w-8 h-8 rounded-lg ${svc.bg} flex items-center justify-center flex-shrink-0`}>
                              <svc.icon className={`w-4 h-4 ${svc.color}`} />
                            </div>
                            <span className="text-sm text-gray-300">{svc.label}</span>
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <Link
                  to="/blog"
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    location.pathname.startsWith("/blog")
                      ? "text-[#3B82F6] bg-blue-500/10"
                      : "text-gray-300 hover:bg-white/5"
                  }`}
                >
                  Blog
                </Link>

                <Link
                  to="/contact"
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    location.pathname === "/contact"
                      ? "text-[#3B82F6] bg-blue-500/10"
                      : "text-gray-300 hover:bg-white/5"
                  }`}
                >
                  Liên Hệ
                </Link>

                <div className="pt-2 mt-2 border-t border-white/10">
                  <Link to="/contact" className="block">
                    <Button className="w-full bg-[#3B82F6] hover:bg-blue-500 text-white border-0 rounded-xl shadow-lg shadow-blue-500/25">
                      <ShoppingBag className="w-4 h-4 mr-2" />
                      Liên Hệ Ngay
                    </Button>
                  </Link>
                </div>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
