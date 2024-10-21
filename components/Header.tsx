import React from "react";
import { useRouter } from "next/router";

const Header: React.FC = () => {
  const router = useRouter();

  return (
    <nav className="text-[24px] bg-[#001f5c] p-[20px] text-main-text flex justify-between items-center flex-wrap gap-x-[20px] gap-y-[10px]">
      <h3
        className="font-bold cursor-pointer text-[f9f5ff]"
        onClick={() => router.push("/")}
      >
        Halal Dollars
      </h3>
    </nav>
  );
};

export default Header;
