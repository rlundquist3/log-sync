"use babel";
import { parseNotes } from "./parseNotes";

const logSync = async () => {
  console.log("Initialized");

  const db = inkdrop.main.dataStore.getLocalDB();
  const sendsTag = await db.tags.findWithName("sends!");

  // TODO: actually paginate and query
  const notesWithSends = await db.notes.findWithTag(sendsTag._id, {
    limit: 1000,
  });

  const parsedNotes = parseNotes(notesWithSends.docs);
  console.log("parsed", parsedNotes);
};

module.exports = {
  logSync,
};
