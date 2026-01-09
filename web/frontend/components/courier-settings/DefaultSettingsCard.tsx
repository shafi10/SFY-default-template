interface DefaultSettingsCardProps {
  deliveryType: string;
  packageType: string;
  defaultWeight: string;
  defaultCodAmount: string;
  isCodEnabled: boolean;
  onDeliveryTypeChange: (value: string) => void;
  onPackageTypeChange: (value: string) => void;
  onDefaultWeightChange: (value: string) => void;
  onDefaultCodAmountChange: (value: string) => void;
  onIsCodEnabledChange: (value: boolean) => void;
}

import { TextField } from "../commonUI/TextField";

export function DefaultSettingsCard({
  deliveryType,
  packageType,
  defaultWeight,
  defaultCodAmount,
  isCodEnabled,
  onDeliveryTypeChange,
  onPackageTypeChange,
  onDefaultWeightChange,
  onDefaultCodAmountChange,
  onIsCodEnabledChange,
}: DefaultSettingsCardProps) {
  return (
    <s-section>
      <s-stack>
        <s-stack>
          <s-text type="strong">Default Settings</s-text>
        </s-stack>

        <s-text color="subdued">
          Set default values for new orders to streamline the shipping process.
        </s-text>

        <s-grid
          gridTemplateColumns="repeat(2, 1fr)"
          gap="base"
          paddingBlockEnd="small"
        >
          <s-stack paddingBlockStart="small">
            <s-choice-list 
              label="Default Delivery Type"
              name="Default Delivery Type"
              values={deliveryType ? [deliveryType] : []}
              onChange={(e: any) => {
                const value = e?.detail?.values?.[0] ?? null;
                if (value) {
                  onDeliveryTypeChange(value);
                }
              }}
            >
              <s-choice value="home">Home Delivery</s-choice>
              <s-choice value="hub">Hub Delivery</s-choice>
            </s-choice-list>
          </s-stack>

          <s-stack paddingBlockStart="small">
            <s-select 
              label="Default Package Type"
              value={packageType}
              onChange={(e: any) => {
                const value = e?.detail?.value ?? e?.target?.value ?? "";
                //console.log("Package type changed:", value);
                onPackageTypeChange(value);
              }}
            >
              <s-option value="select">Select package type</s-option>
              <s-option value="box">Box</s-option>
              <s-option value="bag">Bag</s-option>
              <s-option value="envelope">Envelope</s-option>
              <s-option value="custom">Custom</s-option>
            </s-select>
          </s-stack>

          <TextField
            label="Default Weight (kg)"
            placeholder="e.g., 0.5"
            value={defaultWeight}
            onChange={onDefaultWeightChange}
          />
          <TextField
            label="Default COD Amount (BDT)"
            placeholder="e.g., 500"
            value={defaultCodAmount}
            onChange={onDefaultCodAmountChange}
          />
        </s-grid>

        <s-text-area
          label="Default Parcel Note"
          placeholder="Enter default note for parcels (e.g., Handle with care)"
        />

        <s-stack paddingBlock="small-200"></s-stack>

        <s-checkbox 
          label="Enable Cash on Delivery (COD) by default"
          checked={isCodEnabled}
          onChange={(e: any) => {
            let checked = false;
            
            if (e?.detail?.checked !== undefined) {
              checked = e.detail.checked;
            } else if (e?.target?.checked !== undefined) {
              checked = e.target.checked;
            } else if (e?.currentTarget?.checked !== undefined) {
              checked = e.currentTarget.checked;
            }
            
            onIsCodEnabledChange(checked);
          }}
        />
      </s-stack>
    </s-section>
  );
}
