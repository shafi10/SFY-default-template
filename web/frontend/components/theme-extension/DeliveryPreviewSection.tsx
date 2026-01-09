interface DeliveryPreviewSectionProps {
  deliveryStartTime: string;
  deliveryEndTime: string;
  formatTime: (time: string) => string;
}

export default function DeliveryPreviewSection({
  deliveryStartTime,
  deliveryEndTime,
  formatTime,
}: DeliveryPreviewSectionProps) {
  return (
    <s-stack direction="block" gap="base">
      {/* Expected Delivery Banner */}
      <s-box
        padding="base"
        borderRadius="base"
        background="subdued"
        border="base base solid"
      >
        <s-stack direction="inline" gap="small-300" inline-align="center">
          <s-icon type="clock" tone="info" />
          <s-stack direction="block" gap="small-100">
            <s-text type="strong">Expected Delivery</s-text>
            <s-text>
              {formatTime(deliveryStartTime)} - {formatTime(deliveryEndTime)}
            </s-text>
          </s-stack>
        </s-stack>
      </s-box>

      {/* Delivery Partner Card */}
      <s-box padding="base" borderRadius="base" border="base base solid">
        <s-stack direction="block" gap="none">
          <s-stack
            direction="inline"
            gap="small-300"
            justifyContent="space-between"
            alignItems="center"
          >
            <s-stack direction="inline" gap="small-200" alignItems="center">
              <s-icon type="person" />
              <s-text type="strong">Delivery Partner</s-text>
            </s-stack>
            <s-stack direction="inline" gap="small-200" alignItems="center">
              <s-button variant="primary" icon="phone">
                Call
              </s-button>
              <s-button icon="chat">Message</s-button>
            </s-stack>
          </s-stack>
          <s-stack paddingInlineStart="large-200">
            <s-text>Karim Rahman</s-text>
          </s-stack>
        </s-stack>
      </s-box>
    </s-stack>
  );
}
