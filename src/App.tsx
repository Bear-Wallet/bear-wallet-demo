import { useState } from "react";
import { WalletSDK } from "@bear-wallet/sdk";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

function App() {
  const wallet = new WalletSDK();

  const [result, setResult] = useState("");

  const [message, setMessage] = useState("Hello Bear Wallet");
  const [amount, setAmount] = useState(10);
  const [toAddress, setToAddress] = useState(
    "0x17BE8cd0301597c1c701327aeF29917ea744Df4b"
  );

  async function handleClick(type: "connect" | "signMsg" | "sendTxn") {
    if (!message) {
      alert("Please enter a message to sign");
      return;
    }

    try {
      if (type === "connect") {
        const result = await wallet.connect("TESTNET");
        setResult(`Wallet Address - ${result}`);
      } else if (type === "signMsg") {
        if (!message) {
          throw new Error("Please enter a message to sign");
        }

        const result = await wallet.signMessage(message);
        setResult(`Signed Message - ${result}`);
      } else if (type === "sendTxn") {
        if (!amount || !toAddress) {
          throw new Error("Please enter a message to sign");
        }

        const result = await wallet.sendTransaction({
          amount: amount,
          chainId: 421614,
          toAddress: toAddress,
        });

        setResult(`Transaction Hash - ${result}`);
      }
    } catch (error: any) {
      setResult(error?.message ?? "Error performing operation");
      console.error(error);
    }
  }

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-4xl font-bold my-8">Bear Wallet SDK Demo</h1>

      <Tabs
        defaultValue="connect"
        className="w-full max-w-screen-sm"
        onValueChange={() => {
          setResult("");
        }}
      >
        <TabsList className="w-full">
          <TabsTrigger value="connect">Wallet Connect</TabsTrigger>
          <TabsTrigger value="signMsg">Sign Message</TabsTrigger>
          <TabsTrigger value="sendTxn">Send Transaction</TabsTrigger>
        </TabsList>

        <TabsContent value="connect">
          <Card>
            <CardHeader>
              <CardTitle>Wallet Connect</CardTitle>
              <CardDescription>
                Connect to various networks like Ethereum, Arbitrum, Polygon,
                etc.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button onClick={() => handleClick("connect")}>Connect</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="signMsg">
          <Card>
            <CardHeader>
              <CardTitle>Sign Message</CardTitle>
              <CardDescription>
                Sign a message with private key.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="message">Message</Label>
                <Input
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleClick("signMsg")}>Sign</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="sendTxn">
          <Card>
            <CardHeader>
              <CardTitle>Send Transaction</CardTitle>
              <CardDescription>Send Transaction to an address.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="amount">Amount in wei</Label>
                <Input
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(parseInt(e.target.value))}
                  type="number"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="to">To</Label>
                <Input
                  id="to"
                  value={toAddress}
                  onChange={(e) => setToAddress(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleClick("sendTxn")}>Send</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {result && (
          <Card className="my-2">
            <CardContent className="space-y-2 py-4 break-all">
              {result}
            </CardContent>
          </Card>
        )}
      </Tabs>
    </div>
  );
}

export default App;
