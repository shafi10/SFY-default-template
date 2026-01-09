import { CourierType } from "../../types/courier-settings.types";

interface WarningBannerProps {
  selectedCourier: CourierType;
  defaultCourier: CourierType | null;
}

export function WarningBanner({ selectedCourier, defaultCourier }: WarningBannerProps) {
  if (defaultCourier) {
    return (
      <s-banner tone="success" heading="Default Courier">
        <s-stack direction="inline" columnGap="small-200" alignItems="center">
          {/* <s-icon type="checkmark" /> */}
          <s-text>
            <span style={{ fontWeight: "bold" }}>{defaultCourier}</span> is
            currently set as your default courier service.
          </s-text>
        </s-stack>
      </s-banner>
    );
  }

  return (
    <s-banner tone="warning" heading="Default Courier">
      <s-text>
        No default courier is set. Set{" "}
        <span style={{ fontWeight: "bold" }}>{selectedCourier}</span> as default
        to streamline order processing.
      </s-text>
    </s-banner>
  );
}
