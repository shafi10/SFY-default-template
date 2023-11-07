import { Spinner } from "@shopify/polaris";
import React from "react";

export function Spinners({ size = "small" }) {
  return <Spinner accessibilityLabel="Small spinner example" size={size} />;
}
