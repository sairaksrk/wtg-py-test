"use client";

import { Select } from "@/components/ui/select";

export type ProSelectProp = {
  className?: string;
  label?: string;
  value?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
};

const options = [
  {
    label: "สำนักงานเลขานุการกรม 1",
    value: "สำนักงานเลขานุการกรม 1",
  },
  {
    label: "สำนักงานเลขานุการกรม 2",
    value: "สำนักงานเลขานุการกรม 2",
  },
];

export default function SelectAgency({
  value,
  label,
  className,
  disabled,
  required,
  error,
  ...props
}: ProSelectProp) {
  return (
    <Select
      {...props}
      label={label}
      options={options}
      floatingLabel
      value={value}
      disabled={disabled}
      className={className}
      required={required}
      error={error}
    />
  );
}