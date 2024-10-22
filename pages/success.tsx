import React from "react";
import Header from "../components/Header";
import Link from "next/link";

const success = () => {
  return (
    <>
      <Header />
      <div className="min-h-[calc(100vh-78px)] w-full bg-[#f2f4f7] text-[#001f5c] flex flex-col items-center justify-center">
        <h3 className="font-bold text-4xl mb-10">
          Transaction successful 🎉🎉 🎉
        </h3>

        <div className="max-w-[500px] flex flex-col gap-6 text-center mb-6">
          <p className="text-[#475467] text-base font-semibold">
            <span className="bg-red-500 text-white p-1 rounded">NOTE:</span>{" "}
            After payment, payment confirmation receipt will be sent to your
            mail and after a short period of time (max - 30 mins - delay might
            be due to payment confirmation), a mail will be sent to your email
            with your GoHighLevel account details. You can also login with your
            email and password you entered here. <br /> Login URL:{" "}
            <a
              target="_blank"
              className="text-[#003db8d7]"
              href="https://app.gohighlevel.com/login"
            >
              https://app.gohighlevel.com/login
            </a>
          </p>
          <p className="text-[#475467] text-base font-semibold">
            <span className="bg-red-500 text-white p-1 rounded">NOTE:</span> If
            you did not receive any mail after 30 mins, kindly check your spam
            folder, if you still did not receive any mail, kindly call or
            WhatsApp us at +234 704 572 8507 or join our WhatsApp group{" "}
            <a
              target="_blank"
              className="text-[#003db8d7]"
              href="https://chat.whatsapp.com/HlAckWYQvQUCLGNgiZZGee"
            >
              Here
            </a>
          </p>
        </div>
        <Link
          className="bg-[#003db8d7] text-[#f9f5ff] p-[10px_20px] border-none rounded-[5px] mt-[20px] cursor-pointer transition-all duration-300 hover:bg-[#0237a1]"
          href={"/"}
        >
          Go back
        </Link>
      </div>
    </>
  );
};

export default success;
