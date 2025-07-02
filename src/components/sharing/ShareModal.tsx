import React, { useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel, Button } from "@headlessui/react";
import {
  ShareData,
  copyToClipboard,
  generateShareableUrl,
} from "@/utils/sharing";
import SocialShareButtons from "./SocialShareButtons";
import { IoClose } from "react-icons/io5";
import { HiOutlineClipboardCopy, HiOutlineCheck } from "react-icons/hi";
import { toast } from "react-toastify";

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  shareData: ShareData;
  onShare?: (platform: string) => void;
}

const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  shareData,
  onShare,
}) => {
  const [copied, setCopied] = useState(false);
  const shareableUrl = generateShareableUrl(
    shareData.courseId,
    shareData.title,
  );

  const handleCopyLink = async () => {
    const success = await copyToClipboard(shareableUrl);
    if (success) {
      setCopied(true);
      toast.success("Link copied to clipboard!", {
        position: "top-right",
        autoClose: 2000,
      });
      setTimeout(() => setCopied(false), 2000);
    } else {
      toast.error("Failed to copy link", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-0 z-10 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center sm:p-0">
          <DialogPanel className="relative transform overflow-hidden rounded-2xl bg-white py-8 text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
            <div className="bg-white px-6 py-4">
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-bold leading-6 text-gray-900">
                    Share Course
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Share this course with your network
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                >
                  <IoClose size={24} />
                </button>
              </div>

              {/* Course Preview */}
              <div className="mb-8 p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                <h4 className="font-bold text-gray-900 mb-3 text-lg">
                  {shareData.title}
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                  {shareData.description}
                </p>
              </div>

              {/* Copy Link Section */}
              <div className="mb-8">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Share this link
                </label>
                <div className="flex">
                  <input
                    type="text"
                    value={shareableUrl}
                    readOnly
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#9B51E0] focus:border-transparent bg-gray-50"
                    placeholder="Course link will appear here"
                  />
                  <button
                    onClick={handleCopyLink}
                    className={`px-4 py-3 rounded-r-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                      copied
                        ? "bg-green-500 text-white shadow-lg"
                        : "bg-[#9B51E0] text-white hover:bg-[#5801A9] shadow-md hover:shadow-lg"
                    }`}
                  >
                    {copied ? (
                      <>
                        <HiOutlineCheck size={18} />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <HiOutlineClipboardCopy size={18} />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Social Share Buttons */}
              <div className="mb-8">
                <label className="block text-sm font-semibold text-gray-700 mb-4">
                  Share on social media
                </label>
                <SocialShareButtons
                  shareData={{ ...shareData, url: shareableUrl }}
                  onShare={onShare}
                />
              </div>

              {/* Footer */}
              <div className="flex justify-end pt-4 border-t border-gray-100">
                <Button
                  onClick={onClose}
                  className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                >
                  Close
                </Button>
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default ShareModal;
