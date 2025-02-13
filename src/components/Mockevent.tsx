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
import { attensysEventAbi } from "@/deployments/abi";
import { attensysEventAddress } from "@/deployments/contracts";
import { useReadContract, useNetwork } from "@starknet-react/core";

export default function Mockevent() {
  const setWalletLatest = useSetAtom(walletStarknetkitLatestAtom);
  const setWalletNext = useSetAtom(walletStarknetkitNextAtom);
  const setConnectorData = useSetAtom(connectorDataAtom);
  const setConnector = useSetAtom(connectorAtom);
  const [wallet, setWallet] = useAtom(walletStarknetkitLatestAtom);

  const eventContract = new Contract(
    attensysEventAbi,
    attensysEventAddress,
    provider,
  );

  useEffect(() => {
    /* setWalletLatest(RESET) */
    setWalletNext(RESET);
    setConnectorData(RESET);
    setConnector(RESET);
  }, []);

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
    console.log("event created, transaction hash:", res.transaction_hash);
  };

  const handleRegisterEvent = async () => {
    eventContract.connect(wallet?.account);
    const myCall = eventContract.populate("register_for_event", [2]);
    const res = await eventContract.register_for_event(myCall.calldata);
    await provider.waitForTransaction(res.transaction_hash);
    console.log(
      "Registration successful, transaction hash:",
      res.transaction_hash,
    );
  };

  const handleMarkEventAttendance = async () => {
    eventContract.connect(wallet?.account);
    const myCall = eventContract.populate("mark_attendance", [1]);
    const res = await eventContract.mark_attendance(myCall.calldata);
    await provider.waitForTransaction(res.transaction_hash);
    console.log(
      "Attendance marked successfully, transaction hash:",
      res.transaction_hash,
    );
  };

  const handleEventBatchCertify = async () => {
    eventContract.connect(wallet?.account);
    const myCall = eventContract.populate("batch_certify_attendees", [1]);
    const res = await eventContract.batch_certify_attendees(myCall.calldata);
    await provider.waitForTransaction(res.transaction_hash);
    console.log(
      "success batch certification complete, transaction hash:",
      res.transaction_hash,
    );
  };

  const get_specific_event_details = async () => {
    let event_details = await eventContract.get_event_details(1);
    console.log("Specific event here", event_details);
  };

  const get_all_events = async () => {
    let all_event_details = await eventContract.get_all_events();
    console.log("All events here", all_event_details);
  };

  const get_specific_event_nft_contract_details = async () => {
    let event_nft_details = await eventContract.get_event_nft_contract(1);
    console.log("All events here", event_nft_details);
  };

  const get_attendance_status = async () => {
    let attendance_stat = await eventContract.get_attendance_status(
      "0x5a679d1e0d9f67370d8c3250388afec2da1deaf895b51841e017a3eb7bfd154",
      1,
    );
    console.log("attendance status here:", attendance_stat);
  };

  const get_all_attended_event = async () => {
    let all_attended_event = await eventContract.get_all_attended_events(
      "0x5a679d1e0d9f67370d8c3250388afec2da1deaf895b51841e017a3eb7bfd154",
    );
    console.log("all attended event here:", all_attended_event);
  };
  const get_all_registered_event = async () => {
    let all_registered_event =
      await eventContract.get_all_list_registered_events(
        "0x5a679d1e0d9f67370d8c3250388afec2da1deaf895b51841e017a3eb7bfd154",
      );
    console.log("all registered event here:", all_registered_event);
  };

  const get_nft_contract = async () => {
    let nft_contract = await eventContract.get_event_nft_contract(1);
    console.log("nft contract address here:", nft_contract);
  };
  const handleEndEvent = async () => {
    eventContract.connect(wallet?.account);
    const myCall = eventContract.populate("end_event", [1]);
    let res = await eventContract.end_event(1);
    await provider.waitForTransaction(res.transaction_hash);
    console.log("event end successful", res.transaction_hash);
  };

  const handleEventRegCommencement = async () => {
    eventContract.connect(wallet?.account);
    const myCall = eventContract.populate("start_end_reg", [0, 2]);
    const res = await eventContract.start_end_reg(myCall.calldata);
    await provider.waitForTransaction(res.transaction_hash);
    console.log("registration toggle successful:", res.transaction_hash);
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
        get_specific_event_details();
        get_all_events();
        get_specific_event_nft_contract_details();
        get_attendance_status();
        get_all_attended_event();
        get_all_registered_event();
        get_nft_contract();
        setWallet(connectedWallet);
      } catch (e) {
        console.error(e);
        alert((e as any).message);
      }
    };

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
          mock event interaction here
        </h1>
        <div className="text-sm bg-gray-200 px-4 py-2 text-black">
          Connected: {wallet?.account?.address}
        </div>
      </div>

      <div>
        <button
          onClick={handleCreateEvent}
          className="border-black bg-red-500 mt-2"
        >
          Create event button
        </button>
      </div>

      <div>
        <button
          onClick={handleRegisterEvent}
          className="border-black bg-red-500 mt-2"
        >
          Register for event button
        </button>
      </div>

      <div>
        <button
          onClick={handleMarkEventAttendance}
          className="border-black bg-red-500 mt-2"
        >
          Mark attendance for event button
        </button>
      </div>

      <div>
        <button
          onClick={handleEventBatchCertify}
          className="border-black bg-red-500 mt-2"
        >
          batch certify event proof button
        </button>
      </div>
      <div>
        <button
          onClick={handleEndEvent}
          className="border-black bg-red-500 mt-2"
        >
          End event button
        </button>
      </div>

      <div>
        <button
          onClick={handleEventRegCommencement}
          className="border-black bg-red-500 mt-2"
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
