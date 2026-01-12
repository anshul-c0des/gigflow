"use client";

import { useState } from "react";
import api from "@/lib/axios";

type Props = {
  gigId: string;
  onBidCreated: (bid: any) => void;
};

export const BidForm = ({ gigId, onBidCreated }: Props) => {
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post("/bids", { gigId, amount: Number(amount), message: message || "" });
      onBidCreated(data.bid);
      setAmount("");
      setMessage("");
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to place bid");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="border p-2 w-full rounded"
        required
      />
      <textarea
        placeholder="Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="border p-2 w-full rounded"
        required
      />
      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        {loading ? "Placing..." : "Place Bid"}
      </button>
    </form>
  );
};
