import User from "./user";
import EpicSession from "./epic/epic-session";

(async () => {
  const user = new User();
  await user.initialize();

  const session = new EpicSession(user);
  await session.initialize();
})();

setTimeout(process.exit, 120000);