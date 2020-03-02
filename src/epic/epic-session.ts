import axios, { AxiosInstance } from "axios";
import axiosCookieJarSupport from "axios-cookiejar-support";
import tough from "tough-cookie";
import path from "path";

import User from "../prompt/user";
import {
  InitializeSessionCookies,
  InitializeUserSession,
  IEpicOauthResponse,
  GetItemBuildInfo,
  GetItemManifest,
  BuildItemChunkListFromManifest,
  DownloadItemChunkList,
  ExtractAssetFilesFromChunks
} from "./requests";
import { GetOwnedAssets, IEpicAssetDetail } from "./requests/get-owned-assets";
import { IDownloadDetails } from "../prompt/asset-version";

export default class EpicSession {
  private user: User;
  private transport: AxiosInstance;
  private sessionDetails: IEpicOauthResponse | null;
  public assets: IEpicAssetDetail[];

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

  public async downloadAsset(details: IDownloadDetails) {
    if (!this.sessionDetails) {
      throw new Error("You haven't logged in yet? Shouldn't be possible");
    }

    const downloadDir = path.resolve("./download");

    const buildInfo = await GetItemBuildInfo(this.transport, this.sessionDetails, details);
    const manifest = await GetItemManifest(this.transport, buildInfo);
    const chunkList = BuildItemChunkListFromManifest(buildInfo, manifest);
    const chunkDir = await DownloadItemChunkList(this.transport, manifest, chunkList, downloadDir);
    await ExtractAssetFilesFromChunks(manifest, chunkDir);
  }
}
