"use client";
import { walletStarknetkitLatestAtom } from "@/state/connectedWalletStarknetkitLatest";
import {
  connectorAtom,
  connectorDataAtom,
  walletStarknetkitNextAtom,
} from "@/state/connectedWalletStarknetkitNext";
import { useSetAtom } from "jotai";
import { RESET } from "jotai/utils";
import { useEffect } from "react";
import { useAtom } from "jotai";
import { connect, disconnect } from "starknetkit";
import { ARGENT_WEBWALLET_URL, CHAIN_ID, provider } from "@/constants";
import {
  useSendTransaction,
  useAccount,
  useBlockNumber,
} from "@starknet-react/core";
import { BlockNumber, Contract, RpcProvider, Account } from "starknet";
import { attensysCourseAbi } from "@/deployments/abi";
import { attensysCourseAddress } from "@/deployments/contracts";
import { useReadContract, useNetwork } from "@starknet-react/core";

export default function Mockevent() {
  const setWalletLatest = useSetAtom(walletStarknetkitLatestAtom);
  const setWalletNext = useSetAtom(walletStarknetkitNextAtom);
  const setConnectorData = useSetAtom(connectorDataAtom);
  const setConnector = useSetAtom(connectorAtom);
  const [wallet, setWallet] = useAtom(walletStarknetkitLatestAtom);

  const eventContract = new Contract(
    attensysCourseAbi,
    attensysCourseAddress,
    provider,
  );

  useEffect(() => {
    setWalletLatest(RESET);
    setWalletNext(RESET);
    setConnectorData(RESET);
    setConnector(RESET);
  }, []);

  const handleCreateCourse = async () => {
    eventContract.connect(wallet?.account);
    const myCall = eventContract.populate("create_course", [
      "0x05a679d1e0d9f67370d8c3250388afec2da1deaf895b51841e017a3eb7bfd154",
      1,
      "QmXGUbN7ccNtieggpCMTEQfnTqSP6Fb858sucaN2hjRsyv",
      "kennynft",
      "knt",
    ]);
    const res = await eventContract.create_course(myCall.calldata);
    await provider.waitForTransaction(res.transaction_hash);
    console.log("Course created, transaction hash:", res.transaction_hash);
  };

  const handleCourseAdd = async () => {
    eventContract.connect(wallet?.account);
    const myCall = eventContract.populate("add_replace_course_content", [
      2,
      "0x05a679d1e0d9f67370d8c3250388afec2da1deaf895b51841e017a3eb7bfd154",
      "QmXGUbN7ccNtieggpCMTE",
      "QfnTqSP6Fb858sucaN2hjRsyv",
    ]);
    const res = await eventContract.add_replace_course_content(myCall.calldata);
    await provider.waitForTransaction(res.transaction_hash);
    console.log("Course added, transaction hash:", res.transaction_hash);
  };

  const handleCourseFinish = async () => {
    eventContract.connect(wallet?.account);
    const myCall = eventContract.populate("finish_course_claim_certification", [
      1,
    ]);
    const res = await eventContract.finish_course_claim_certification(
      myCall.calldata,
    );
    await provider.waitForTransaction(res.transaction_hash);
    console.log("Course added, transaction hash:", res.transaction_hash);
  };

  const get_course_info = async () => {
    let course_infos = await eventContract.get_course_infos([1]);
    console.log("Course infos here", course_infos);
  };
  const get_user_completed_course = async () => {
    let user_completed_course_infos =
      await eventContract.get_user_completed_courses(
        "0x05a679d1e0d9f67370d8c3250388afec2da1deaf895b51841e017a3eb7bfd154",
      );
    console.log("user completed course here", user_completed_course_infos);
  };

  const get_all_course_info = async () => {
    let all_course_infos = await eventContract.get_all_courses_info();
    console.log("All Course infos here", all_course_infos);
  };

  const get_all_creator_courses = async () => {
    let all_creator_course_infos = await eventContract.get_all_creator_courses(
      "0x05a679d1e0d9f67370d8c3250388afec2da1deaf895b51841e017a3eb7bfd154",
    );
    console.log("All creator Course infos here", all_creator_course_infos);
  };

  const get_creator_info = async () => {
    let creator_info = await eventContract.get_creator_info(
      "0x05a679d1e0d9f67370d8c3250388afec2da1deaf895b51841e017a3eb7bfd154",
    );
    console.log("creator info here", creator_info);
  };

  const get_nft_contract = async () => {
    let nft_contract = await eventContract.get_course_nft_contract(1);
    console.log("course nft contract address here:", nft_contract);
  };

  const get_complete_stat = async () => {
    let complete_stat =
      await eventContract.check_course_completion_status_n_certification(
        1,
        "0x05a679d1e0d9f67370d8c3250388afec2da1deaf895b51841e017a3eb7bfd154",
      );
    console.log("completion status here:", complete_stat);
  };

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
        });
        //@todo make sure details update on the go, instead of waiting to reload
        setWallet(connectedWallet);
      } catch (e) {
        console.error(e);
        alert((e as any).message);
      }
    };
    get_course_info();
    get_user_completed_course();
    get_all_course_info();
    get_all_creator_courses();
    get_creator_info();
    get_nft_contract();
    get_complete_stat();
    if (!wallet) {
      autoConnect();
    }
  }, [wallet]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      document.addEventListener("wallet_disconnected", async () => {
        setWallet(RESET);
      });
    }
  }, []);

  return (
    <div>
      <div>
        <h1 className="text-3xl font-bold underline text-red-700">
          mock course interaction here
        </h1>
      </div>

      <div>
        <button
          onClick={handleCreateCourse}
          className="border-black bg-red-500 mt-2"
        >
          Create course button
        </button>
      </div>

      <div>
        <button
          onClick={handleCourseAdd}
          className="border-black bg-red-500 mt-2"
        >
          Course Add button
        </button>
      </div>

      <div>
        <button
          onClick={handleCourseFinish}
          className="border-black bg-red-500 mt-2"
        >
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
