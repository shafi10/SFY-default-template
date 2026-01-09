import { ProgressBar } from "@shopify/polaris";

interface ConfigurationStatusCardProps {
  completionPercentage: number;
  completionStatus: string;
  completionTone: "success" | "critical";
}

export function ConfigurationStatusCard({
  completionPercentage,
  completionStatus,
  completionTone,
}: ConfigurationStatusCardProps) {
  return (
    <s-section>
      <s-stack gap="base">
        <s-stack direction="inline" justifyContent="space-between">
          <s-stack gap="small-500">
            <s-text type="strong">Configuration Status</s-text>
            <s-text color="subdued">Complete all required fields to activate your integration.</s-text>
          </s-stack>
          <s-stack gap="small-500" alignItems="end">
            <s-text type="strong">{completionPercentage}%</s-text>
            <s-badge tone={completionTone}>{completionStatus}</s-badge>
          </s-stack>
        </s-stack>

        <ProgressBar progress={completionPercentage} size="small" tone={completionTone} />

        <s-link remove-underline>
          <s-stack direction="inline">
            {/* @ts-expect-error -enum  */}
            <s-icon type="video" />
            <s-text>Video Tutorial</s-text>
          </s-stack>
        </s-link>
      </s-stack>
    </s-section>
  );
}
