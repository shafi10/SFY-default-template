import { DeliveryMethod } from "@shopify/shopify-api";

/**
 * @type {{[key: string]: import("@shopify/shopify-api").WebhookHandler}}
 */
export default {
  CUSTOMERS_DATA_REQUEST: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/api/webhooks",
    callback: async (topic: any, shop: any, body: any, webhookId: any) => {
      try {
        const payload = JSON.parse(body);
      } catch (error) {
        console.error("Error handling CUSTOMERS_DATA_REQUEST:", error);
      }
    },
  },

  CUSTOMERS_REDACT: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/api/webhooks",
    callback: async (topic: any, shop: any, body: any, webhookId: any) => {
      try {
        const payload = JSON.parse(body);
      } catch (error) {
        console.error("Error handling CUSTOMERS_DATA_REQUEST:", error);
      }
    },
  },

  SHOP_REDACT: {
    deliveryMethod: DeliveryMethod.Http,
    callbackUrl: "/api/webhooks",
    callback: async (topic: any, shop: any, body: any, webhookId: any) => {
      try {
        const payload = JSON.parse(body);
      } catch (error) {
        console.error("Error handling CUSTOMERS_DATA_REQUEST:", error);
      }
    },
  },
};
