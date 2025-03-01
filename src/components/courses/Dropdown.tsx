import React, { useState } from "react";

interface Props {
  options: string[];
  selectedOption: string | null;
  onSelect: (option: string) => void;
  required?: boolean;
  errorMessage?: string;
  functionToChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}
const Dropdown = ({
  options,
  selectedOption,
  onSelect,
  required,
  errorMessage,
  functionToChange,
}: Props) => {
  const [selectedValue, setSelectedValue] = useState(selectedOption || "");

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newSelectedValue = event.target.value;
    setSelectedValue(newSelectedValue);
    onSelect(newSelectedValue);
    functionToChange(event);
  };

  return (
    <div className="relative flex-auto h-full">
      <select
        name="cars"
        id="cars"
        value={selectedValue}
        onChange={handleChange}
        className={`w-full h-full sm:w-[100%] px-4 py-2 border ${errorMessage ? "border-red-500" : "border-gray-300"} rounded-xl appearance-none focus:outline-none pr-10`}
      >
        <option value="" disabled={selectedOption !== null}>
          Select an option
        </option>
        {options.map((item, i) => (
          <option key={i} value={item}>
            {item}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-6 flex items-center pointer-events-none">
        <svg
          className="w-4 h-4 text-gray-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
      {errorMessage && (
        <p className="text-red-500 text-xs mt-1">{errorMessage}</p>
      )}
    </div>
  );
};

export default Dropdown;
