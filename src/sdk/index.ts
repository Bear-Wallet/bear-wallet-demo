export class WalletSDK {
  public readonly miniAppUrl: string;
  private readonly app = window.Telegram.WebApp;

  constructor() {
    this.miniAppUrl = "https://t.me/bear_waller_test_bot/wallet";
  }

  async sign(message: string) {
    return new Promise((resolve, reject) => {
      console.log("wallet.sign");

      const popup = window.open(
        `${this.miniAppUrl}/?startapp=${message}&message=${message}`
      );

      //   window.addEventListener(
      //     "message",
      //     (event) => {
      //       console.log(`event.origin: ${event.origin}`);
      //       console.log(event.data);
      //       console.log("-------");

      //       if (event.origin !== this.miniAppUrl) return;
      //       if (event.data.type === "SIGNATURE_RESULT") {
      //         popup?.close();
      //         resolve(event.data.signature);
      //       }
      //     },
      //     false
      //   );

      //   // Send the message to be signed to the Mini App
      //   popup?.postMessage({ type: "SIGN_REQUEST", message }, this.miniAppUrl);
    });
  }
}
