// Shopify Shop Response Types
export interface ShopifyShopResponse {
  data: ShopifyShop[];
}

export interface ShopifyShop {
  id: number;
  name: string;
  email: string;
  currency: string;
  domain?: string;
  myshopify_domain?: string;
  plan_name?: string;
  plan_display_name?: string;
  shop_owner?: string;
  country_code?: string;
  country_name?: string;
  timezone?: string;
}

export interface ShopData {
  id: number;
  name: string;
  email: string;
  currencyCode: string;
}

// Extend Express Request/Response types
declare global {
  namespace Express {
    interface Locals {
      shopify: {
        session: any; // Replace with Session type from @shopify/shopify-api if available
      };
    }
  }
}
