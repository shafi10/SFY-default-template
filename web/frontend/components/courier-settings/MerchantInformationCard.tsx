import { TextField } from "../commonUI/TextField";

interface MerchantInformationCardProps {
  merchantName: string;
  merchantPhone: string;
  merchantAddress: string;
  onMerchantNameChange?: (value: string) => void;
  onMerchantPhoneChange?: (value: string) => void;
  onMerchantAddressChange?: (value: string) => void;
}

export function MerchantInformationCard({
  merchantName,
  merchantPhone,
  merchantAddress,
  onMerchantNameChange,
  onMerchantPhoneChange,
  onMerchantAddressChange,
}: MerchantInformationCardProps) {
  return (
    <s-section>
      <s-stack>
        <s-stack paddingBlockEnd="small-200">
          <s-text type="strong">Merchant Information</s-text>
          <s-text color="subdued">
            Provide your business details for shipping labels and courier
            communication.
          </s-text>
        </s-stack>

        <s-grid
          gridTemplateColumns="repeat(2, 1fr)"
          gap="base"
          paddingBlockEnd="small"
        >
          <TextField
            label="Merchant Name"
            required
            placeholder="Enter your business name"
            value={merchantName}
            onChange={onMerchantNameChange}
          />
          <TextField
            label="Merchant Phone"
            required
            placeholder="Enter your contact number"
            value={merchantPhone}
            onChange={onMerchantPhoneChange}
          />
        </s-grid>
        <s-text-area
          placeholder="Enter your complete business address"
          label="Merchant Address"
          required
          value={merchantAddress}
          onChange={(e: any) => {
            const value = e?.detail?.value ?? e?.target?.value ?? "";
            onMerchantAddressChange?.(value);
          }}
        />
      </s-stack>
    </s-section>
  );
}
