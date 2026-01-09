import VerticalTimelineOption from "./VerticalTimelineOption";
import HorizontalTimelineOption from "./HorizontalTimelineOption";

interface TimelineLayoutSelectorProps {
  timelineLayout: "vertical" | "horizontal";
  onLayoutChange: (layout: "vertical" | "horizontal") => void;
}

export default function TimelineLayoutSelector({
  timelineLayout,
  onLayoutChange,
}: TimelineLayoutSelectorProps) {
  return (
    <s-stack direction="block" gap="small-300">
      <s-text type="strong">Timeline Layout</s-text>
      <s-text>Choose how the order timeline is displayed to customers</s-text>

      <s-grid gridTemplateColumns="repeat(2, 1fr)" gap="base">
        <VerticalTimelineOption
          checked={timelineLayout === "vertical"}
          onChange={(value) =>
            onLayoutChange(value as "vertical" | "horizontal")
          }
        />

        <HorizontalTimelineOption
          checked={timelineLayout === "horizontal"}
          onChange={(value) =>
            onLayoutChange(value as "vertical" | "horizontal")
          }
        />
      </s-grid>
    </s-stack>
  );
}
