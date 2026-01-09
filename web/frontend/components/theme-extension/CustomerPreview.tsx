import OrderTimelinePreview from "./timeline-preview/OrderTimelinePreview";
import DeliveryPreviewSection from "./DeliveryPreviewSection";

interface CustomerPreviewProps {
  activeTab: "timeline" | "delivery";
  viewMode: "desktop" | "mobile";
  onViewModeChange: (mode: "desktop" | "mobile") => void;
  timelineLayout: "vertical" | "horizontal";
  deliveryStartTime: string;
  deliveryEndTime: string;
  formatTime: (time: string) => string;
}

export default function CustomerPreview({
  activeTab,
  viewMode,
  onViewModeChange,
  timelineLayout,
  deliveryStartTime,
  deliveryEndTime,
  formatTime,
}: CustomerPreviewProps) {
  return (
    <s-box
      padding="base"
      border-radius="large"
      background="base"
      borderRadius="base"
      border="base base solid"
    >
      <s-stack direction="block" gap="base">
        {/* Header */}
        <s-stack
          direction="inline"
          justifyContent="space-between"
          gap="base"
          inline-align="center"
        >
          <s-stack
            direction="inline"
            gap="small-300"
            inline-align="center"
            alignItems="center"
          >
            <s-icon type="view"></s-icon>
            <s-text type="strong">Customer Preview</s-text>
          </s-stack>
          <s-stack direction="inline" gap="small-300">
            <s-button 
              variant={viewMode === "desktop" ? "primary" : undefined}
              onClick={() => onViewModeChange("desktop")}
            >
              Desktop
            </s-button>
            <s-button 
              variant={viewMode === "mobile" ? "primary" : undefined}
              onClick={() => onViewModeChange("mobile")}
            >
              Mobile
            </s-button>
          </s-stack>
        </s-stack>

        <s-text>See how your customizations appear to customers</s-text>
        <s-stack></s-stack>

        {/* Preview Box */}
        <div style={{ 
          maxWidth: viewMode === "mobile" ? "400px" : "100%",
          margin: viewMode === "mobile" ? "0 auto" : "0",
          transition: "max-width 0.3s ease"
        }}>
          <s-box padding="large" borderRadius="base" border="base base solid">
          <s-stack direction="block" gap="base" paddingBlockEnd="large-200">
            {/* Order Timeline */}
            <OrderTimelinePreview timelineLayout={timelineLayout} />
          </s-stack>

          {activeTab === "delivery" && (
            <>
              <s-divider color="strong"></s-divider>

              {/* Delivery Preview Cards */}
              <s-stack direction="block" gap="base" paddingBlockStart="large-200">
                <DeliveryPreviewSection
                  deliveryStartTime={deliveryStartTime}
                  deliveryEndTime={deliveryEndTime}
                  formatTime={formatTime}
                />
              </s-stack>
            </>
          )}
        </s-box>
        </div>
      </s-stack>
    </s-box>
  );
}
