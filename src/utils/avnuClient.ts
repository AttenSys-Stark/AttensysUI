// Client-side AVNU wrapper that uses server-side API
export const executeCallsSecure = async (
  account: any,
  calls: any[],
  options?: {
    gasTokenAddress?: string;
    maxFeePercentage?: number;
  }
) => {
  const response = await fetch('/api/avnu/execute-calls', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      account: {
        address: account.address,
      },
      calls,
      options,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
  }

  return await response.json();
};