import { Tabs } from "@shopify/polaris";
import TimelineLayoutSelector from "./timeline/TimelineLayoutSelector";
import DeliveryTimeWindowSettings from "./DeliveryTimeWindowSettings";

interface CustomizationSettingsProps {
  activeTab: "timeline" | "delivery";
  onTabChange: (tab: "timeline" | "delivery") => void;
  timelineLayout: "vertical" | "horizontal";
  onLayoutChange: (layout: "vertical" | "horizontal") => void;
  deliveryStartTime: string;
  deliveryEndTime: string;
  onStartTimeChange: (time: string) => void;
  onEndTimeChange: (time: string) => void;
  formatTime: (time: string) => string;
  onResetDefaults: () => void;
  onSaveChanges: () => void;
}

export default function CustomizationSettings({
  activeTab,
  onTabChange,
  timelineLayout,
  onLayoutChange,
  deliveryStartTime,
  deliveryEndTime,
  onStartTimeChange,
  onEndTimeChange,
  formatTime,
  onResetDefaults,
  onSaveChanges,
}: CustomizationSettingsProps) {
  const tabItems = [
    { id: "timeline", content: "Timeline", Icon: "clock" },
    { id: "delivery", content: "Delivery", Icon: "delivery" },
  ];

  const selectedTabIndex = activeTab === "timeline" ? 0 : 1;

  return (
    <s-box
      padding="base"
      border-radius="large"
      background="base"
      borderRadius="base"
      border="base base solid"
    >
      <s-stack direction="block" gap="small">
        {/* Header */}
        <s-stack direction="block" gap="small-300">
          <s-text type="strong">Customization Settings</s-text>
          <s-text>
            Configure timeline appearance, delivery window, and email
            notifications
          </s-text>
          <s-divider color="strong" />
        </s-stack>

        <s-stack direction="inline" justifyContent="space-between" gap="none">
          <s-button icon="refresh" onClick={onResetDefaults}>
            Reset All to Defaults
          </s-button>
          <s-button variant="primary" icon="file" onClick={onSaveChanges}>
            Save All Changes
          </s-button>
        </s-stack>

        {/* Tabs */}
        <Tabs
          tabs={tabItems}
          selected={selectedTabIndex}
          onSelect={(index) =>
            onTabChange(index === 0 ? "timeline" : "delivery")
          }
          fitted
        />
        <s-divider></s-divider>

        {/* Timeline Layout Section - Only show when Timeline tab is active */}
        {activeTab === "timeline" && (
          <TimelineLayoutSelector
            timelineLayout={timelineLayout}
            onLayoutChange={onLayoutChange}
          />
        )}

        {/* Delivery Section - Only show when Delivery tab is active */}
        {activeTab === "delivery" && (
          <DeliveryTimeWindowSettings
            deliveryStartTime={deliveryStartTime}
            deliveryEndTime={deliveryEndTime}
            onStartTimeChange={onStartTimeChange}
            onEndTimeChange={onEndTimeChange}
            formatTime={formatTime}
          />
        )}
      </s-stack>
    </s-box>
  );
}
