import type React from "react";
import { Input } from "./ui/input";
import type { InputHTMLAttributes } from "react";

interface InputWithIconProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

export default function InputWithIcon({ icon, iconPosition = "left", className, ...props }: InputWithIconProps) {
  const inputPaddingClass = icon ? (iconPosition === "left" ? "pl-10" : "pr-10") : "";

  return (
    <div className="relative">
      {/* icon prop이 존재할 때만 렌더링 */}
      {icon && (
        <div
          className={`pointer-events-none absolute inset-y-0 flex items-center ${
            iconPosition === "left" ? "left-0 pl-3" : "right-0 pr-3"
          }`}
        >
          {/* icon prop을 직접 렌더링합니다. */}
          {icon}
        </div>
      )}

      <Input className={`${className || ""} ${inputPaddingClass}`} {...props} />
    </div>
  );
}
