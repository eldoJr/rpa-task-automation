import { cn } from "@/utils/helpers";
import { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline";
};

const Button = ({ variant = "default", className, children, ...props }: ButtonProps) => {
  return (
    <button
      className={cn(
        "px-4 py-2 rounded-lg font-medium transition-all",
        variant === "default" ? "bg-black text-white hover:bg-gray-800" : "border border-black text-black hover:bg-gray-100",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
