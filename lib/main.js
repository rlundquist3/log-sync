"use babel";

import LogSyncMessageDialog from "./log-sync-message-dialog";
import { logSync } from "./logSync";

module.exports = {
  activate() {
    // inkdrop.components.registerClass(LogSyncMessageDialog);
    // inkdrop.layouts.addComponentToLayout("modal", "LogSyncMessageDialog");
    logSync();
  },

  deactivate() {
    // inkdrop.layouts.removeComponentFromLayout("modal", "LogSyncMessageDialog");
    // inkdrop.components.deleteClass(LogSyncMessageDialog);
  },
};
