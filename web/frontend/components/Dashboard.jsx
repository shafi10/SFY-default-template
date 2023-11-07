import React from "react";
import { Spinners } from "./index";
import { useShopQuery } from "../hooks";
import { Banner } from "@shopify/polaris";

export function Dashboard() {
  const { isLoading, isError } = useShopQuery({
    url: "/api/shop",
  });

  return (
    <>
      {isLoading && !isError ? (
        <Spinners />
      ) : (
        <>
          {isError ? (
            <Banner title="Error">
              <p>
                An error occurred while processing this Page. Please try again
                later.
              </p>
            </Banner>
          ) : (
            <>
              <div>Hello from app</div>
            </>
          )}
        </>
      )}
    </>
  );
}
