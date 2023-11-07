import { Page } from "@shopify/polaris";
import { Dashboard } from "../components";

export default function HomePage() {
  return (
    <Page title="Default temp" fullWidth>
      <Dashboard />
    </Page>
  );
}
