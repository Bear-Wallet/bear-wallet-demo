import { v4 as uuidv4 } from "uuid";

export class WalletSDK {
  public readonly miniAppUrl: string;
  private readonly backendUrl: string;

  constructor() {
    // this.miniAppUrl = "https://t.me/bear_waller_test_bot/wallet";
    this.miniAppUrl = "http://localhost:5174";
    this.backendUrl = "http://localhost:3000/sdk";
  }

  static generateSessionId() {
    return uuidv4();
  }

  async sign(message: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const sessionId = WalletSDK.generateSessionId();

      const data = {
        sessionId,
        message,
      };

      // Open the Telegram Mini App
      window.open(
        `${this.miniAppUrl}?startapp=${encodeURIComponent(
          JSON.stringify(data)
        )}&session=${sessionId}`
      );

      // Poll the server for the result
      const checkServer = setInterval(async () => {
        try {
          const response = await fetch(
            `${this.backendUrl}/get-signature?sessionId=${sessionId}`
          );

          const data = (await response.json()) as {
            signedMessage: string;
            sessionId: string;
          };

          if (data.signedMessage) {
            clearInterval(checkServer);
            resolve(data.signedMessage);
          }
        } catch (error) {
          console.error("Error checking for signature:", error);
        }
      }, 1000);

      // Add a timeout to stop polling after a certain time
      setTimeout(() => {
        clearInterval(checkServer);
        reject(new Error("Signature request timed out"));
      }, 1000 * 60);
    });
  }
}
