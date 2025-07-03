import { useState, useEffect, useCallback } from "react";

// Type declarations for Background Sync API
declare global {
  interface ServiceWorkerRegistration {
    sync: {
      register(tag: string): Promise<void>;
    };
  }

  interface ServiceWorkerGlobalScope {
    sync: {
      register(tag: string): Promise<void>;
    };
  }
}

interface BackgroundUpload {
  id: string;
  fileName: string;
  fileData: string; // base64 encoded file
  pinataJwt: string;
  lectureName?: string;
  lectureDescription?: string;
  status: "pending" | "uploading" | "completed" | "failed";
  error?: string;
  createdAt: string;
  updatedAt?: string;
}

interface UploadResult {
  id: string;
  result: any;
  completedAt: string;
}

export const useBackgroundUpload = () => {
  const [isServiceWorkerReady, setIsServiceWorkerReady] = useState(false);
  const [pendingUploads, setPendingUploads] = useState<BackgroundUpload[]>([]);
  const [uploadResults, setUploadResults] = useState<UploadResult[]>([]);

  // Register service worker
  useEffect(() => {
    const registerServiceWorker = async () => {
      try {
        if (
          "serviceWorker" in navigator &&
          "sync" in window.ServiceWorkerRegistration.prototype
        ) {
          const registration = await navigator.serviceWorker.register("/sw.js");
          console.log("Service Worker registered:", registration);

          // Wait for service worker to be ready
          await navigator.serviceWorker.ready;
          setIsServiceWorkerReady(true);

          // Check for existing pending uploads
          await checkPendingUploads();

          // Listen for upload results
          navigator.serviceWorker.addEventListener(
            "message",
            handleServiceWorkerMessage,
          );
        } else {
          console.warn("Background Sync not supported in this browser");
          setIsServiceWorkerReady(false);
        }
      } catch (error) {
        console.error("Service Worker registration failed:", error);
        setIsServiceWorkerReady(false);
      }
    };

    registerServiceWorker();

    return () => {
      navigator.serviceWorker.removeEventListener(
        "message",
        handleServiceWorkerMessage,
      );
    };
  }, []);

  const handleServiceWorkerMessage = useCallback((event: MessageEvent) => {
    if (event.data && event.data.type === "UPLOAD_STARTED") {
      const { uploadId } = event.data;
      setPendingUploads((prev) =>
        prev.map((upload) =>
          upload.id === uploadId
            ? {
                ...upload,
                status: "uploading",
                updatedAt: new Date().toISOString(),
              }
            : upload,
        ),
      );
    } else if (event.data && event.data.type === "UPLOAD_COMPLETED") {
      const { uploadId, result } = event.data;
      setUploadResults((prev) => [
        ...prev,
        { id: uploadId, result, completedAt: new Date().toISOString() },
      ]);
      setPendingUploads((prev) =>
        prev.filter((upload) => upload.id !== uploadId),
      );
    } else if (event.data && event.data.type === "UPLOAD_FAILED") {
      const { uploadId, error } = event.data;
      setPendingUploads((prev) =>
        prev.map((upload) =>
          upload.id === uploadId
            ? {
                ...upload,
                status: "failed",
                error,
                updatedAt: new Date().toISOString(),
              }
            : upload,
        ),
      );
    }
  }, []);

  const checkPendingUploads = useCallback(async () => {
    if (!isServiceWorkerReady) return;

    try {
      const messageChannel = new MessageChannel();

      return new Promise<void>((resolve, reject) => {
        messageChannel.port1.onmessage = (event) => {
          if (event.data.error) {
            reject(new Error(event.data.error));
          } else {
            setPendingUploads(event.data.uploads || []);
            resolve();
          }
        };

        navigator.serviceWorker.controller?.postMessage(
          { type: "GET_PENDING_UPLOADS" },
          [messageChannel.port2],
        );
      });
    } catch (error) {
      console.error("Failed to check pending uploads:", error);
    }
  }, [isServiceWorkerReady]);

  const addBackgroundUpload = useCallback(
    async (
      file: File,
      pinataJwt: string,
      lectureName?: string,
      lectureDescription?: string,
    ): Promise<string> => {
      if (!isServiceWorkerReady) {
        throw new Error("Service Worker not ready");
      }

      // Convert file to base64
      const fileData = await fileToBase64(file);

      const upload: BackgroundUpload = {
        id: `${Date.now()}-${Math.random()}`,
        fileName: file.name,
        fileData,
        pinataJwt,
        lectureName,
        lectureDescription,
        status: "pending",
        createdAt: new Date().toISOString(),
      };

      try {
        // Store in IndexedDB via service worker
        const messageChannel = new MessageChannel();

        return new Promise<string>((resolve, reject) => {
          messageChannel.port1.onmessage = (event) => {
            if (event.data.error) {
              reject(new Error(event.data.error));
            } else {
              setPendingUploads((prev) => [...prev, upload]);
              resolve(upload.id);
            }
          };

          navigator.serviceWorker.controller?.postMessage(
            {
              type: "ADD_PENDING_UPLOAD",
              upload,
            },
            [messageChannel.port2],
          );
        });
      } catch (error) {
        console.error("Failed to add background upload:", error);
        throw error;
      }
    },
    [isServiceWorkerReady],
  );

  const triggerBackgroundSync = useCallback(async () => {
    if (!isServiceWorkerReady) {
      throw new Error("Service Worker not ready");
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      await registration.sync.register("background-upload");
      console.log("Background sync registered");
    } catch (error) {
      console.error("Failed to register background sync:", error);
      throw error;
    }
  }, [isServiceWorkerReady]);

  const getUploadResult = useCallback(
    async (uploadId: string) => {
      if (!isServiceWorkerReady) return null;

      try {
        const messageChannel = new MessageChannel();

        return new Promise<UploadResult | null>((resolve, reject) => {
          messageChannel.port1.onmessage = (event) => {
            if (event.data.error) {
              reject(new Error(event.data.error));
            } else {
              resolve(event.data.result);
            }
          };

          navigator.serviceWorker.controller?.postMessage(
            {
              type: "GET_UPLOAD_RESULT",
              id: uploadId,
            },
            [messageChannel.port2],
          );
        });
      } catch (error) {
        console.error("Failed to get upload result:", error);
        return null;
      }
    },
    [isServiceWorkerReady],
  );

  const removeUpload = useCallback(
    async (uploadId: string) => {
      if (!isServiceWorkerReady) return;

      try {
        const messageChannel = new MessageChannel();

        return new Promise<void>((resolve, reject) => {
          messageChannel.port1.onmessage = (event) => {
            if (event.data.error) {
              reject(new Error(event.data.error));
            } else {
              setPendingUploads((prev) =>
                prev.filter((upload) => upload.id !== uploadId),
              );
              resolve();
            }
          };

          navigator.serviceWorker.controller?.postMessage(
            {
              type: "REMOVE_PENDING_UPLOAD",
              id: uploadId,
            },
            [messageChannel.port2],
          );
        });
      } catch (error) {
        console.error("Failed to remove upload:", error);
      }
    },
    [isServiceWorkerReady],
  );

  // Helper function to convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // Check if background sync is supported
  const isBackgroundSyncSupported = useCallback(() => {
    return (
      "serviceWorker" in navigator &&
      "sync" in window.ServiceWorkerRegistration.prototype
    );
  }, []);

  return {
    isServiceWorkerReady,
    pendingUploads,
    uploadResults,
    addBackgroundUpload,
    triggerBackgroundSync,
    getUploadResult,
    removeUpload,
    checkPendingUploads,
    isBackgroundSyncSupported,
  };
};
