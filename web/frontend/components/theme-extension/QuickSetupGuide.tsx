const steps = [
  {
    number: 1,
    title: "Customize",
    description:
      "Use the settings below to customize timeline, delivery, and email preferences",
  },
  {
    number: 2,
    title: "Install",
    description:
      'Click "Install Extension" to add the tracking block to your theme',
  },
  {
    number: 3,
    title: "Preview",
    description: "Test with a sample order to see the customer experience",
  },
];

export default function QuickSetupGuide() {
  return (
    <s-box
      padding="base"
      border-radius="large"
      background="base"
      borderRadius="base"
      border="base base solid"
    >
      <s-stack direction="inline">
        <s-stack direction="inline" gap="small-200">
          <s-icon type="info" tone="info" />
          <s-text type="strong">Quick Setup Guide</s-text>

          <s-grid gridTemplateColumns="repeat(3, 1fr)" gap="large">
            {steps?.map((step) => (
              <s-grid key={step.number}>
                <s-stack direction="block" gap="small-400">
                  <s-stack
                    direction="inline"
                    gap="small-300"
                    inline-align="center"
                    paddingInlineStart="large-200"
                  >
                    <s-badge tone="info" color="strong">
                      {step.number}
                    </s-badge>
                    <s-text type="strong">{step.title}</s-text>
                  </s-stack>
                  <s-stack paddingInlineStart="large-200">
                    <s-text>{step.description}</s-text>
                  </s-stack>
                </s-stack>
              </s-grid>
            ))}
          </s-grid>
        </s-stack>
      </s-stack>
    </s-box>
  );
}
