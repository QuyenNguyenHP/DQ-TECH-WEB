import { useState } from "react";
import { motion } from "motion/react";
import {
  MapPin, Phone, Mail, Clock, MessageCircle,
  Facebook, Send, ChevronDown, ChevronUp, CheckCircle2,
} from "lucide-react";
import { Button } from "../components/ui/button";

const faqs = [
  {
    q: "Các bạn đánh giá tình trạng laptop như thế nào?",
    a: "Chúng tôi sử dụng hệ thống phân loại 3 cấp nghiêm ngặt: Tuyệt Vời (như mới, không tì vết), Tốt (mòn nhẹ, hoạt động hoàn hảo), và Khá (mòn nhìn thấy nhưng hoàn toàn hoạt động). Mỗi cấp được xác định sau kiểm tra kỹ lưỡng.",
  },
  {
    q: "Mỗi laptop có kèm bảo hành không?",
    a: "Có! Tất cả laptop đều có bảo hành 1–3 tháng cho lỗi phần cứng. Tình trạng Tuyệt Vời được 3 tháng, Tốt được 3 tháng, Khá được 1 tháng. Chúng tôi xử lý sửa chữa hoặc đổi máy miễn phí.",
  },
  {
    q: "Các bạn kiểm tra sức khỏe pin như thế nào?",
    a: "Chúng tôi dùng công cụ chẩn đoán pin chuyên nghiệp để đo dung lượng sạc đầy hiện tại so với dung lượng thiết kế ban đầu. Tỉ lệ phần trăm được ghi rõ trên từng trang sản phẩm.",
  },
  {
    q: "Tôi có thể nâng cấp RAM hoặc SSD không?",
    a: "Hầu hết laptop chúng tôi bán đều có thể nâng cấp. Chúng tôi ghi rõ máy nào hỗ trợ nâng cấp RAM/SSD trong phần thông số. Chúng tôi cũng có thể nâng cấp trước khi giao hàng — chỉ cần nhắn qua Zalo hoặc Messenger.",
  },
  {
    q: "Giao hàng mất bao lâu?",
    a: "Nội thành TP.HCM: giao trong ngày hoặc hôm sau cho đơn trước 12 giờ trưa. Tỉnh thành khác: 2–4 ngày làm việc qua chuyển phát uy tín. Tất cả đơn hàng đều được bảo hiểm.",
  },
  {
    q: "Chấp nhận những hình thức thanh toán nào?",
    a: "Chúng tôi nhận chuyển khoản ngân hàng (Vietcombank, MB Bank, Techcombank), MoMo, ZaloPay, và thanh toán tiền mặt khi nhận hàng trong TP.HCM. Các tỉnh khác cần thanh toán trước khi giao.",
  },
];

