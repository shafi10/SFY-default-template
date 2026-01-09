import { useAppBridge } from "@shopify/app-bridge-react";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Layout } from "@shopify/polaris";

export default function ExitIframe() {
  const shopify = useAppBridge();
  const { search } = useLocation();
  const [showWarning, setShowWarning] = useState<boolean>(false);

  useEffect(() => {
    if (!!shopify && !!search) {
      // App Bridge loading API - using type assertion for compatibility
      const loading = shopify.loading as
        | { show?: () => void; hide?: () => void }
        | undefined;
      loading?.show?.();

      const params = new URLSearchParams(search);
      const redirectUri = params.get("redirectUri");

      if (!redirectUri) {
        loading?.hide?.();
        return;
      }

      const url = new URL(decodeURIComponent(redirectUri));

      if (
        [window.location.hostname, "admin.shopify.com"].includes(
          url.hostname
        ) ||
        url.hostname.endsWith(".myshopify.com")
      ) {
        window.open(url, "_top");
      } else {
        setShowWarning(true);
        loading?.hide?.();
      }
    }
    return () => {
      const loading = shopify.loading as
        | { show?: () => void; hide?: () => void }
        | undefined;
      loading?.hide?.();
    };
  }, [shopify, search]);

  return showWarning ? (
    <s-page>
      <Layout>
        <Layout.Section>
          <s-grid>
            <s-banner heading="Redirecting outside of Shopify" tone="warning">
              Apps can only use /exitiframe to reach Shopify or the app itself.
            </s-banner>
          </s-grid>
        </Layout.Section>
      </Layout>
    </s-page>
  ) : null;
}
