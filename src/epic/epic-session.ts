import axios, { AxiosInstance } from "axios";
import axiosCookieJarSupport from "axios-cookiejar-support";
import tough from "tough-cookie";

import User from "../user";
import {
  InitializeSessionCookies,
  InitializeUserSession,
  IEpicOauthResponse
} from "./requests";
import { GetOwnedAssets, IEpicAssetDetail } from "./requests/get-owned-assets";

export default class EpicSession {
  private user: User;
  private transport: AxiosInstance;
  private sessionDetails: IEpicOauthResponse | null;
  private assets: IEpicAssetDetail[];

  constructor(user: User) {
    this.sessionDetails = null;
    this.assets = [];
    this.user = user;
    this.transport = axios.create({
      withCredentials: true,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) EpicGamesLauncher/10.13.1-11497744+++Portal+Release-Live UnrealEngine/4.23.0-11497744+++Portal+Release-Live Chrome/59.0.3071.15 Safari/537.36",
      },
      validateStatus: () => true
    });
    axiosCookieJarSupport(this.transport);
    this.transport.defaults.jar = new tough.CookieJar();
  }

  public async initialize() {
    await InitializeSessionCookies(this.transport);
    this.sessionDetails = await InitializeUserSession(this.transport, this.user);
  }

  public async getAssets() {
    if (!this.sessionDetails) {
      throw new Error("You haven't logged in yet? Shouldn't be possible");
    }

    this.assets = await GetOwnedAssets(this.transport, this.sessionDetails);
  }
}
