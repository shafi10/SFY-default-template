// Allow any courier identifier instead of a fixed enum so the types remain provider-agnostic.
export type CourierType = string;

export interface CourierFormState {
  // Webhook Configuration
  webhookSecret: string;
  callbackUrl: string;
  isWebhookGenerated: boolean;

  // Form field values
  isDefaultCourier: boolean;

  // API Configuration
  // Generic credentials map to keep provider-specific keys out of the type surface.
  apiCredentials: Record<string, string>;
  pathaoUsername: string;
  pathaoPassword: string;
  redxApiToken: string;
  steadfastApiKey: string;
  steadfastSecretKey: string;

  // Merchant Information
  merchantName: string;
  merchantPhone: string;
  merchantAddress: string;

  // Default Settings
  deliveryType: string;
  packageType: string;
  defaultWeight: string;
  defaultCodAmount: string;
  isCodEnabled: boolean;
}

export interface CourierFormActions {
  setWebhookSecret: (value: string) => void;
  setCallbackUrl: (value: string) => void;
  setIsWebhookGenerated: (value: boolean) => void;
  setIsDefaultCourier: (value: boolean) => void;
  // Generic setter for credential keys to avoid courier-specific coupling in consumers.
  setApiCredential?: (key: string, value: string) => void;
  setPathaoUsername: (value: string) => void;
  setPathaoPassword: (value: string) => void;
  setRedxApiToken: (value: string) => void;
  setSteadfastApiKey: (value: string) => void;
  setSteadfastSecretKey: (value: string) => void;
  setMerchantName: (value: string) => void;
  setMerchantPhone: (value: string) => void;
  setMerchantAddress: (value: string) => void;
  setDeliveryType: (value: string) => void;
  setPackageType: (value: string) => void;
  setDefaultWeight: (value: string) => void;
  setDefaultCodAmount: (value: string) => void;
  setIsCodEnabled: (value: boolean) => void;
}
