interface TextFieldProps {
  label: string;
  value?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  helpText?: string;
  onChange?: (value: string) => void;
}

export function TextField({
  label,
  value = "",
  placeholder,
  required,
  disabled,
  helpText,
  onChange,
}: TextFieldProps) {
  return (
    <s-text-field
      label={label}
      value={value}
      placeholder={placeholder}
      required={required}
      disabled={disabled}
      help-text={helpText}
      onChange={(e: any) => {
        const v = (e?.detail?.value ?? e?.target?.value ?? "") as string;
        onChange?.(v);
      }}
    />
  );
}
