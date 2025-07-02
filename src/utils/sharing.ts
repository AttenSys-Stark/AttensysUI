import copy from "copy-to-clipboard";

// Declare global gtag function
declare global {
  interface Window {
    gtag?: (command: string, action: string, params: any) => void;
  }
}

export interface ShareData {
  title: string;
  description: string;
  url: string;
  image?: string;
  courseId: string;
}

// Helper function to generate URL-friendly slugs from course names
export const generateSlug = (courseName: string): string => {
  if (!courseName) return "";

  return courseName
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters except hyphens
    .replace(/[\s_-]+/g, "-") // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
};

// Generate a professional, SEO-friendly URL
export const generateShareableUrl = (
  courseId: string,
  courseName?: string,
  baseUrl: string = "https://attensys.xyz",
): string => {
  if (!courseId) {
    console.warn("No course ID provided for shareable URL generation");
    return baseUrl;
  }

  try {
    if (courseName) {
      // Create a professional URL with course slug
      const slug = generateSlug(courseName);
      return `${baseUrl}/c/${slug}?id=${courseId}`;
    } else {
      // Fallback to clean ID-based URL
      return `${baseUrl}/c/${courseId}`;
    }
  } catch (error) {
    console.error("Error generating shareable URL:", error);
    return `${baseUrl}/c/${courseId}`;
  }
};

export const copyToClipboard = (text: string): Promise<boolean> => {
  return new Promise((resolve) => {
    try {
      if (!text) {
        console.warn("No text provided to copy");
        resolve(false);
        return;
      }

      // Check if copy-to-clipboard is available
      if (typeof copy !== "function") {
        console.warn(
          "copy-to-clipboard not available, falling back to navigator.clipboard",
        );

        // Fallback to native clipboard API
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard
            .writeText(text)
            .then(() => resolve(true))
            .catch((err) => {
              console.error("Native clipboard API failed:", err);
              resolve(false);
            });
          return;
        }

        resolve(false);
        return;
      }

      const success = copy(text, {
        format: "text/plain",
        onCopy: () => resolve(true),
      });
      resolve(success);
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
      resolve(false);
    }
  });
};

export const getSocialShareUrls = (shareData: ShareData) => {
  const { title, description, url } = shareData;

  return {
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    email: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${description}\n\n${url}`)}`,
  };
};

export const openShareWindow = (url: string, platform: string) => {
  try {
    const width = 600;
    const height = 400;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    const shareWindow = window.open(
      url,
      `share-${platform}`,
      `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`,
    );

    if (!shareWindow) {
      console.warn("Popup blocked by browser, opening in new tab");
      window.open(url, "_blank");
    }
  } catch (error) {
    console.error("Error opening share window:", error);
    // Fallback to opening in new tab
    window.open(url, "_blank");
  }
};

export const trackShareEvent = (platform: string, courseId: string) => {
  try {
    // Analytics tracking for share events
    if (typeof window !== "undefined" && window.gtag) {
      window.gtag("event", "share", {
        method: platform,
        content_type: "course",
        item_id: courseId,
      });
    }

    console.log(`Shared course ${courseId} on ${platform}`);
  } catch (error) {
    console.error("Error tracking share event:", error);
  }
};
