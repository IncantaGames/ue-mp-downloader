import { AxiosInstance } from "axios";
import { IEpicOauthResponse } from "./epic-oauth-response";

export interface IEpicAsset {
  appName: string;
  labelName: string;
  buildVersion: string;
  catalogItemId: string;
  namespace: string;
  assetId: string;
}

export interface IEpicAssetDetail {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  technicalDetails: string; // html
  keyImages: Array<{
    type: string;
    url: string;
    md5: string;
    width: number;
    height: number;
    size: number;
    uploadedDate: string; // iso format
  }>;
  categories: Array<{
    path: string;
  }>;
  namespace: string;
  status: string;
  creationDate: string; // iso format
  lastModifiedDate: string; // iso format
  entitlementName: string;
  entitlementType: string;
  itemType: string;
  releaseInfo: Array<{
    id: string;
    appId: string;
    compatibleApps?: string[];
    platform: string[];
    dateAdded: string; // iso format
    releaseNote: string;
    versionTitle: string;
  }>;
  developer: string;
  developerId: string;
  endOfSupport: boolean;
  unsearchable: boolean;
}

export interface IEpicAssetVersion {
  title: string;
  appId: string;
  version: string;
  minorVersion: number;
};

export function GetEngineVersionsForItem(detail: IEpicAssetDetail): IEpicAssetVersion[] {
  const versions: IEpicAssetVersion[] = [];

  detail.releaseInfo.forEach((releaseInfo) => {
    if (releaseInfo.compatibleApps) {
      releaseInfo.compatibleApps.forEach((compatibleApp) => {
        var minorVersion = Number(compatibleApp.replace("UE_4.", ""));
        versions.push({
          title: `4.${minorVersion}`,
          appId: releaseInfo.appId,
          version: compatibleApp,
          minorVersion: minorVersion
        });
      });
    }
  });

  // Sorts latest version first
  versions.sort((a, b) => {
    if (a.minorVersion > b.minorVersion) return -1;
    if (a.minorVersion < b.minorVersion) return 1;
    return 0;
  });

  return versions;
}

export async function GetOwnedAssets(transport: AxiosInstance, sessionDetails: IEpicOauthResponse): Promise<IEpicAssetDetail[]> {
  const assetsResponse = await transport.get("https://launcher-public-service-prod06.ol.epicgames.com/launcher/api/public/assets/Windows?label=Live", {
    headers: {
      Authorization: `${sessionDetails.token_type} ${sessionDetails.access_token}`
    }
  });

  if (assetsResponse.status !== 200) {
    throw new Error("Couldn't get the assets");
  }

  // filter out the non-ue namespace as well as the engine itself to reduce requests
  const assets = (assetsResponse.data as IEpicAsset[]).filter(a => a.namespace === "ue" && a.assetId !== "UE");

  if (assets.length === 0) {
    throw new Error("Failed to fetch owned assets. This might be because you need to accept the Epic Launcher EULA for your account, or you own zero assets.");
  }

  const detailedAssets: IEpicAssetDetail[] = [];

  // lets do this in serial to make sure session handshakes are okay
  for (const asset of assets) {
    const detailResponse = await transport.get(`https://catalog-public-service-prod06.ol.epicgames.com/catalog/api/shared/bulk/items?id=${asset.catalogItemId}&includeDLCDetails=false&includeMainGameDetails=false&country=US&locale=en`, {
      headers: {
        Authorization: `${sessionDetails.token_type} ${sessionDetails.access_token}`
      }
    });

    if (detailResponse.status !== 200) {
      throw new Error(`Couldn't get detail response for asset ${asset.assetId}`);
    }

    const detail = (detailResponse.data as {[key: string]: IEpicAssetDetail})[asset.catalogItemId];

    const isAsset = detail.categories.find((cat) => {
      return (cat.path === "assets" || cat.path === "projects" || cat.path === "plugins")
    }) !== undefined;

    if (isAsset) {
      detailedAssets.push(detail);
    }
  }

  // Sort items alphabetically
  detailedAssets.sort((a, b) => {
    if (a.title < b.title) return -1;
    if (a.title > b.title) return 1;
    return 0;
  });

  return detailedAssets;
}