'use client';

import React, { useRef, useState } from 'react';

// declare type for the props

type InputProps = {
  length?: number;
  onComplete: (pin: string) => void;
};

const OTPInput = ({ length = 4, onComplete }: InputProps) => {
  // if you're not using Typescript, simply do const inputRef = useRef()

  const inputRef = useRef<HTMLInputElement[]>(Array(length).fill(null));

  // if you're not using Typescript, do useState()
  const [OTP, setOTP] = useState<string[]>(Array(length).fill(''));

  const handleTextChange = (input: string, index: number) => {
    const newPin = [...OTP];
    newPin[index] = input;
    setOTP(newPin);

    // check if the user has entered the first digit, if yes, automatically focus on the next input field and so on.

    if (input.length === 1 && index < length - 1) {
      inputRef.current[index + 1]?.focus();
    }

    if (input.length === 0 && index > 0) {
      inputRef.current[index - 1]?.focus();
    }

    // if the user has entered all the digits, grab the digits and set as an argument to the onComplete function.

    if (newPin.every((digit) => digit !== '')) {
      onComplete(newPin.join(''));
    }
  };

  // return the inputs component

  return (
    <div className="flex mb-2 gap-4 ">
      {Array.from({ length }, (_, index) => (
        <input
          key={index}
          type="text"
          maxLength={1}
          value={OTP[index]}
          onChange={(e) => handleTextChange(e.target.value, index)}
          ref={(ref) => (inputRef.current[index] = ref as HTMLInputElement)}
          className=" w-14 h-14 py-3 text-md font-extrabold text-center text-gray-900 bg-white border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
        />
      ))}
    </div>
  );
};

export default OTPInput;
