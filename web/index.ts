import { join } from "path";
import { readFileSync } from "fs";
import express, { Request, Response, NextFunction } from "express";
import serveStatic from "serve-static";
import shopify from "./shopify";
import GDPRWebhookHandlers from "./gdpr";
import type { ShopData, ShopifyShopResponse } from "./types";

const PORT: number = parseInt(
  process.env.BACKEND_PORT || process.env.PORT || "3000",
  10
);

const STATIC_PATH: string =
  process.env.NODE_ENV === "production"
    ? `${process.cwd()}/frontend/dist`
    : `${process.cwd()}/frontend/`;

const app = express();

// Set up Shopify authentication and webhook handling
app.get(shopify.config.auth.path, shopify.auth.begin());
app.get(
  shopify.config.auth.callbackPath,
  shopify.auth.callback(),
  shopify.redirectToShopifyOrAppRoot()
);
app.post(
  shopify.config.webhooks.path,
  // GDPRWebhookHandlers has a deliveryMethod typing that is incompatible with the
  // library's expected DeliveryMethod.Http type, so assert to any here to satisfy the signature.
  shopify.processWebhooks({ webhookHandlers: GDPRWebhookHandlers as any })
);

// If you are adding routes outside of the /api path, remember to
// also add a proxy rule for them in web/frontend/vite.config.js

app.use("/api/*", shopify.validateAuthenticatedSession());

app.use(express.json());

app.get("/api/shop", async (_req: Request, res: Response): Promise<void> => {
  const response: any = await shopify.api.rest.Shop.all({
    session: res.locals.shopify.session,
  });

  const shop: ShopData = {
    id: response?.data[0]?.id,
    name: response.data[0]?.name,
    email: response.data[0]?.email,
    currencyCode: response.data[0]?.currency,
  };

  res.status(200).send(shop);
});

app.use(shopify.cspHeaders());
app.use(serveStatic(STATIC_PATH, { index: false }));

app.use(
  "/*",
  shopify.ensureInstalledOnShop(),
  async (
    _req: Request,
    res: Response,
    _next: NextFunction
  ): Promise<Response> => {
    return res
      .status(200)
      .set("Content-Type", "text/html")
      .send(readFileSync(join(STATIC_PATH, "index.html")));
  }
);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
