import React, { useState } from "react";

interface AddressInputProp {
  onAddressChange: (addresses: string[]) => void;
}

const Addressinput: React.FC<AddressInputProp> = ({ onAddressChange }) => {
  const [inputValue, setInputValue] = useState<string>("");
  const [instructorAddress, setInstructorAddresses] = useState<string[]>([]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      if (inputValue.trim()) {
        //@todo validate address input
        const newAddress = [...instructorAddress, inputValue.trim()];
        setInstructorAddresses(newAddress);
        onAddressChange(newAddress);
        setInputValue("");
      }
    }
  };

  const handleRemoveEmail = (index: number) => {
    const newEmails = instructorAddress.filter((_, i) => i !== index);
    setInstructorAddresses(newEmails);
    onAddressChange(newEmails);
  };

  return (
    <div className="flex flex-wrap items-center p-2 rounded-md">
      {instructorAddress.map((instAddress, index) => (
        <div
          key={index}
          className="flex items-center  text-gray-800 p-1 mr-2 mb-2 rounded"
        >
          <span className="text-sm">{instAddress}</span>
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
        placeholder="Enter Instructor wallet address and press Enter or comma"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
      />
    </div>
  );
};

export default Addressinput;
