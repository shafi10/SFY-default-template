import { TextField } from "../commonUI/TextField";
import { useUI } from "../../contexts/ui.context";

interface WebhookConfigurationCardProps {
  webhookSecret: string;
  callbackUrl: string;
  isWebhookGenerated: boolean;
  onGenerateWebhook: () => void;
}

export function WebhookConfigurationCard({
  webhookSecret,
  callbackUrl,
  isWebhookGenerated,
  onGenerateWebhook,
}: WebhookConfigurationCardProps) {
  const { showToast } = useUI();

  const handleCopy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      showToast(`${label} copied to clipboard`);
    } catch (err) {
      console.error("Failed to copy:", err);
      showToast("Failed to copy to clipboard", { error: true });
    }
  };

  return (
    <s-section>
      <s-stack>
        <s-stack paddingBlockEnd="small-200">
          <s-stack
            direction="inline"
            justifyContent="space-between"
            alignItems="center"
          >
            <s-stack>
              <s-text type="strong">Webhook Configuration</s-text>
              <s-text color="subdued">
                Configure webhooks to receive real-time updates about order
                status changes.
              </s-text>
            </s-stack>
            <s-button
              variant="primary"
              onClick={onGenerateWebhook}
              disabled={isWebhookGenerated}
            >
              {isWebhookGenerated
                ? "Webhook and URL Generated"
                : "Generate Webhook Secret Key & Callback URL"}
            </s-button>
          </s-stack>
        </s-stack>

        <s-grid gridTemplateColumns="repeat(2, 1fr)" gap="base">
          <s-grid
            gridTemplateColumns="1fr auto"
            gap="small-100"
            alignItems="end"
          >
            <TextField
              required
              label="Webhook Secret"
              placeholder="Enter webhook secret"
              value={webhookSecret}
              disabled
            />
            <s-button
              variant="tertiary"
              onClick={() => handleCopy(webhookSecret, "Webhook Secret")}
              disabled={!webhookSecret}
              icon="duplicate"
            ></s-button>
          </s-grid>
          <s-grid
            gridTemplateColumns="1fr auto"
            gap="small-100"
            alignItems="end"
          >
            <TextField
              required
              label="Callback URL"
              placeholder="Enter callback URL"
              value={callbackUrl}
              disabled
            />
            <s-button
              variant="tertiary"
              onClick={() => handleCopy(callbackUrl, "Callback URL")}
              disabled={!callbackUrl}
              icon="duplicate"
            ></s-button>
          </s-grid>
        </s-grid>
      </s-stack>
    </s-section>
  );
}
