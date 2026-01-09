import { CourierType, CourierFormState } from "../types/courier-settings.types";
import { CourierSettingsPayload } from "../types/courier-settings-payload.types";

export function buildCourierSettingsPayload(
  selectedCourier: CourierType,
  defaultCourier: CourierType | null,
  formState: CourierFormState
): CourierSettingsPayload {
  const normalize = (v: string) => (v ?? "").trim();
  const apiCredentials: Record<string, string> = {};

  // Populate credentials generically by key to keep payload provider-agnostic
  if (selectedCourier.toLowerCase() === "pathao") {
    if (formState.pathaoUsername) apiCredentials.username = normalize(formState.pathaoUsername);
    if (formState.pathaoPassword) apiCredentials.password = normalize(formState.pathaoPassword);
  } else if (selectedCourier.toLowerCase() === "redx") {
    if (formState.redxApiToken) apiCredentials.apiToken = normalize(formState.redxApiToken);
  } else if (selectedCourier.toLowerCase() === "steadfast") {
    if (formState.steadfastApiKey) apiCredentials.apiKey = normalize(formState.steadfastApiKey);
    if (formState.steadfastSecretKey) apiCredentials.secretKey = normalize(formState.steadfastSecretKey);
  }

  const payload: CourierSettingsPayload = {
    courier: selectedCourier,
    isDefault: defaultCourier === selectedCourier,

    // API Configuration - provider-agnostic key-value map
    apiCredentials,

    // Webhook Configuration
    webhook: {
      secret: formState.webhookSecret,
      callbackUrl: formState.callbackUrl,
    },

    // Merchant Information
    merchant: {
      name: formState.merchantName,
      phone: formState.merchantPhone,
      address: formState.merchantAddress,
    },

    // Default Settings
    defaults: {
      deliveryType: formState.deliveryType as "home" | "hub" | "",
      packageType: formState.packageType as any,
      weight: formState.defaultWeight,
      codAmount: formState.defaultCodAmount,
      isCodEnabled: formState.isCodEnabled,
    },
  };

  return payload;
}

/**
 * Validates if the payload has all required fields
 */
export function validateCourierSettingsPayload(
  payload: CourierSettingsPayload
): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  const courierKey = payload.courier.toLowerCase();

  // Required credential keys by courier (extendable without changing payload shape)
  const requiredCredentialsByCourier: Record<string, string[]> = {
    pathao: ["username", "password"],
    redx: ["apiToken"],
    steadfast: ["apiKey", "secretKey"],
  };

  const requiredCredentialKeys = requiredCredentialsByCourier[courierKey] || [];
  const missingCreds = requiredCredentialKeys.filter(
    (key) => !payload.apiCredentials[key]?.trim()
  );
  if (missingCreds.length > 0) {
    errors.push(
      `${payload.courier} credentials missing: ${missingCreds.join(", ")}`
    );
  }

  // Validate webhook
  if (!payload.webhook.secret?.trim() || !payload.webhook.callbackUrl?.trim()) {
    errors.push("Webhook configuration is required");
  }

  // Validate merchant info
  if (
    !payload.merchant.name?.trim() ||
    !payload.merchant.phone?.trim() ||
    !payload.merchant.address?.trim()
  ) {
    errors.push("Complete merchant information is required");
  }

  // Validate default settings
  console.log("Validating default settings:", { 
    deliveryType: payload.defaults.deliveryType, 
    packageType: payload.defaults.packageType,
    weight: payload.defaults.weight,
    codAmount: payload.defaults.codAmount
  });
  
  const defaultSettingsErrors = [];
  if (!payload.defaults.deliveryType) {
    defaultSettingsErrors.push("deliveryType is missing");
  }
  if (!payload.defaults.packageType || payload.defaults.packageType === "select") {
    defaultSettingsErrors.push("packageType is missing or still 'select'");
  }
  const weightNumber = Number(payload.defaults.weight);
  if (!payload.defaults.weight || Number.isNaN(weightNumber) || weightNumber <= 0) {
    defaultSettingsErrors.push("weight is missing or invalid");
  }
  const codNumber = Number(payload.defaults.codAmount);
  if (
    payload.defaults.codAmount === "" ||
    payload.defaults.codAmount === null ||
    Number.isNaN(codNumber) ||
    codNumber < 0
  ) {
    defaultSettingsErrors.push("codAmount is missing or invalid");
  }
  
  if (defaultSettingsErrors.length > 0) {
    console.error("Default settings validation failed:", defaultSettingsErrors);
    errors.push(`Default settings incomplete: ${defaultSettingsErrors.join(", ")}`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
