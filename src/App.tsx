import { useState } from "react";
import { WalletSDK } from "./sdk";

function App() {
  const wallet = new WalletSDK();

  const [message, setMessage] = useState("Hi");
  const [signedMsg, setSignedMsg] = useState("");

  async function onClick() {
    if (!message) {
      alert("Please enter a message to sign");
      return;
    }

    try {
      // const result = await wallet.signMessage(message);
      const result = await wallet.sendTransaction({
        amount: 10,
        chainId: 421614,
        toAddress: "0x17BE8cd0301597c1c701327aeF29917ea744Df4b",
      });
      setSignedMsg(result);
    } catch (error) {
      setSignedMsg("Error signing message");
      console.error(error);
    }
  }

  return (
    <div className="max-w-screen">
      <h1>Bear Wallet SDK Demo</h1>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
        }}
      >
        <input
          type="text"
          name="message"
          id="message"
          onChange={(e) => setMessage(e.target.value)}
          value={message}
        />

        <button onClick={onClick}>Sign Message</button>

        <div></div>

        {signedMsg && (
          <div className="max-w-full">
            <h2>Signed Message:</h2>
            <p>{signedMsg}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
