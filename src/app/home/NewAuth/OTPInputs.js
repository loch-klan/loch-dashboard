import React, { useEffect, useRef, useState } from "react";

const OTPInputs = ({ numberOfDigits, handleChangeOTP, isMobile, onSubmit }) => {
  const [otp, setOtp] = useState(new Array(numberOfDigits).fill(""));
  const [otpError, setOtpError] = useState(null);
  const otpBoxReference = useRef([]);
  const [flag, setFlag] = useState(false);

  function handleChange(e, index) {
    if (flag) return;

    const { value } = e.target;

    let newArr = [...otp];
    newArr[index] = value;
    setOtp(newArr);

    if (value && index < numberOfDigits - 1) {
      otpBoxReference.current[index + 1].focus();
    }
  }

  useEffect(() => {
    handleChangeOTP(otp.join(""));
  }, [otp]);

  function handlePaste(e) {
    const pastedData = e.clipboardData.getData("text");
    const pastedValues = pastedData.split("").slice(0, numberOfDigits);

    let newArr = [...otp];
    pastedValues.forEach((value, index) => {
      newArr[index] = value;
    });

    const focusIndex = pastedValues.length > 5 ? 5 : pastedValues.length;
    setOtp(newArr);

    otpBoxReference.current[focusIndex].focus();
    setFlag(true);
  }

  useEffect(() => {
    if (flag) {
      setTimeout(() => {
        setFlag(false);
      }, 1000);
    }
  }, [flag]);

  function handleBackspaceAndEnter(e, index) {
    if (flag) return;

    if (e.key === "Backspace" && !e.target.value && index > 0) {
      otpBoxReference.current[index - 1].focus();
    }
    if (e.key === "Enter" && e.target.value && index < numberOfDigits - 1) {
      otpBoxReference.current[index + 1].focus();
    }
    if (e.key === "Enter" && onSubmit) {
      onSubmit();
    }
  }

  return (
    <div className="new-auth-content-input--otp-pills-holder">
      {otp.map((digit, index) => (
        <input
          type="number"
          pattern="[0-9]*"
          inputmode="numeric"
          key={index}
          value={digit}
          maxLength={1}
          onChange={(e) => handleChange(e, index)}
          onKeyUp={(e) => handleBackspaceAndEnter(e, index)}
          ref={(reference) => (otpBoxReference.current[index] = reference)}
          className={`new-auth-content-input new-auth-content-input--otp-pills ${
            isMobile ? "new-auth-content-input--otp-pills-mobile" : ""
          }`}
          onPaste={handlePaste}
        />
      ))}
    </div>
  );
};

export default OTPInputs;
