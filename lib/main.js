'use strict';

require('react');
require('inkdrop');

const gradeRegEx = /(5\.\d+[a-d]|V\d+)/;
const parseNotes = async notes => notes.map(note => {
  const sendsSection = note.body.split(/\*\*noteworthy sends:\*\*/i)[1];
  if (!!sendsSection) {
    const sends = sendsSection.split(/(-|\n)/).filter(s => !!s.match(gradeRegEx));
    console.log(sends);
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

const logSync = async () => {
  console.log("Initialized");
  const db = inkdrop.main.dataStore.getLocalDB();
  const sendsTag = await db.tags.findWithName("sends!");

  // TODO: actually paginate and query
  const notesWithSends = await db.notes.findWithTag(sendsTag._id, {
    limit: 1000
  });
  const parsedNotes = parseNotes(notesWithSends.docs);
  console.log("parsed", parsedNotes);
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
