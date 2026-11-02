import { Link } from "react-router";
import { motion } from "motion/react";
import {
  Bot, Workflow, TrendingUp, PiggyBank, MessageSquare, ShoppingCart,
  FileText, BarChart3, CalendarClock, Megaphone, Store, Users, Briefcase,
  Building2, ArrowRight, CheckCircle2, ExternalLink,
} from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import drumsImg from "../../imports/DRUMS.png";
import homeassistantImg from "../../imports/homeassistant.png";
import engineImg from "../../imports/4enginesmonitoring.jpg";

const benefits = [
  {
    icon: Workflow,
    title: "Tinh Gọn Quy Trình",
    desc: "Rà soát cách bạn đang làm việc, bỏ bớt bước thừa và để máy làm thay những việc lặp đi lặp lại.",
    color: "text-[#3B82F6]",
    bg: "bg-[#3B82F6]/10",
  },
  {
    icon: TrendingUp,
    title: "Tăng Hiệu Quả",
    desc: "Phản hồi khách nhanh hơn, ít sai sót hơn, dữ liệu luôn sẵn sàng để ra quyết định.",
    color: "text-green-400",
    bg: "bg-green-500/10",
  },
  {
    icon: PiggyBank,
    title: "Giảm Chi Phí",
    desc: "Bớt thời gian làm thủ công, bớt nhân sự cho việc lặp lại — dùng công cụ phù hợp với túi tiền.",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
  },
];

const useCases = [
  {
    icon: MessageSquare,
    title: "Chăm Sóc Khách Hàng",
    desc: "Chatbot AI trả lời tin nhắn Facebook, Zalo, website 24/7; tự chuyển cho người khi cần.",
  },
  {
    icon: ShoppingCart,
    title: "Xử Lý Đơn Hàng",
    desc: "Đơn từ nhiều kênh tự gom về một nơi, tự gửi xác nhận, cập nhật tồn kho và vận chuyển.",
  },
  {
    icon: Megaphone,
    title: "Nội Dung & Marketing",
    desc: "AI hỗ trợ viết bài, mô tả sản phẩm, lên lịch đăng bài đều đặn trên các nền tảng.",
  },
  {
    icon: BarChart3,
    title: "Báo Cáo Tự Động",
    desc: "Doanh thu, chi phí, hiệu quả bán hàng tự tổng hợp hằng ngày, gửi thẳng vào điện thoại.",
  },
  {
    icon: FileText,
    title: "Giấy Tờ & Dữ Liệu",
    desc: "Đọc hóa đơn, chứng từ, nhập liệu bảng tính tự động thay vì gõ tay từng dòng.",
  },
  {
    icon: CalendarClock,
    title: "Lịch Hẹn & Nhắc Việc",
    desc: "Tự đặt lịch, nhắc khách, nhắc nhân viên; theo dõi công việc không bỏ sót.",
  },
];

const audiences = [
  { icon: Store, title: "Cửa hàng & shop online" },
  { icon: Building2, title: "Doanh nghiệp nhỏ" },
  { icon: Briefcase, title: "Kinh doanh cá nhân, freelancer" },
  { icon: Users, title: "Nhóm làm việc ít người" },
];

const steps = [
  {
    step: "01",
    title: "Tìm Hiểu Quy Trình",
    desc: "Trò chuyện miễn phí để hiểu cách bạn đang vận hành và những việc tốn thời gian nhất.",
  },
  {
    step: "02",
    title: "Đề Xuất Giải Pháp",
    desc: "Chọn công cụ AI và tự động hóa phù hợp quy mô, ngân sách; báo rõ chi phí trước khi làm.",
  },
  {
    step: "03",
    title: "Triển Khai & Kết Nối",
    desc: "Cài đặt, kết nối với công cụ bạn đang dùng (Zalo, Facebook, Google Sheets, phần mềm bán hàng…).",
  },
  {
    step: "04",
    title: "Hướng Dẫn & Đồng Hành",
    desc: "Hướng dẫn bạn và nhân viên sử dụng, theo dõi và điều chỉnh để hệ thống chạy ổn định lâu dài.",
  },
];

const projects = [
  {
    name: "DRUMS",
    type: "Hệ thống giám sát & thu thập dữ liệu",
    img: drumsImg,
    url: "https://drums.dqtech.cloud/",
  },
  {
    name: "4 Engines Monitoring",
    type: "Giám sát động cơ tự động qua Modbus",
    img: engineImg,
    url: "https://dqtech.us/",
  },
  {
    name: "Home Assistant",
    type: "Tự động hóa thiết bị & ngôi nhà thông minh",
    img: homeassistantImg,
    url: "https://home.dqtech.cloud/",
  },
];

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

