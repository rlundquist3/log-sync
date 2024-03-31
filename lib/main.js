'use strict';

require('react');
require('inkdrop');
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
        grade
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
    grade
  }) => ({
    name,
    grade,
    type: !!grade.match(/V\d+/) ? "boulder" : "sport"
  }));
  const {
    data
  } = await client.mutation(createClimbsMutation, {
    input
  });
  console.log(`${data?.createClimbs?.info?.nodesCreated} sends added to database`);
};

const logSync = async () => {
  console.log("Initialized");
  const db = inkdrop.main.dataStore.getLocalDB();
  const sendsTag = await db.tags.findWithName("sends!");
  const syncedTag = await db.tags.findWithName("synced");

  // TODO: actually paginate and query
  const notesWithSends = (await db.notes.findWithTag(sendsTag._id, {
    limit: 1000
  })).docs.filter(({
    tags
  }) => !tags.includes(syncedTag._id));
  console.log(notesWithSends);
  console.log(`${notesWithSends.length} sessions to sync`);
  const parsedClimbs = parseNotes(notesWithSends);
  console.log("parsed", parsedClimbs);
  await syncWithDatabase(parsedClimbs);
  const noteIds = notesWithSends.map(({
    _id
  }) => _id);
  await db.utils.setTagsBatch(noteIds, [syncedTag._id]);
};

module.exports = {
  activate() {
    // inkdrop.components.registerClass(LogSyncMessageDialog);
    // inkdrop.layouts.addComponentToLayout("modal", "LogSyncMessageDialog");
    logSync();
  },
  deactivate() {
    // inkdrop.layouts.removeComponentFromLayout("modal", "LogSyncMessageDialog");
    // inkdrop.components.deleteClass(LogSyncMessageDialog);
  }
};
//# sourceMappingURL=main.js.map
