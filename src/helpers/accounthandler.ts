import {
  Account,
  ec,
  json,
  stark,
  RpcProvider,
  hash,
  CallData,
  CairoOption,
  CairoOptionVariant,
  CairoCustomEnum,
  constants,
  Contract,
  Uint256,
  cairo,
  Call,
} from "starknet";
import { Erc20Abi } from "@/deployments/erc20abi";
import { STRK_ADDRESS } from "@/deployments/erc20Contract";

const NODE_URL =
  process.env.NEXT_PUBLIC_CHAIN_ID === constants.NetworkName.SN_MAIN
    ? "https://starknet-mainnet.public.blastapi.io"
    : "https://starknet-sepolia.public.blastapi.io/rpc/v0_7";

const privateKey = process.env.NEXT_PUBLIC_MASTER_PRIVATE_KEY;
const accountAddress = process.env.NEXT_PUBLIC_MASTER_ADDRESS ?? "";
const provider = new RpcProvider({ nodeUrl: NODE_URL ?? "" });
const account0 = new Account(provider, accountAddress, privateKey ?? "");

const erc20Contract = new Contract(Erc20Abi, STRK_ADDRESS, account0);

export const AccountHandler = async (
  progressCallback?: (status: string) => void,
) => {
  const provider_r = new RpcProvider({ nodeUrl: NODE_URL ?? "" });
  const argentXaccountClassHash =
    "0x036078334509b514626504edc9fb252328d1a240e4e948bef8d0c08dff45927f";

  // Generate public and private key pair.
  progressCallback?.("Generating key pair...");

  const privateKeyAX = stark.randomAddress();
  const starkKeyPubAX = ec.starkCurve.getStarkKey(privateKeyAX);

  // Calculate future address of the ArgentX account
  const axSigner = new CairoCustomEnum({ Starknet: { pubkey: starkKeyPubAX } });
  const axGuardian = new CairoOption<unknown>(CairoOptionVariant.None);
  const AXConstructorCallData = CallData.compile({
    owner: axSigner,
    guardian: axGuardian,
  });
  const AXcontractAddress = hash.calculateContractAddressFromHash(
    starkKeyPubAX,
    argentXaccountClassHash,
    AXConstructorCallData,
    0,
  );

  progressCallback?.("Crunching numbers...");
  const { suggestedMaxFee: estimatedFee1 } =
    await account0.estimateAccountDeployFee(
      {
        classHash: argentXaccountClassHash,
        constructorCalldata: AXConstructorCallData,
        contractAddress: AXcontractAddress,
        addressSalt: starkKeyPubAX,
      },
      { version: 3 },
    );

  const toTransferTk: Uint256 = cairo.uint256(0.1 * 10 ** 18);
  const transferCall: Call = erc20Contract.populate("transfer", {
    recipient: AXcontractAddress,
    amount: toTransferTk,
  });

  progressCallback?.("Initializing user account...");
  const { transaction_hash: transferTxHash } = await account0.execute(
    transferCall,
    { version: 3 },
  );
  await provider.waitForTransaction(transferTxHash, {
    retryInterval: 2000,
    successStates: ["ACCEPTED_ON_L2"],
  });

  const balanceofnewaccountTransfer =
    await erc20Contract.balance_of(AXcontractAddress);
  // console.log('new account has a balance of:', balanceofnewaccountTransfer);

  if (BigInt(balanceofnewaccountTransfer) < BigInt(estimatedFee1)) {
    throw new Error(
      "New account does not have enough balance to cover the deployment fee.",
    );
  }

  const accountAX = new Account(provider, AXcontractAddress, privateKeyAX);

  const deployAccountPayload = {
    classHash: argentXaccountClassHash,
    constructorCalldata: AXConstructorCallData,
    contractAddress: AXcontractAddress,
    addressSalt: starkKeyPubAX,
  };

  progressCallback?.("Almost there...");
  const { transaction_hash: AXdAth, contract_address: AXcontractFinalAddress } =
    await accountAX.deployAccount(deployAccountPayload, { version: 3 });
  await provider.waitForTransaction(AXdAth, {
    retryInterval: 2000,
    successStates: ["ACCEPTED_ON_L2"],
  });
  progressCallback?.("Account created!");
  return {
    privateKeyAX,
    AXcontractFinalAddress,
  };
};
