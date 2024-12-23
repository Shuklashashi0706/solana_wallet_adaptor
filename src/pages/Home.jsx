import React, { useState } from "react";
import Airdrop from "@/components/Airdrop";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { ed25519 } from "@noble/curves/ed25519";
import bs58 from "bs58";

const Home = () => {
  const { connection } = useConnection();
  const wallet = useWallet();
  const { publicKey, signMessage } = useWallet();

  const [balance, setBalance] = useState("Loading...");
  const [messageStatus, setMessageStatus] = useState("");
  const [sendStatus, setSendStatus] = useState("");

  async function sendTokens() {
    try {
      const to = document.getElementById("to").value.trim();
      const amount = parseFloat(document.getElementById("amount").value);

      if (!to || !amount || isNaN(amount)) {
        throw new Error("Please enter a valid recipient and amount.");
      }

      const transaction = new Transaction();
      transaction.add(
        SystemProgram.transfer({
          fromPubkey: wallet.publicKey,
          toPubkey: new PublicKey(to),
          lamports: amount * LAMPORTS_PER_SOL,
        })
      );

      await wallet.sendTransaction(transaction, connection);
      setSendStatus(`Sent ${amount} SOL to ${to}`);
    } catch (error) {
      setSendStatus(`Error: ${error.message}`);
    }
  }

  async function onClick() {
    try {
      if (!publicKey) throw new Error("Wallet not connected!");
      if (!signMessage) throw new Error("Wallet does not support message signing!");

      const message = document.getElementById("message").value.trim();
      if (!message) throw new Error("Message cannot be empty!");

      const encodedMessage = new TextEncoder().encode(message);
      const signature = await signMessage(encodedMessage);

      if (!ed25519.verify(signature, encodedMessage, publicKey.toBytes())) {
        throw new Error("Message signature invalid!");
      }

      setMessageStatus(`Message signed successfully! Signature: ${bs58.encode(signature)}`);
    } catch (error) {
      setMessageStatus(`Error: ${error.message}`);
    }
  }

  async function getBalance() {
    if (wallet.publicKey) {
      const balance = await connection.getBalance(wallet.publicKey);
      setBalance(`${(balance / LAMPORTS_PER_SOL).toFixed(2)} SOL`);
    } else {
      setBalance("Wallet not connected");
    }
  }

  React.useEffect(() => {
    getBalance();
  }, [wallet.publicKey]); // Update balance when wallet changes

  return (
    <div className="bg-[#0F172A] h-fit pb-10 w-full">
      <div className="w-full flex items-center justify-between px-10 py-4 border-b border-gray-700">
        <div className="text-white font-bold text-2xl">DropFly</div>
        <WalletMultiButton />
      </div>

      {/* SOL Balance Section */}
      <div className="flex flex-col items-center justify-center gap-6 mt-10">
        <div className="text-white font-bold text-2xl">SOL Balance:</div>
        <div className="text-white font-semibold text-xl">{balance}</div>
      </div>

      {/* Send Tokens Section */}
      <div className="flex flex-col items-center mt-10 gap-4">
        <h2 className="text-white font-bold text-xl">Send Tokens</h2>
        <input
          id="to"
          type="text"
          placeholder="Recipient Address"
          className="px-4 py-2 rounded-md border border-gray-700 bg-gray-800 text-white w-80 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Recipient Address"
        />
        <input
          id="amount"
          type="number"
          placeholder="Amount (SOL)"
          className="px-4 py-2 rounded-md border border-gray-700 bg-gray-800 text-white w-80 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Amount (SOL)"
        />
        <button
          onClick={sendTokens}
          className="px-6 py-2 bg-green-600 text-white font-bold rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          Send Tokens
        </button>
        {sendStatus && (
          <p className="text-sm text-gray-300 mt-2 text-center">{sendStatus}</p>
        )}
      </div>

      {/* Sign Message Section */}
      <div className="flex flex-col items-center mt-10 gap-4">
        <h2 className="text-white font-bold text-xl">Sign Message</h2>
        <input
          id="message"
          type="text"
          placeholder="Enter message to sign"
          className="px-4 py-2 rounded-md border border-gray-700 bg-gray-800 text-white w-80 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Message to sign"
        />
        <button
          onClick={onClick}
          className="px-6 py-2 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Sign Message
        </button>
        {messageStatus && (
          <p className="text-sm text-gray-300 mt-2 text-center">{messageStatus}</p>
        )}
      </div>

      {/* Airdrop Section */}
      <div className="w-full flex flex-col justify-center items-center mt-10">
        <Airdrop />
      </div>
    </div>
  );
};

export default Home;
