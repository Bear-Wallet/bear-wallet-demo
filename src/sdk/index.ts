import { v4 as uuidv4 } from "uuid";
import { getData } from "../helpers/api";

export class WalletSDK {
  public readonly miniAppUrl: string;

  constructor() {
    // this.miniAppUrl = "https://t.me/bear_waller_test_bot/wallet";
    this.miniAppUrl = "http://localhost:5173";
  }

  private static generateSessionId() {
    return uuidv4();
  }

  private openMiniApp(data: { type: string; sessionId: string; data: any }) {
    window.open(
      `${this.miniAppUrl}?startapp=${encodeURIComponent(JSON.stringify(data))}`
    );
  }

  /**
   * Connects to the wallet
   *
   * @param network: "MAINNET" | "TESTNET"
   *
   * @returns wallet address of the wallet
   *
   */
  async connect(network: "MAINNET" | "TESTNET"): Promise<string> {
    return new Promise((resolve, reject) => {
      const sessionId = WalletSDK.generateSessionId();

      const data = {
        type: "CONNECT",
        sessionId,
        data: network,
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
          console.error("Waiting for connection...");
        }
      }, 1000);

      // Add a timeout to stop polling after a certain time
      setTimeout(() => {
        clearInterval(checkServer);
        reject(new Error("Signature request timed out"));
      }, 1000 * 60);
    });
  }

  /**
   * Signs a message using the private key of the connected wallet
   *
   * @param message: The message to sign
   *
   * @returns The signature of the message
   *
   */
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

  /**
   * Signs a transaction using the private key of the connected wallet
   *
   * @param to: Address to send the transaction to
   * @param val: Amount to send in wei
   * @param chainId: EVM Chain ID, ex: 421614 for Arbitrum Sepolia
   *
   * @returns The signature of the message
   *
   */
  async sendTransaction({
    toAddress,
    amount,
    chainId,
  }: {
    toAddress: string;
    amount: number;
    chainId: number;
  }): Promise<string> {
    return new Promise((resolve, reject) => {
      const sessionId = WalletSDK.generateSessionId();

      const data = {
        type: "SEND_TXN",
        sessionId,
        data: { toAddress, amount, chainId },
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
          console.error("Waiting for transaction hash...");
        }
      }, 2000);

      // Add a timeout to stop polling after a certain time
      setTimeout(() => {
        clearInterval(checkServer);
        reject(new Error("Transaction request timed out"));
      }, 1000 * 60);
    });
  }
}
