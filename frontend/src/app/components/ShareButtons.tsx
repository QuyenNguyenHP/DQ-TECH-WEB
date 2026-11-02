import { Link2, Share2 } from "lucide-react";
import { toast } from "sonner";

type IconProps = { className?: string };

const FacebookIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M24 12.07C24 5.41 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.04V9.41c0-3.02 1.8-4.7 4.54-4.7 1.31 0 2.68.24 2.68.24v2.97h-1.5c-1.5 0-1.96.93-1.96 1.89v2.26h3.32l-.53 3.5h-2.8V24C19.62 23.1 24 18.1 24 12.07" />
  </svg>
);

const XIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M18.9 1.15h3.68l-8.04 9.19L24 22.85h-7.4l-5.8-7.58-6.64 7.58H.48l8.6-9.83L0 1.15h7.59l5.24 6.93 6.07-6.93Zm-1.29 19.5h2.04L6.48 3.24H4.3l13.31 17.41Z" />
  </svg>
);

const LinkedInIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
  </svg>
);

const TelegramIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M11.94 0A12 12 0 1 0 24 12 12 12 0 0 0 11.94 0Zm5.89 8.17-1.97 9.28c-.15.66-.54.82-1.09.51l-3-2.21-1.45 1.4c-.16.16-.3.3-.6.3l.21-3.05 5.56-5.02c.24-.21-.05-.33-.38-.12l-6.87 4.33-2.96-.92c-.64-.2-.66-.64.14-.95l11.57-4.46c.54-.2 1.01.13.84.94Z" />
  </svg>
);

interface ShareButtonsProps {
  title: string;
  text?: string;
  /** Defaults to the current page URL. */
  url?: string;
  className?: string;
}

export function ShareButtons({ title, text, url, className = "" }: ShareButtonsProps) {
  const shareUrl = url ?? (typeof window !== "undefined" ? window.location.href : "");
  const u = encodeURIComponent(shareUrl);
  const t = encodeURIComponent(title);

  const networks = [
    {
      name: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${u}`,
      Icon: FacebookIcon,
      hover: "hover:bg-[#1877F2] hover:border-[#1877F2]",
    },
    {
      name: "X",
      href: `https://twitter.com/intent/tweet?url=${u}&text=${t}`,
      Icon: XIcon,
      hover: "hover:bg-black hover:border-white/40",
    },
    {
      name: "LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${u}`,
      Icon: LinkedInIcon,
      hover: "hover:bg-[#0A66C2] hover:border-[#0A66C2]",
    },
    {
      name: "Telegram",
      href: `https://t.me/share/url?url=${u}&text=${t}`,
      Icon: TelegramIcon,
      hover: "hover:bg-[#229ED9] hover:border-[#229ED9]",
    },
  ];

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Đã sao chép link bài viết!");
    } catch {
      toast.error("Không thể sao chép link");
    }
  };

  // Native share sheet (mostly phones) reaches apps like Zalo and Messenger.
  const canNativeShare = typeof navigator !== "undefined" && typeof navigator.share === "function";
  const nativeShare = () => {
    navigator.share({ title, text, url: shareUrl }).catch(() => {});
  };

  const buttonClass =
    "w-10 h-10 rounded-xl border border-white/15 bg-white/5 text-gray-300 hover:text-white flex items-center justify-center transition-all";

  return (
    <div className={`flex flex-wrap items-center gap-2 ${className}`}>
      <span className="text-sm text-gray-400 mr-1">Chia sẻ:</span>
      {networks.map(({ name, href, Icon, hover }) => (
        <a
          key={name}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Chia sẻ lên ${name}`}
          title={`Chia sẻ lên ${name}`}
          className={`${buttonClass} ${hover}`}
        >
          <Icon className="w-4 h-4" />
        </a>
      ))}
      <button
        type="button"
        onClick={copyLink}
        aria-label="Sao chép link"
        title="Sao chép link"
        className={`${buttonClass} hover:bg-white/15`}
      >
        <Link2 className="w-4 h-4" />
      </button>
      {canNativeShare && (
        <button
          type="button"
          onClick={nativeShare}
          aria-label="Chia sẻ qua ứng dụng khác"
          title="Chia sẻ qua ứng dụng khác (Zalo, Messenger…)"
          className={`${buttonClass} hover:bg-[#3B82F6] hover:border-[#3B82F6]`}
        >
          <Share2 className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
