import { FC } from "react";

interface SelectProps {
  label: string;
  options: string[];
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const Select: FC<SelectProps> = ({ label, options, value, onChange }) => {
  return (
    <div className="flex flex-col">
      <label className="text-gray-700 font-medium mb-1">{label}</label>
      <select
        className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={value}
        onChange={onChange}
      >
        <option value="">Select an option</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
