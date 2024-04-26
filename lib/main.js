'use strict';

var core = require('@urql/core');

const gradeRegEx = /(5\.\d+[a-d]|V\d+)/;
const parseNotes = notes => notes.map(note => {
  const sendsSection = note.body.split(/\*\*noteworthy sends:\*\*/i)[1];
  if (!!sendsSection) {
    const sends = sendsSection.split(/(-|\n)/).filter(s => !!s.match(gradeRegEx));
    return sends.map(s => {
      const grade = s.match(gradeRegEx)[0];
      return {
        name: s.replace(`, ${grade}`, "").trim(),
        grade,
        sendDate: new Date(note.createdAt)
      };
    });
  }
  return null;
}).filter(s => !!s).flat();

const client = new core.Client({
  url: "https://climb-log-api.vercel.app/graphql",
  exchanges: [core.fetchExchange]
});

const createClimbsMutation = core.gql`
  mutation CreateClimbs($input: [ClimbCreateInput!]!) {
    createClimbs(input: $input) {
      climbs {
        id
      }
      info {
        nodesCreated
      }
    }
  }
`;
const syncWithDatabase = async climbs => {
  const input = climbs.map(({
    name,
    grade,
    sendDate
  }) => ({
    name,
    grade,
    type: !!grade.match(/V\d+/) ? "boulder" : "sport",
    sendDate,
    source: "inkdrop"
  }));
  const {
    data
  } = await client.mutation(createClimbsMutation, {
    input
  });
  console.log(`${data?.createClimbs?.info?.nodesCreated} sends added to database`);
};

const logSync = async () => {
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
      updatedAt: Number(new Date())
    });
    syncedTag = await db.tags.findWithName("synced");
  }

  // TODO: actually paginate and query
  const notesWithSends = (await db.notes.findWithTag(sendsTag._id, {
    limit: 1000
  })).docs.filter(({
    tags
  }) => !tags.includes(syncedTag._id));
  console.log(`${notesWithSends.length} sessions sync`);
  const parsedClimbs = parseNotes(notesWithSends);
  await syncWithDatabase(parsedClimbs);
  const noteIds = notesWithSends.map(({
    _id
  }) => _id);
  await db.utils.setTagsBatch(noteIds, [syncedTag._id]);
};

const deleteAllClimbsMutation = core.gql`
  mutation DeleteAllClimbs($where: ClimbWhere) {
    deleteClimbs(where: $where) {
      nodesDeleted
    }
  }
`;
const clearDatabase = async () => {
  const {
    data
  } = await client.mutation(deleteAllClimbsMutation, {
    where: {
      source: "inkdrop"
    }
  });
  console.log(`${data?.deleteClimbs?.nodesDeleted} sends deleted from database`);
  const db = inkdrop.main.dataStore.getLocalDB();
  const syncedTag = await db.tags.findWithName("synced");
  await db.utils.deleteTag(syncedTag._id);
  console.log("Removed synced tag");
};

module.exports = {
  activate() {
    inkdrop.commands.add(document.body, "climb-log:sync", logSync);
    inkdrop.commands.add(document.body, "climb-log:clear-and-restore", async () => {
      await clearDatabase();
      await logSync();
    });
    inkdrop.menu.update();
    logSync();
  },
  deactivate() {}
};
//# sourceMappingURL=main.js.map
