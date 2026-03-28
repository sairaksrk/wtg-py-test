import type { JSX } from "react";
import { Icon } from "@iconify/react";
import { useRef, useState } from "react";
import { cn } from "@/utils/helpers";

type SelectOption = {
  label: string;
  value: string | number;
};

type SelectProps = React.ComponentProps<"select"> & {
  options: SelectOption[];
  iconPosition?: "left" | "right";
  iconClick?: () => void;
  icon?: JSX.Element;
  label?: string;
  floatingLabel?: boolean;
  required?: boolean;
  readOnly?: boolean;
  error?: string;
};

function Select({
  className,
  options = [],
  iconPosition,
  iconClick,
  icon,
  value,
  onChange,
  label,
  floatingLabel,
  required = false,
  readOnly,
  error,
  ...props
}: SelectProps) {
  const [isFocused, setIsFocused] = useState(false);
  const selectRef = useRef<HTMLSelectElement>(null);

  const handleFocus = (e: React.FocusEvent<HTMLSelectElement>) => {
    setIsFocused(true);
    props.onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLSelectElement>) => {
    setIsFocused(false);
    props.onBlur?.(e);
  };
  const hasValue = value !== undefined && value !== null && value !== "";
  const isLabelFloating = floatingLabel && (isFocused || hasValue);
  //   const placeholderText = label ? `- เลือก${label} -` : "- เลือก -";
  const placeholderText = "- เลือก -";
  //  Label จะลอยเมื่อ Focus หรือ มีค่า

  return (
    <div className="relative w-full">
      <div className="relative">
        {floatingLabel && label && (
          <label
            htmlFor={props.id}
            className={cn(
              "absolute left-4 transition-all duration-200 ease-out cursor-text pointer-events-none z-10",
              isLabelFloating
                ? "top-2 text-sm text-subdude"
                : "top-1/2 -translate-y-1/2 text-base text-foreground",
              iconPosition === "left" && icon
                ? isLabelFloating
                  ? "left-11"
                  : "left-12"
                : "",
            )}
          >
            {label}

            {required && !readOnly && (
              <span className="text-destructive"> *</span>
            )}
          </label>
        )}

        <select
          {...props}
          ref={selectRef}
          value={value}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={cn(
            "flex w-full h-14 rounded-xl border border-input px-4 text-base shadow-xs outline-none transition-all appearance-none",
            floatingLabel && label && isLabelFloating ? "pt-5 pb-1" : "py-2",
            iconPosition === "left" && icon ? "pl-12" : "",
            "pr-10",
            error ? "border-destructive" : "",
            readOnly ? "bg-gray-100 text-[#A1A1AA]" : "bg-background",
            !isLabelFloating && !hasValue
              ? "text-transparent"
              : "text-foreground",
            className,
          )}
        >
          <option value="" disabled={false}>
            {placeholderText}
          </option>

          {options.map((opt) => (
            <option
              key={opt.value}
              value={opt.value}
              className="text-foreground"
            >
              {opt.label}
            </option>
          ))}
        </select>

        {/* Arrow Icon */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
          <Icon
            icon="lucide:chevron-down"
            className="h-5 w-5 text-muted-foreground"
          />
        </div>
      </div>

      {/* Error Message */}
      {error && <p className="text-destructive mt-1.5 text-sm">{error}</p>}
    </div>
  );
}

export { Select };
