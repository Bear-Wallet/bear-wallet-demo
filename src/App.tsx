import { useState } from "react";
import "./App.css";
import { WalletSDK } from "./sdk";

function App() {
  const [message, setMessage] = useState("Hi");
  const [signedMsg, setSignedMsg] = useState("");

  async function onClick() {
    if (!message) {
      alert("Please enter a message to sign");
      return;
    }

    const wallet = new WalletSDK();

    try {
      const result = await wallet.sign(message);
      setSignedMsg(result as string);
    } catch (error) {
      setSignedMsg("Error signing message");
      console.error(error);
    }
  }

  return (
    <>
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
          <div>
            <h2>Signed Message:</h2>
            <p>{signedMsg}</p>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
