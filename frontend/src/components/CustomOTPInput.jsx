import React, { useState, useRef, useEffect } from 'react';

const CustomOTPInput = ({ value, onChange, numInputs = 6, separator = null, inputStyle = '', containerStyle = '', shouldAutoFocus = false }) => {
  const [otp, setOtp] = useState(value || '');
  const inputRefs = useRef([]);

  useEffect(() => {
    setOtp(value || '');
  }, [value]);

  useEffect(() => {
    if (shouldAutoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [shouldAutoFocus]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // Only allow digits

    let newOtpArr = otp.split('').filter(Boolean);
    // For typing, always insert at the first empty position from left
    if (value) {
      // Find first empty position
      let pos = newOtpArr.findIndex((d) => !d);
      if (pos === -1) pos = newOtpArr.length;
      if (pos < numInputs) {
        newOtpArr[pos] = value;
      }
    } else {
      // On backspace, clear this position
      newOtpArr[index] = '';
    }
    // Fill remaining with '' to numInputs
    while (newOtpArr.length < numInputs) newOtpArr.push('');
    const updatedOtp = newOtpArr.slice(0, numInputs).join('');
    setOtp(updatedOtp);
    onChange(updatedOtp);
    
    // Auto-focus next input after entering digit
    if (value && index < numInputs - 1) {
      // Find next empty input
      let next = newOtpArr.findIndex((d) => !d);
      if (next === -1) next = index + 1;
      inputRefs.current[next]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, numInputs);
    // Always fill from left
    setOtp(pastedData.padEnd(numInputs, ''));
    onChange(pastedData.padEnd(numInputs, ''));
    // Focus the last input filled
    inputRefs.current[pastedData.length - 1 || 0]?.focus();
  };

  return (
    <div className={`flex justify-center ${containerStyle}`} dir="ltr">
      {Array.from({ length: numInputs }, (_, index) => (
        <React.Fragment key={index}>
          <input
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            maxLength="1"
            value={otp[index] || ''}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            className={`w-12 h-12 text-center border-2 border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none ${inputStyle}`}
            autoComplete="off"
          />
          {separator && index < numInputs - 1 && separator}
        </React.Fragment>
      ))}
    </div>
  );
};

export default CustomOTPInput;
