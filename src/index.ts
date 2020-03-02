import User from "./prompt/user";
import EpicSession from "./epic/epic-session";
import { GetAssetAndVersionToDownload } from "./prompt/asset-version";

(async () => {
  const user = new User();
  await user.initialize();

  const session = new EpicSession(user);
  await session.initialize();
  await session.getAssets();

  while (true) {
    const downloadDetails = await GetAssetAndVersionToDownload(session.assets);

    await session.downloadAsset(downloadDetails);
  }
})();
