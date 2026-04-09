// import * as React from "react"

// import { cn } from "@/utils/helpers"

// function Textarea({ ref, className, ...props }: React.ComponentProps<"textarea"> & { ref?: React.RefObject<HTMLTextAreaElement | null> }) {
// 	return (
// 		<textarea
// 			ref={ref}
// 			data-slot="textarea"
// 			className={cn(
// 				"flex w-full min-h-28 min-w-0 rounded-xl border border-input bg-background px-4 py-3 text-base shadow-xs transition-[color,box-shadow] outline-none",
// 				"placeholder:text-muted-foreground",
// 				"disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-bg-disabled disabled:text-text-disabled",
// 				"focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
// 				"aria-invalid:border-destructive aria-invalid:ring-destructive/20",
// 				className,
// 			)}
// 			{...props}
// 		/>
// 	)
// }

// Textarea.displayName = "Textarea"

// export { Textarea }

import type { JSX } from "react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/utils/helpers";

type TextAreaProps = React.ComponentProps<"textarea"> & {
  iconPosition?: "left" | "right";
  iconClick?: () => void;
  icon?: JSX.Element;
  label?: string;
  floatingLabel?: boolean;
  required?: boolean;
  error?: string;
  rows?: number;
};

function TextArea({
  className,
  iconPosition,
  iconClick,
  icon,
  value,
  onChange,
  label,
  floatingLabel = false,
  required = false,
  error,
  rows = 4,
  ...props
}: TextAreaProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [displayValue, setDisplayValue] = useState<string>("");
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  // Sync internal display value with external value prop
  useEffect(() => {
    setDisplayValue(String(value || ""));
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDisplayValue(e.target.value);
    onChange?.(e);
  };

  const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    setIsFocused(true);
    props.onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    setIsFocused(false);
    props.onBlur?.(e);
  };

  const hasValue = displayValue !== "";
  const isLabelFloating = floatingLabel && (isFocused || hasValue);

  return (
    <div className="relative w-full">
      <div className="relative">
        {/* Floating Label */}
        {floatingLabel && label && (
          <label
            htmlFor={props.id}
            className={cn(
              "absolute w-[500px] left-4 transition-all duration-200 ease-out cursor-text pointer-events-none z-10", // เพิ่ม z-10
              isLabelFloating
                ? "top-2 text-sm text-subdude px-1 bg-background"
                : "top-4 text-base text-foreground",
              iconPosition === "left" && icon
                ? isLabelFloating
                  ? "left-11"
                  : "left-12"
                : "",
            )}
          >
            {label}
            {required && <span className="text-destructive"> *</span>}
          </label>
        )}

        {/* Left Icon */}
        {iconPosition === "left" && icon && (
          <div
            className={cn(
              "absolute left-0 top-0 flex items-start justify-center p-4",
              iconClick ? "cursor-pointer" : "",
            )}
            onClick={iconClick}
          >
            {icon}
          </div>
        )}

        <textarea
          {...props}
          id={props.id}
          ref={textAreaRef}
          rows={rows}
          data-slot="textarea"
          aria-invalid={!!error}
          className={cn(
            "flex w-full h-64 rounded-xl border border-input bg-background px-4 py-3 text-base shadow-xs transition-[color,box-shadow] outline-none resize-none",
            "placeholder:text-muted-foreground",
            "disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-bg-disabled disabled:text-text-disabled",
            "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
            "aria-invalid:border-destructive aria-invalid:ring-destructive/20",
            floatingLabel && label && isLabelFloating ? "pt-8" : "pt-4",
            iconPosition === "left" && icon ? "pl-12" : "",
            iconPosition === "right" && icon ? "pr-12" : "",
            error ? "border-destructive" : "",
            "scrollbar-thin scrollbar-thumb-rounded",
            className,
          )}
          value={displayValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={floatingLabel ? "" : props.placeholder}
        />

        {/* Right Icon */}
        {iconPosition === "right" && icon && (
          <div
            className={cn(
              "absolute right-0 top-0 flex items-start justify-center p-4",
              iconClick ? "cursor-pointer" : "",
            )}
            onClick={iconClick}
          >
            {icon}
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && <p className="text-destructive mt-1.5 text-sm">{error}</p>}
    </div>
  );
}

export { TextArea };
