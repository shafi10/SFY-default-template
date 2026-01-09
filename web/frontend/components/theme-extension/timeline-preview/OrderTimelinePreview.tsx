import VerticalTimelinePreview from "./VerticalTimelinePreview";
import HorizontalTimelinePreview from "./HorizontalTimelinePreview";

interface OrderTimelinePreviewProps {
  timelineLayout: "vertical" | "horizontal";
}

export default function OrderTimelinePreview({
  timelineLayout,
}: OrderTimelinePreviewProps) {
  return (
    <s-stack direction="block" gap="base">
      <s-text type="strong">Order Timeline</s-text>
      {timelineLayout === "vertical" ? (
        <VerticalTimelinePreview />
      ) : (
        <HorizontalTimelinePreview />
      )}
    </s-stack>
  );
}
