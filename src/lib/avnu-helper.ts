// Helper to execute AVNU gasless transactions via server-side API
export const executeAvnuTransaction = async (account: any, calls: any[], gasTokenAddress: string) => {
  const response = await fetch("/api/avnu/execute-transaction", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      account: account.address,
      calls,
      gasTokenAddress,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to execute gasless transaction");
  }

  return await response.json();
};