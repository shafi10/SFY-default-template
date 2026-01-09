import { callGetPathaoPickupLocationList } from "../apis/configCourier";
import useFetchQuery from "../hooks/useGlobalQuery";

interface ShopSetupResponse {
  success: boolean;
  message: string;
}

export default function HomePage() {
  const {} = useFetchQuery<ShopSetupResponse>({
    apiEndpoint: "/api/shop",
    apiKey: "shop-setup",
  });

  return (
    <s-page>
      <s-button onClick={callGetPathaoPickupLocationList}>Test</s-button>
    </s-page>
  );
}
