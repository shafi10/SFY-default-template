import { useState, useRef, useEffect } from "react";
import { Tabs } from "@shopify/polaris";
import { CourierType, CourierFormState } from "../types/courier-settings.types";
import { useCourierForm } from "../hooks/useCourierForm";
import { useCompletionStatus } from "../hooks/useCompletionStatus";
import { useCourierAPI } from "../hooks/useCourierAPI";
import { useAuthenticatedFetch } from "../hooks/useAuthenticatedFetch";
import { useUI } from "../contexts/ui.context";
import { CourierSelectorHeader } from "../components/courier-settings/CourierSelectorHeader";
import { WarningBanner } from "../components/courier-settings/WarningBanner";
import { ConfigurationStatusCard } from "../components/courier-settings/ConfigurationStatusCard";
import { DefaultCourierCard } from "../components/courier-settings/DefaultCourierCard";
import { ApiConfigurationCard } from "../components/courier-settings/ApiConfigurationCard";
import { WebhookConfigurationCard } from "../components/courier-settings/WebhookConfigurationCard";
import { MerchantInformationCard } from "../components/courier-settings/MerchantInformationCard";
import { DefaultSettingsCard } from "../components/courier-settings/DefaultSettingsCard";

export default function CourierSettings() {
  const authenticatedFetch = useAuthenticatedFetch();
  const [selectedCourier, setSelectedCourier] = useState<CourierType>("Pathao");
  const [selectedTab, setSelectedTab] = useState(0);

  const [defaultCourier, setDefaultCourier] = useState<CourierType | null>(
    null
  );
  const [isSaving, setIsSaving] = useState(false);
  const [webhookByCourier, setWebhookByCourier] = useState<
    Record<string, { secret: string; url: string; generated: boolean }>
  >({});
  const [defaultsByCourier, setDefaultsByCourier] = useState<
    Record<
      string,
      {
        deliveryType: string;
        packageType: string;
        defaultWeight: string;
        defaultCodAmount: string;
        isCodEnabled: boolean;
      }
    >
  >({});
  const initialDefaultsByCourier = useRef<
    Record<
      string,
      {
        deliveryType: string;
        packageType: string;
        defaultWeight: string;
        defaultCodAmount: string;
        isCodEnabled: boolean;
      }
    >
  >({});

  const [formState, formActions] = useCourierForm();
  const courierTypeMapForCalc: Record<string, string> = {
    Pathao: "pathao",
    RedX: "redx",
    Steadfast: "steadfast",
  };
  const selectedApiType =
    courierTypeMapForCalc[selectedCourier] || selectedCourier.toLowerCase();
  const isApiConfigured = Boolean(defaultsByCourier[selectedApiType]);
  const { percentage, status, tone } = useCompletionStatus(
    selectedCourier,
    formState,
    { isApiConfigured }
  );
  const {
    setMerchantInformation,
    setDefaultCourier: setDefaultCourierMutation,
    setDefaultSettings,
    generateWebhookCredentials,
    addCourierService,
    resetCourierService,
    isLoading: apiLoading,
  } = useCourierAPI();
  const { showToast } = useUI();

  // Track initial state for comparison
  const initialDefaultCourier = useRef<CourierType | null>(null);
  const serverDefaultCourier = useRef<CourierType | null>(null);
  const initialFormState = useRef<CourierFormState | null>(null);
  const snapshotTaken = useRef(false);
  const merchantHydrated = useRef(false);
  const initialMerchant = useRef<{
    name: string;
    phone: string;
    address: string;
  } | null>(null);
  const initialApiConfig = useRef<Record<string, any>>({});

  // Take snapshot AFTER data is loaded (when form has substantial data)
  useEffect(() => {
    // Only take snapshot once, and only when form has multiple fields filled
    if (!snapshotTaken.current) {
      // Wait until merchant info AND defaults are populated
      const hasMerchantData =
        formState.merchantName &&
        formState.merchantPhone &&
        formState.merchantAddress;
      const hasDefaultsData =
        formState.deliveryType &&
        formState.packageType &&
        formState.packageType !== "select" &&
        formState.defaultWeight &&
        formState.defaultCodAmount;

      // Take snapshot when we have complete data
      if (hasMerchantData && hasDefaultsData) {
        initialFormState.current = { ...formState };
        initialDefaultCourier.current = defaultCourier;
        snapshotTaken.current = true;
        console.log("✅ Initial snapshot captured:", {
          merchant: {
            name: formState.merchantName,
            phone: formState.merchantPhone,
            address: formState.merchantAddress,
          },
          defaultCourier: defaultCourier || "(none)",
          defaults: {
            deliveryType: formState.deliveryType,
            packageType: formState.packageType,
            weight: formState.defaultWeight,
            codAmount: formState.defaultCodAmount,
            isCodEnabled: formState.isCodEnabled,
          },
        });
      }
    }
  }, [formState, defaultCourier]);

  // Initialize baseline for default courier independently of form snapshot
  useEffect(() => {
    if (initialDefaultCourier.current === null && defaultCourier !== null) {
      initialDefaultCourier.current = defaultCourier;
    }
  }, [defaultCourier]);

  // Load webhook state for selected courier (so it's per-courier and persists)
  useEffect(() => {
    const courierTypeMap: Record<string, string> = {
      Pathao: "pathao",
      RedX: "redx",
      Steadfast: "steadfast",
    };
    const apiType =
      courierTypeMap[selectedCourier] || selectedCourier.toLowerCase();

    let aborted = false;
    // Immediately reflect per-courier defaults in the form to avoid leaking previous courier values
    const existingDefaults = defaultsByCourier[apiType];
    if (existingDefaults) {
      formActions.setDeliveryType(existingDefaults.deliveryType);
      formActions.setPackageType(existingDefaults.packageType);
      formActions.setDefaultWeight(existingDefaults.defaultWeight);
      formActions.setDefaultCodAmount(existingDefaults.defaultCodAmount);
      formActions.setIsCodEnabled(existingDefaults.isCodEnabled);
    } else {
      formActions.setDeliveryType("");
      formActions.setPackageType("select");
      formActions.setDefaultWeight("");
      formActions.setDefaultCodAmount("");
      formActions.setIsCodEnabled(false);
    }
    (async () => {
      try {
        const res = await authenticatedFetch(
          `/api/admin/courier-config/${apiType}`
        );
        if (!res.ok) return;
        const json = await res.json();
        const cfg = json?.data;
        if (!cfg || aborted) return;
        const secret = cfg.webhookSecret || "";
        const baseUrl = cfg.webhookBaseUrl || "";
        setWebhookByCourier((prev) => ({
          ...prev,
          [apiType]: {
            secret,
            url: baseUrl,
            generated: Boolean(secret),
          },
        }));
        // Reflect webhook state into form for completion calculation
        formActions.setWebhookSecret(secret);
        formActions.setCallbackUrl(baseUrl);
        formActions.setIsWebhookGenerated(Boolean(secret));

        // Hydrate defaults per courier from server
        const hydratedDefaults = {
          deliveryType: cfg.defaultDeliveryType || "",
          packageType: cfg.defaultPackageType || "select",
          defaultWeight: (cfg.defaultWeight ?? "").toString(),
          defaultCodAmount: (cfg.defaultCODAmount ?? "").toString(),
          isCodEnabled: Boolean(cfg.shouldEnableCodByDefault),
        };
        setDefaultsByCourier((prev) => ({
          ...prev,
          [apiType]: hydratedDefaults,
        }));

        // Capture initial snapshot per courier if not set
        if (!initialDefaultsByCourier.current[apiType]) {
          initialDefaultsByCourier.current[apiType] = { ...hydratedDefaults };
        }

        // Reflect into form state for UI controls
        formActions.setDeliveryType(hydratedDefaults.deliveryType);
        formActions.setPackageType(hydratedDefaults.packageType);
        formActions.setDefaultWeight(hydratedDefaults.defaultWeight);
        formActions.setDefaultCodAmount(hydratedDefaults.defaultCodAmount);
        formActions.setIsCodEnabled(hydratedDefaults.isCodEnabled);

        // Initialize empty API credential snapshot for change detection
        // Note: Backend stores authentication response, not original credentials
        // So we can't display saved credentials (security best practice)
        if (!initialApiConfig.current[apiType]) {
          initialApiConfig.current[apiType] = {
            username: "",
            password: "",
            apiToken: "",
            apiKey: "",
            secretKey: "",
          };
        }

        // Hydrate merchant info once globally (same for all couriers)
        if (!merchantHydrated.current) {
          const m = cfg.merchant || {};
          const snapshot = {
            name: m.name || "",
            phone: m.phoneNo || "",
            address: m.address || "",
          };
          initialMerchant.current = snapshot;
          formActions.setMerchantName(snapshot.name);
          formActions.setMerchantPhone(snapshot.phone);
          formActions.setMerchantAddress(snapshot.address);
          merchantHydrated.current = true;
        }
      } catch (e) {
        // ignore fetch errors silently; button will still try and surface errors on generate
      }
    })();
    return () => {
      aborted = true;
    };
  }, [selectedCourier]);

  // Hydrate merchant info once on first mount using any available courier config
  useEffect(() => {
    if (merchantHydrated.current) return;
    let aborted = false;
    (async () => {
      const types = ["steadfast", "pathao", "redx", "ecourier"];
      for (const t of types) {
        if (aborted || merchantHydrated.current) break;
        try {
          const res = await authenticatedFetch(
            `/api/admin/courier-config/${t}`
          );
          if (!res.ok) continue;
          const json = await res.json();
          const m = json?.data?.merchant;
          if (!m) continue;
          if (aborted) break;
          const snapshot = {
            name: m.name || "",
            phone: m.phoneNo || "",
            address: m.address || "",
          };
          initialMerchant.current = snapshot;
          formActions.setMerchantName(snapshot.name);
          formActions.setMerchantPhone(snapshot.phone);
          formActions.setMerchantAddress(snapshot.address);
          merchantHydrated.current = true;
          break;
        } catch {
          // continue trying other types
        }
      }
    })();
    return () => {
      aborted = true;
    };
  }, []);

  // Select the persisted default courier on first load
  useEffect(() => {
    let aborted = false;
    (async () => {
      // If a default is already set in state, do nothing
      if (defaultCourier) return;
      const types = ["steadfast", "pathao", "redx"];
      const toUiName: Record<string, CourierType> = {
        pathao: "Pathao",
        redx: "RedX",
        steadfast: "Steadfast",
      };
      for (const t of types) {
        if (aborted) break;
        try {
          const res = await authenticatedFetch(
            `/api/admin/courier-config/${t}`
          );
          if (!res.ok) continue;
          const json = await res.json();
          const cfg = json?.data;
          if (cfg?.isDefault) {
            const uiName =
              toUiName[t] ||
              ((t.charAt(0).toUpperCase() + t.slice(1)) as CourierType);
            setDefaultCourier(uiName);
            serverDefaultCourier.current = uiName;
            setSelectedCourier(uiName);
            break;
          }
        } catch {
          // continue probing other types
        }
      }
    })();
    return () => {
      aborted = true;
    };
  }, []);

  const handleGenerateWebhook = () => {
    const courierTypeMap: Record<string, string> = {
      Pathao: "pathao",
      RedX: "redx",
      Steadfast: "steadfast",
    };
    const apiType =
      courierTypeMap[selectedCourier] || selectedCourier.toLowerCase();
    const url = `/api/admin/courier-config/create-hook-credential/${apiType}`;

    // Use mutation with callbacks following choice-legacy pattern
    generateWebhookCredentials.mutate(
      { url },
      {
        onSuccess: async (res) => {
          const response = await res.json();
          if (response?.data) {
            setWebhookByCourier((prev) => ({
              ...prev,
              [apiType]: {
                secret: response.data.secret,
                url: response.data.baseUrl,
                generated: true,
              },
            }));

            // Update form state for completion calculation
            formActions.setWebhookSecret(response.data.secret);
            formActions.setCallbackUrl(response.data.baseUrl);
            formActions.setIsWebhookGenerated(true);

            showToast(`Webhook credentials generated for ${selectedCourier}`);
          }
        },
        onError: async (err: any) => {
          const error = await err.json().catch(() => ({}));
          showToast(error?.message || "Failed to generate webhook", {
            error: true,
          });
        },
      }
    );
  };

  const handleReset = () => {
    const courierTypeMap: Record<string, string> = {
      Pathao: "pathao",
      RedX: "redx",
      Steadfast: "steadfast",
    };
    const apiType =
      courierTypeMap[selectedCourier] || selectedCourier.toLowerCase();
    const url = `/api/admin/courier-config/reset/${apiType}`;

    // Use mutation with callbacks following choice-legacy pattern
    resetCourierService.mutate(
      { url, skipBody: true },
      {
        onSuccess: async (res) => {
          const response = await res.json().catch(() => ({ success: res?.ok }));

          if (res?.ok || response?.success) {
            // Clear per-courier UI state
            setWebhookByCourier((prev) => {
              const { [apiType]: _, ...rest } = prev;
              return rest;
            });
            setDefaultsByCourier((prev) => {
              const { [apiType]: _, ...rest } = prev;
              return rest;
            });

            // Clear form fields for selected courier
            formActions.setPathaoUsername("");
            formActions.setPathaoPassword("");
            formActions.setRedxApiToken("");
            formActions.setSteadfastApiKey("");
            formActions.setSteadfastSecretKey("");
            formActions.setDeliveryType("");
            formActions.setPackageType("select");
            formActions.setDefaultWeight("");
            formActions.setDefaultCodAmount("");
            formActions.setIsCodEnabled(false);
            formActions.setWebhookSecret("");
            formActions.setCallbackUrl("");
            formActions.setIsWebhookGenerated(false);

            // Clear snapshots for this courier
            delete initialDefaultsByCourier.current[apiType];
            initialApiConfig.current[apiType] = {
              username: "",
              password: "",
              apiToken: "",
              apiKey: "",
              secretKey: "",
            };

            // Clear merchant info from UI (backend deletes it on reset)
            formActions.setMerchantName("");
            formActions.setMerchantPhone("");
            formActions.setMerchantAddress("");
            initialMerchant.current = { name: "", phone: "", address: "" };
            merchantHydrated.current = false;

            // If the reset courier was set as default, clear it
            if (defaultCourier === selectedCourier) {
              setDefaultCourier(null);
              serverDefaultCourier.current = null;
            }

            showToast(`Reset successful for ${selectedCourier}`);
          }
        },
        onError: async (err: any) => {
          const error = await err.json().catch(() => ({}));
          showToast(error?.message || "Failed to reset configuration", {
            error: true,
          });
        },
      }
    );
  };

  // Helper: Check if merchant info actually changed (independent of defaults snapshot)
  const isMerchantChanged = () => {
    const baseline = initialMerchant.current || {
      name: "",
      phone: "",
      address: "",
    };
    const nameChanged =
      (baseline.name || "") !== (formState.merchantName || "");
    const phoneChanged =
      (baseline.phone || "") !== (formState.merchantPhone || "");
    const addressChanged =
      (baseline.address || "") !== (formState.merchantAddress || "");
    return nameChanged || phoneChanged || addressChanged;
  };

  // Helper: Check if default courier actually changed
  const isDefaultCourierChanged = () => {
    const baseline = serverDefaultCourier.current;
    // If baseline is unset and a default is selected, treat as change
    if (baseline === null) return Boolean(defaultCourier);
    return baseline !== defaultCourier;
  };

  // Helper: Check if default settings actually changed
  const isDefaultsChanged = () => {
    const courierTypeMap: Record<string, string> = {
      Pathao: "pathao",
      RedX: "redx",
      Steadfast: "steadfast",
    };
    const apiType =
      courierTypeMap[selectedCourier] || selectedCourier.toLowerCase();
    const initial = initialDefaultsByCourier.current[apiType];
    if (!initial) return false;

    const deliveryTypeChanged =
      (initial.deliveryType || "") !== (formState.deliveryType || "");
    const packageTypeChanged =
      (initial.packageType || "") !== (formState.packageType || "");
    const weightChanged =
      (initial.defaultWeight || "") !== (formState.defaultWeight || "");
    const codAmountChanged =
      (initial.defaultCodAmount || "") !== (formState.defaultCodAmount || "");
    const codEnabledChanged =
      (initial.isCodEnabled || false) !== (formState.isCodEnabled || false);

    return (
      deliveryTypeChanged ||
      packageTypeChanged ||
      weightChanged ||
      codAmountChanged ||
      codEnabledChanged
    );
  };

  // Helper: Check if API config changed (for the selected courier)
  const isApiConfigChanged = () => {
    const courierTypeMap: Record<string, string> = {
      Pathao: "pathao",
      RedX: "redx",
      Steadfast: "steadfast",
    };
    const apiType =
      courierTypeMap[selectedCourier] || selectedCourier.toLowerCase();
    const initial = initialApiConfig.current[apiType] || {
      username: "",
      password: "",
      apiToken: "",
      apiKey: "",
      secretKey: "",
    };

    if (selectedCourier === "Pathao") {
      const usernameChanged =
        (initial.username || "") !== (formState.pathaoUsername || "");
      const passwordChanged =
        (initial.password || "") !== (formState.pathaoPassword || "");
      return usernameChanged || passwordChanged;
    } else if (selectedCourier === "RedX") {
      const tokenChanged =
        (initial.apiToken || "") !== (formState.redxApiToken || "");
      return tokenChanged;
    } else if (selectedCourier === "Steadfast") {
      const keyChanged =
        (initial.apiKey || "") !== (formState.steadfastApiKey || "");
      const secretChanged =
        (initial.secretKey || "") !== (formState.steadfastSecretKey || "");
      return keyChanged || secretChanged;
    }
    return false;
  };

  const handleSave = () => {
    // Check which groups actually changed
    const merchantChanged = isMerchantChanged();
    const defaultCourierChanged = isDefaultCourierChanged();
    const defaultsChanged = isDefaultsChanged();
    const apiConfigChanged = isApiConfigChanged();

    console.log("=== Change Detection Debug ===");
    console.log("Initial snapshot:", {
      merchant: {
        name: initialFormState.current?.merchantName,
        phone: initialFormState.current?.merchantPhone,
        address: initialFormState.current?.merchantAddress,
      },
      defaultCourier: initialDefaultCourier.current,
      defaults: {
        deliveryType: initialFormState.current?.deliveryType,
        packageType: initialFormState.current?.packageType,
        weight: initialFormState.current?.defaultWeight,
        codAmount: initialFormState.current?.defaultCodAmount,
        isCodEnabled: initialFormState.current?.isCodEnabled,
      },
    });
    console.log("Current state:", {
      merchant: {
        name: formState.merchantName,
        phone: formState.merchantPhone,
        address: formState.merchantAddress,
      },
      defaultCourier,
      defaults: {
        deliveryType: formState.deliveryType,
        packageType: formState.packageType,
        weight: formState.defaultWeight,
        codAmount: formState.defaultCodAmount,
        isCodEnabled: formState.isCodEnabled,
      },
    });
    console.log("Change detection result:", {
      merchantChanged,
      defaultCourierChanged,
      defaultsChanged,
      apiConfigChanged,
    });

    if (
      !merchantChanged &&
      !defaultCourierChanged &&
      !defaultsChanged &&
      !apiConfigChanged
    ) {
      showToast("No changes detected");
      return;
    }

    setIsSaving(true);
    const courierTypeMap: Record<string, string> = {
      Pathao: "pathao",
      RedX: "redx",
      Steadfast: "steadfast",
    };
    const apiType =
      courierTypeMap[selectedCourier] || selectedCourier.toLowerCase();

    const updateSnapshots = () => {
      initialFormState.current = { ...formState };
      initialDefaultCourier.current = defaultCourier;
      initialMerchant.current = {
        name: formState.merchantName || "",
        phone: formState.merchantPhone || "",
        address: formState.merchantAddress || "",
      };
      initialApiConfig.current[apiType] = {
        username: formState.pathaoUsername || "",
        password: formState.pathaoPassword || "",
        apiToken: formState.redxApiToken || "",
        apiKey: formState.steadfastApiKey || "",
        secretKey: formState.steadfastSecretKey || "",
      };
      initialDefaultsByCourier.current[apiType] = {
        deliveryType: formState.deliveryType || "",
        packageType: formState.packageType || "select",
        defaultWeight: formState.defaultWeight || "",
        defaultCodAmount: formState.defaultCodAmount || "",
        isCodEnabled: !!formState.isCodEnabled,
      };
      if (apiConfigChanged) {
        setDefaultsByCourier((prev) => ({
          ...prev,
          [apiType]: {
            deliveryType: formState.deliveryType || "",
            packageType: formState.packageType || "select",
            defaultWeight: formState.defaultWeight || "",
            defaultCodAmount: formState.defaultCodAmount || "",
            isCodEnabled: !!formState.isCodEnabled,
          },
        }));
      }
    };

    const run = async () => {
      try {
        // API config
        if (apiConfigChanged) {
          const defaultSettings = {
            defaultDeliveryType: formState.deliveryType || "home",
            defaultPackageType:
              formState.packageType !== "select"
                ? formState.packageType
                : "box",
            defaultWeight: Number(formState.defaultWeight) || 1,
            defaultCODAmount: Number(formState.defaultCodAmount) || 0,
            defaultParcelNote: "Default note",
            shouldEnableCodByDefault: formState.isCodEnabled || false,
          };

          let apiPayload: any = { type: apiType };
          if (selectedCourier === "Pathao") {
            apiPayload.payload = {
              username: formState.pathaoUsername,
              password: formState.pathaoPassword,
              ...defaultSettings,
            };
          } else if (selectedCourier === "RedX") {
            apiPayload.payload = {
              apiToken: formState.redxApiToken,
              ...defaultSettings,
            };
          } else if (selectedCourier === "Steadfast") {
            apiPayload.payload = {
              apiKey: formState.steadfastApiKey,
              secretKey: formState.steadfastSecretKey,
              ...defaultSettings,
            };
          }

          const res = await addCourierService.mutateAsync(apiPayload);
          const response = await res.json().catch(() => ({ success: res?.ok }));
          if (!(res?.ok || response?.success))
            throw new Error(
              response?.message || "Failed to save API configuration"
            );
        }

        // Merchant
        if (merchantChanged) {
          const merchantPayload = {
            name: formState.merchantName,
            phoneNo: formState.merchantPhone,
            address: formState.merchantAddress,
          };

          if (
            !merchantPayload.name ||
            !merchantPayload.phoneNo ||
            !merchantPayload.address
          ) {
            showToast("Please fill all merchant information fields", {
              error: true,
            });
            throw new Error("Invalid merchant data");
          }

          const res = await setMerchantInformation.mutateAsync(merchantPayload);
          const response = await res.json().catch(() => ({ success: res?.ok }));
          if (!(res?.ok || response?.success))
            throw new Error(
              response?.message || "Failed to save merchant information"
            );
        }

        // Default courier
        if (defaultCourierChanged && defaultCourier) {
          const res = await setDefaultCourierMutation.mutateAsync({
            type: apiType,
          });
          const response = await res.json().catch(() => ({ success: res?.ok }));
          if (!(res?.ok || response?.success))
            throw new Error(
              response?.message || "Failed to set default courier"
            );
        }

        // Defaults
        if (defaultsChanged) {
          const defaultsPayload = {
            defaultDeliveryType: formState.deliveryType,
            defaultPackageType: formState.packageType,
            defaultWeight: Number(formState.defaultWeight),
            defaultCODAmount: Number(formState.defaultCodAmount),
            defaultParcelNote: "Default note",
            shouldEnableCodByDefault: formState.isCodEnabled,
          };

          if (
            !defaultsPayload.defaultDeliveryType ||
            !defaultsPayload.defaultPackageType ||
            defaultsPayload.defaultPackageType === "select" ||
            !defaultsPayload.defaultWeight ||
            defaultsPayload.defaultCODAmount === null
          ) {
            showToast("Please fill all default settings fields", {
              error: true,
            });
            throw new Error("Invalid defaults");
          }

          const res = await setDefaultSettings.mutateAsync({
            type: apiType,
            payload: defaultsPayload,
          });
          const response = await res.json().catch(() => ({ success: res?.ok }));
          if (!(res?.ok || response?.success))
            throw new Error(
              response?.message || "Failed to save default settings"
            );
        }

        updateSnapshots();
        showToast("Settings saved successfully");
      } catch (err: any) {
        if (
          err?.message &&
          err.message !== "Invalid defaults" &&
          err.message !== "Invalid merchant data"
        ) {
          showToast(err.message, { error: true });
        }
      } finally {
        setIsSaving(false);
      }
    };

    run();
  };

  return (
    <s-page back-action-url="/index" inlineSize="base">
      <s-stack>
        {/* Header Actions */}
        <CourierSelectorHeader
          selectedCourier={selectedCourier}
          onReset={handleReset}
          onSave={handleSave}
          isSaving={isSaving || apiLoading}
        />
        <s-box>
          <s-stack direction="inline" alignItems="center">
            <Tabs
              tabs={[
                {
                  id: "courier-tab",
                  content: selectedCourier,
                  accessibilityLabel: "Courier selection",
                  panelID: "courier-panel",
                  actions: [
                    {
                      type: "Steadfast" as any,
                      content: "Steadfast",
                      onAction: () => setSelectedCourier("Steadfast"),
                    },
                    {
                      type: "Pathao" as any,
                      content: "Pathao",
                      onAction: () => setSelectedCourier("Pathao"),
                    },
                    {
                      type: "RedX" as any,
                      content: "RedX",
                      onAction: () => setSelectedCourier("RedX"),
                    },
                  ],
                },
                {
                  id: "tutorial",
                  content: "Tutorial",
                  panelID: "tutorial-panel",
                },
                {
                  id: "notes",
                  content: "Important Notes",
                  panelID: "notes-panel",
                },
              ]}
              selected={selectedTab}
              onSelect={setSelectedTab}
            />
          </s-stack>
          <s-divider color="strong"></s-divider>
        </s-box>

        {/* Spacing */}
        <s-stack paddingBlock="small-200"></s-stack>

        {/* Warning Banner */}
        <WarningBanner
          selectedCourier={selectedCourier}
          defaultCourier={defaultCourier}
        />

        <s-stack paddingBlock="small-200"></s-stack>

        {/* Configuration Status Card */}
        <ConfigurationStatusCard
          completionPercentage={percentage}
          completionStatus={status}
          completionTone={tone}
        />

        <s-stack paddingBlock="small-200"></s-stack>

        {/* Default Courier Card */}
        {(() => {
          const courierTypeMap: Record<string, string> = {
            Pathao: "pathao",
            RedX: "redx",
            Steadfast: "steadfast",
          };
          const apiType =
            courierTypeMap[selectedCourier] || selectedCourier.toLowerCase();
          const hasConfig = Boolean(defaultsByCourier[apiType]);
          return (
            <DefaultCourierCard
              selectedCourier={selectedCourier}
              defaultCourier={defaultCourier}
              onDefaultCourierChange={setDefaultCourier}
              disabled={!hasConfig}
            />
          );
        })()}

        <s-stack paddingBlock="small-200"></s-stack>

        {/* API Configuration Card */}
        <ApiConfigurationCard
          selectedCourier={selectedCourier}
          credentials={{
            pathaoUsername: formState.pathaoUsername,
            pathaoPassword: formState.pathaoPassword,
            redxApiToken: formState.redxApiToken,
            steadfastApiKey: formState.steadfastApiKey,
            steadfastSecretKey: formState.steadfastSecretKey,
          }}
          disabled={Boolean(defaultsByCourier[selectedApiType])}
          onChange={(key, value) => {
            switch (key) {
              case "pathaoUsername":
                formActions.setPathaoUsername(value);
                break;
              case "pathaoPassword":
                formActions.setPathaoPassword(value);
                break;
              case "redxApiToken":
                formActions.setRedxApiToken(value);
                break;
              case "steadfastApiKey":
                formActions.setSteadfastApiKey(value);
                break;
              case "steadfastSecretKey":
                formActions.setSteadfastSecretKey(value);
                break;
            }
          }}
        />

        <s-stack paddingBlock="small-200"></s-stack>

        {/* Webhook Configuration Card - per courier state */}
        {(() => {
          const courierTypeMap: Record<string, string> = {
            Pathao: "pathao",
            RedX: "redx",
            Steadfast: "steadfast",
          };
          const apiType =
            courierTypeMap[selectedCourier] || selectedCourier.toLowerCase();
          const current = webhookByCourier[apiType] || {
            secret: "",
            url: "",
            generated: false,
          };
          return (
            <WebhookConfigurationCard
              webhookSecret={current.secret}
              callbackUrl={current.url}
              isWebhookGenerated={current.generated}
              onGenerateWebhook={handleGenerateWebhook}
            />
          );
        })()}

        <s-stack paddingBlock="small-200"></s-stack>

        {/* Merchant Information Card */}
        <MerchantInformationCard
          merchantName={formState.merchantName}
          merchantPhone={formState.merchantPhone}
          merchantAddress={formState.merchantAddress}
          onMerchantNameChange={formActions.setMerchantName}
          onMerchantPhoneChange={formActions.setMerchantPhone}
          onMerchantAddressChange={formActions.setMerchantAddress}
        />

        <s-stack paddingBlock="small-200"></s-stack>

        {/* Default Settings Card */}
        {(() => {
          const courierTypeMap: Record<string, string> = {
            Pathao: "pathao",
            RedX: "redx",
            Steadfast: "steadfast",
          };
          const apiType =
            courierTypeMap[selectedCourier] || selectedCourier.toLowerCase();
          const current = defaultsByCourier[apiType] || {
            deliveryType: "",
            packageType: "select",
            defaultWeight: "",
            defaultCodAmount: "",
            isCodEnabled: false,
          };

          const onDeliveryTypeChange = (v: string) => {
            formActions.setDeliveryType(v);
            setDefaultsByCourier((prev) => ({
              ...prev,
              [apiType]: { ...(prev[apiType] || current), deliveryType: v },
            }));
          };
          const onPackageTypeChange = (v: string) => {
            formActions.setPackageType(v);
            setDefaultsByCourier((prev) => ({
              ...prev,
              [apiType]: { ...(prev[apiType] || current), packageType: v },
            }));
          };
          const onDefaultWeightChange = (v: string) => {
            formActions.setDefaultWeight(v);
            setDefaultsByCourier((prev) => ({
              ...prev,
              [apiType]: { ...(prev[apiType] || current), defaultWeight: v },
            }));
          };
          const onDefaultCodAmountChange = (v: string) => {
            formActions.setDefaultCodAmount(v);
            setDefaultsByCourier((prev) => ({
              ...prev,
              [apiType]: { ...(prev[apiType] || current), defaultCodAmount: v },
            }));
          };
          const onIsCodEnabledChange = (v: boolean) => {
            formActions.setIsCodEnabled(v);
            setDefaultsByCourier((prev) => ({
              ...prev,
              [apiType]: { ...(prev[apiType] || current), isCodEnabled: v },
            }));
          };

          return (
            <DefaultSettingsCard
              deliveryType={current.deliveryType}
              packageType={current.packageType}
              defaultWeight={current.defaultWeight}
              defaultCodAmount={current.defaultCodAmount}
              isCodEnabled={current.isCodEnabled}
              onDeliveryTypeChange={onDeliveryTypeChange}
              onPackageTypeChange={onPackageTypeChange}
              onDefaultWeightChange={onDefaultWeightChange}
              onDefaultCodAmountChange={onDefaultCodAmountChange}
              onIsCodEnabledChange={onIsCodEnabledChange}
            />
          );
        })()}

        <s-stack paddingBlock="small-500"></s-stack>
      </s-stack>
    </s-page>
  );
}
