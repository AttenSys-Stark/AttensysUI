"use client";
import { walletStarknetkit } from "@/state/connectedWalletStarknetkit";
import {
  connectorAtom,
  connectorDataAtom,
  walletStarknetkitNextAtom,
} from "@/state/connectedWalletStarknetkitNext"
import { useAtomValue, useSetAtom } from "jotai"
import { RESET } from "jotai/utils"
import { useEffect } from "react"
import { useAtom } from "jotai"
import { connect } from "starknetkit"
import { ARGENT_WEBWALLET_URL, CHAIN_ID, provider } from "@/constants"
import { Contract } from "starknet";
import { attensysCourseAbi } from '@/deployments/abi'
import { attensysCourseAddress } from '@/deployments/contracts'
import { sessionKeyModeAtom, sessionAccountAtom, sessionAtom } from "@/state/argentSessionState"

const eventContract = new Contract(
  attensysCourseAbi,
  attensysCourseAddress,
  provider,
);
      
export default function Mockevent() {
  const setWalletLatest = useSetAtom(walletStarknetkitLatestAtom)
  const setWalletNext = useSetAtom(walletStarknetkitNextAtom)
  const setConnectorData = useSetAtom(connectorDataAtom)
  const setConnector = useSetAtom(connectorAtom)
  const [wallet, setWallet] = useAtom(walletStarknetkitLatestAtom)
  const sessionKeyMode = useAtomValue(sessionKeyModeAtom)
  const sessionAccount = useAtomValue(sessionAccountAtom)
  const session = useAtomValue(sessionAtom)
  const courseContract = new Contract(attensysCourseAbi, attensysCourseAddress, provider);

  useEffect(() => {
    setWalletLatest(RESET)
    setWalletNext(RESET)
    setConnectorData(RESET)
    setConnector(RESET)
  }, [])

  const handleCreateCourse = async () => {
    try {
      const myCall = courseContract.populate('create_course', ["0x05a679d1e0d9f67370d8c3250388afec2da1deaf895b51841e017a3eb7bfd154", 1, "QmXGUbN7ccNtieggpCMTEQfnTqSP6Fb858sucaN2hjRsyv", "kennynft", "knt"]);

      if (sessionKeyMode) {
        if (!session || !sessionAccount) {
          throw new Error("No open session")
        }

        courseContract.connect(sessionAccount)

        const { suggestedMaxFee } = await sessionAccount.estimateInvokeFee({
          contractAddress: attensysCourseAddress,
          entrypoint: "create_course",
          calldata: myCall.calldata,
        })

        const maxFee = (suggestedMaxFee * BigInt(15)) / BigInt(10)

        const result = await courseContract.create_course(
          myCall.calldata,
          {
            maxFee,
          },
        )

        await provider.waitForTransaction(result.transaction_hash)
      } else {
        courseContract.connect(wallet?.account);

        const res = await courseContract.create_course(myCall.calldata);
        await provider.waitForTransaction(res.transaction_hash);
      }
    } catch (error) {
      console.error("Error creating course:", error);
    }
  }

  const handleCourseAdd = async () => {
    try {
      const myCall = courseContract.populate('add_replace_course_content', [2, "0x05a679d1e0d9f67370d8c3250388afec2da1deaf895b51841e017a3eb7bfd154", "QmXGUbN7ccNtieggpCMTE", "QfnTqSP6Fb858sucaN2hjRsyv"]);

      if (sessionKeyMode) {
        if (!session || !sessionAccount) {
          throw new Error("No open session")
        }

        courseContract.connect(sessionAccount)

        const { suggestedMaxFee } = await sessionAccount.estimateInvokeFee({
          contractAddress: attensysCourseAddress,
          entrypoint: "add_replace_course_content",
          calldata: myCall.calldata,
        })

        const maxFee = (suggestedMaxFee * BigInt(15)) / BigInt(10)

        const result = await courseContract.add_replace_course_content(
          myCall.calldata,
          {
            maxFee,
          },
        )

        await provider.waitForTransaction(result.transaction_hash)
      } else {
        courseContract.connect(wallet?.account);
        const res = await courseContract.add_replace_course_content(myCall.calldata);
        await provider.waitForTransaction(res.transaction_hash);
      }
    } catch (error) {
      console.error("Error updating course:", error);
    }
  }

  const handleCourseFinish = async () => {
    try {
      const myCall = courseContract.populate('finish_course_claim_certification', [1]);

      if (sessionKeyMode) {
        if (!session || !sessionAccount) {
          throw new Error("No open session")
        }

        courseContract.connect(sessionAccount)

        const { suggestedMaxFee } = await sessionAccount.estimateInvokeFee({
          contractAddress: attensysCourseAddress,
          entrypoint: "finish_course_claim_certification",
          calldata: myCall.calldata,
        })

        const maxFee = (suggestedMaxFee * BigInt(15)) / BigInt(10)

        const result = await courseContract.finish_course_claim_certification(
          myCall.calldata,
          {
            maxFee,
          },
        )

        await provider.waitForTransaction(result.transaction_hash)
      } else {
        courseContract.connect(wallet?.account);

        const res = await courseContract.finish_course_claim_certification(myCall.calldata);
        await provider.waitForTransaction(res.transaction_hash);
      }
    } catch (error) {
      console.error("Error finishing course:", error);
    }
  }

  const get_course_info = async () => {
    let course_infos = await courseContract.get_course_infos([1]);
    console.log("Course infos here", course_infos);
  }
  const get_user_completed_course = async () => {
    let user_completed_course_infos = await courseContract.get_user_completed_courses("0x05a679d1e0d9f67370d8c3250388afec2da1deaf895b51841e017a3eb7bfd154");
    console.log("user completed course here", user_completed_course_infos);
  }

  const get_all_course_info = async () => {
    let all_course_infos = await courseContract.get_all_courses_info();
    console.log("All Course infos here", all_course_infos);
  }

  const get_all_creator_courses = async () => {
    let all_creator_course_infos = await courseContract.get_all_creator_courses("0x05a679d1e0d9f67370d8c3250388afec2da1deaf895b51841e017a3eb7bfd154");
    console.log("All creator Course infos here", all_creator_course_infos);
  }

  const get_creator_info = async () => {
    let creator_info = await courseContract.get_creator_info("0x05a679d1e0d9f67370d8c3250388afec2da1deaf895b51841e017a3eb7bfd154");
    console.log("creator info here", creator_info);
  }

  const get_nft_contract = async () => {
    let nft_contract = await courseContract.get_course_nft_contract(1);
    console.log("course nft contract address here:", nft_contract);
  }

  const get_complete_stat = async () => {
    let complete_stat = await courseContract.check_course_completion_status_n_certification(1, "0x05a679d1e0d9f67370d8c3250388afec2da1deaf895b51841e017a3eb7bfd154");
    console.log("completion status here:", complete_stat);
  }

  useEffect(() => {
    const autoConnect = async () => {
      try {
        const { wallet: connectedWallet } = await connect({
          provider,
          modalMode: "neverAsk",
          webWalletUrl: ARGENT_WEBWALLET_URL,
          argentMobileOptions: {
            dappName: "Attensys",
            url: window.location.hostname,
            chainId: CHAIN_ID,
            icons: [],
          },
        })
        //@todo make sure details update on the go, instead of waiting to reload
        setWallet(connectedWallet)
      } catch (e) {
        console.error(e)
        alert((e as any).message)
      }
    }
    get_course_info();
    get_user_completed_course();
    get_all_course_info();
    get_all_creator_courses();
    get_creator_info();
    get_nft_contract();
    get_complete_stat();
    if (!wallet) {
      autoConnect()
    }
  }, [wallet])

  useEffect(() => {
    if (typeof window !== "undefined") {
      document.addEventListener("wallet_disconnected", async () => {
        setWallet(RESET)
      })
    }
  }, [])

  return (
    <div>
      <div>
        <h1 className="text-3xl font-bold text-red-700 underline">
          mock course interaction here
        </h1>
      </div>

      <div>
        <button
          onClick={handleCreateCourse}
          className="mt-2 bg-red-500 border-black"
        >
          Create course button
        </button>
      </div>

      <div>
        <button
          onClick={handleCourseAdd}
          className="mt-2 bg-red-500 border-black"
        >
          Course Add button
        </button>
      </div>

      <div>
        <button onClick={handleCourseFinish} className="mt-2 bg-red-500 border-black">
          handle finish course and claim button
        </button>
      </div>

      <div className="mb-8">
        <h1>Course info function console logged</h1>
        <h1>user completed courses console logged</h1>
        <h1>All courses info console logged</h1>
        <h1>All creator course info console logged</h1>
        <h1>Creator info console logged</h1>
        <h1>course nft contract console logged</h1>
        <h1>completion stat console logged</h1>

      </div>
    </div>
  );
}
