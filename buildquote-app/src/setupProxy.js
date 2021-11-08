import { createProxyMiddleware } from "http-proxy-middleware";

const context = ["/api"];

export default function (app) {
  const appProxy = createProxyMiddleware(context, {
    target: "https://localhost:5001",
    secure: false,
  });

  app.use(appProxy);
}
