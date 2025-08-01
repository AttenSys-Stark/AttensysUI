// Client-side transaction service that uses server-side APIs for secure signing
export class TransactionService {
  private static async makeRequest(endpoint: string, data: any) {
    try {
      const response = await fetch(`/api/auth/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Request failed");
      }

      return await response.json();
    } catch (error) {
      console.error(`Transaction service error (${endpoint}):`, error);
      throw error;
    }
  }

  static async signTransaction(
    encryptedPrivateKey: string,
    address: string,
    transactionData: any,
    transactionType: "invoke" | "declare" | "deploy" = "invoke",
  ) {
    const result = await this.makeRequest("sign-transaction", {
      encryptedPrivateKey,
      address,
      transactionData,
      transactionType,
    });

    return {
      transactionHash: result.transactionHash,
      transaction: result.transaction,
    };
  }

  static async executeTransaction(
    encryptedPrivateKey: string,
    address: string,
    calls: any[],
  ) {
    return await this.signTransaction(
      encryptedPrivateKey,
      address,
      { calls },
      "invoke",
    );
  }

  static async declareContract(
    encryptedPrivateKey: string,
    address: string,
    contractData: any,
  ) {
    return await this.signTransaction(
      encryptedPrivateKey,
      address,
      contractData,
      "declare",
    );
  }

  static async deployContract(
    encryptedPrivateKey: string,
    address: string,
    contractData: any,
  ) {
    return await this.signTransaction(
      encryptedPrivateKey,
      address,
      contractData,
      "deploy",
    );
  }
}
