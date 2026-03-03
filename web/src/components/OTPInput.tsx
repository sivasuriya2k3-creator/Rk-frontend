import React, { useRef, useState, useEffect } from 'react';

interface OTPInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  onComplete?: (value: string) => void;
  disabled?: boolean;
  error?: boolean;
  className?: string;
}

export const OTPInput: React.FC<OTPInputProps> = ({
  length = 6,
  value,
  onChange,
  onComplete,
  disabled = false,
  error = false,
  className = ''
}) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  // Initialize input refs
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, length);
  }, [length]);

  // Auto-focus first input on mount
  useEffect(() => {
    if (!disabled && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [disabled]);

  // Handle completion
  useEffect(() => {
    if (value.length === length && onComplete) {
      onComplete(value);
    }
  }, [value, length, onComplete]);

  const handleChange = (index: number, newValue: string) => {
    // Only allow digits
    const sanitized = newValue.replace(/\D/g, '');
    
    if (sanitized.length === 0) {
      // Handle deletion
      const newOTP = value.split('');
      newOTP[index] = '';
      onChange(newOTP.join(''));
      return;
    }

    if (sanitized.length === 1) {
      // Single digit input
      const newOTP = value.split('');
      newOTP[index] = sanitized;
      onChange(newOTP.join(''));

      // Move to next input
      if (index < length - 1 && inputRefs.current[index + 1]) {
        inputRefs.current[index + 1]?.focus();
        setActiveIndex(index + 1);
      }
    } else if (sanitized.length > 1) {
      // Handle paste - distribute digits across inputs
      const digits = sanitized.slice(0, length).split('');
      const newOTP = value.split('');
      
      digits.forEach((digit, i) => {
        if (index + i < length) {
          newOTP[index + i] = digit;
        }
      });
      
      onChange(newOTP.join(''));

      // Focus the last filled input or the next empty one
      const nextIndex = Math.min(index + digits.length, length - 1);
      inputRefs.current[nextIndex]?.focus();
      setActiveIndex(nextIndex);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (value[index]) {
        // Clear current input
        const newOTP = value.split('');
        newOTP[index] = '';
        onChange(newOTP.join(''));
      } else if (index > 0) {
        // Move to previous input and clear it
        const newOTP = value.split('');
        newOTP[index - 1] = '';
        onChange(newOTP.join(''));
        inputRefs.current[index - 1]?.focus();
        setActiveIndex(index - 1);
      }
      e.preventDefault();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
      setActiveIndex(index - 1);
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
      setActiveIndex(index + 1);
    } else if (e.key === 'Enter' && value.length === length) {
      onComplete?.(value);
    }
  };

  const handleFocus = (index: number) => {
    setActiveIndex(index);
    // Select the content on focus for easier editing
    inputRefs.current[index]?.select();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const digits = pastedData.replace(/\D/g, '').slice(0, length);
    
    if (digits) {
      onChange(digits.padEnd(length, '').slice(0, length));
      
      // Focus the last input
      const lastIndex = Math.min(digits.length, length - 1);
      inputRefs.current[lastIndex]?.focus();
      setActiveIndex(lastIndex);
    }
  };

  return (
    <div className={`flex gap-2 justify-center ${className}`}>
      {Array.from({ length }, (_, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[index] || ''}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onFocus={() => handleFocus(index)}
          onPaste={handlePaste}
          disabled={disabled}
          className={`
            w-12 h-14 text-center text-2xl font-semibold
            border-2 rounded-lg
            transition-all duration-200
            ${error 
              ? 'border-red-500 bg-red-50 dark:bg-red-900/20' 
              : activeIndex === index
                ? 'border-[#D4AF37] bg-white dark:bg-gray-800 shadow-lg'
                : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'
            }
            ${disabled 
              ? 'opacity-50 cursor-not-allowed' 
              : 'hover:border-[#D4AF37]/50 cursor-text'
            }
            focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50
            text-gray-900 dark:text-white
          `}
          aria-label={`OTP digit ${index + 1}`}
        />
      ))}
    </div>
  );
};

export default OTPInput;
