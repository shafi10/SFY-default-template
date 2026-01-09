import { CourierType } from "./courier-settings.types";

export interface CourierSettingsPayload {
  courier: CourierType;
  isDefault: boolean;
  
  // API Configuration - generic key-value credentials
  apiCredentials: Record<string, string>;

  // Webhook Configuration
  webhook: {
    secret: string;
    callbackUrl: string;
  };

  // Merchant Information
  merchant: {
    name: string;
    phone: string;
    address: string;
  };

  // Default Settings
  defaults: {
    deliveryType: "home" | "hub" | "";
    packageType: "box" | "bag" | "envelope" | "custom" | "select" | "";
    weight: string;
    codAmount: string;
    parcelNote?: string;
    isCodEnabled: boolean;
  };
}
