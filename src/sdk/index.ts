export class WalletSDK {
  private miniAppUrl: string;
  private app = window.Telegram.WebApp;

  constructor() {
    this.miniAppUrl = "https://t.me/bear_waller_test_bot/wallet";
  }

  async sign(message: string) {
    return new Promise((resolve, reject) => {
      window.open(`${this.miniAppUrl}/?startapp=test&sign?message=${message}`);
    });
  }
}
