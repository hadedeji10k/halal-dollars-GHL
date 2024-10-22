import React from "react";
import Spinner from "../assets/Spinner";

const Loader = ({
  spinning,
  children,
  message,
  className,
  textClassName,
}: {
  message?: string;
  spinning: boolean;
  children: any;
  className?: string;
  textClassName?: string;
}) => {
  return spinning ? (
    <div
      className={`relative w-full h-full flex flex-col justify-center items-center ${className}`}
    >
      <div className="loader absolute top-[40%] left-[45%]">
        <Spinner fill="#001f5c" className="animate-spin-slow absolute" />
      </div>
      <p
        className={`absolute loader top-[50%] text-[1.1rem] font-semibold ${textClassName}`}
      >
        {message}
      </p>
      <div className="spin_blur">{children}</div>
    </div>
  ) : (
    <>{children}</>
  );
};

export default Loader;
