import { CourierType } from "../../types/courier-settings.types";
import { ResetConfirmationModal } from "./ResetConfirmationModal";

interface CourierSelectorHeaderProps {
  selectedCourier: CourierType;
  onReset: () => void;
  onSave: () => void;
  isSaving?: boolean;
}

export function CourierSelectorHeader({
  selectedCourier,
  onReset,
  onSave,
  isSaving = false,
}: CourierSelectorHeaderProps) {
  return (
    <s-stack
      direction="inline"
      justifyContent="space-between"
      paddingBlockStart="small-300"
      paddingBlockEnd="small-200"
      alignItems="center"
    >
      <s-text type="strong"> <span style={{fontSize: "1rem"}}> Configure {selectedCourier}</span></s-text>
      <s-stack direction="inline" columnGap="small-400" alignItems="center">
        
        <ResetConfirmationModal onConfirmReset={onReset} disabled={isSaving} />
        
        <s-button variant="primary" onClick={onSave} disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Settings"}
        </s-button>
      </s-stack>
    </s-stack>
  );
}
