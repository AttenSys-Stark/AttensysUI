import React, { useState, useEffect } from "react";
import { useSessionKeys } from "@/hooks/useSessionKeys";
import { Account, Call, CallData } from "starknet";
import { ATTENSYS_CONTRACT_ADDRESS } from "@/utils/sessionKeys";

interface SessionKeyManagerProps {
  containerClassName?: string;
  compact?: boolean;
}

export const SessionKeyManager: React.FC<SessionKeyManagerProps> = ({
  containerClassName,
  compact = false,
}) => {
  const {
    sessionKey,
    session,
    sessionAccount,
    isCreatingSession,
    error,
    createSession,
    clearSession,
  } = useSessionKeys();
  const [isExecuting, setIsExecuting] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [executionError, setExecutionError] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<string>("");
 
  // Calculate and update the time remaining for the session
  useEffect(() => {
    if (!session) {
      setTimeRemaining("");
      return;
    }
    
    const updateTimeRemaining = () => {
      try {
        // Get expiry from session based on the known structure
        const sessionExpiry = (session as any).expiresAt;
        
        if (!sessionExpiry) {
          setTimeRemaining("");
          return;
        }
        
        const now = Math.floor(Date.now() / 1000);
        const remainingSeconds = Math.max(0, sessionExpiry - now);
        
        if (remainingSeconds <= 0) {
          setTimeRemaining("Expired");
          // Automatically clear expired session
          clearSession();
          return;
        }
        
        const hours = Math.floor(remainingSeconds / 3600);
        const minutes = Math.floor((remainingSeconds % 3600) / 60);
        
        setTimeRemaining(`${hours}h ${minutes}m remaining`);
      } catch (error) {
        console.error("Error calculating time remaining:", error);
        setTimeRemaining("");
      }
    };
    
    // Update immediately and then every minute
    updateTimeRemaining();
    const intervalId = setInterval(updateTimeRemaining, 60000);
    
    return () => clearInterval(intervalId);
  }, [session, clearSession]);

  // Function to handle session creation
  const handleCreateSession = async () => {
    setExecutionError(null);
    setTxHash(null);
    try {
      const result = await createSession();
      if (!result) {
        console.error("Session creation failed without throwing an error");
      }
    } catch (error: any) {
      console.error("Session creation handling error:", error);
    }
  };

  // Example function to execute a transaction using the session
  const executeTransaction = async () => {
    if (!sessionAccount) {
      setExecutionError("No session account available");
      return;
    }

    setIsExecuting(true);
    setExecutionError(null);
    setTxHash(null);

    try {
      // Sample call to a contract function
      const call: Call = {
        contractAddress: ATTENSYS_CONTRACT_ADDRESS,
        entrypoint: "acquire_a_course",
        calldata: CallData.compile([10, 0]), //  u256 value of 10 (low = 10, high = 0)
      };

      console.log("Executing transaction with session account:", sessionAccount);

      // Estimate fee for the transaction
      const { suggestedMaxFee, resourceBounds } = await (sessionAccount as Account).estimateInvokeFee(
        call,
        { version: "0x3" }
      );

      // Add a buffer to the estimated fee
      const maxFee = (suggestedMaxFee * BigInt(15)) / BigInt(10);

      // Adjusted resource bounds
      const adjustedResourceBounds = {
        ...resourceBounds,
        l1_gas: {
          ...resourceBounds.l1_gas,
          max_amount: "0x28",
        },
      };

      // Execute the transaction
      const { transaction_hash } = await (sessionAccount as Account).execute(
        call,
        {
          maxFee,
          resourceBounds: adjustedResourceBounds,
          version: "0x3",
        }
      );

      setTxHash(transaction_hash);
    } catch (error: any) {
      console.error("Transaction execution failed:", error);
      setExecutionError(error.message || "Failed to execute transaction");
    } finally {
      setIsExecuting(false);
    }
  };

  // Compact mode for header display
  if (compact) {
    return (
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className={`${
            session 
              ? "bg-green-100 w-36 text-green-700 " 
              : "bg-transparent hover:bg-gray-300 text-gray-700"
          } py-2 px-4 rounded-md flex leading-5 text-sm items-center justify-center space-x-2 border border-green-300`}
          title={session ? "Session Active" : "Manage Session Keys"}
        >
          {!session && <span className="hidden md:inline">Session Keys</span>}
          {session && <span className="hidden md:inline">Session Active</span>}
        </button>
        
        {showDropdown && (
          <div className="absolute top-5 right-0 z-50 w-40 bg-white rounded-lg shadow-lg border border-gray-200">
            {!session ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCreateSession();
                    setShowDropdown(false);
                  }}
                  disabled={isCreatingSession}
                  className="bg-gradient-to-r from-[#4A90E2] to-[#9B51E0] text-white text-sm py-2 px-4 rounded-md w-full flex items-center justify-center"
                >
                  {isCreatingSession ? "Creating Session..." : "Create Session"}
                </button>
            ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      clearSession();
                      setShowDropdown(false);
                    }}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-md w-full"
                  >
                    Clear Session
                  </button>
            )}
          </div>
        )}
      </div>
    );
  }

  // Regular full view
  return (
    <div className={containerClassName}>
      <div className="bg-white rounded-lg shadow-md p-4">
        <h2 className="text-lg font-semibold mb-4">Session Keys</h2>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4">
            <p className="font-semibold mb-1">Session Error:</p>
            <p className="text-sm">{error}</p>
          </div>
        )}
        
        {!session ? (
          <button
            onClick={handleCreateSession}
            disabled={isCreatingSession}
            className="bg-gradient-to-r from-[#4A90E2] to-[#9B51E0] text-white py-2 px-4 rounded-md w-full flex items-center justify-center space-x-2 mb-4"
          >
            {isCreatingSession ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Creating Session...</span>
              </>
            ) : (
              <span>Create Session</span>
            )}
          </button>
        ) : (
          <div className="space-y-4">
            <div className="bg-gray-100 p-3 rounded-md">
              <p className="text-sm text-gray-600 mb-1">Session Active</p>
              {timeRemaining && (
                <p className="text-xs text-gray-600 mt-1 flex items-center">
                  <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {timeRemaining}
                </p>
              )}
            </div>
            
            <div className="flex flex-col space-y-2">
              <button
                onClick={executeTransaction}
                disabled={isExecuting}
                className="bg-gradient-to-r from-[#4A90E2] to-[#9B51E0] text-white py-2 px-4 rounded-md w-full flex items-center justify-center"
              >
                {isExecuting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Executing...</span>
                  </>
                ) : (
                  <span>Execute Transaction</span>
                )}
              </button>
              
              <button
                onClick={clearSession}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-md w-full"
              >
                Clear Session
              </button>
            </div>
            
            {txHash && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded">
                <p className="font-semibold mb-1">Transaction sent!</p>
                <p className="text-xs font-mono break-all">{txHash}</p>
              </div>
            )}
            
            {executionError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
                <p className="font-semibold mb-1">Execution error:</p>
                <p className="text-sm">{executionError}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}; 