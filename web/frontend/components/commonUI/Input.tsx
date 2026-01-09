interface InputProps {
  label?: string;
  value?: string;
  checked?: boolean;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  name?: string;
}

export function Input({
  label,
  value,
  checked,
  onChange,
  type = "text",
  placeholder,
  disabled = false,
  name,
}: InputProps) {
  const isRadio = type === "radio";
  
  const inputElement = (
    <input
      type={type}
      name={name}
      value={value}
      checked={checked}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      style={
        isRadio
          ? {
              margin: 0,
              cursor: disabled ? "not-allowed" : "pointer",
              opacity: disabled ? 0.6 : 1,
            }
          : {
              padding: "8px 12px",
              borderRadius: "8px",
              border: "1px solid #C9CCCF",
              fontSize: "14px",
              width: "100%",
              boxSizing: "border-box",
              fontFamily: "inherit",
              cursor: disabled ? "not-allowed" : "pointer",
              opacity: disabled ? 0.6 : 1,
            }
      }
    />
  );

  if (isRadio || !label) {
    return inputElement;
  }

  return (
    <s-stack direction="block" gap="small-300">
      <s-text type="strong">{label}</s-text>
      {inputElement}
    </s-stack>
  );
}
