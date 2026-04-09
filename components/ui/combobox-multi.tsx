"use client";

import { Icon } from "@iconify/react";
import { useTranslations } from "next-intl";
import * as React from "react";
import { FieldError } from "react-hook-form";
import { buttonVariants } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MasterSelectProps } from "@/types/api";
import { cn } from "@/utils/helpers";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";

interface ComboboxMultiProps {
  options?: MasterSelectProps[];
  placeholder?: string;
  value?: (string | number)[];
  valueType?: "string" | "number";
  onChange?: (value: (string | number)[]) => void;
  isError?: FieldError;
  disabled?: boolean;
  label?: string;
  floatingLabel?: boolean;
  required?: boolean;
  error?: string;
}

export function ComboboxMulti(props: ComboboxMultiProps) {
  const c = useTranslations("common");
  const {
    options,
    placeholder,
    value: valueProp,
    valueType = "number",
    onChange,
    isError = false,
    disabled = false,
    label,
    floatingLabel = false,
    required = false,
    error,
  } = props;
  const value = React.useMemo(() => valueProp ?? [], [valueProp]);
  const listId = React.useId();
  const defaultPlaceholder = placeholder || c("search-placeholder");
  const [open, setOpen] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);
  const triggerRef = React.useRef<HTMLDivElement>(null);

  const selectedOptions = React.useMemo(() => {
    if (!options?.length || !value.length) return [];
    return value
      .map((v) => options.find((o) => o.value == v))
      .filter((o): o is MasterSelectProps => o !== undefined);
  }, [options, value]);

  const hasValue = () => value.length > 0;

  const hasChips = selectedOptions.length > 0;

  const isLabelFloating = floatingLabel && (isFocused || hasValue());

  const toggleValue = (raw: string) => {
    const selectedValue = raw.split("::")[0];
    const coerced =
      valueType === "string" ? selectedValue : Number(selectedValue);
    const exists = value.some((v) => v == coerced);
    const next = exists
      ? value.filter((v) => v != coerced)
      : [...value, coerced];
    onChange?.(next);
  };

  const removeValue = (raw: string | number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onChange?.(value.filter((v) => v != raw));
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        {floatingLabel && label && (
          <label
            className={cn(
              "absolute left-4 transition-all duration-200 ease-out cursor-pointer pointer-events-none z-10",
              isLabelFloating
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
            <div
              ref={triggerRef}
              role="combobox"
              aria-expanded={open}
              aria-controls={listId}
              tabIndex={disabled ? -1 : 0}
              className={cn(
                buttonVariants({ variant: "combobox", size: "default" }),
                "flex w-full min-h-14 min-w-0 rounded-xl border bg-background px-4 text-base shadow-xs transition-[color,box-shadow] outline-none",
                hasChips
                  ? "h-auto items-start justify-start"
                  : "items-center justify-start",
                "text-left font-normal whitespace-normal",
                "hover:bg-background",
                "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
                "disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-bg-disabled disabled:text-text-disabled",
                floatingLabel && label && isLabelFloating
                  ? "pt-6 pb-2"
                  : "py-2",
                hasValue() ? "text-foreground" : "text-muted-foreground",
                isError || error ? "border-destructive" : "border-input",
              )}
              onFocus={() => setIsFocused(true)}
              onBlur={() => !open && setIsFocused(false)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setOpen((o) => !o);
                }
              }}
            >
              <div
                className={cn(
                  "flex w-full min-w-0 justify-between gap-2",
                  hasChips ? "items-start" : "items-center",
                )}
              >
                <div
                  className={cn(
                    "flex min-w-0 flex-1 flex-wrap items-center gap-1.5 text-left",
                    floatingLabel && label && isLabelFloating ? "mt-1" : "",
                  )}
                >
                  {selectedOptions.length > 0 ? (
                    selectedOptions.map((opt) => (
                      <span
                        key={`${opt.value}`}
                        className="border-input inline-flex max-w-full items-center gap-0.5 rounded-xl border px-2 py-0.5 text-sm"
                      >
                        <span className="min-w-0 truncate">{opt.label}</span>
                        <button
                          type="button"
                          className="inline-flex shrink-0 rounded-sm p-0.5 opacity-70 outline-none hover:opacity-100"
                          disabled={disabled}
                          aria-label={c("remove-tag")}
                          onClick={(e) => removeValue(opt.value, e)}
                        >
                          <Icon icon="lucide:x" className="size-3.5" />
                        </button>
                      </span>
                    ))
                  ) : (
                    <span className="truncate">
                      {floatingLabel ? "" : defaultPlaceholder}
                    </span>
                  )}
                </div>
                <Icon
                  icon="lucide:chevron-down"
                  className={cn(
                    "ml-2 h-4 w-4 shrink-0 self-center opacity-50",
                    floatingLabel && label && isLabelFloating ? "-mt-3" : "",
                    hasChips && "self-start",
                    hasChips &&
                      floatingLabel &&
                      label &&
                      isLabelFloating &&
                      "mt-0.5",
                  )}
                />
              </div>
            </div>
          </PopoverTrigger>
          <PopoverContent
            id={listId}
            className="w-(--radix-popover-trigger-width) p-0"
            align="start"
          >
            <Command>
              <CommandInput placeholder={defaultPlaceholder} />
              <CommandList>
                <CommandEmpty>{c("not-found")}</CommandEmpty>
                <CommandGroup>
                  {options?.map((option) => {
                    const uniqueValue = `${option.value}::${option.label}`;
                    const checked = value.some((v) => v == option.value);
                    return (
                      <CommandItem
                        value={uniqueValue}
                        key={uniqueValue}
                        data-checked={checked ? "true" : undefined}
                        onSelect={toggleValue}
                      >
                        {option.label}
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              </CommandList>
            </Command>
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
