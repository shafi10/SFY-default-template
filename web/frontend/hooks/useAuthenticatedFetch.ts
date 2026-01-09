import { useAppBridge } from "@shopify/app-bridge-react";
import { Redirect } from "@shopify/app-bridge/actions";
import type { ClientApplication, AppBridgeState } from "@shopify/app-bridge";

type AppBridgeApp = ClientApplication<AppBridgeState>;

/**
 * Returns an auth-aware `fetch` that:
 * 1) Ensures an OpenID Connect ID token is present in `Authorization` by calling
 *    App Bridge `idToken` (or `shopify.idToken` fallback) when missing:
 *    https://shopify.dev/docs/api/app-bridge-library/apis/id-token
 * 2) Uses native `fetch` with credentials included; App Bridge already injects auth when possible:
 *    https://shopify.dev/docs/api/app-bridge-library/apis/resource-fetching
 * 3) Checks `X-Shopify-API-Request-Failure-Reauthorize` and redirects if reauth is required.
 */
export function useAuthenticatedFetch() {
  const app = useAppBridge() as unknown as AppBridgeApp;

  return async (uri: string, options?: RequestInit): Promise<Response> => {
    const headers = await ensureAuthHeader(options?.headers, app);
    const response = await fetch(uri, {
      credentials: "include",
      ...options,
      headers,
    });
    checkHeadersForReauthorization(response.headers, app);
    return response;
  };
}

async function ensureAuthHeader(
  existingHeaders: HeadersInit | undefined,
  app: AppBridgeApp
) {
  const headers = new Headers(existingHeaders || {});

  if (!headers.has("Authorization")) {
    const token = await getIdToken(app);
    if (token) headers.set("Authorization", `Bearer ${token}`);
  }

  return headers;
}

async function getIdToken(app: AppBridgeApp) {
  try {
    const appIdToken = (app as any)?.idToken;
    if (typeof appIdToken === "function") return await appIdToken();

    const globalIdToken = (window as any)?.shopify?.idToken;
    if (typeof globalIdToken === "function") return await globalIdToken();
  } catch (err) {
    console.warn("Failed to retrieve ID token", err);
  }
  return undefined;
}

function checkHeadersForReauthorization(headers: Headers, app: AppBridgeApp) {
  if (headers.get("X-Shopify-API-Request-Failure-Reauthorize") === "1") {
    const authUrlHeader =
      headers.get("X-Shopify-API-Request-Failure-Reauthorize-Url") ||
      `/api/auth`;

    const redirect = Redirect.create(app);
    redirect.dispatch(
      Redirect.Action.REMOTE,
      authUrlHeader.startsWith("/")
        ? `https://${window.location.host}${authUrlHeader}`
        : authUrlHeader
    );
  }
}
