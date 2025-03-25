import { useState, useCallback, useEffect } from "react";
import { 
  SessionKey,
  createSessionRequest, 
  createSession, 
  buildSessionAccount,
  Session,
  CreateSessionParams
} from "@argent/x-sessions";
import { constants, Account, AccountInterface } from "starknet";
import { useWallet } from "./useWallet";
import { provider } from "@/constants";
import { 
  allowedMethods, 
  getExpiry, 
  metaData,
  generateSessionKey, 
  toHexChainId,
  getArgentSessionServiceUrl
} from "@/utils/sessionKeys";

interface SessionState {
  sessionKey: SessionKey | null;
  session: Session | null;
  sessionAccount: Account | AccountInterface | null;
  isCreatingSession: boolean;
  error: string | null;
}

// Local storage keys for persisting session data
const SESSION_KEY_STORAGE_KEY = "attensys_session_key";
const SESSION_STORAGE_KEY = "attensys_session";

export const useSessionKeys = () => {
  const { wallet } = useWallet();
  
  const [sessionState, setSessionState] = useState<SessionState>({
    sessionKey: null,
    session: null,
    sessionAccount: null,
    isCreatingSession: false,
    error: null
  });

  // Load session data from local storage on component mount
  useEffect(() => {
    const loadSavedSession = async () => {
      try {
        // Only proceed if we have a connected wallet
        if (!wallet || !wallet.account?.address) return;
        
        // Get saved session data
        const savedSessionKeyStr = localStorage.getItem(SESSION_KEY_STORAGE_KEY);
        const savedSessionStr = localStorage.getItem(SESSION_STORAGE_KEY);
        
        if (!savedSessionKeyStr || !savedSessionStr) return;
        
        // Parse saved data
        const savedSessionKey = JSON.parse(savedSessionKeyStr) as SessionKey;
        const savedSession = JSON.parse(savedSessionStr) as Session;
        
        // Check if the session is for the current address
        if (savedSession.address.toLowerCase() !== wallet.account.address.toLowerCase()) {
          console.log("Saved session is for a different wallet address");
          return;
        }
        
        // For debugging - log the session structure
        console.log("Session structure:", savedSession);
        
        // Check if the session has expired - based on the correct structure from logs
        try {
          const now = Math.floor(Date.now() / 1000);
          // The expiry is in the expiresAt property based on the logs
          const sessionExpiry = (savedSession as any).expiresAt;
            
          if (!sessionExpiry || sessionExpiry < now) {
            console.log("Saved session has expired");
            // Clear expired session
            localStorage.removeItem(SESSION_KEY_STORAGE_KEY);
            localStorage.removeItem(SESSION_STORAGE_KEY);
            return;
          }
          
          console.log(`Session valid until: ${new Date(sessionExpiry * 1000).toLocaleString()}, ${Math.round((sessionExpiry - now) / 60)} minutes remaining`);
        } catch (error) {
          console.error("Error checking session expiry:", error);
          // Continue anyway - we'll let the session service validate the session
        }
        
        console.log("Loading saved session from local storage");
        
        // Build the session account
        const sessionAccount = await buildSessionAccount({
          session: savedSession,
          sessionKey: savedSessionKey,
          provider: provider as any,
          argentSessionServiceBaseUrl: getArgentSessionServiceUrl(),
          useCacheAuthorisation: true,
        });
        
        // Update state with loaded session
        setSessionState({
          sessionKey: savedSessionKey,
          session: savedSession,
          sessionAccount: sessionAccount as any,
          isCreatingSession: false,
          error: null
        });
        
        console.log("Session loaded successfully");
      } catch (error: any) {
        console.error("Error loading saved session:", error);
        // Clear invalid session data
        localStorage.removeItem(SESSION_KEY_STORAGE_KEY);
        localStorage.removeItem(SESSION_STORAGE_KEY);
      }
    };
    
    loadSavedSession();
  }, [wallet]);

  // Create a session with the wallet
  const createSessionWithWallet = useCallback(async () => {
    if (!wallet) {
      setSessionState(prev => ({ ...prev, error: "Wallet not connected" }));
      return false;
    }
    
    // Get address from wallet account
    const walletAddress = wallet.account?.address;
    if (!walletAddress) {
      setSessionState(prev => ({ ...prev, error: "No wallet address found" }));
      return false;
    }
    
    // Get chain ID from wallet
    const walletChainId = wallet.chainId || wallet.provider?.chainId;
    if (!walletChainId) {
      setSessionState(prev => ({ ...prev, error: "No chain ID available" }));
      return false;
    }
    
    try {
      setSessionState(prev => ({ ...prev, isCreatingSession: true, error: null }));
      
      // 1. Generate a new session key
      const sessionKey = generateSessionKey();
      console.log("Generated session key:", sessionKey);
      
      // 2. Convert to hex chain ID
      const hexChainId = toHexChainId(walletChainId);
      if (!hexChainId) {
        throw new Error("Invalid chain ID");
      }
      console.log("Chain ID:", hexChainId);
      
      // 3. Define session parameters
      const sessionParams: CreateSessionParams = {
        allowedMethods,
        expiry: getExpiry(),
        sessionKey,
        metaData
      };
      
      // 4. Create a session request 
      const sessionRequest = createSessionRequest({
        sessionParams,
        chainId: hexChainId as constants.StarknetChainId,
      });
      
      // 5. Get the typed data for signing
      const typedData = sessionRequest.sessionTypedData;
      
      console.log("Starting signing process with data:", typedData);
      
      // 6. Sign using the wallet's account methods
      let signature;
      
      if (!wallet.account) {
        throw new Error("Wallet account not available");
      }
      
      // Try using the account methods available
      if (typeof wallet.account.signTypedData === 'function') {
        console.log("Using signTypedData method");
        signature = await wallet.account.signTypedData(typedData);
      } else if (typeof wallet.account.signMessage === 'function') {
        console.log("Using signMessage method");
        signature = await wallet.account.signMessage(typedData);
      } else {
        throw new Error("Wallet doesn't support required signing methods");
      }
      
      if (!signature) {
        throw new Error("Failed to get signature from wallet");
      }
      
      console.log("Got signature:", signature);
      
      // 7. Create session with signature
      const session = await createSession({
        address: walletAddress,
        chainId: hexChainId as constants.StarknetChainId,
        authorisationSignature: signature,
        sessionRequest,
      });
      
      console.log("Session created:", session);
      
      // 8. Build session account
      const sessionAccount = await buildSessionAccount({
        session,
        sessionKey,
        provider: provider as any,
        argentSessionServiceBaseUrl: getArgentSessionServiceUrl(),
        useCacheAuthorisation: true,
      });
      
      console.log("Session account built:", sessionAccount);
      
      // 9. Save session data to local storage
      localStorage.setItem(SESSION_KEY_STORAGE_KEY, JSON.stringify(sessionKey));
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
      
      // 10. Update state with created session
      setSessionState({
        sessionKey,
        session,
        sessionAccount: sessionAccount as any,
        isCreatingSession: false,
        error: null
      });
      
      return true;
    } catch (error: any) {
      console.error("Session error:", error);
      setSessionState(prev => ({
        ...prev,
        isCreatingSession: false,
        error: error.message || "Failed to create session"
      }));
      
      return false;
    }
  }, [wallet]);

  // Clear current session
  const clearSession = useCallback(() => {
    // Clear session data from local storage
    localStorage.removeItem(SESSION_KEY_STORAGE_KEY);
    localStorage.removeItem(SESSION_STORAGE_KEY);
    
    // Reset session state
    setSessionState({
      sessionKey: null,
      session: null,
      sessionAccount: null,
      isCreatingSession: false,
      error: null
    });
  }, []);

  return {
    ...sessionState,
    createSession: createSessionWithWallet,
    clearSession,
  };
};