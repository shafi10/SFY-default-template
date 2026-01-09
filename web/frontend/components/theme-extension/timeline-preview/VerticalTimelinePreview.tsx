export default function VerticalTimelinePreview() {
  return (
    <s-stack direction="block" gap="none" paddingInlineStart="base">
      {/* Item 1 */}
      <s-stack direction="block" gap="none">
        <s-stack direction="inline" gap="small-300" inline-align="start">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0",
            }}
          >
            <div
              style={{
                width: "16px",
                height: "16px",
                borderRadius: "50%",
                background: "#2C6ECB",
                flexShrink: 0,
              }}
            ></div>
            <div
              style={{
                width: "2px",
                height: "35px",
                background: "#D0D0D0",
              }}
            ></div>
          </div>
          <s-stack direction="block" gap="small-500" paddingBlockStart="none">
            <s-text type="strong">Order Placed</s-text>
            <s-text>Oct 27, 2025 at 10:30 AM</s-text>
          </s-stack>
        </s-stack>
      </s-stack>

      {/* Item 2 */}
      <s-stack direction="block" gap="none">
        <s-stack direction="inline" gap="small-300" inline-align="start">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0",
            }}
          >
            <div
              style={{
                width: "16px",
                height: "16px",
                borderRadius: "50%",
                background: "#00A0AC",
                flexShrink: 0,
              }}
            ></div>
            <div
              style={{
                width: "2px",
                height: "35px",
                background: "#D0D0D0",
              }}
            ></div>
          </div>
          <s-stack direction="block" gap="small-500" paddingBlockStart="none">
            <s-text type="strong">Processing</s-text>
            <s-text>Oct 27, 2025 at 10:30 AM</s-text>
          </s-stack>
        </s-stack>
      </s-stack>

      {/* Item 3 */}
      <s-stack direction="block" gap="none">
        <s-stack direction="inline" gap="small-300" inline-align="start">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0",
            }}
          >
            <div
              style={{
                width: "16px",
                height: "16px",
                borderRadius: "50%",
                background: "#FFA500",
                flexShrink: 0,
              }}
            ></div>
            <div
              style={{
                width: "2px",
                height: "35px",
                background: "#D0D0D0",
              }}
            ></div>
          </div>
          <s-stack direction="block" gap="small-500" paddingBlockStart="none">
            <s-text type="strong">Out for Delivery</s-text>
            <s-text>Oct 27, 2025 at 10:30 AM</s-text>
          </s-stack>
        </s-stack>
      </s-stack>

      {/* Item 4 */}
      <s-stack direction="inline" gap="small-300" alignItems="normal">
        <div
          style={{
            width: "16px",
            height: "16px",
            borderRadius: "50%",
            background: "#008060",
            flexShrink: 0,
          }}
        ></div>
        <s-stack direction="block" gap="small-500">
          <s-text type="strong">Delivered</s-text>
          <s-text>Oct 27, 2025 at 10:30 AM</s-text>
        </s-stack>
      </s-stack>
    </s-stack>
  );
}
