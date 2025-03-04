"use client";
import { provider } from "@/constants";
import { Contract } from "starknet";
import { attensysCourseAbi } from "@/deployments/abi";
import { attensysCourseAddress } from "@/deployments/contracts";
import { useWallet } from "@/hooks/useWallet";

export default function Mockevent() {
  const { session, sessionAccount, sessionKeyMode, wallet } = useWallet();

  const courseContract = new Contract(
    attensysCourseAbi,
    attensysCourseAddress,
    provider,
  );

  const handleCreateCourse = async () => {
    try {
      const myCall = courseContract.populate("create_course", [
        "0x05a679d1e0d9f67370d8c3250388afec2da1deaf895b51841e017a3eb7bfd154",
        1,
        "QmXGUbN7ccNtieggpCMTEQfnTqSP6Fb858sucaN2hjRsyv",
        "kennynft",
        "knt",
      ]);

      if (sessionKeyMode) {
        if (!session || !sessionAccount) {
          throw new Error("No open session");
        }

        courseContract.connect(sessionAccount);

        const { suggestedMaxFee } = await sessionAccount.estimateInvokeFee({
          contractAddress: attensysCourseAddress,
          entrypoint: "create_course",
          calldata: myCall.calldata,
        });

        const maxFee = (suggestedMaxFee * BigInt(15)) / BigInt(10);

        const result = await courseContract.create_course(myCall.calldata, {
          maxFee,
        });

        await provider.waitForTransaction(result.transaction_hash);
      } else {
        if (!wallet?.account) {
          throw new Error("Wallet not connected");
        }

        courseContract.connect(wallet?.account);

        const res = await courseContract.create_course(myCall.calldata);
        await provider.waitForTransaction(res.transaction_hash);
      }
    } catch (error) {
      console.error("Error creating course:", error);
    }
  };

  const handleCourseAdd = async () => {
    try {
      const myCall = courseContract.populate("add_replace_course_content", [
        2,
        "0x05a679d1e0d9f67370d8c3250388afec2da1deaf895b51841e017a3eb7bfd154",
        "QmXGUbN7ccNtieggpCMTE",
        "QfnTqSP6Fb858sucaN2hjRsyv",
      ]);

      if (sessionKeyMode) {
        if (!session || !sessionAccount) {
          throw new Error("No open session");
        }

        courseContract.connect(sessionAccount);

        const { suggestedMaxFee } = await sessionAccount.estimateInvokeFee({
          contractAddress: attensysCourseAddress,
          entrypoint: "add_replace_course_content",
          calldata: myCall.calldata,
        });

        const maxFee = (suggestedMaxFee * BigInt(15)) / BigInt(10);

        const result = await courseContract.add_replace_course_content(
          myCall.calldata,
          {
            maxFee,
          },
        );

        await provider.waitForTransaction(result.transaction_hash);
      } else {
        if (!wallet?.account) {
          throw new Error("Wallet not connected");
        }

        courseContract.connect(wallet?.account);
        const res = await courseContract.add_replace_course_content(
          myCall.calldata,
        );
        await provider.waitForTransaction(res.transaction_hash);
      }
    } catch (error) {
      console.error("Error updating course:", error);
    }
  };

  const handleCourseFinish = async () => {
    try {
      const myCall = courseContract.populate(
        "finish_course_claim_certification",
        [1],
      );

      if (sessionKeyMode) {
        if (!session || !sessionAccount) {
          throw new Error("No open session");
        }

        courseContract.connect(sessionAccount);

        const { suggestedMaxFee } = await sessionAccount.estimateInvokeFee({
          contractAddress: attensysCourseAddress,
          entrypoint: "finish_course_claim_certification",
          calldata: myCall.calldata,
        });

        const maxFee = (suggestedMaxFee * BigInt(15)) / BigInt(10);

        const result = await courseContract.finish_course_claim_certification(
          myCall.calldata,
          {
            maxFee,
          },
        );

        await provider.waitForTransaction(result.transaction_hash);
      } else {
        if (!wallet?.account) {
          throw new Error("Wallet not connected");
        }

        courseContract.connect(wallet?.account);

        const res = await courseContract.finish_course_claim_certification(
          myCall.calldata,
        );
        await provider.waitForTransaction(res.transaction_hash);
      }
    } catch (error) {
      console.error("Error finishing course:", error);
    }
  };

  const get_course_info = async () => {
    const course_infos = await courseContract.get_course_infos([1]);
    console.log("Course infos here", course_infos);
  };
  const get_user_completed_course = async () => {
    const user_completed_course_infos =
      await courseContract.get_user_completed_courses(
        "0x05a679d1e0d9f67370d8c3250388afec2da1deaf895b51841e017a3eb7bfd154",
      );
    console.log("user completed course here", user_completed_course_infos);
  };

  const get_all_course_info = async () => {
    const all_course_infos = await courseContract.get_all_courses_info();
    console.log("All Course infos here", all_course_infos);
  };

  const get_all_creator_courses = async () => {
    const all_creator_course_infos =
      await courseContract.get_all_creator_courses(
        "0x05a679d1e0d9f67370d8c3250388afec2da1deaf895b51841e017a3eb7bfd154",
      );
    console.log("All creator Course infos here", all_creator_course_infos);
  };

  const get_creator_info = async () => {
    const creator_info = await courseContract.get_creator_info(
      "0x05a679d1e0d9f67370d8c3250388afec2da1deaf895b51841e017a3eb7bfd154",
    );
    console.log("creator info here", creator_info);
  };

  const get_nft_contract = async () => {
    const nft_contract = await courseContract.get_course_nft_contract(1);
    console.log("course nft contract address here:", nft_contract);
  };

  const get_complete_stat = async () => {
    const complete_stat =
      await courseContract.check_course_completion_status_n_certification(
        1,
        "0x05a679d1e0d9f67370d8c3250388afec2da1deaf895b51841e017a3eb7bfd154",
      );
    console.log("completion status here:", complete_stat);
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
