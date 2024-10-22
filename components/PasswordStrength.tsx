import React from "react";
import { IoCheckbox } from "react-icons/io5";

const PasswordStrength = ({
  hasEightCharacters,
  hasLowerCase,
  hasOneNumber,
  hasSpecialCharacter,
  hasUpperCase,
}: {
  hasEightCharacters: boolean;
  hasOneNumber: boolean;
  hasSpecialCharacter: boolean;
  hasUpperCase: boolean;
  hasLowerCase: boolean;
}) => {
  return (
    <>
      <div className="flex h-auto w-full items-center justify-between gap-5 mt-3">
        <div
          className={`${
            hasEightCharacters ||
            hasOneNumber ||
            hasSpecialCharacter ||
            hasUpperCase ||
            hasLowerCase
              ? "bg-green-600"
              : "bg-gray-600"
          } h-1.5 w-full rounded-md md:min-w-[128px] mb-2`}
        />
        <div
          className={`${
            hasEightCharacters && hasSpecialCharacter
              ? "bg-green-600"
              : "bg-gray-600"
          } h-1.5 w-full rounded-md md:min-w-[128px] mb-2`}
        />
        <div
          className={`${
            hasEightCharacters &&
            hasOneNumber &&
            hasSpecialCharacter &&
            hasUpperCase &&
            hasLowerCase
              ? "bg-green-600"
              : "bg-gray-600"
          } h-1.5 w-full rounded-md md:min-w-[128px] mb-2`}
        />
      </div>
      <div className="flex flex-col gap-1 text-sm">
        <div
          className={`flex flex-row items-center gap-x-3 ${
            hasEightCharacters ? "text-green-600" : "text-gray-600"
          }`}
        >
          <IoCheckbox />
          <p>At least 8 characters</p>
        </div>
        <div
          className={`flex flex-row items-center gap-x-3 ${
            hasOneNumber ? "text-green-600" : "text-gray-600"
          }`}
        >
          <IoCheckbox />
          <p>Contains at least one number</p>
        </div>
        <div
          className={`flex flex-row items-center gap-x-3 ${
            hasSpecialCharacter ? "text-green-600" : "text-gray-600"
          }`}
        >
          <IoCheckbox />
          <p>Contains a special character</p>
        </div>
        <div
          className={`flex flex-row items-center gap-x-3 ${
            hasUpperCase ? "text-green-600" : "text-gray-600"
          }`}
        >
          <IoCheckbox />
          <p>Contains uppercase letter</p>
        </div>
        <div
          className={`flex flex-row items-center gap-x-3 ${
            hasLowerCase ? "text-green-600" : "text-gray-600"
          }`}
        >
          <IoCheckbox />
          <p>Contains lowercase letter</p>
        </div>
      </div>
    </>
  );
};

export default PasswordStrength;
