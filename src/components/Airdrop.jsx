import { Button } from "@/components/ui/button";
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
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useEffect, useState } from "react";


const Airdrop = () => {
  const [publicKey, setPublicKey] = useState("");
  const [amount, setAmount] = useState(0);
  const [showLink, setShowLink] = useState(false);
  const [txnSign, setTxnSign] = useState("");
  const wallet = useWallet();
  const { connection } = useConnection();
  useEffect(() => {
    if (wallet.connected) {
      setPublicKey(wallet.publicKey.toString());
    }
  }, [wallet]);

  const sendAirdropToUser = async () => {
    try {
      const airDropResTxn = await connection.requestAirdrop(
        wallet.publicKey,
        amount * LAMPORTS_PER_SOL
      );
      if (airDropResTxn) {
        setShowLink(true);
        setTxnSign(airDropResTxn);
      }
    } catch (error) {
      console.log("Airdrop error:", error);
    }
  };
  const handleInput = (input) => {
    setAmount(input.target.value);
  };

  return (
    <Card className="  w-[50%] h-[20rem] bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500">
      <CardHeader>
        <CardTitle className="text-white text-[2rem] ">DropFly</CardTitle>
        <CardDescription className=" text-white text-[1rem]">
          Airdrop in one-click.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label className="text-white text-sm lg:text-xl  " htmlFor="name">
                {wallet.connected ? (
                  publicKey
                ) : (
                  <span>Connect your wallet...</span>
                )}
              </Label>
              <div className=" flex  gap-1 ">
                <Input
                  min={0}
                  max={100}
                  onChange={handleInput}
                  value={amount}
                  type="number"
                  id="name"
                  className=" w-[50%] text-white font-bold text-xs "
                  placeholder="Amount"
                />
                <span className=" text-2xl text-white font-bold ">SOL</span>
              </div>
              {showLink && (
                <div className=" text-white text-xl ">
                  Click here to see the txn :{" "}
                  <a
                    onClick={() => setShowLink(false)}
                    target="_blank"
                    href={`https://explorer.solana.com/tx/${txnSign}?cluster=devnet`}
                  >{`${txnSign}`}</a>
                </div>
              )}
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        {/* <Button variant="outline">Cancel</Button> */}
        <Button className="p-5 " onClick={sendAirdropToUser}>
          Send Airdrop
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Airdrop;
