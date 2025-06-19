import { useEffect, useState } from "react";
import { ArrowRight, CheckCircle, Loader2, X } from "lucide-react";
import strk from "@/assets/strk.png";
import Image from "next/image";
import { provider } from "@/constants";
import { attensysCourseAbi } from "@/deployments/abi";
import { attensysCourseAddress } from "@/deployments/contracts";
import { cairo, Contract, Uint256 } from "starknet";
import { useAccount } from "@starknet-react/core";
import { Erc20Abi } from "@/deployments/erc20abi";
import { STRK_ADDRESS } from "@/deployments/erc20Contract";
import { Bounce, ToastContainer, toast } from "react-toastify";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { executeCalls } from "@avnu/gasless-sdk";

interface BalanceModalProps {
  account: any;
  address: string;
}

const BalanceModal = ({ account, address }: BalanceModalProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [step, setStep] = useState(1); // 1: Input, 2: Confirm, 3: Processing, 4: Success
  const [recipientAddress, setRecipientAddress] = useState("");
  const [amount, setAmount] = useState<number>(0);
  const [error, setError] = useState("");
  const [userClaimables, setUserClaimables] = useState(0);
  const [userClaimablesStrk, setuserClaimablesStrk] = useState(0);
  const [userbalanceUSD, setuserbalanceUSD] = useState(0);
  const [userbalanceSTRK, setuserbalanceSTRK] = useState(0);
  const [claimingstatus, setclaimingstatus] = useState(false);
  const [usdDisplay, setUsdDisplay] = useState(0);
  const [soldCourses, setsoldCourses] = useState(0);
  // const { account, address } = useAccount();

  const courseContract = new Contract(
    attensysCourseAbi,
    attensysCourseAddress,
    provider,
  );

  const erc20Contract = new Contract(Erc20Abi, STRK_ADDRESS, provider);

  const validateAddress = (address: string) => {
    return (
      (address.length === 65 || address.length === 66) &&
      address.startsWith("0x")
    );
  };

  const handleClaim = async () => {
    if (userClaimablesStrk <= 0) return;
    const courseContract = new Contract(
      attensysCourseAbi,
      attensysCourseAddress,
      account,
    );
    setclaimingstatus(true);

    try {
      const claim_calldata = await courseContract.populate("creator_withdraw", [
        userClaimablesStrk,
      ]);
      // Prepare the call for AVNU Gasless SDK
      const calls = [
        {
          contractAddress: attensysCourseAddress,
          entrypoint: "creator_withdraw",
          calldata: claim_calldata.calldata,
        },
      ];
      // Use AVNU Gasless SDK
      const avnuApiKey = process.env.NEXT_PUBLIC_AVNU_API_KEY;
      if (!avnuApiKey) {
        throw new Error("Missing AVNU API key in environment variables");
      }
      const response = await executeCalls(
        account,
        calls,
        {
          gasTokenAddress: STRK_ADDRESS,
        },
        {
          apiKey: avnuApiKey,
          baseUrl: "https://sepolia.api.avnu.fi",
        },
      );
      // Wait for transaction confirmation
      let tx = await provider.waitForTransaction(response.transactionHash);
      if (
        ((tx as any)?.finality_status === "ACCEPTED_ON_L2" ||
          (tx as any)?.finality_status === "ACCEPTED_ON_L1") &&
        (tx as any)?.execution_status === "SUCCEEDED"
      ) {
        await new Promise((resolve) => setTimeout(resolve, 3000));
        setclaimingstatus(false);
        toast.success("Claim successful", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
        return;
      } else {
        setclaimingstatus(false);
        toast.error("claim failed", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
        });
        return;
      }
    } catch (err) {
      console.log("Error populating calldata (gasless):", err);
      setclaimingstatus(false);
      toast.error("claim failed", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    }
  };

  const handleWithdrawClick = () => {
    setIsModalOpen(true);
    setStep(1);
    setRecipientAddress("");
    setAmount(0);
    setError("");
  };

  const handleNext = () => {
    if (!validateAddress(recipientAddress)) {
      setError("Please enter a valid wallet address");
      return;
    }
    if (!amount || isNaN(Number(amount))) {
      setError("Please enter a valid amount");
      return;
    }
    setError("");
    setStep(2);
  };

  const handleConfirm = async () => {
    setStep(3);
    try {
      const erc20Contract = new Contract(Erc20Abi, STRK_ADDRESS, account);
      const toTransferTk: Uint256 = cairo.uint256(amount * 10 ** 18);
      // Prepare the call
      const calls = [
        {
          contractAddress: STRK_ADDRESS,
          entrypoint: "transfer",
          calldata: [recipientAddress, toTransferTk.low, toTransferTk.high],
        },
      ];
      // Use AVNU Gasless SDK
      const avnuApiKey = process.env.NEXT_PUBLIC_AVNU_API_KEY;
      if (!avnuApiKey) {
        throw new Error("Missing AVNU API key in environment variables");
      }
      const response = await executeCalls(
        account,
        calls,
        {
          gasTokenAddress: STRK_ADDRESS,
        },
        {
          apiKey: avnuApiKey,
          baseUrl: "https://sepolia.api.avnu.fi",
        },
      );
      // Wait for transaction confirmation
      let tx = await provider.waitForTransaction(response.transactionHash);
      if (
        ((tx as any)?.finality_status === "ACCEPTED_ON_L2" ||
          (tx as any)?.finality_status === "ACCEPTED_ON_L1") &&
        (tx as any)?.execution_status === "SUCCEEDED"
      ) {
        await new Promise((resolve) => setTimeout(resolve, 3000));
        setStep(4);
      } else {
        setError("Withdrawal failed. Please try again.");
        setStep(1);
      }
    } catch (err: any) {
      console.log("error (gasless) transferring:", err);
      setError("Withdrawal failed. Please try again.");
      setStep(1);
      toast.error("withdrawal failed", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleamountChange = (e: any) => {
    setAmount(e.target.value);
  };
  useEffect(() => {
    const getEquivalentValue = async () => {
      try {
        const currentPrice = await courseContract?.get_price_of_strk_usd();
        const formattedPrice = Number(currentPrice) / 100000000;
        const equivalentValue = (Number(amount) * formattedPrice).toFixed(2);
        setUsdDisplay(Number(equivalentValue));
      } catch (error) {
        console.error("Error fetching current STRK price:", error);
      }
    };
    getEquivalentValue();
  }, [amount]);

  useEffect(() => {
    const getCurrentStrkPrice = async () => {
      try {
        const currentPrice = await courseContract?.get_price_of_strk_usd();
        const formattedPrice = Number(currentPrice) / 100000000;
        console.log(address);
        const claimable =
          await courseContract?.get_creator_withdrawable_amount(address);

        const walletBalance = await erc20Contract?.balance_of(address);
        const decimals = 18;
        const convertedValue = Number(walletBalance) / 10 ** decimals;

        const coursesSold =
          await courseContract?.get_total_course_sales(address);
        setsoldCourses(Number(coursesSold));

        setuserbalanceSTRK(convertedValue);
        setuserbalanceUSD(convertedValue * formattedPrice);
        setUserClaimables(Number(claimable) * formattedPrice);
        setuserClaimablesStrk(Number(claimable));

        console.log("Wallet balance:", walletBalance);
        console.log("Claimable amount:", Number(claimable));
        console.log("Current STRK price:", formattedPrice);
      } catch (error) {
        console.error("Error fetching current STRK price:", error);
      }
    };

    getCurrentStrkPrice();
    const intervalId = setInterval(getCurrentStrkPrice, 3000);
    return () => clearInterval(intervalId);
  }, [courseContract]);

  return (
    <div className="relative">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
      {/* Earnings Dashboard */}
      <div className="w-full min-h-[200px] bg-white p-5 border border-gray-200 rounded-lg mt-2 shadow-sm">
        {/* Earnings row */}
        <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-100">
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1">
              Total Earnings
            </p>
            <div className="flex items-center">
              <span className="text-lg font-semibold text-gray-900">
                ${userClaimables.toFixed(2)}
              </span>
              <span className="ml-2 text-sm text-gray-500">
                ({userClaimablesStrk.toFixed(2)} STRK)
              </span>
            </div>
          </div>
          <button
            onClick={handleClaim}
            className="px-4 py-2 border-[1px] bg-gradient-to-r from-[#4A90E2] to-[#9B51E0] hover:bg-emerald-700 text-white text-sm font-medium rounded-lg shadow-xs transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50"
          >
            {claimingstatus ? (
              <LoadingSpinner size="sm" colorVariant="white" />
            ) : (
              "Claim"
            )}
          </button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs font-medium text-gray-500">Courses Sold</p>
            <p className="text-sm font-semibold text-gray-900 mt-1">
              {soldCourses}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium text-gray-500">Wallet Balance</p>
            <div className="flex items-center mt-1">
              <div className="flex-shrink-0 w-4 h-4 relative">
                <Image
                  src={strk}
                  alt="STRK token"
                  width={16}
                  height={16}
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="text-sm font-semibold text-gray-900">
                ${userbalanceUSD.toFixed(2)}
              </span>
              <span className="ml-1 w-full text-[10px] text-gray-500">
                ({userbalanceSTRK.toFixed(2)} STRK)
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={handleWithdrawClick}
          className="px-4 py-2 bg-gradient-to-r from-[#4A90E2] to-[#9B51E0] mt-2 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg shadow-xs transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 flex items-center gap-2"
        >
          Send STRK
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Withdrawal Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-5 border-b">
              <h3 className="font-semibold text-lg">
                {step === 1 && "Withdraw Funds"}
                {step === 2 && "Confirm Withdrawal"}
                {step === 3 && "Processing"}
                {step === 4 && "Success!"}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5">
              {step === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Recipient Address
                    </label>
                    <input
                      type="text"
                      value={recipientAddress}
                      onChange={(e) => setRecipientAddress(e.target.value)}
                      placeholder="0x..."
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Amount (STRK)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={amount ?? 0}
                        onChange={(e) => handleamountChange(e)}
                        placeholder="0.00"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      />
                      <span className="absolute right-3 top-3 text-gray-500">
                        STRK
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      ${usdDisplay.toFixed(2)}
                    </p>
                  </div>

                  {error && <p className="text-red-500 text-sm">{error}</p>}

                  <div className="pt-2">
                    <button
                      onClick={handleNext}
                      className="w-full bg-gradient-to-r from-[#4A90E2] to-[#9B51E0] hover:bg-emerald-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between py-2">
                      <span className="text-gray-600">Recipient:</span>
                      <span className="font-mono text-sm">
                        {shortHex(recipientAddress)}
                      </span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-medium">{amount} STRK</span>
                    </div>
                    <div className="flex justify-between py-2 border-t border-gray-200 mt-2">
                      <span className="text-gray-600">Network Fee:</span>
                      <span className="text-gray-600">Free</span>
                    </div>
                  </div>

                  <button
                    onClick={handleConfirm}
                    className="w-full bg-gradient-to-r from-[#4A90E2] to-[#9B51E0] hover:bg-emerald-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
                  >
                    Confirm Withdrawal
                  </button>
                </div>
              )}

              {step === 3 && (
                <div className="flex flex-col items-center py-8 space-y-4">
                  <Loader2 className="w-12 h-12 text-emerald-600 animate-spin" />
                  <p className="text-lg font-medium">
                    Processing your withdrawal...
                  </p>
                  <p className="text-gray-500 text-sm">
                    This may take a few moments
                  </p>
                </div>
              )}

              {step === 4 && (
                <div className="flex flex-col items-center py-8 space-y-4">
                  <CheckCircle className="w-12 h-12 text-emerald-600" />
                  <p className="text-lg font-medium">Withdrawal Successful!</p>
                  <p className="text-gray-500 text-center text-sm">
                    {amount} STRK has been sent to {shortHex(recipientAddress)}
                  </p>
                  <button
                    onClick={closeModal}
                    className="mt-4 bg-gradient-to-r from-[#4A90E2] to-[#9B51E0] hover:bg-emerald-700 text-white py-2 px-6 rounded-lg font-medium transition-colors"
                  >
                    Done
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper function to shorten addresses
const shortHex = (address: string) => {
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

export default BalanceModal;
