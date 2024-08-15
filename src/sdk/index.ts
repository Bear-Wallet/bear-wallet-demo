import { v4 as uuidv4 } from "uuid";
import { getData } from "../helpers/api";

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

  openMiniApp(data: { type: string; sessionId: string; data: any }) {
    window.open(
      `${this.miniAppUrl}?startapp=${encodeURIComponent(JSON.stringify(data))}`
    );
  }

  async signMessage(message: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const sessionId = WalletSDK.generateSessionId();

      const data = {
        type: "SIGN_MSG",
        sessionId,
        data: message,
      };

      this.openMiniApp(data);

      // Poll the server for the result
      const checkServer = setInterval(async () => {
        try {
          const data = await getData({ sessionId });

          if (data.data) {
            clearInterval(checkServer);
            resolve(data.data);
          }
        } catch {
          console.error("Waiting for signature...");
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
