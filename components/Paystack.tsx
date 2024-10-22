"use client";
import Link from "next/link";
import React from "react";

const Paystack = ({ url, onClose }: { url: string; onClose: () => void }) => {
  return (
    <div className="flex flex-col gap-2 mt-10 max-w-[400px]">
      <p className="text-[#475467] text-base font-semibold">
        <span className="bg-red-500 text-white p-1 rounded">NOTE:</span> Kindly
        check and confirm your details before making payments, these details
        will be used in creating your GoHighLevel account.
      </p>
      <button
        className="bg-red-500 text-[#f9f5ff] p-[10px_20px] border-none rounded-[5px] mt-[20px] cursor-pointer transition-all duration-300 hover:bg-red-700"
        onClick={onClose}
      >
        Cancel
      </button>
      <Link
        className="bg-[#003db8d7] text-[#f9f5ff] p-[10px_20px] border-none rounded-[5px] mt-[20px] cursor-pointer transition-all duration-300 hover:bg-[#0237a1]"
        href={url}
      >
        Confirm Payment
      </Link>
    </div>
  );
};
export default Paystack;
