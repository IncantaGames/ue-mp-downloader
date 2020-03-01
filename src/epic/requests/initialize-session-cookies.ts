import { AxiosInstance } from "axios";

export async function InitializeSessionCookies(transport: AxiosInstance) {
  // various requests to fill the cookie jar, yum!
  await transport.get("https://www.epicgames.com/id/login");
  await transport.get("https://tracking.epicgames.com/tracking.js");
  await transport.get("https://www.epicgames.com/id/api/i18n");
  await transport.get("https://www.epicgames.com/id/api/reputation");
  await transport.get("https://www.epicgames.com/id/api/location");
  await transport.get("https://www.epicgames.com/id/api/authenticate");
  await transport.get("https://www.epicgames.com/id/api/analytics");
}
