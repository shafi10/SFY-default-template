import useCreate, { useUpdate } from "./useGlobalMutation";

export interface CourierConfigCredentials {
  username?: string;
  password?: string;
  apiToken?: string;
  apiKey?: string;
  secretKey?: string;
  apiSecret?: string;
  userId?: string;
}

export interface CourierConfigPayload {
  type: string;
  payload: CourierConfigCredentials & {
    defaultDeliveryType?: string;
    defaultPackageType?: string;
    defaultWeight?: number;
    defaultCODAmount?: number;
    defaultParcelNote?: string;
    shouldEnableCodByDefault?: boolean;
  };
}

export interface DefaultSettingsPayload {
  type: string;
  payload: {
    defaultDeliveryType: string;
    defaultPackageType: string;
    defaultWeight: number;
    defaultCODAmount: number;
    defaultParcelNote?: string;
    shouldEnableCodByDefault: boolean;
  };
}

export interface MerchantPayload {
  name: string;
  phoneNo?: string;
  address?: string;
}

export function useCourierAPI() {
  // Instantiate mutations using our global hooks (React Query under the hood)
  // Following choice-legacy pattern: expose mutations directly for callback usage
  const addCourierServiceMutation = useCreate(
    "/api/admin/courier-config",
    "addCourierService"
  );
  const setMerchantInfoMutation = useCreate(
    "/api/admin/courier-config/merchant",
    "setMerchantInfo"
  );
  const setDefaultCourierMutation = useCreate(
    "/api/admin/courier-config/default",
    "setDefaultCourier"
  );
  const setDefaultSettingsMutation = useCreate(
    "/api/admin/courier-config/default-settings",
    "setDefaultSettings"
  );
  // For webhook generation (PUT) we use useUpdate with dynamic URL
  const generateWebhookMutation = useUpdate("", "generateWebhook");
  
  // For reset (POST with dynamic path), use dedicated mutation
  const resetCourierMutation = useCreate("", "resetCourier");

  return {
    // Expose mutation objects directly for callback-based usage
    addCourierService: addCourierServiceMutation,
    setMerchantInformation: setMerchantInfoMutation,
    setDefaultCourier: setDefaultCourierMutation,
    setDefaultSettings: setDefaultSettingsMutation,
    generateWebhookCredentials: generateWebhookMutation,
    resetCourierService: resetCourierMutation,
    
    // Aggregate loading states
    isLoading:
      addCourierServiceMutation.isLoading ||
      setMerchantInfoMutation.isLoading ||
      setDefaultCourierMutation.isLoading ||
      setDefaultSettingsMutation.isLoading ||
      generateWebhookMutation.isLoading ||
      resetCourierMutation.isLoading,
  };
}
