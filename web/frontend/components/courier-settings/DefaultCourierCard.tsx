import { CourierType } from "../../types/courier-settings.types";

interface DefaultCourierCardProps {
  selectedCourier: CourierType;
  defaultCourier: CourierType | null;
  onDefaultCourierChange: (courier: CourierType | null) => void;
  disabled?: boolean;
}

export function DefaultCourierCard({
  selectedCourier,
  defaultCourier,
  onDefaultCourierChange,
  disabled,
}: DefaultCourierCardProps) {
  const isDefault = defaultCourier === selectedCourier;

  return (
    <s-section>
      <s-stack>
        <s-stack
          direction="inline"
          justifyContent="space-between"
          alignItems="center"
        >
          <s-text type="strong">Default Courier</s-text>
        </s-stack>
        <s-stack paddingBlockEnd="small-200">
          <s-text color="subdued">
            Set this courier as the default for streamlined order processing.
          </s-text>
        </s-stack>
        <s-checkbox
          label={`Set ${selectedCourier} as default courier`}
          checked={isDefault}
          disabled={disabled}
          onChange={(e: any) => {
            const checked = (e?.target as any)?.checked ?? false;
            onDefaultCourierChange(checked ? selectedCourier : null);
          }}
        />
        {disabled && (
          <s-text tone="critical">
            Configure {selectedCourier} first to enable setting it as default.
          </s-text>
        )}
      </s-stack>
    </s-section>
  );
}