export function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const inputCls =
    "w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-[#0F1115] dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 transition-all text-sm";

  return (
    <div className="min-h-screen bg-white dark:bg-[#0F1115] pt-20">
      {/* Header */}
      <div className="bg-[#0F1115] py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff06_1px,transparent_1px),linear-gradient(to_bottom,#ffffff06_1px,transparent_1px)] bg-[size:48px_48px]" />
        <div className="absolute top-0 left-1/3 w-64 h-64 bg-[#3B82F6]/15 rounded-full blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-[#3B82F6] font-semibold text-sm uppercase tracking-widest mb-3">Kết Nối Với Chúng Tôi</p>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">Liên Hệ</h1>
            <p className="text-gray-400 max-w-xl mx-auto">
              Có câu hỏi, muốn kiểm tra hàng còn không, hay cần tư vấn chọn laptop? Chúng tôi luôn sẵn sàng hỗ trợ bạn.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-5 gap-12">
          {/* Contact info sidebar */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick contact cards */}
            <div className="space-y-4">
              {[
                {
                  icon: Phone,
                  title: "Phone / Zalo",
                  value: "+84 8585 13197",
                  sub: "Trong giờ làm việc",
                  href: "tel:+848513197",
                  color: "text-green-500",
                  bg: "bg-green-50 dark:bg-green-500/10",
                },
                {
                  icon: Mail,
                  title: "Email",
                  value: "dqtech131@gmail.com",
                  sub: "Phản hồi trong vòng 2 giờ",
                  href: "mailto:dqtech131@gmail.com",
                  color: "text-[#3B82F6]",
                  bg: "bg-blue-50 dark:bg-blue-500/10",
                },
                {
                  icon: MapPin,
                  title: "Ghé Thăm",
                  value: " Số 1, ngõ 115 Máng Nước, Phường An Hải ",
                  sub: "TP. Hải Phòng, Việt Nam",
                  href: "#map",
                  color: "text-red-500",
                  bg: "bg-red-50 dark:bg-red-500/10",
                },
              ].map((item) => (
                <a
                  key={item.title}
                  href={item.href}
                  className="flex items-center gap-4 p-5 rounded-2xl border border-gray-200 dark:border-white/10 hover:border-[#3B82F6]/30 hover:shadow-md transition-all group"
                >
                  <div className={`w-11 h-11 rounded-xl ${item.bg} flex items-center justify-center flex-shrink-0`}>
                    <item.icon className={`w-5 h-5 ${item.color}`} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{item.title}</p>
                    <p className="font-semibold text-[#0F1115] dark:text-white group-hover:text-[#3B82F6] transition-colors">
                      {item.value}
                    </p>
                    <p className="text-xs text-gray-500">{item.sub}</p>
                  </div>
                </a>
              ))}
            </div>

            {/* Business hours */}
            <div className="p-5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-4 h-4 text-[#3B82F6]" />
                <h3 className="font-semibold text-[#0F1115] dark:text-white">Giờ Làm Việc</h3>
              </div>
              {[
                { day: "Thứ 2 – Thứ 6", hours: "8:00 – 18:00" },
                { day: "Thứ 7", hours: "8:00 – 18:00" },
                { day: "Chủ Nhật", hours: "9:00 – 16:00" },
              ].map((row) => (
                <div key={row.day} className="flex justify-between py-2 border-b border-gray-100 dark:border-white/5 last:border-0">
                  <span className="text-sm text-gray-600 dark:text-gray-400">{row.day}</span>
                  <span className="text-sm font-medium text-[#0F1115] dark:text-white">{row.hours}</span>
                </div>
              ))}
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-white/5">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs text-green-500 font-medium">Đang mở cửa</span>
              </div>
            </div>

            {/* Quick messaging */}
            <div>
              <p className="text-sm font-semibold text-[#0F1115] dark:text-white mb-3">
                Nhắn Tin Nhanh Qua
              </p>
              <div className="grid grid-cols-3 gap-3">
                <a
                  href="https://zalo.me/848513197"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-2 py-4 rounded-2xl border border-gray-200 dark:border-white/10 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/10 hover:text-blue-500 text-gray-600 dark:text-gray-400 transition-all"
                >
                  <MessageCircle className="w-6 h-6" />
                  <span className="text-xs font-medium">Zalo</span>
                </a>
                <a
                  href="https://wa.me/848513197"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-2 py-4 rounded-2xl border border-gray-200 dark:border-white/10 hover:border-green-400 hover:bg-green-50 dark:hover:bg-green-500/10 hover:text-green-500 text-gray-600 dark:text-gray-400 transition-all"
                >
                  <Phone className="w-6 h-6" />
                  <span className="text-xs font-medium">WhatsApp</span>
                </a>
                <a
                  href="https://m.me/laptophubvn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center gap-2 py-4 rounded-2xl border border-gray-200 dark:border-white/10 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 hover:text-blue-600 text-gray-600 dark:text-gray-400 transition-all"
                >
                  <Facebook className="w-6 h-6" />
                  <span className="text-xs font-medium">Messenger</span>
                </a>
              </div>
            </div>
          </div>

          {/* Contact form */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-white/3 rounded-3xl border border-gray-200 dark:border-white/10 p-8">
              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <div className="w-16 h-16 rounded-full bg-green-50 dark:bg-green-500/10 flex items-center justify-center mx-auto mb-5">
                    <CheckCircle2 className="w-8 h-8 text-green-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#0F1115] dark:text-white mb-2">Đã Gửi Tin Nhắn!</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6">
                    Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi trong vòng 2 giờ trong giờ làm việc.
                  </p>
                  <Button
                    onClick={() => setSubmitted(false)}
                    variant="outline"
                    className="border-gray-200 dark:border-white/10 rounded-xl"
                  >
                    Gửi Tin Nhắn Khác
                  </Button>
                </motion.div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold text-[#0F1115] dark:text-white mb-6">Gửi Tin Nhắn Cho Chúng Tôi</h2>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-[#0F1115] dark:text-white block mb-1.5">
                          Họ và Tên <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Nguyen Van A"
                          className={inputCls}
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-[#0F1115] dark:text-white block mb-1.5">
                          Số Điện Thoại
                        </label>
                        <input
                          type="tel"
                          placeholder="+84 90 000 0000"
                          className={inputCls}
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-[#0F1115] dark:text-white block mb-1.5">
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="your@email.com"
                        className={inputCls}
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-[#0F1115] dark:text-white block mb-1.5">
                        Chủ Đề
                      </label>
                      <select
                        className={inputCls}
                        value={form.subject}
                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      >
                        <option value="">Chọn chủ đề...</option>
                        <option value="product">Hỏi Về Sản Phẩm</option>
                        <option value="order">Tình Trạng Đơn Hàng</option>
                        <option value="warranty">Bảo Hành / Sửa Chữa</option>
                        <option value="availability">Kiểm Tra Hàng Còn</option>
                        <option value="other">Khác</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-[#0F1115] dark:text-white block mb-1.5">
                        Nội Dung <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        required
                        rows={5}
                        placeholder="Cho chúng tôi biết bạn đang tìm gì, hoặc đặt bất kỳ câu hỏi nào..."
                        className={`${inputCls} resize-none`}
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-[#3B82F6] hover:bg-blue-600 text-white border-0 py-3.5 rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all text-base"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Gửi Tin Nhắn
                    </Button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Map */}
        <div id="map" className="mt-16">
          <h2 className="text-2xl font-bold text-[#0F1115] dark:text-white mb-6">Tìm Chúng Tôi</h2>
          <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-white/10 h-80 relative">
            <iframe
              title="Store Location"
              src="https://maps.google.com/maps?q=20.853968,106.6476&z=15&output=embed"
              className="w-full h-full"
              style={{ border: 0, filter: "grayscale(20%)" }}
              allowFullScreen
              loading="lazy"
            />
            <div className="absolute top-4 left-4 bg-white dark:bg-[#0F1115] rounded-xl p-3 shadow-lg border border-gray-200 dark:border-white/10 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#3B82F6]" />
              <span className="text-sm font-medium text-[#0F1115] dark:text-white">
                Số 1, ngõ 115 Máng Nước, Phường An Hải, TP Hải Phòng
              </span>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <section className="mt-16">
          <div className="text-center mb-10">
            <p className="text-[#3B82F6] font-semibold text-sm uppercase tracking-widest mb-2">FAQ</p>
            <h2 className="text-3xl font-bold text-[#0F1115] dark:text-white">Câu Hỏi Thường Gặp</h2>
          </div>
          <div className="max-w-3xl mx-auto space-y-3">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                className="rounded-2xl border border-gray-200 dark:border-white/10 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                >
                  <span className="font-medium text-[#0F1115] dark:text-white pr-4">{faq.q}</span>
                  {openFaq === i ? (
                    <ChevronUp className="w-5 h-5 text-[#3B82F6] flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  )}
                </button>
                {openFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    className="px-5 pb-5 text-sm text-gray-600 dark:text-gray-400 leading-relaxed border-t border-gray-100 dark:border-white/5 pt-4"
                  >
                    {faq.a}
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
