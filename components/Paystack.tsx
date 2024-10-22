"use client";
import React, { useEffect, useRef } from "react";
import { usePaystackPayment } from "react-paystack";

const PaystackHookExample = ({
  config,
  onSuccess,
  onClose,
}: {
  config: any;
  onSuccess: (value: string) => void;
  onClose: () => void;
}) => {
  if (window === undefined) {
    return null;
  }
  const initializePayment = usePaystackPayment(config);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  }, [bottomRef.current]);

  return (
    <div className="flex flex-col gap-2 mt-10 max-w-[400px]" ref={bottomRef}>
      <p className="text-[#475467] text-base font-semibold">
        <span className="bg-red-500 text-white p-1 rounded">NOTE:</span> Kindly
        check and confirm your details before making payments, these details
        will be used in creating your GoHighLevel account. Cancel to make any
        changes.
      </p>
      <button
        className="bg-red-500 text-[#f9f5ff] p-[10px_20px] border-none rounded-[5px] mt-[20px] cursor-pointer transition-all duration-300 hover:bg-red-700"
        onClick={onClose}
      >
        Cancel
      </button>
      <button
        className="bg-[#003db8d7] text-[#f9f5ff] p-[10px_20px] border-none rounded-[5px] mt-[20px] cursor-pointer transition-all duration-300 hover:bg-[#0237a1]"
        onClick={() => {
          initializePayment({ onSuccess, onClose });
        }}
      >
        Confirm Payment
      </button>
    </div>
  );
};
export default PaystackHookExample;
