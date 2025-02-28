import { ARGENT_SESSION_SERVICE_BASE_URL, provider } from "@/constants"
import { sessionAtom, sessionAccountAtom, sessionKeyModeAtom } from "@/state/argentSessionState"
import { connectorDataAtom, walletStarknetkitNextAtom } from "@/state/connectedWalletStarknetkitNext"
import { useAtomValue, useSetAtom } from "jotai"
import type { FC } from "react"
import { ConnectButton } from "./ConnectButton"
import { allowedMethods, expiry, metaData, dappKey } from "@/helpers/openSession"
import { type CreateSessionParams, createSession, buildSessionAccount, verifySession } from "@argent/x-sessions"

export const SessionKeys: FC = () => {
  const wallet = useAtomValue(walletStarknetkitNextAtom)
  const connectorData = useAtomValue(connectorDataAtom)
  const setSession = useSetAtom(sessionAtom)
  const setSessionAccount = useSetAtom(sessionAccountAtom)
  const setSessionKeyMode = useSetAtom(sessionKeyModeAtom)

  const handleCreateSession = async () => {
    try {
      if (!connectorData || !connectorData.account) {
        throw new Error("No connector data")
      }

      const sessionParams: CreateSessionParams = {
        allowedMethods,
        expiry,
        metaData: metaData(false),
        sessionKey: dappKey,
      }
      const chainId = await provider.getChainId()
      const session = await createSession({
        address: connectorData.account,
        chainId: chainId,
        wallet: wallet as any,
        sessionParams,
      })

      const sessionAccount = await buildSessionAccount({
        session,
        sessionKey: dappKey,
        provider: provider,
        argentSessionServiceBaseUrl: ARGENT_SESSION_SERVICE_BASE_URL,
      })

      if (!sessionAccount) {
        console.error("Session account creation failed")
        return
      }

      console.log("verify:", verifySession({ session, sessionKey: dappKey }))

      setSession(session)
      setSessionAccount(sessionAccount)
      setSessionKeyMode(true)
    } catch (e) {
      console.error("Session start failed:", e)
      alert((e as any).message)
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleCreateSession}
        className="mt-4 text-white bg-black border-8 border-black"
      >
        Create Seesion Keys
      </button>

    </div>
  )
}

export { ConnectButton }
