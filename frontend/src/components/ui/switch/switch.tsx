// components/ui/switch.tsx
import * as React from "react";

interface SwitchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type" | "onChange"> {
  onCheckedChange?: (checked: boolean) => void;
  checked?: boolean;
}

const Switch = React.forwardRef<HTMLInputElement, SwitchProps>(
  ({ className, onCheckedChange, checked, ...props }, ref) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (onCheckedChange) {
        onCheckedChange(event.target.checked);
      }
    };

    return (
      <div className={`inline-flex ${className || ""}`}>
        <label className="relative inline-block h-6 w-11">
          <input
            ref={ref}
            type="checkbox"
            className="peer sr-only"
            checked={checked}
            onChange={handleChange}
            {...props}
          />
          <span className="absolute inset-0 cursor-pointer rounded-full bg-gray-300 transition peer-checked:bg-blue-500" />
          <span className="absolute left-1 top-1 h-4 w-4 transform rounded-full bg-white transition peer-checked:translate-x-5" />
        </label>
      </div>
    );
  }
);
Switch.displayName = "Switch";

export { Switch };