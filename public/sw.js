// Service Worker for Background Uploads
const CACHE_NAME = "attensys-upload-cache-v1";

// Install event - cache necessary files
self.addEventListener("install", (event) => {
  console.log("Service Worker installing...");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        "/",
        "/static/js/bundle.js",
        "/static/css/main.css",
      ]);
    }),
  );
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("Service Worker activating...");
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("Deleting old cache:", cacheName);
            return caches.delete(cacheName);
          }
        }),
      );
    }),
  );
});

// Listen for online events to automatically trigger uploads
self.addEventListener("online", (event) => {
  console.log("Device came back online, checking for pending uploads...");
  event.waitUntil(handleBackgroundUpload());
});

// Background sync event for uploads
self.addEventListener("sync", (event) => {
  console.log("Background sync triggered:", event.tag);

  if (event.tag === "background-upload") {
    event.waitUntil(handleBackgroundUpload());
  }
});

// Handle background upload
async function handleBackgroundUpload() {
  try {
    // Get pending uploads from IndexedDB
    const pendingUploads = await getPendingUploads();

    if (pendingUploads.length === 0) {
      console.log("No pending uploads found");
      return;
    }

    console.log(`Processing ${pendingUploads.length} pending uploads`);

    for (const upload of pendingUploads) {
      try {
        // Update status to uploading and notify main thread
        await updateUploadStatus(upload.id, "uploading");

        // Notify main thread that upload started
        self.clients.matchAll().then((clients) => {
          clients.forEach((client) => {
            client.postMessage({
              type: "UPLOAD_STARTED",
              uploadId: upload.id,
            });
          });
        });

        await processUpload(upload);
        await removePendingUpload(upload.id);
        console.log(`Upload completed: ${upload.fileName}`);
      } catch (error) {
        console.error(`Upload failed for ${upload.fileName}:`, error);
        await updateUploadStatus(upload.id, "failed", error.message);

        // Notify main thread of failure
        self.clients.matchAll().then((clients) => {
          clients.forEach((client) => {
            client.postMessage({
              type: "UPLOAD_FAILED",
              uploadId: upload.id,
              error: error.message,
            });
          });
        });
      }
    }
  } catch (error) {
    console.error("Background upload error:", error);
  }
}

// Process individual upload
async function processUpload(upload) {
  const formData = new FormData();

  // Convert base64 back to blob
  const response = await fetch(upload.fileData);
  const blob = await response.blob();
  formData.append("file", blob, upload.fileName);
  formData.append("network", "private");

  const uploadResponse = await fetch("https://uploads.pinata.cloud/v3/files", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${upload.pinataJwt}`,
    },
    body: formData,
  });

  if (!uploadResponse.ok) {
    throw new Error(`Upload failed: ${uploadResponse.statusText}`);
  }

  const result = await uploadResponse.json();

  // Update status to completed
  await updateUploadStatus(upload.id, "completed");

  // Store the result for when the app comes back online
  await storeUploadResult(upload.id, result);

  // Notify main thread
  self.clients.matchAll().then((clients) => {
    clients.forEach((client) => {
      client.postMessage({
        type: "UPLOAD_COMPLETED",
        uploadId: upload.id,
        result: result,
      });
    });
  });

  return result;
}

// IndexedDB operations
async function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("AttensysUploads", 1);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      // Create object store for pending uploads
      if (!db.objectStoreNames.contains("pendingUploads")) {
        const uploadStore = db.createObjectStore("pendingUploads", {
          keyPath: "id",
        });
        uploadStore.createIndex("status", "status", { unique: false });
      }

      // Create object store for upload results
      if (!db.objectStoreNames.contains("uploadResults")) {
        const resultStore = db.createObjectStore("uploadResults", {
          keyPath: "id",
        });
      }
    };
  });
}

async function getPendingUploads() {
  const db = await openDB();
  const transaction = db.transaction(["pendingUploads"], "readonly");
  const store = transaction.objectStore("pendingUploads");
  const index = store.index("status");

  return new Promise((resolve, reject) => {
    const request = index.getAll("pending");
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function addPendingUpload(upload) {
  const db = await openDB();
  const transaction = db.transaction(["pendingUploads"], "readwrite");
  const store = transaction.objectStore("pendingUploads");

  return new Promise((resolve, reject) => {
    const request = store.add(upload);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function removePendingUpload(id) {
  const db = await openDB();
  const transaction = db.transaction(["pendingUploads"], "readwrite");
  const store = transaction.objectStore("pendingUploads");

  return new Promise((resolve, reject) => {
    const request = store.delete(id);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function updateUploadStatus(id, status, error = null) {
  const db = await openDB();
  const transaction = db.transaction(["pendingUploads"], "readwrite");
  const store = transaction.objectStore("pendingUploads");

  return new Promise((resolve, reject) => {
    const getRequest = store.get(id);
    getRequest.onsuccess = () => {
      const upload = getRequest.result;
      if (upload) {
        upload.status = status;
        upload.error = error;
        upload.updatedAt = new Date().toISOString();

        const putRequest = store.put(upload);
        putRequest.onsuccess = () => resolve(putRequest.result);
        putRequest.onerror = () => reject(putRequest.error);
      } else {
        reject(new Error("Upload not found"));
      }
    };
    getRequest.onerror = () => reject(getRequest.error);
  });
}

async function storeUploadResult(id, result) {
  const db = await openDB();
  const transaction = db.transaction(["uploadResults"], "readwrite");
  const store = transaction.objectStore("uploadResults");

  return new Promise((resolve, reject) => {
    const request = store.put({
      id,
      result,
      completedAt: new Date().toISOString(),
    });
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Expose functions to main thread
self.addEventListener("message", async (event) => {
  if (event.data && event.data.type === "GET_PENDING_UPLOADS") {
    getPendingUploads()
      .then((uploads) => {
        event.ports[0].postMessage({ uploads });
      })
      .catch((error) => {
        event.ports[0].postMessage({ error: error.message });
      });
  }

  if (event.data && event.data.type === "ADD_PENDING_UPLOAD") {
    addPendingUpload(event.data.upload)
      .then(() => {
        event.ports[0].postMessage({ success: true });
      })
      .catch((error) => {
        event.ports[0].postMessage({ error: error.message });
      });
  }

  if (event.data && event.data.type === "REMOVE_PENDING_UPLOAD") {
    removePendingUpload(event.data.id)
      .then(() => {
        event.ports[0].postMessage({ success: true });
      })
      .catch((error) => {
        event.ports[0].postMessage({ error: error.message });
      });
  }

  if (event.data && event.data.type === "GET_UPLOAD_RESULT") {
    try {
      const db = await openDB();
      const transaction = db.transaction(["uploadResults"], "readonly");
      const store = transaction.objectStore("uploadResults");

      const request = store.get(event.data.id);
      request.onsuccess = () => {
        event.ports[0].postMessage({ result: request.result });
      };
      request.onerror = () => {
        event.ports[0].postMessage({ error: request.error.message });
      };
    } catch (error) {
      event.ports[0].postMessage({ error: error.message });
    }
  }
});

// Make functions available globally for debugging
self.getPendingUploads = getPendingUploads;
self.addPendingUpload = addPendingUpload;
self.removePendingUpload = removePendingUpload;
self.updateUploadStatus = updateUploadStatus;
self.storeUploadResult = storeUploadResult;
