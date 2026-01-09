import { useMemo } from "react";
import { CourierType, CourierFormState } from "../types/courier-settings.types";

interface CompletionStatus {
  percentage: number;
  status: "Complete" | "Incomplete";
  tone: "success" | "critical";
}

export function useCompletionStatus(
  selectedCourier: CourierType,
  formState: CourierFormState,
  options?: { isApiConfigured?: boolean }
): CompletionStatus {
  return useMemo(() => {
    let completedSections = 0;
    const totalSections = 4;

    // 1. API Configuration (25%)
    const apiConfiguredByInputs =
      (selectedCourier === "Pathao" &&
        formState.pathaoUsername &&
        formState.pathaoPassword) ||
      (selectedCourier === "RedX" && formState.redxApiToken) ||
      (selectedCourier === "Steadfast" &&
        formState.steadfastApiKey &&
        formState.steadfastSecretKey);

    if (apiConfiguredByInputs || options?.isApiConfigured) {
      completedSections++;
    }

    // 2. Webhook Configuration (25%)
    if (formState.isWebhookGenerated) completedSections++;

    // 3. Merchant Information (25%)
    if (
      formState.merchantName &&
      formState.merchantPhone &&
      formState.merchantAddress
    ) {
      completedSections++;
    }

    // 4. Default Settings (25%)
    if (
      formState.deliveryType &&
      formState.packageType !== "select" &&
      formState.defaultWeight &&
      formState.defaultCodAmount
    ) {
      completedSections++;
    }

    const percentage = Math.round((completedSections / totalSections) * 100);
    const status = percentage === 100 ? "Complete" : "Incomplete";
    const tone = percentage === 100 ? "success" : "critical";

    return { percentage, status, tone };
  }, [selectedCourier, formState, options?.isApiConfigured]);
}
