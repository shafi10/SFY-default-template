interface DeliveryTimeWindowSettingsProps {
  deliveryStartTime: string;
  deliveryEndTime: string;
  onStartTimeChange: (time: string) => void;
  onEndTimeChange: (time: string) => void;
  formatTime: (time: string) => string;
}

import { Input } from "../commonUI/Input";

export default function DeliveryTimeWindowSettings({
  deliveryStartTime,
  deliveryEndTime,
  onStartTimeChange,
  onEndTimeChange,
  formatTime,
}: DeliveryTimeWindowSettingsProps) {
  return (
    <s-stack direction="block" gap="base">
      <s-stack direction="block" gap="small-300">
        <s-text type="strong">Delivery Time Window</s-text>
        <s-text>Set the expected delivery time range shown to customers</s-text>
      </s-stack>

      <s-grid gridTemplateColumns="repeat(2, 1fr)" gap="base">
        {/* Start Time */}
        <Input
          label="Start Time"
          type="time"
          value={deliveryStartTime}
          onChange={onStartTimeChange}
        />

        {/* End Time */}
        <Input
          label="End Time"
          type="time"
          value={deliveryEndTime}
          onChange={onEndTimeChange}
        />
      </s-grid>

      {/* Preview Text */}
      <s-box
        padding="small-100"
        borderRadius="small"
        border="base base solid"
      >
        <s-stack direction="block" gap="small-300">
          <s-text>Preview Text</s-text>
          <s-text type="strong">
            {formatTime(deliveryStartTime)} - {formatTime(deliveryEndTime)}
          </s-text>
        </s-stack>
      </s-box>

      <s-banner heading="For Internal Deliveries Only" tone="info">
        This delivery window appears only for orders assigned to internal
        delivery partners. Third-party courier deliveries use their own tracking
        information.
      </s-banner>
    </s-stack>
  );
}
