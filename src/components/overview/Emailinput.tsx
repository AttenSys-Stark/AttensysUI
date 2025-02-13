import React, { useState } from "react";

interface EmailInputProps {
  onEmailsChange: (emails: string[]) => void;
}

const Emailinput: React.FC<EmailInputProps> = ({ onEmailsChange }) => {
  const [inputValue, setInputValue] = useState<string>("");
  const [emails, setEmails] = useState<string[]>([]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      if (inputValue.trim() && validateEmail(inputValue.trim())) {
        const newEmails = [...emails, inputValue.trim()];
        setEmails(newEmails);
        onEmailsChange(newEmails);
        setInputValue("");
      }
    }
  };

  const handleRemoveEmail = (index: number) => {
    const newEmails = emails.filter((_, i) => i !== index);
    setEmails(newEmails);
    onEmailsChange(newEmails);
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <div className="flex flex-wrap items-center p-2 rounded-md">
      {emails.map((email, index) => (
        <div
          key={index}
          className="flex items-center  text-gray-800 p-1 mr-2 mb-2 rounded"
        >
          <span className="text-sm">{email}</span>
          <button
            type="button"
            onClick={() => handleRemoveEmail(index)}
            className="ml-1 text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>
      ))}
      <input
        type="text"
        className="flex-grow p-2 border-none focus:outline-none bg-transparent"
        placeholder="Enter email and press Enter or comma"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
};

export default Emailinput;
