import { FC, useState } from "react";
import { useArgentInvisible } from "@/hooks/useArgentInvisible";

interface ArgentInvisibleButtonProps {
  className?: string;
}

export const ArgentInvisibleButton: FC<ArgentInvisibleButtonProps> = ({ className }) => {
  const { account, connectStatus, connect, disconnect } = useArgentInvisible();
  const [showTooltip, setShowTooltip] = useState(false);

  const handleConnect = async () => {
    await connect();
  };

  const handleDisconnect = async () => {
    await disconnect();
  };

  const isConnected = account !== undefined;
  const isConnecting = connectStatus === "Connecting";
  
  // Format address for display
  const displayAddress = account?.address 
    ? `${account.address.slice(0, 6)}...${account.address.slice(-4)}`
    : "";

  return (
    <div>
      {!isConnected ? (
        <button
          className={`bg-gradient-to-r from-[#4A90E2] to-[#9B51E0] text-white text-sm leading-4 px-2 py-2 rounded-md flex items-center justify-center space-x-1 ${className}`}
          onClick={handleConnect}
          disabled={isConnecting}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 12a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3"
            />
          </svg>
          <span>{isConnecting ? "Connecting..." : "Connect with Argent Web"}</span>
        </button>
      ) : (
        <div className="flex flex-col">
          <div className="relative">
            <a 
              href="https://web.argent.xyz" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs text-[#9B51E0] mb-1 text-center hover:underline cursor-pointer transition-all flex items-center justify-center"
              title="Open Wallet Dashboard"
              onMouseOver={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              {displayAddress}
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                strokeWidth="1.5" 
                stroke="currentColor" 
                className="w-3 h-3 ml-1"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" 
                />
              </svg>
            </a>
            {showTooltip && (
              <div className="absolute top-5 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
                Open Wallet Dashboard
                <div className="absolute bottom-[-6px] left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-t-[6px] border-t-gray-800 border-r-[6px] border-r-transparent"></div>
              </div>
            )}
          </div>
          <button
            onClick={handleDisconnect}
            className={`bg-gradient-to-r from-[#4A90E2] to-[#9B51E0] text-sm leading-4 text-white px-2 py-2 rounded-md flex items-center justify-center space-x-1 ${className}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25V9m-4.5 0h12m-9 0v9a2.25 2.25 0 0 0 2.25 2.25h3A2.25 2.25 0 0 0 15 18V9m-6 0h6"
              />
            </svg>
            <span>Disconnect Argent</span>
          </button>
        </div>
      )}
    </div>
  );
}; 