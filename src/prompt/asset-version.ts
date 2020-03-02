import menu from "console-menu";
import { GetEngineVersionsForItem, IEpicAssetDetail, IEpicAssetVersion } from "../epic/requests";

export interface IDownloadDetails {
  assetId: string;
  versionId: string;
}

export async function GetAssetAndVersionToDownload(assets: IEpicAssetDetail[]): Promise<IDownloadDetails> {
  var helpMessage = "Scroll using Up/Down, arrow keys, or Page Up / Page Down. Press CTRL+C to quit.";

  const asset: IEpicAssetDetail | undefined = await menu(assets, { header: "Select a Marketplace Asset to Download", pageSize: 10, border: true, helpMessage: helpMessage });

  if (asset == undefined) {
    process.exit(0); // Control+C
  }

  const versions = GetEngineVersionsForItem(asset);
  const version: IEpicAssetVersion | undefined = await menu(versions, { header: asset.title + " - Choose Engine Version", border: true, helpMessage: helpMessage });

  if (version == undefined) {
    process.exit(0); // Control+C
  }

  return {
    assetId: asset.id,
    versionId: version.appId,
  };
}