import { CourierType } from "../types/courier-settings.types";

export interface CredentialFieldConfig {
  key: string;
  label: string;
  helpText: string;
}

export const COURIER_API_CREDENTIALS: Record<CourierType, CredentialFieldConfig[]> = {
  Pathao: [
    {
      key: "pathaoUsername",
      label: "Username",
      helpText: "Enter your Pathao Username",
    },
    {
      key: "pathaoPassword",
      label: "Password",
      helpText: "Enter your Pathao Password",
    },
  ],
  RedX: [
    {
      key: "redxApiToken",
      label: "API Token",
      helpText: "Enter your RedX API Token",
    },
  ],
  Steadfast: [
    {
      key: "steadfastApiKey",
      label: "API Key",
      helpText: "Enter your Steadfast API Key",
    },
    {
      key: "steadfastSecretKey",
      label: "Secret Key",
      helpText: "Enter your Steadfast Secret Key",
    },
  ],
};
