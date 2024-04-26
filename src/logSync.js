import { parseNotes } from "./parseNotes";
import { syncWithDatabase } from "./syncWithDatabase";

export const logSync = async () => {
  console.log("Staring log sync");

  const db = inkdrop.main.dataStore.getLocalDB();
  const sendsTag = await db.tags.findWithName("sends!");
  let syncedTag = await db.tags.findWithName("synced");
  if (!syncedTag) {
    console.log("Database cleared - creating new synced tag");
    await db.tags.put({
      _id: await db.tags.createId(),
      name: "synced",
      color: "default",
      count: 0,
      createdAt: Number(new Date()),
      updatedAt: Number(new Date()),
    });
    syncedTag = await db.tags.findWithName("synced");
  }

  // TODO: actually paginate and query
  const notesWithSends = (
    await db.notes.findWithTag(sendsTag._id, {
      limit: 1000,
    })
  ).docs.filter(({ tags }) => !tags.includes(syncedTag._id));
  console.log(`${notesWithSends.length} sessions sync`);

  const parsedClimbs = parseNotes(notesWithSends);

  await syncWithDatabase(parsedClimbs);

  const noteIds = notesWithSends.map(({ _id }) => _id);
  await db.utils.setTagsBatch(noteIds, [syncedTag._id]);
};
