"use client";

import { Icon } from "@iconify/react";
import * as React from "react";
import { FieldError } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/utils/helpers";
import { useDateFormatter } from "@/hooks/use-date-formatter";

interface DatePickerProps {
  placeholder?: string;
  value?: Date | bigint | null;
  onChange?: (value: Date | bigint | undefined) => void;
  isError?: FieldError;
  disabled?: boolean;
  label?: string;
  floatingLabel?: boolean;
  required?: boolean;
  error?: string;
  disablePastDates?: boolean;
  disableFutureDates?: boolean;
  valueType?: "date" | "bigint";
}

export function DatePicker(props: DatePickerProps) {
  const {
    placeholder = "Select date",
    value,
    onChange,
    isError = false,
    disabled = false,
    label,
    floatingLabel = false,
    required = false,
    error,
    disablePastDates = false,
    disableFutureDates = false,
    valueType = "date",
  } = props;

  const [open, setOpen] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);
  const triggerRef = React.useRef<HTMLButtonElement>(null);

  const { formatToBuddhist } = useDateFormatter();

  const bigintToDate = (bigintValue: bigint): Date => {
    return new Date(Number(bigintValue));
  };

  const dateToBigint = (date: Date): bigint => {
    return BigInt(date.getTime());
  };

  const getDateValue = (): Date | undefined => {
    if (!value) return undefined;

    if (typeof value === "bigint") {
      return bigintToDate(value);
    }

    return value;
  };

  const hasValue = () => {
    return value !== undefined && value !== null;
  };

  const isLabelFloating = floatingLabel && (isFocused || hasValue());

  const getDisabledDates = () => {
    if (disablePastDates) {
      return { before: new Date() };
    }

    if (disableFutureDates) {
      return { after: new Date() };
    }

    return undefined;
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        {floatingLabel && label && (
          <label
            className={cn(
              "absolute left-4 transition-all duration-200 ease-out cursor-pointer pointer-events-none z-10",
              isLabelFloating && value
                ? "top-2 text-sm text-subdude"
                : "top-1/2 -translate-y-1/2 text-base text-foreground",
              disabled ? "opacity-60" : "",
            )}
            onClick={() => triggerRef.current?.click()}
          >
            {label}
            {required && <span className="text-destructive"> *</span>}
          </label>
        )}
        <Popover
          open={open}
          onOpenChange={(isOpen) => {
            setOpen(isOpen);
            setIsFocused(isOpen);
          }}
        >
          <PopoverTrigger asChild>
            <Button
              ref={triggerRef}
              variant="combobox"
              className={cn(
                "flex w-full h-14 min-w-0 rounded-xl border bg-background px-4 text-base shadow-xs transition-[color,box-shadow] outline-none",
                "hover:bg-background",
                "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
                "disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-bg-disabled disabled:text-text-disabled disabled:opacity-60",
                floatingLabel && label && isLabelFloating
                  ? "pt-6 pb-2"
                  : "py-2",
                value ? "text-foreground" : "text-muted-foreground",
                isError || error ? "border-destructive" : "border-input",
              )}
              disabled={disabled}
              onFocus={() => setIsFocused(true)}
              onBlur={() => !open && setIsFocused(false)}
            >
              <div className="flex w-full items-center justify-between">
                <div
                  className={cn(
                    "truncate text-left",
                    floatingLabel && label && isLabelFloating ? "mt-1" : "",
                  )}
                >
                  {value
                    ? // format(getDateValue()!, "dd MMM yyyy")
                      // format(displayDate, "dd MMM yyyy", {
                      //     locale: selectedLocale,
                      //   })
                      formatToBuddhist(Number(getDateValue()!), "dd MMM yyyy")
                    : floatingLabel
                      ? ""
                      : placeholder}
                </div>
                <Icon
                  icon="solar:calendar-linear"
                  className={cn(
                    "ml-2 h-4 w-4 shrink-0",
                    floatingLabel && label && isLabelFloating ? "-mt-3" : "",
                  )}
                />
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              className="text-black"
              mode="single"
              selected={getDateValue()}
              onSelect={(date) => {
                if (date) {
                  const convertedValue =
                    valueType === "bigint" ? dateToBigint(date) : date;
                  onChange?.(convertedValue);
                } else {
                  onChange?.(undefined);
                }
                setOpen(false);
              }}
              disabled={getDisabledDates()}
            />
          </PopoverContent>
        </Popover>
      </div>
      {(error ||
        (isError && typeof isError === "object" && "message" in isError)) && (
        <p className="text-destructive mt-1.5 text-sm">
          {error ||
            (typeof isError === "object" && "message" in isError
              ? isError.message
              : "")}
        </p>
      )}
    </div>
  );
}
