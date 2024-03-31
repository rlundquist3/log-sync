import React, { useEffect, useCallback } from "react";
import { logger, useModal } from "inkdrop";

const LogSyncMessageDialog = (props) => {
  const modal = useModal();
  const { Dialog } = inkdrop.components.classes;

  const toggle = useCallback(() => {
    modal.show();
    logger.debug("LogSync was toggled!");
  }, []);

  useEffect(() => {
    const sub = inkdrop.commands.add(document.body, {
      "log-sync:toggle": toggle,
    });
    return () => sub.dispose();
  }, [toggle]);

  return (
    <Dialog {...modal.state} onBackdropClick={modal.close}>
      <Dialog.Title>LogSync</Dialog.Title>
      <Dialog.Content>LogSync was toggled!</Dialog.Content>
      <Dialog.Actions>
        <button className="ui button" onClick={modal.close}>
          Close
        </button>
      </Dialog.Actions>
    </Dialog>
  );
};

export default LogSyncMessageDialog;
