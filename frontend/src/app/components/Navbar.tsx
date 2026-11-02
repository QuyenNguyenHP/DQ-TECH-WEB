import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { Search, Menu, X, ShoppingBag, LockKeyhole } from "lucide-react";
import { Button } from "./ui/button";
import { motion, AnimatePresence } from "motion/react";
import logoImage from "../../imports/logo.png";

const navLinks = [
  { to: "/", label: "Trang Chủ", isActive: (path: string) => path === "/" },
  { to: "/giai-phap-ai", label: "Dịch Vụ", isActive: (path: string) => path.startsWith("/giai-phap-ai") },
  { to: "/blog", label: "Blog", isActive: (path: string) => path.startsWith("/blog") },
  { to: "/contact", label: "Liên Hệ", isActive: (path: string) => path === "/contact" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

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
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-4 py-2 rounded-lg text-sm transition-all ${
                    link.isActive(location.pathname)
                      ? "text-[#3B82F6] bg-blue-500/10 font-semibold"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
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

              <Link to="/admin/login" className="hidden md:block">
                <Button
                  size="sm"
                  variant="outline"
                  className="border-white/15 bg-white/5 text-gray-300 hover:bg-white/10 hover:text-white hover:border-white/25 rounded-lg px-3 transition-all"
                >
                  <LockKeyhole className="w-4 h-4 lg:mr-2" />
                  <span className="hidden lg:inline">Admin</span>
                </Button>
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
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      link.isActive(location.pathname)
                        ? "text-[#3B82F6] bg-blue-500/10"
                        : "text-gray-300 hover:bg-white/5"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}

                <div className="pt-2 mt-2 border-t border-white/10">
                  <Link
                    to="/admin/login"
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 mb-2 rounded-xl border border-white/10 bg-white/5 text-sm font-medium text-gray-300 hover:bg-white/10 hover:text-white transition-all"
                  >
                    <LockKeyhole className="w-4 h-4" />
                    Trang Admin
                  </Link>
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
