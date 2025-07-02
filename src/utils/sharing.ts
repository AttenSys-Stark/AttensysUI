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
  baseUrl: string = "http://attensys.xyz",
): string => {
  if (courseName) {
    // Create a professional URL with course slug
    const slug = generateSlug(courseName);
    return `${baseUrl}/c/${slug}?id=${courseId}`;
  } else {
    // Fallback to clean ID-based URL
    return `${baseUrl}/c/${courseId}`;
  }
};

export const copyToClipboard = (text: string): Promise<boolean> => {
  return new Promise((resolve) => {
    try {
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
  const width = 600;
  const height = 400;
  const left = window.screen.width / 2 - width / 2;
  const top = window.screen.height / 2 - height / 2;

  window.open(
    url,
    `share-${platform}`,
    `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`,
  );
};

export const trackShareEvent = (platform: string, courseId: string) => {
  // Analytics tracking for share events
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "share", {
      method: platform,
      content_type: "course",
      item_id: courseId,
    });
  }

  console.log(`Shared course ${courseId} on ${platform}`);
};
