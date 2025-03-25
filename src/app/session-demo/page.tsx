"use client";

import React, { useState } from "react";
import { useWallet } from "@/hooks/useWallet";
import { ConnectButton } from "@/components/connect/ConnectButton";
import { SessionKeyManager } from "@/components/session/SessionKeyManager";

const SessionDemo = () => {
  const { wallet, disconnectWallet } = useWallet();
  const [isCorrectNetwork, setIsCorrectNetwork] = useState<boolean | null>(null);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-[#4A90E2] to-[#9B51E0]">
        Argent Session Keys Demo
      </h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-3">What are Session Keys?</h2>
        <p className="text-gray-700 mb-4">
          Session keys enable applications to execute transactions on behalf of users for a limited time without requiring a signature for each transaction. This improves user experience by reducing the number of signature requests.
        </p>
        
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 my-4">
          <h3 className="font-medium text-blue-700 mb-2">Key Features:</h3>
          <ul className="list-disc pl-5 text-gray-700 space-y-1">
            <li>Time-limited: Sessions automatically expire after a set period (24 hours by default)</li>
            <li>Scope-limited: Only approved contracts and functions can be called</li>
            <li>Revocable: Users can clear the session at any time</li>
            <li>Gas-efficient: Transactions through session keys have lower gas costs</li>
          </ul>
        </div>
        
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 my-4">
          <h3 className="font-medium text-yellow-700">Important Notes:</h3>
          <p className="text-gray-700 mt-1">
            Session keys are currently only supported by Argent X wallet. When a session is active, you'll see a real-time countdown of remaining time until expiry. You can manually clear a session at any time using the "Clear Session" button.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Wallet Connection</h2>
        {!wallet ? (
          <div className="flex flex-col items-center">
            <p className="text-gray-700 mb-4">Connect your wallet to try out session keys:</p>
            <ConnectButton setIsCorrectNetwork={setIsCorrectNetwork} />
          </div>
        ) : (
          <div>
            <p className="text-gray-700 mb-2">Connected wallet:</p>
            <div className="bg-gray-100 p-3 rounded-md font-mono text-sm mb-4 break-all">
              {wallet.account?.address}
            </div>
            <div className="flex justify-center">
              <button
                onClick={disconnectWallet}
                className="bg-red-100 text-red-700 px-4 py-2 rounded-md hover:bg-red-200 transition"
              >
                Disconnect Wallet
              </button>
            </div>
          </div>
        )}
      </div>

      {wallet && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Session Key Management</h2>
          
          <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
            <p className="text-gray-700">
              Create a session key to allow this demo to execute transactions on your behalf. 
              Once the session is active, you can execute sample transactions without additional signature requests.
              The timer will show how much time is left before the session expires.
            </p>
          </div>
          
          <SessionKeyManager />
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="font-medium text-gray-800 mb-2">Try it out:</h3>
            <ol className="list-decimal pl-5 text-gray-700 space-y-2">
              <li>Click "Create Session" to generate and approve a session key</li>
              <li>Once active, note the countdown timer showing session expiry</li>
              <li>Click "Execute Transaction" to send a transaction without requiring a signature</li>
              <li>If needed, click "Clear Session" to revoke the session immediately</li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
};

export default SessionDemo; 