"use client";
import { walletStarknetkit } from "@/state/connectedWalletStarknetkit";
import {
  connectorAtom,
  connectorDataAtom,
} from "@/state/connectedWalletStarknetkitNext";
import { useAtom } from "jotai";
import {
  useSendTransaction,
  useAccount,
  useBlockNumber,
} from "@starknet-react/core";
import { BlockNumber, Contract, RpcProvider, Account } from "starknet";
import { attensysCourseAbi } from "@/deployments/abi";
import { attensysCourseAddress } from "@/deployments/contracts";
import { provider } from "@/constants";
export default function MockCourse() {
  const [wallet] = useAtom(walletStarknetkit);

  const eventContract = new Contract(
    attensysCourseAbi,
    attensysCourseAddress,
    provider,
  );

  const handleCreateCourse = async () => {
    eventContract.connect(wallet?.account);
    const myCall = eventContract.populate("create_course", [
      "0x05Bf9E38B116B37A8249a4cd041D402903a5E8a67C1a99d2D336ac7bd8B4034e",
      1,
      "QmXGUbN7ccNtieggpCMTEQfnTqSP6Fb858sucaN2hjRsyv",
      "kennynft",
      "knt",
      "QmXGUbN7ccNtieggpCMTEQfnTqSP6Fb858sucaN2hjRsyv",
    ]);

    const res = await eventContract.create_course(myCall.calldata);
    await provider.waitForTransaction(res.transaction_hash);
    console.info("Course created, transaction hash:", res.transaction_hash);
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
    console.info("Course added, transaction hash:", res.transaction_hash);
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
    console.info("Course added, transaction hash:", res.transaction_hash);
  };

  const get_course_info = async () => {
    const course_infos = await eventContract.get_course_infos([1]);
    console.info("Course infos here", course_infos);
  };
  const get_user_completed_course = async () => {
    const user_completed_course_infos =
      await eventContract.get_user_completed_courses(
        "0x05a679d1e0d9f67370d8c3250388afec2da1deaf895b51841e017a3eb7bfd154",
      );
    console.info("user completed course here", user_completed_course_infos);
  };

  const get_all_course_info = async () => {
    const all_course_infos = await eventContract.get_all_courses_info();
    console.info("All Course infos here", all_course_infos);
  };

  const get_all_creator_courses = async () => {
    const all_creator_course_infos =
      await eventContract.get_all_creator_courses(
        "0x05a679d1e0d9f67370d8c3250388afec2da1deaf895b51841e017a3eb7bfd154",
      );
    console.info("All creator Course infos here", all_creator_course_infos);
  };

  const get_creator_info = async () => {
    const creator_info = await eventContract.get_creator_info(
      "0x05a679d1e0d9f67370d8c3250388afec2da1deaf895b51841e017a3eb7bfd154",
    );
    console.info("creator info here", creator_info);
  };

  const get_nft_contract = async () => {
    const nft_contract = await eventContract.get_course_nft_contract(1);
    console.info("course nft contract address here:", nft_contract);
  };

  const get_complete_stat = async () => {
    const complete_stat =
      await eventContract.check_course_completion_status_n_certification(
        1,
        "0x05a679d1e0d9f67370d8c3250388afec2da1deaf895b51841e017a3eb7bfd154",
      );
    console.info("completion status here:", complete_stat);
  };

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
        <button
          onClick={handleCourseFinish}
          className="mt-2 bg-red-500 border-black"
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
