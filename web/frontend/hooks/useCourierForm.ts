import { useState, useEffect } from "react";
import { CourierFormState, CourierFormActions } from "../types/courier-settings.types";

export function useCourierForm(): [CourierFormState, CourierFormActions] {
  const [webhookSecret, setWebhookSecret] = useState("");
  const [callbackUrl, setCallbackUrl] = useState("");
  const [isWebhookGenerated, setIsWebhookGenerated] = useState(false);
  const [isDefaultCourier, setIsDefaultCourier] = useState(false);
  const [pathaoUsername, setPathaoUsername] = useState("");
  const [pathaoPassword, setPathaoPassword] = useState("");
  const [redxApiToken, setRedxApiToken] = useState("");
  const [steadfastApiKey, setSteadfastApiKey] = useState("");
  const [steadfastSecretKey, setSteadfastSecretKey] = useState("");
  const [merchantName, setMerchantName] = useState("");
  const [merchantPhone, setMerchantPhone] = useState("");
  const [merchantAddress, setMerchantAddress] = useState("");
  const [deliveryType, setDeliveryType] = useState("");
  const [packageType, setPackageType] = useState("select");
  const [defaultWeight, setDefaultWeight] = useState("");
  const [defaultCodAmount, setDefaultCodAmount] = useState("");
  const [isCodEnabled, setIsCodEnabled] = useState(false);
  const [apiCredentials, setApiCredentials] = useState<Record<string, string>>({});

  // Listen to custom web component events to update state
  useEffect(() => {
    const handleInput = (e: Event) => {
      const target = e.target as HTMLElement;
      const value = (target as any).value || "";

      const labelMap: Record<string, (value: string) => void> = {
        "Username": setPathaoUsername,
        "Password": setPathaoPassword,
        "API Token": setRedxApiToken,
        "API Key": setSteadfastApiKey,
        "Secret Key": setSteadfastSecretKey,
        // Merchant fields, weight, and COD amount are handled via direct onChange props
      };

      const label = target.getAttribute("label");
      if (label && labelMap[label]) {
        labelMap[label](value);
      }
    };

    const handleChange = (e: Event) => {
      const target = e.target as HTMLElement;

      // Only handle isDefaultCourier and COD checkbox here
      // deliveryType and packageType are handled directly via component onChange props
      const label = target.getAttribute("label") || "";
      if (label.includes("default courier")) {
        setIsDefaultCourier((target as any).checked || false);
      }
      if (label.includes("Cash on Delivery (COD) by default")) {
        setIsCodEnabled((target as any).checked || false);
      }
    };

    document.addEventListener("input", handleInput);
    document.addEventListener("change", handleChange);

    return () => {
      document.removeEventListener("input", handleInput);
      document.removeEventListener("change", handleChange);
    };
  }, []);

  const state: CourierFormState = {
    webhookSecret,
    callbackUrl,
    isWebhookGenerated,
    isDefaultCourier,
    // generic credentials map for flexible providers
    apiCredentials,
    pathaoUsername,
    pathaoPassword,
    redxApiToken,
    steadfastApiKey,
    steadfastSecretKey,
    merchantName,
    merchantPhone,
    merchantAddress,
    deliveryType,
    packageType,
    defaultWeight,
    defaultCodAmount,
    isCodEnabled,
  };

  const actions: CourierFormActions = {
    setWebhookSecret,
    setCallbackUrl,
    setIsWebhookGenerated,
    setIsDefaultCourier,
    setApiCredential: (key: string, value: string) =>
      setApiCredentials(prev => ({ ...prev, [key]: value })),
    setPathaoUsername,
    setPathaoPassword,
    setRedxApiToken,
    setSteadfastApiKey,
    setSteadfastSecretKey,
    setMerchantName,
    setMerchantPhone,
    setMerchantAddress,
    setDeliveryType,
    setPackageType,
    setDefaultWeight,
    setDefaultCodAmount,
    setIsCodEnabled,
  };

  return [state, actions];
}
