import type { JSX } from "react";
import { Icon } from "@iconify/react";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/utils/helpers";

type InputProps = React.ComponentProps<"input"> & {
  iconPosition?: "left" | "right";
  iconClick?: () => void;
  icon?: JSX.Element;
  isFile?: boolean;
  thousandSeparator?: boolean;
  label?: string;
  floatingLabel?: boolean;
  required?: boolean;
  error?: string;
};

function Input({
  className,
  type,
  iconPosition,
  iconClick,
  icon,
  isFile = false,
  thousandSeparator = false,
  value,
  onChange,
  label,
  floatingLabel = false,
  required = false,
  error,
  ...props
}: InputProps) {
  const [toggleType, setToggleType] = useState(type);
  const [displayValue, setDisplayValue] = useState<string>("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  // Format number with thousand separators
  const formatNumberWithCommas = (num: string): string => {
    // Remove existing commas and non-numeric characters except decimal point
    const cleanNum = num.replace(/[^\d.]/g, "");

    // Split by decimal point
    const parts = cleanNum.split(".");

    // Add commas to integer part
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    // Join back with decimal if it exists
    return parts.join(".");
  };

  // Remove commas for actual value
  const removeCommas = (num: string): string => {
    return num.replace(/,/g, "");
  };

  // Update display value when value prop changes
  useEffect(() => {
    if (thousandSeparator && value !== undefined) {
      const stringValue = String(value);
      if (
        !Number.isNaN(Number(removeCommas(stringValue))) &&
        stringValue !== ""
      ) {
        setDisplayValue(formatNumberWithCommas(stringValue));
      } else {
        setDisplayValue(stringValue);
      }
    } else {
      setDisplayValue(String(value || ""));
    }
  }, [value, thousandSeparator]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;

    if (thousandSeparator) {
      // Only allow numbers, commas, and decimal points
      const cleanValue = inputValue.replace(/[^\d.,]/g, "");

      if (
        cleanValue === "" ||
        !Number.isNaN(Number(removeCommas(cleanValue)))
      ) {
        const formattedValue =
          cleanValue === "" ? "" : formatNumberWithCommas(cleanValue);
        setDisplayValue(formattedValue);

        // Create a new event with the clean numeric value (without commas)
        const cleanNumericValue = removeCommas(formattedValue);
        const syntheticEvent = {
          ...e,
          target: {
            ...e.target,
            value: cleanNumericValue,
          },
        };

        onChange?.(syntheticEvent as React.ChangeEvent<HTMLInputElement>);
      }
    } else {
      setDisplayValue(inputValue);
      onChange?.(e);
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    props.onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    props.onBlur?.(e);
  };

  const hasValue = () => {
    const currentValue = thousandSeparator ? displayValue : value;
    return (
      currentValue !== undefined && currentValue !== null && currentValue !== ""
    );
  };

  const isLabelFloating = floatingLabel && (isFocused || hasValue());
  return (
    <div className="relative w-full">
      <div className="relative">
        {floatingLabel && label && (
          <label
            htmlFor={props.id}
            className={cn(
              "absolute left-4 transition-all duration-200 ease-out cursor-text pointer-events-none",
              isLabelFloating
                ? "top-2 text-sm text-subdude"
                : "top-1/2 -translate-y-1/2 text-base text-foreground",
              iconPosition == "left" && icon
                ? isLabelFloating
                  ? "left-11"
                  : "left-12"
                : "",
            )}
            onClick={() => inputRef.current?.focus()}
          >
            {label}
            {required && <span className="text-destructive"> *</span>}
          </label>
        )}
        {iconPosition == "left" && (
          <div
            className={cn(
              "absolute inset-y-0 left-0 my-px ml-px flex items-center justify-center rounded-r-md p-4",
              iconClick ? "cursor-pointer" : "",
            )}
            onClick={iconClick}
          >
            {icon}
          </div>
        )}
        <input
          {...props}
          id={props.id}
          ref={inputRef}
          type={toggleType}
          data-slot="input"
          aria-invalid={!!error}
          className={cn(
            "flex w-full h-14 min-w-0 rounded-xl border border-input bg-background px-4 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none",
            "placeholder:text-muted-foreground",
            "disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-bg-disabled disabled:text-text-disabled disabled:opacity-60",
            "file:inline-flex file:h-7 file:border-0 file:bg-transparent file:font-medium file:text-foreground",
            "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
            "aria-invalid:border-destructive aria-invalid:ring-destructive/20",
            floatingLabel && label && isLabelFloating ? "pt-6" : "",
            iconPosition == "left" && icon ? "pl-12" : "",
            iconPosition == "right" && icon ? "pr-12" : "",
            type == "password" ? "pr-12" : "",
            error ? "border-destructive" : "",
            className,
          )}
          value={thousandSeparator ? displayValue : value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={floatingLabel ? "" : props.placeholder}
        />
        {type == "password" && (
          <div
            className={cn(
              "absolute inset-y-0 right-0 my-px ml-px flex cursor-pointer items-center justify-center rounded-r-md p-4",
            )}
            onClick={() =>
              setToggleType(toggleType == "password" ? "text" : "password")
            }
          >
            {toggleType == "password" ? (
              <Icon icon="lucide:eye" className="text-primary h-4 w-4" />
            ) : (
              <Icon icon="lucide:eye-off" className="text-primary h-4 w-4" />
            )}
          </div>
        )}
        {iconPosition == "right" && (
          <div
            className={cn(
              "absolute inset-y-0 right-0 my-px ml-px flex items-center justify-center rounded-r-md p-4",
              iconClick ? "cursor-pointer" : "",
              isFile ? "border bg-secondary px-8" : "",
            )}
            onClick={iconClick}
          >
            {icon}
          </div>
        )}
      </div>
      {error && <p className="text-destructive mt-1.5 text-sm">{error}</p>}
    </div>
  );
}

export { Input };
