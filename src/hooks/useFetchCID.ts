import { LRUCache } from "lru-cache";
import { useCallback, useState } from "react";
import { pinata } from "../../utils/config";
/**
 * useFetchCID Hook
 *
 * This custom hook provides functionality to fetch content from IPFS using a CID (Content Identifier).
 * It manages the fetching process with retry logic, caching, and loading/error states.
 *
 * Usage:
 *
 * const { fetchCIDContent, isLoading, getError } = useFetchCID();
 *
 * @returns {Object} - An object containing:
 *   - fetchCIDContent: A function to fetch content using a CID.
 *   - isLoading: A boolean indicating if the fetch operation is in progress.
 *   - getError: A function to retrieve any error that occurred during fetching.
 *
 * Caching:
 * The hook uses an LRU (Least Recently Used) cache to store responses for a specified time (default: 30 minutes).
 *
 * Retry Logic:
 * If a fetch operation fails, it will automatically retry up to a maximum number of attempts (default: 2) with an increasing delay between attempts.
 */

interface FetchStatus {
  loading: boolean;
  error: string | null;
  lastUpdated?: number;
}

const DEFAULT_MAX_RETRIES = 2;
const RETRY_DELAY = 1000;
const DEFAULT_TTL = 1000 * 60 * 30; // 30 minutes
const cache = new LRUCache({
  max: 1000,
  ttl: DEFAULT_TTL, // 5 minutes in milliseconds
});
export const useFetchCID = () => {
  const [status, setStatus] = useState<Record<string, FetchStatus>>({});

  const updateStatus = useCallback(
    (CID: string, updates: Partial<FetchStatus>) => {
      setStatus((prev) => ({
        ...prev,
        [CID]: { ...prev[CID], ...updates, lastUpdated: Date.now() },
      }));
    },
    [],
  );

  const fetchWithRetry = useCallback(
    async (CID: string, retryCount = 0): Promise<any> => {
      try {
        return await pinata.gateways.get(CID);
      } catch (error: any) {
        if (retryCount < DEFAULT_MAX_RETRIES) {
          await new Promise((resolve) =>
            setTimeout(resolve, RETRY_DELAY * (retryCount + 1)),
          );
          return fetchWithRetry(CID, retryCount + 1);
        }
        throw new Error(`Failed to fetch CID ${CID}: ${error.message}`);
      }
    },
    [],
  );

  const fetchCIDContent = useCallback(
    async (CID: string) => {
      if (!CID) return null;
      updateStatus(CID, { loading: true, error: null });
      const cachedResponse = cache.get(CID);
      if (cachedResponse) {
        // console.log("Serving from cache", cachedResponse);
        return cachedResponse;
      }
      try {
        console.log("Serving from network", CID);
        let data = await fetchWithRetry(CID);
        cache.set(CID, data);

        updateStatus(CID, { loading: false });
        return data;
      } catch (error: any) {
        updateStatus(CID, {
          loading: false,
          error: error.message || "Unknown error",
        });
        return null;
      }
    },
    [fetchWithRetry, updateStatus],
  );

  const fetchMultipleCIDs = useCallback(
    async (CIDs: string[]) => {
      return Promise.all(CIDs.map((cid) => fetchCIDContent(cid)));
    },
    [fetchCIDContent],
  );

  return {
    fetchCIDContent,
    fetchMultipleCIDs,
    isLoading: useCallback(
      (CID: string) => status[CID]?.loading ?? false,
      [status],
    ),
    getError: useCallback(
      (CID: string) => status[CID]?.error ?? null,
      [status],
    ),
    getLastUpdated: useCallback(
      (CID: string) => status[CID]?.lastUpdated,
      [status],
    ),
  };
};