export function AiSolutionsPage() {
  return (
    <div className="min-h-screen bg-[#0F1115] text-white">
      {/* Hero */}
      <section className="relative pt-28 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:64px_64px]" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-[#3B82F6]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <Badge className="bg-green-500/15 text-green-300 border-green-500/30 mb-6 px-4 py-1.5">
              <Bot className="w-3.5 h-3.5 mr-1.5" />
              Tư Vấn Ứng Dụng AI & Tự Động Hóa
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Đưa AI Vào Quy Trình,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-[#3B82F6]">
                Làm Ít Mà Hiệu Quả Hơn
              </span>
            </h1>
            <p className="text-lg text-gray-400 mb-8 leading-relaxed">
              DQ TECH tư vấn và triển khai giải pháp AI, tự động hóa quy trình cho doanh nghiệp nhỏ và kinh doanh
              cá nhân — giúp tinh gọn quy trình, tăng hiệu quả và giảm chi phí vận hành, với công cụ phù hợp quy mô
              và ngân sách của bạn.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/contact">
                <Button className="w-full sm:w-auto bg-green-600 hover:bg-green-500 text-white border-0 px-8 h-12 rounded-xl shadow-lg shadow-green-500/25 transition-all">
                  Đăng Ký Tư Vấn Miễn Phí
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <a href="#ung-dung">
                <Button
                  variant="outline"
                  className="w-full sm:w-auto border-white/20 text-white hover:bg-white/10 h-12 rounded-xl px-8 bg-transparent"
                >
                  Xem Ứng Dụng Thực Tế
                </Button>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-[#0A0D11]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {benefits.map((b, i) => (
              <motion.div
                key={b.title}
                {...fadeUp}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all"
              >
                <div className={`w-14 h-14 rounded-2xl ${b.bg} flex items-center justify-center mb-5`}>
                  <b.icon className={`w-7 h-7 ${b.color}`} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{b.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section id="ung-dung" className="py-20 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="text-center mb-12">
            <p className="text-sm text-green-400 font-semibold uppercase tracking-widest mb-3">Ứng Dụng Thực Tế</p>
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">AI Có Thể Làm Gì Cho Bạn?</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Những việc lặp lại mỗi ngày là nơi AI và tự động hóa phát huy tác dụng rõ nhất.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {useCases.map((u, i) => (
              <motion.div
                key={u.title}
                {...fadeUp}
                transition={{ delay: i * 0.05 }}
                className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-green-500/40 hover:bg-green-500/5 transition-all"
              >
                <div className="w-11 h-11 rounded-xl bg-green-500/10 flex items-center justify-center mb-4 group-hover:bg-green-500/20 transition-all">
                  <u.icon className="w-5 h-5 text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{u.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{u.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Audience */}
      <section className="py-16 bg-[#0A0D11] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2 {...fadeUp} className="text-2xl lg:text-3xl font-bold text-white text-center mb-10">
            Phù Hợp Với Ai?
          </motion.h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {audiences.map((a, i) => (
              <motion.div
                key={a.title}
                {...fadeUp}
                transition={{ delay: i * 0.05 }}
                className="flex flex-col items-center text-center gap-3 p-6 rounded-2xl bg-white/5 border border-white/10"
              >
                <a.icon className="w-7 h-7 text-[#3B82F6]" />
                <p className="text-sm font-medium text-white">{a.title}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="text-center mb-12">
            <p className="text-sm text-[#3B82F6] font-semibold uppercase tracking-widest mb-3">Cách Chúng Tôi Làm</p>
            <h2 className="text-3xl lg:text-4xl font-bold text-white">Quy Trình 4 Bước</h2>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <motion.div
                key={s.step}
                {...fadeUp}
                transition={{ delay: i * 0.1 }}
                className="relative p-6 rounded-2xl bg-white/5 border border-white/10"
              >
                <span className="text-4xl font-black text-[#3B82F6]/30">{s.step}</span>
                <h3 className="text-lg font-semibold text-white mt-2 mb-2">{s.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects */}
      <section className="py-20 bg-[#0A0D11]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="text-center mb-12">
            <p className="text-sm text-green-400 font-semibold uppercase tracking-widest mb-3">Dự Án Đã Triển Khai</p>
            <h2 className="text-3xl lg:text-4xl font-bold text-white">Tự Động Hóa & Dữ Liệu</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {projects.map((p, i) => (
              <motion.a
                key={p.name}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                {...fadeUp}
                transition={{ delay: i * 0.1 }}
                className="group block rounded-2xl overflow-hidden bg-white/5 border border-white/10 hover:border-green-500/40 transition-all"
              >
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={p.img}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-white">{p.name}</h3>
                    <p className="text-sm text-gray-400">{p.type}</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-green-400 flex-shrink-0 mt-1" />
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div
            {...fadeUp}
            className="rounded-3xl bg-gradient-to-br from-green-600 to-[#3B82F6] p-10 sm:p-12 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:32px_32px]" />
            <div className="relative">
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Bắt Đầu Từ Một Buổi Trò Chuyện</h2>
              <p className="text-white/85 mb-6 max-w-xl mx-auto">
                Kể cho chúng tôi nghe việc nào đang tốn thời gian nhất — DQ TECH sẽ gợi ý cách tự động hóa phù hợp.
              </p>
              <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-8 text-sm text-white/90">
                {["Tư vấn miễn phí", "Báo giá rõ ràng", "Hỗ trợ lâu dài"].map((t) => (
                  <li key={t} className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    {t}
                  </li>
                ))}
              </ul>
              <Link to="/contact">
                <Button className="bg-white text-[#0F1115] hover:bg-gray-100 border-0 px-8 h-12 rounded-xl font-semibold shadow-lg">
                  Liên Hệ Tư Vấn
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
