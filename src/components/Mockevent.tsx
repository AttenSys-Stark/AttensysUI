"use client";
import { walletStarknetkit } from "@/state/connectedWalletStarknetkit";
import { useAtomValue } from "jotai";
import { provider } from "@/constants";
import { Contract } from "starknet";
import { attensysEventAbi } from "@/deployments/abi";
import { attensysEventAddress } from "@/deployments/contracts";
import {
  sessionKeyModeAtom,
  sessionAccountAtom,
  sessionAtom,
} from "@/state/argentSessionState";

export default function Mockevent() {
  const wallet = useAtomValue(walletStarknetkit);
  const sessionKeyMode = useAtomValue(sessionKeyModeAtom);
  const sessionAccount = useAtomValue(sessionAccountAtom);
  const session = useAtomValue(sessionAtom);

  const eventContract = new Contract(
    attensysEventAbi,
    attensysEventAddress,
    provider,
  );

  const handleCreateEvent = async () => {
    try {
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
      if (sessionKeyMode) {
        if (!session || !sessionAccount) {
          throw new Error("No open session");
        }
        eventContract.connect(sessionAccount);
        const { suggestedMaxFee } = await sessionAccount.estimateInvokeFee({
          contractAddress: attensysEventAddress,
          entrypoint: "create_event",
          calldata: myCall.calldata,
        });
        const maxFee = (suggestedMaxFee * BigInt(15)) / BigInt(10);
        const result = await eventContract.create_event(myCall.calldata, {
          maxFee,
        });
        await provider.waitForTransaction(result.transaction_hash);
      } else {
        eventContract.connect(wallet?.account);

        const res = await eventContract.create_event(myCall.calldata);
        await provider.waitForTransaction(res.transaction_hash);
      }
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  const handleRegisterEvent = async () => {
    try {
      const myCall = eventContract.populate("register_for_event", [2]);
      if (sessionKeyMode) {
        if (!session || !sessionAccount) {
          throw new Error("No open session");
        }
        eventContract.connect(sessionAccount);
        const { suggestedMaxFee } = await sessionAccount.estimateInvokeFee({
          contractAddress: attensysEventAddress,
          entrypoint: "register_for_event",
          calldata: myCall.calldata,
        });
        const maxFee = (suggestedMaxFee * BigInt(15)) / BigInt(10);
        const result = await eventContract.register_for_event(myCall.calldata, {
          maxFee,
        });
        await provider.waitForTransaction(result.transaction_hash);
      } else {
        eventContract.connect(wallet?.account);

        const res = await eventContract.register_for_event(myCall.calldata);
        await provider.waitForTransaction(res.transaction_hash);
      }
    } catch (error) {
      console.error("Error registering event:", error);
    }
  };

  const handleMarkEventAttendance = async () => {
    try {
      const myCall = eventContract.populate("mark_attendance", [1]);
      if (sessionKeyMode) {
        if (!session || !sessionAccount) {
          throw new Error("No open session");
        }
        eventContract.connect(sessionAccount);
        const { suggestedMaxFee } = await sessionAccount.estimateInvokeFee({
          contractAddress: attensysEventAddress,
          entrypoint: "mark_attendance",
          calldata: myCall.calldata,
        });
        const maxFee = (suggestedMaxFee * BigInt(15)) / BigInt(10);
        const result = await eventContract.mark_attendance(myCall.calldata, {
          maxFee,
        });
        await provider.waitForTransaction(result.transaction_hash);
      } else {
        eventContract.connect(wallet?.account);

        const res = await eventContract.mark_attendance(myCall.calldata);
        await provider.waitForTransaction(res.transaction_hash);
      }
    } catch (error) {
      console.error("Error marking event attendance:", error);
    }
  };

  const handleEventBatchCertify = async () => {
    try {
      const myCall = eventContract.populate("batch_certify_attendees", [1]);
      if (sessionKeyMode) {
        if (!session || !sessionAccount) {
          throw new Error("No open session");
        }
        eventContract.connect(sessionAccount);
        const { suggestedMaxFee } = await sessionAccount.estimateInvokeFee({
          contractAddress: attensysEventAddress,
          entrypoint: "batch_certify_attendees",
          calldata: myCall.calldata,
        });
        const maxFee = (suggestedMaxFee * BigInt(15)) / BigInt(10);
        const result = await eventContract.batch_certify_attendees(
          myCall.calldata,
          {
            maxFee,
          },
        );
        await provider.waitForTransaction(result.transaction_hash);
      } else {
        eventContract.connect(wallet?.account);

        const res = await eventContract.batch_certify_attendees(
          myCall.calldata,
        );
        await provider.waitForTransaction(res.transaction_hash);
      }
    } catch (error) {
      console.error("Error batch certify event:", error);
    }
  };

  const get_specific_event_details = async () => {
    const event_details = await eventContract.get_event_details(1);
    console.log("Specific event here", event_details);
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
    console.log("attendance status here:", attendance_stat);
  };

  const get_all_attended_event = async () => {
    const all_attended_event = await eventContract.get_all_attended_events(
      "0x5a679d1e0d9f67370d8c3250388afec2da1deaf895b51841e017a3eb7bfd154",
    );
    console.log("all attended event here:", all_attended_event);
  };
  const get_all_registered_event = async () => {
    const all_registered_event =
      await eventContract.get_all_list_registered_events(
        "0x5a679d1e0d9f67370d8c3250388afec2da1deaf895b51841e017a3eb7bfd154",
      );
    console.log("all registered event here:", all_registered_event);
  };

  const get_nft_contract = async () => {
    const nft_contract = await eventContract.get_event_nft_contract(1);
    console.log("nft contract address here:", nft_contract);
  };
  const handleEndEvent = async () => {
    try {
      const myCall = eventContract.populate("end_event", [1]);
      if (sessionKeyMode) {
        if (!session || !sessionAccount) {
          throw new Error("No open session");
        }
        eventContract.connect(sessionAccount);
        const { suggestedMaxFee } = await sessionAccount.estimateInvokeFee({
          contractAddress: attensysEventAddress,
          entrypoint: "end_event",
          calldata: myCall.calldata,
        });
        const maxFee = (suggestedMaxFee * BigInt(15)) / BigInt(10);
        const result = await eventContract.end_event(myCall.calldata, {
          maxFee,
        });
        await provider.waitForTransaction(result.transaction_hash);
      } else {
        eventContract.connect(wallet?.account);

        const res = await eventContract.end_event(1);
        await provider.waitForTransaction(res.transaction_hash);
      }
    } catch (error) {
      console.error("Error creating organization profile:", error);
    }
  };

  const handleEventRegCommencement = async () => {
    try {
      const myCall = eventContract.populate("start_end_reg", [0, 2]);
      if (sessionKeyMode) {
        if (!session || !sessionAccount) {
          throw new Error("No open session");
        }
        eventContract.connect(sessionAccount);
        const { suggestedMaxFee } = await sessionAccount.estimateInvokeFee({
          contractAddress: attensysEventAddress,
          entrypoint: "start_end_reg",
          calldata: myCall.calldata,
        });
        const maxFee = (suggestedMaxFee * BigInt(15)) / BigInt(10);
        const result = await eventContract.start_end_reg(myCall.calldata, {
          maxFee,
        });
        await provider.waitForTransaction(result.transaction_hash);
      } else {
        eventContract.connect(wallet?.account);

        const res = await eventContract.start_end_reg(myCall.calldata);
        await provider.waitForTransaction(res.transaction_hash);
      }
    } catch (error) {
      console.error("Error creating organization profile:", error);
    }
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
