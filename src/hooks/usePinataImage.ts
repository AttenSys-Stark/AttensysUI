import { useState, useEffect } from 'react';

export const usePinataImage = (cid: string | undefined) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!cid || cid === 'undefined' || cid.trim() === '') {
      console.log('usePinataImage: Skipping invalid CID:', cid);
      return;
    }

    console.log('usePinataImage: Fetching image for CID:', cid);

    const fetchImageUrl = async () => {
      setLoading(true);
      setError(null);

      try {
        // First try to get config for gateway URL
        const configResponse = await fetch('/api/config');
        const config = await configResponse.json();

        // For private content, we should create an access link
        const accessResponse = await fetch('/api/pinata/access-link', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            cid: cid,
            expires: 3600, // 1 hour
          }),
        });

        if (accessResponse.ok) {
          const { url } = await accessResponse.json();
          console.log('usePinataImage: Got access URL:', url);
          setImageUrl(url);
        } else {
          // Fallback to public gateway if access link fails
          const fallbackUrl = `${config.gatewayUrl}/ipfs/${cid}`;
          console.log('usePinataImage: Using fallback URL:', fallbackUrl);
          setImageUrl(fallbackUrl);
        }
      } catch (err) {
        console.error('Error fetching image URL:', err);
        setError(err instanceof Error ? err.message : 'Failed to load image');
        // Fallback to public IPFS gateway
        setImageUrl(`https://ipfs.io/ipfs/${cid}`);
      } finally {
        setLoading(false);
      }
    };

    fetchImageUrl();
  }, [cid]);

  return { imageUrl, loading, error };
};