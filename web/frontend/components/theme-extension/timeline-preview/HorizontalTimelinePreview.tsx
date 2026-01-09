export default function HorizontalTimelinePreview() {
  return (
    <s-stack direction="block" gap="base">
      {/* Timeline dots and connectors */}
      <s-stack
        direction="inline"
        gap="none"
        alignItems="center"
        justifyContent="space-between"
      >
        <div
          style={{
            width: "16px",
            height: "16px",
            borderRadius: "50%",
            background: "#2C6ECB",
          }}
        ></div>
        <div
          style={{
            flex: 1,
            height: "2px",
            background: "#E3E3E3",
            margin: "0 12px",
          }}
        ></div>
        <div
          style={{
            width: "16px",
            height: "16px",
            borderRadius: "50%",
            background: "#00A0AC",
          }}
        ></div>
        <div
          style={{
            flex: 1,
            height: "2px",
            background: "#E3E3E3",
            margin: "0 12px",
          }}
        ></div>
        <div
          style={{
            width: "16px",
            height: "16px",
            borderRadius: "50%",
            background: "#FFA500",
          }}
        ></div>
        <div
          style={{
            flex: 1,
            height: "2px",
            background: "#E3E3E3",
            margin: "0 12px",
          }}
        ></div>
        <div
          style={{
            width: "16px",
            height: "16px",
            borderRadius: "50%",
            background: "#008060",
          }}
        ></div>
      </s-stack>

      {/* Labels */}
      <s-grid gridTemplateColumns="repeat(4, 1fr)" gap="base">
        <s-stack direction="block" gap="small-500" alignItems="start">
          <s-text type="strong">Order Placed</s-text>
          <s-text>Oct 27, 10:30 AM</s-text>
        </s-stack>
        <s-stack direction="block" gap="small-500" alignItems="start">
          <s-text type="strong">Processing</s-text>
          <s-text>Oct 27, 10:30 AM</s-text>
        </s-stack>
        <s-stack
          direction="block"
          gap="small-500"
          alignContent="start"
          paddingInlineStart="large-300"
        >
          <s-text type="strong">Out for Delivery</s-text>
          <s-text>Oct 27, 10:30 AM</s-text>
        </s-stack>
        <s-stack
          direction="block"
          gap="small-500"
          alignItems="end"
          paddingInlineStart="large-300"
        >
          <s-text type="strong">Delivered</s-text>
          <s-text>Oct 27, 10:30 AM</s-text>
        </s-stack>
      </s-grid>
    </s-stack>
  );
}
