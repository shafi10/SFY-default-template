import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  QuickSetupGuide,
  CustomizationSettings,
  CustomerPreview,
} from "../components/theme-extension";
import useFetchQuery from "../hooks/useGlobalQuery";
import useCreate from "../hooks/useGlobalMutation";

// Default configuration values
const DEFAULT_CONFIG = {
  timelineLayout: "vertical" as "vertical" | "horizontal",
  deliveryStartTime: "18:00",
  deliveryEndTime: "20:00",
};

const THEME_EXTENSION_QUERY_KEY = "theme-extension-setting";
const THEME_EXTENSION_GET_ENDPOINT = "/api/admin/theme-extension/get-setting";
const THEME_EXTENSION_SAVE_ENDPOINT = "/api/admin/theme-extension/create";

type ThemeExtensionSettings = {
  timeline?: {
    layout?: string;
  };
  delivery?: {
    startTime?: string;
    endTime?: string;
  };
};

export default function ThemeExtension() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"timeline" | "delivery">(
    "timeline"
  );
  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");
  const [timelineLayout, setTimelineLayout] = useState<
    "vertical" | "horizontal"
  >(DEFAULT_CONFIG.timelineLayout);
  const [deliveryStartTime, setDeliveryStartTime] = useState(
    DEFAULT_CONFIG.deliveryStartTime
  );
  const [deliveryEndTime, setDeliveryEndTime] = useState(
    DEFAULT_CONFIG.deliveryEndTime
  );

  const { data: settingsResponse } = useFetchQuery<{ success?: boolean; data?: ThemeExtensionSettings }>(
    {
      apiEndpoint: THEME_EXTENSION_GET_ENDPOINT,
      apiKey: THEME_EXTENSION_QUERY_KEY,
    }
  );

  const { mutateAsync: createThemeExtension } = useCreate(
    THEME_EXTENSION_SAVE_ENDPOINT,
    THEME_EXTENSION_QUERY_KEY
  );

  useEffect(() => {
    const apiSettings = settingsResponse?.data;
    if (!apiSettings) return;

    const apiLayout = apiSettings.timeline?.layout;
    const apiStart = apiSettings.delivery?.startTime;
    const apiEnd = apiSettings.delivery?.endTime;

    if (apiLayout === "vertical" || apiLayout === "horizontal") {
      setTimelineLayout(apiLayout);
    }
    if (typeof apiStart === "string") {
      setDeliveryStartTime(apiStart);
    }
    if (typeof apiEnd === "string") {
      setDeliveryEndTime(apiEnd);
    }
  }, [settingsResponse]);

  const resetToDefaults = () => {
    setTimelineLayout(DEFAULT_CONFIG.timelineLayout);
    setDeliveryStartTime(DEFAULT_CONFIG.deliveryStartTime);
    setDeliveryEndTime(DEFAULT_CONFIG.deliveryEndTime);
  };

  const saveChanges = async () => {
    await createThemeExtension({
      layout: timelineLayout,
      startTime: deliveryStartTime,
      endTime: deliveryEndTime,
    });
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  return (
    <s-page inlineSize="large">
      <style>
        {`
          [data-timeline-card="true"] {
            display: block;
            width: 100%;
            border: 1px solid #C9CCCF;
            border-radius: 12px;
            background: #FFFFFF;
            cursor: pointer;
            transition: border-color 120ms ease, background 120ms ease;
            padding: 0;
            text-align: left;
          }
          [data-timeline-card="true"][data-selected="true"] {
            border: 2px solid #2C6ECB;
            background: #F0F7FF;
          }
          [data-timeline-card="true"]:focus-within {
            outline: none;
            box-shadow: none;
          }
        `}
      </style>
      {/* Back navigation */}
      <s-stack direction="block" gap="base">
        <s-stack
          direction="inline"
          gap="base"
          inline-align="center"
          alignItems="center"
        >
          <s-button icon="arrow-left" href="/"></s-button>
          <s-text type="strong">Theme Extension</s-text>
        </s-stack>

        {/* Header with title and button */}
        <s-stack direction="inline" justifyContent="space-between" gap="base">
          <s-stack direction="block" gap="small-300">
            <s-text type="strong">Theme Extension Block</s-text>
            <s-text>
              Customize how customers see order tracking on your storefront
            </s-text>
          </s-stack>
          <s-button icon="compose" onClick={() => navigate("/faq")}>
            View Documentation
          </s-button>
        </s-stack>

        {/* Quick Setup Guide */}
        <QuickSetupGuide />

        {/* Customization Settings and Customer Preview */}
        <s-grid gridTemplateColumns="1fr 1fr" gap="base">
          <CustomizationSettings
            activeTab={activeTab}
            onTabChange={setActiveTab}
            timelineLayout={timelineLayout}
            onLayoutChange={setTimelineLayout}
            deliveryStartTime={deliveryStartTime}
            deliveryEndTime={deliveryEndTime}
            onStartTimeChange={setDeliveryStartTime}
            onEndTimeChange={setDeliveryEndTime}
            formatTime={formatTime}
            onResetDefaults={resetToDefaults}
            onSaveChanges={saveChanges}
          />

          <CustomerPreview
            activeTab={activeTab}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            timelineLayout={timelineLayout}
            deliveryStartTime={deliveryStartTime}
            deliveryEndTime={deliveryEndTime}
            formatTime={formatTime}
          />
        </s-grid>
      </s-stack>
    </s-page>
  );
}
