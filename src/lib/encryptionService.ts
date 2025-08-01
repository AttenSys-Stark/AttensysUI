// Client-side encryption service that uses server-side APIs
export class EncryptionService {
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
      console.error(`Encryption service error (${endpoint}):`, error);
      throw error;
    }
  }

  static async encryptPrivateKey(plainText: string): Promise<string> {
    const result = await this.makeRequest("encrypt", { plainText });
    return result.encryptedData;
  }

  static async decryptPrivateKey(encryptedData: string): Promise<string> {
    const result = await this.makeRequest("decrypt", { encryptedData });
    return result.decryptedData;
  }
}
