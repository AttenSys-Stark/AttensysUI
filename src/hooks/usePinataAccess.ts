import { useState, useEffect } from "react";

export const usePinataAccess = () => {
  const [url, setUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createAccessLink = async (cid: string, expires: number = 86400) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch("/api/pinata/access-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cid, expires }),
      });

      if (!response.ok) throw new Error("Failed to create access link");
      
      const { url: accessUrl } = await response.json();
      setUrl(accessUrl);
      return accessUrl;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createAccessLink, url, loading, error };
};
