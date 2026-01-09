import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <s-page>
      <s-section accessibilityLabel="404 Not Found section">
        <s-grid gap="base" justifyItems="center" paddingBlock="large-400">
          <s-box maxInlineSize="200px" maxBlockSize="200px">
            <s-image
              aspectRatio="1/1"
              src="https://cdn.shopify.com/static/images/polaris/patterns/callout.png"
              alt="404 Not Found"
            />
          </s-box>
          <s-grid justifyItems="center" maxInlineSize="450px" gap="base">
            <s-stack alignItems="center" gap="base">
              <s-heading>404</s-heading>
              <s-heading>{t("NotFound.heading")}</s-heading>
              <s-paragraph>{t("NotFound.description")}</s-paragraph>
            </s-stack>
            <s-button-group>
              <s-button
                slot="primary-action"
                aria-label="Go to home page"
                onClick={() => navigate("/")}
              >
                Go to home
              </s-button>
            </s-button-group>
          </s-grid>
        </s-grid>
      </s-section>
    </s-page>
  );
}
