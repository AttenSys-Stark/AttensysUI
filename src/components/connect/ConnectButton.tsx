import { ARGENT_WEBWALLET_URL, CHAIN_ID, provider } from "@/constants"
import { walletStarknetkitLatestAtom } from "@/state/connectedWalletStarknetkitLatest"
import { useSetAtom } from "jotai"
import { useRouter } from "next/navigation"
import type { FC } from "react"
import { connect } from "starknetkit"

const ConnectButton: FC = () => {
  const setWallet = useSetAtom(walletStarknetkitLatestAtom)
  const navigate = useRouter()

  const connectFn = async () => {
    try {
      const { wallet } = await connect({
        provider,
        modalMode: "alwaysAsk",
        webWalletUrl: ARGENT_WEBWALLET_URL,
        argentMobileOptions: {
          dappName: "Attensys",
          url: window.location.hostname,
          chainId: CHAIN_ID,
          icons: [],
        },
      })

      setWallet(wallet)
    } catch (e) {
      console.error(e)
      alert((e as any).message)
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={connectFn}
        className="mt-4 text-white bg-black border-8 border-black"
      >
        Connect
      </button>

    </div>
  )
}

export { ConnectButton }
