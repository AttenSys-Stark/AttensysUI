import React from "react";
import {
  TwitterShareButton,
  LinkedinShareButton,
  TelegramShareButton,
  EmailShareButton,
  TwitterIcon,
  LinkedinIcon,
  TelegramIcon,
  EmailIcon,
} from "react-share";
import { ShareData, openShareWindow, trackShareEvent } from "@/utils/sharing";

interface SocialShareButtonsProps {
  shareData: ShareData;
  onShare?: (platform: string) => void;
}

const SocialShareButtons: React.FC<SocialShareButtonsProps> = ({
  shareData,
  onShare,
}) => {
  const handleShare = (platform: string, url: string) => {
    openShareWindow(url, platform);
    trackShareEvent(platform, shareData.courseId);
    onShare?.(platform);
  };

  const { title, description, url } = shareData;

  const shareButtonClass =
    "flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-gray-50 transition-all duration-200 hover:scale-105 hover:shadow-md border border-transparent hover:border-gray-200";

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <TwitterShareButton
        url={url}
        title={title}
        onClick={() =>
          handleShare(
            "twitter",
            `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
          )
        }
        className={shareButtonClass}
      >
        <div className="flex flex-col items-center gap-2">
          <TwitterIcon size={40} round />
          <span className="text-xs font-semibold text-gray-700">Twitter</span>
        </div>
      </TwitterShareButton>

      <LinkedinShareButton
        url={url}
        title={title}
        summary={description}
        onClick={() =>
          handleShare(
            "linkedin",
            `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
          )
        }
        className={shareButtonClass}
      >
        <div className="flex flex-col items-center gap-2">
          <LinkedinIcon size={40} round />
          <span className="text-xs font-semibold text-gray-700">LinkedIn</span>
        </div>
      </LinkedinShareButton>

      <TelegramShareButton
        url={url}
        title={title}
        onClick={() =>
          handleShare(
            "telegram",
            `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
          )
        }
        className={shareButtonClass}
      >
        <div className="flex flex-col items-center gap-2">
          <TelegramIcon size={40} round />
          <span className="text-xs font-semibold text-gray-700">Telegram</span>
        </div>
      </TelegramShareButton>

      <EmailShareButton
        url={url}
        subject={title}
        body={description}
        onClick={() =>
          handleShare(
            "email",
            `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${description}\n\n${url}`)}`,
          )
        }
        className={shareButtonClass}
      >
        <div className="flex flex-col items-center gap-2">
          <EmailIcon size={40} round />
          <span className="text-xs font-semibold text-gray-700">Email</span>
        </div>
      </EmailShareButton>
    </div>
  );
};

export default SocialShareButtons;
