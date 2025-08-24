import { NextRequest, NextResponse } from "next/server";
import { 
  Account, 
  cairo, 
  Contract, 
  RpcProvider, 
  ec,
  stark,
  hash,
  CallData,
  CairoOption,
  CairoOptionVariant,
  CairoCustomEnum,
  Uint256,
  Call
} from "starknet";
import { Erc20Abi } from "@/deployments/erc20abi";
import { STRK_ADDRESS } from "@/deployments/erc20Contract";

export async function POST(request: NextRequest) {
  try {
    const privateKey = process.env.MASTER_PRIVATE_KEY;
    const masterAddress = process.env.MASTER_ACCOUNT_ADDRESS;
    
    if (!privateKey || !masterAddress) {
      throw new Error("Master credentials not configured");
    }

    const provider = new RpcProvider({
      nodeUrl: process.env.STARKNET_RPC_URL || "https://api.cartridge.gg/x/starknet/sepolia",
    });

    const masterAccount = new Account(provider, masterAddress, privateKey);
    const erc20Contract = new Contract(Erc20Abi, STRK_ADDRESS, masterAccount);
    
    const argentXaccountClassHash = "0x036078334509b514626504edc9fb252328d1a240e4e948bef8d0c08dff45927f";

    // Generate new account keys
    const privateKeyAX = stark.randomAddress();
    const starkKeyPubAX = ec.starkCurve.getStarkKey(privateKeyAX);

    // Calculate future address
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

    // Estimate fees
    const { suggestedMaxFee: estimatedFee1 } = await masterAccount.estimateAccountDeployFee(
      {
        classHash: argentXaccountClassHash,
        constructorCalldata: AXConstructorCallData,
        contractAddress: AXcontractAddress,
        addressSalt: starkKeyPubAX,
      },
      { version: 3 },
    );

    // Transfer tokens to new account
    const toTransferTk: Uint256 = cairo.uint256(0.1 * 10 ** 18);
    const transferCall: Call = erc20Contract.populate("transfer", {
      recipient: AXcontractAddress,
      amount: toTransferTk,
    });

    const estimateFees = await masterAccount.estimateInvokeFee(transferCall, {
      version: "0x03",
    });

    const resourceBounds = {
      ...estimateFees.resourceBounds,
    };
    
    const tx = await masterAccount.execute(transferCall, {
      version: "0x03",
      resourceBounds,
    });
    
    await provider.waitForTransaction(tx.transaction_hash, {
      retryInterval: 2000,
      successStates: ["ACCEPTED_ON_L2"],
    });

    // Deploy the new account
    const accountAX = new Account(provider, AXcontractAddress, privateKeyAX);
    const deployAccountPayload = {
      classHash: argentXaccountClassHash,
      constructorCalldata: AXConstructorCallData,
      contractAddress: AXcontractAddress,
      addressSalt: starkKeyPubAX,
    };

    const { transaction_hash: AXdAth, contract_address: AXcontractFinalAddress } = 
      await accountAX.deployAccount(deployAccountPayload, {
        version: "0x03",
        resourceBounds,
      });
      
    await provider.waitForTransaction(AXdAth, {
      retryInterval: 2000,
      successStates: ["ACCEPTED_ON_L2"],
    });

    return NextResponse.json({ 
      privateKey: privateKeyAX,
      contractAddress: AXcontractFinalAddress,
      transactionHash: AXdAth
    });
  } catch (error) {
    console.error("Account creation error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create account" },
      { status: 500 }
    );
  }
}