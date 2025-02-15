"use client";
import { walletStarknetkit } from "@/state/connectedWalletStarknetkit";
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
import { attensysEventAbi } from "@/deployments/abi";
import { attensysEventAddress } from "@/deployments/contracts";
import { useReadContract, useNetwork } from "@starknet-react/core";

export default function Mockevent() {
  const [wallet] = useAtom(walletStarknetkit);

  const eventContract = new Contract(
    attensysEventAbi,
    attensysEventAddress,
    provider,
  );

  const handleCreateEvent = async () => {
    eventContract.connect(wallet?.account);
    const myCall = eventContract.populate("create_event", [
      "0x05a679d1e0d9f67370d8c3250388afec2da1deaf895b51841e017a3eb7bfd154",
      "kennyevent",
      "QmXGUbN7ccNtieggpCMTEQfnTqSP6Fb858sucaN2hjRsyv",
      "kennynft",
      "knt",
      23,
      100,
      1,
    ]);
    const res = await eventContract.create_event(myCall.calldata);
    await provider.waitForTransaction(res.transaction_hash);
    console.info("event created, transaction hash:", res.transaction_hash);
  };

  const handleRegisterEvent = async () => {
    eventContract.connect(wallet?.account);
    const myCall = eventContract.populate("register_for_event", [2]);
    const res = await eventContract.register_for_event(myCall.calldata);
    await provider.waitForTransaction(res.transaction_hash);
    console.info(
      "Registration successful, transaction hash:",
      res.transaction_hash,
    );
  };

  const handleMarkEventAttendance = async () => {
    eventContract.connect(wallet?.account);
    const myCall = eventContract.populate("mark_attendance", [1]);
    const res = await eventContract.mark_attendance(myCall.calldata);
    await provider.waitForTransaction(res.transaction_hash);
    console.info(
      "Attendance marked successfully, transaction hash:",
      res.transaction_hash,
    );
  };

  const handleEventBatchCertify = async () => {
    eventContract.connect(wallet?.account);
    const myCall = eventContract.populate("batch_certify_attendees", [1]);
    const res = await eventContract.batch_certify_attendees(myCall.calldata);
    await provider.waitForTransaction(res.transaction_hash);
    console.info(
      "success batch certification complete, transaction hash:",
      res.transaction_hash,
    );
  };

  const get_specific_event_details = async () => {
    const event_details = await eventContract.get_event_details(1);
    console.info("Specific event here", event_details);
  };

  const get_all_events = async () => {
    const all_event_details = await eventContract.get_all_events();
    console.info("All events here", all_event_details);
  };

  const get_specific_event_nft_contract_details = async () => {
    const event_nft_details = await eventContract.get_event_nft_contract(1);
    console.info("All events here", event_nft_details);
  };

  const get_attendance_status = async () => {
    const attendance_stat = await eventContract.get_attendance_status(
      "0x5a679d1e0d9f67370d8c3250388afec2da1deaf895b51841e017a3eb7bfd154",
      1,
    );
    console.info("attendance status here:", attendance_stat);
  };

  const get_all_attended_event = async () => {
    const all_attended_event = await eventContract.get_all_attended_events(
      "0x5a679d1e0d9f67370d8c3250388afec2da1deaf895b51841e017a3eb7bfd154",
    );
    console.info("all attended event here:", all_attended_event);
  };
  const get_all_registered_event = async () => {
    const all_registered_event =
      await eventContract.get_all_list_registered_events(
        "0x5a679d1e0d9f67370d8c3250388afec2da1deaf895b51841e017a3eb7bfd154",
      );
    console.info("all registered event here:", all_registered_event);
  };

  const get_nft_contract = async () => {
    const nft_contract = await eventContract.get_event_nft_contract(1);
    console.info("nft contract address here:", nft_contract);
  };
  const handleEndEvent = async () => {
    eventContract.connect(wallet?.account);
    const myCall = eventContract.populate("end_event", [1]);
    const res = await eventContract.end_event(1);
    await provider.waitForTransaction(res.transaction_hash);
    console.info("event end successful", res.transaction_hash);
  };

  const handleEventRegCommencement = async () => {
    eventContract.connect(wallet?.account);
    const myCall = eventContract.populate("start_end_reg", [0, 2]);
    const res = await eventContract.start_end_reg(myCall.calldata);
    await provider.waitForTransaction(res.transaction_hash);
    console.info("registration toggle successful:", res.transaction_hash);
  };

  return (
    <div>
      <div>
        <h1 className="text-3xl font-bold text-red-700 underline">
          mock event interaction here
        </h1>
        <div className="px-4 py-2 text-sm text-black bg-gray-200">
          Connected: {wallet?.account?.address}
        </div>
      </div>

      <div>
        <button
          onClick={handleCreateEvent}
          className="mt-2 bg-red-500 border-black"
        >
          Create event button
        </button>
      </div>

      <div>
        <button
          onClick={handleRegisterEvent}
          className="mt-2 bg-red-500 border-black"
        >
          Register for event button
        </button>
      </div>

      <div>
        <button
          onClick={handleMarkEventAttendance}
          className="mt-2 bg-red-500 border-black"
        >
          Mark attendance for event button
        </button>
      </div>

      <div>
        <button
          onClick={handleEventBatchCertify}
          className="mt-2 bg-red-500 border-black"
        >
          batch certify event proof button
        </button>
      </div>
      <div>
        <button
          onClick={handleEndEvent}
          className="mt-2 bg-red-500 border-black"
        >
          End event button
        </button>
      </div>

      <div>
        <button
          onClick={handleEventRegCommencement}
          className="mt-2 bg-red-500 border-black"
        >
          Toggle the start and and of an event
        </button>
      </div>

      <div className="mb-8">
        <h1>Specific Event details console logged</h1>
        <h1>All Events details console logged</h1>
        <h1>connected attendee attendance status console logged</h1>
        <h1>all attended event by connected account console logged</h1>
        <h1>all registed event by connected account console logged</h1>
        <h1>specific event nft contract address console logged</h1>
      </div>
    </div>
  );
}
