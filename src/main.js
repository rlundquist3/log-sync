import { logSync } from "./logSync";
import { clearDatabase } from "./clearDatabase";

module.exports = {
  activate() {
    inkdrop.commands.add(document.body, "climb-log:sync", logSync);
    inkdrop.commands.add(
      document.body,
      "climb-log:clear-and-restore",
      async () => {
        await clearDatabase();
        await logSync();
      }
    );

    inkdrop.menu.update();
    logSync();
  },

  deactivate() {},
};
