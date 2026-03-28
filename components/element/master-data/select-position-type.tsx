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
    label: "นักวิชาการคลัง",
    value: "นักวิชาการคลัง",
  },
  {
    label: "เศรษฐกร",
    value: "เศรษฐกร",
  },
];

export default function SelectPositionType({
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

// export type Option = {
//   value?: string;
//   label?: string;
// };

// const options: Option[] = [
//   {
//     label: "ชาย",
//     value: "ชาย",
//   },
//   {
//     label: "หญิง",
//     value: "หญิง",
//   },
//   {
//     label: "ไม่ระบุ",
//     value: "ไม่ระบุ",
//   },
// ];

// export type ProSelectProp = {
//   className?: string;
//   placeholder?: string;
//   value?: string;
//   disabled?: boolean;
// };

// const SelectGender = forwardRef(
//   (
//     { value, placeholder, className, disabled, ...props }: ProSelectProp,
//     ref: Ref<any>
//   ) => {
//     return (
//       <ProSelect
//         {...props}
//         ref={ref}
//         value={value}
//         options={options}
//         placeholder={placeholder}
//         className={twMerge("", className)}
//         disabled={disabled}
//       />
//     );
//   }
// );

// export default SelectGender;
