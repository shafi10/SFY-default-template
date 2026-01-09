interface ResetConfirmationModalProps {
  onConfirmReset: () => void;
  disabled?: boolean;
}

export function ResetConfirmationModal({
  onConfirmReset,
  disabled = false,
}: ResetConfirmationModalProps) {
  return (
    <>
      <s-button 
        id="reset-modal-trigger"
        variant="auto"
        commandFor="reset-confirmation-modal"
        command="--show"
        disabled={disabled}
      >
        Reset
      </s-button>

      <s-modal 
        id="reset-confirmation-modal"
        heading="Reset Configuration"
        size="small"
      >
        <s-stack gap="base">
          <s-text>
            Are you sure you want to reset all settings for this courier? This action cannot be undone.
          </s-text>
        </s-stack>

        <s-button
          slot="secondary-actions"
          variant="secondary"
          commandFor="reset-confirmation-modal"
          command="--hide"
          disabled={disabled}
        >
          Cancel
        </s-button>

        <s-button
          slot="primary-action"
          variant="primary"
          commandFor="reset-confirmation-modal"
          command="--hide"
          onClick={onConfirmReset}
          disabled={disabled}
        >
          Reset
        </s-button>
      </s-modal>
    </>
  );
}
