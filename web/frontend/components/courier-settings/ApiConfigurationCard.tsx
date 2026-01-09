import { CourierType } from "../../types/courier-settings.types";
import { TextField } from "../commonUI/TextField";
import { COURIER_API_CREDENTIALS } from "../../constants/courierApiConfig";

interface ApiConfigurationCardProps {
  selectedCourier: CourierType;
  credentials: Record<string, string>;
  disabled?: boolean;
  onChange?: (key: string, value: string) => void;
}

export function ApiConfigurationCard({
  selectedCourier,
  credentials,
  disabled,
  onChange,
}: ApiConfigurationCardProps) {
  // Get field configuration for the selected courier
  const fieldConfigs = COURIER_API_CREDENTIALS[selectedCourier] || [];

  const fields = fieldConfigs.map((config) => ({
    ...config,
    value: credentials[config.key] || "",
  }));

  return (
    <s-section>
      <s-stack>
        <s-stack paddingBlockEnd="small-200">
          <s-text type="strong">API Configuration</s-text>
          <s-text color="subdued">
            Enter your <s-link>{selectedCourier} API credentials</s-link> to
            enable order processing and tracking.
          </s-text>
        </s-stack>

        <s-grid gridTemplateColumns="repeat(2, 1fr)" gap="base">
          {fields.map((field) => (
            <TextField
              key={field.key}
              label={field.label}
              required
              helpText={field.helpText}
              value={field.value}
              disabled={disabled}
              onChange={(value) => onChange?.(field.key, value)}
            />
          ))}
        </s-grid>
      </s-stack>
    </s-section>
  );
}
