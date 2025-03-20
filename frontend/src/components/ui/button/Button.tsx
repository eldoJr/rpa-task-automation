// components/ui/button.tsx
import * as React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const getVariantClasses = () => {
      switch (variant) {
        case "default":
          return "bg-blue-500 text-white hover:bg-blue-600";
        case "destructive":
          return "bg-red-500 text-white hover:bg-red-600";
        case "outline":
          return "bg-transparent border border-gray-300 hover:bg-gray-100";
        case "secondary":
          return "bg-gray-200 text-gray-900 hover:bg-gray-300";
        case "ghost":
          return "bg-transparent hover:bg-gray-100";
        case "link":
          return "bg-transparent text-blue-500 hover:underline";
        default:
          return "bg-blue-500 text-white hover:bg-blue-600";
      }
    };

    const getSizeClasses = () => {
      switch (size) {
        case "default":
          return "h-10 px-4 py-2";
        case "sm":
          return "h-8 px-3 text-sm";
        case "lg":
          return "h-12 px-6 text-lg";
        case "icon":
          return "h-10 w-10";
        default:
          return "h-10 px-4 py-2";
      }
    };

    return (
      <button
        ref={ref}
        className={`inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none ${getVariantClasses()} ${getSizeClasses()} ${className || ""}`}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };