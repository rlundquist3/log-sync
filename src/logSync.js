import { parseNotes } from "./parseNotes";
import { syncWithDatabase } from "./syncWithDatabase";

export const logSync = async () => {
  console.log("Initialized");

  const db = inkdrop.main.dataStore.getLocalDB();
  const sendsTag = await db.tags.findWithName("sends!");
  const syncedTag = await db.tags.findWithName("synced");

  // TODO: actually paginate and query
  const notesWithSends = (
    await db.notes.findWithTag(sendsTag._id, {
      limit: 1000,
    })
  ).docs.filter(({ tags }) => !tags.includes(syncedTag._id));
  console.log(`${notesWithSends.length} sessions to sync`);

  const parsedClimbs = parseNotes(notesWithSends);

  await syncWithDatabase(parsedClimbs);

  const noteIds = notesWithSends.map(({ _id }) => _id);
  await db.utils.setTagsBatch(noteIds, [syncedTag._id]);
};
