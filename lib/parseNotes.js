const gradeRegEx = /(5\.\d+[a-d]|V\d+)/;

const parseNotes = async (notes) =>
  notes
    .map((note) => {
      const sendsSection = note.body.split(/\*\*noteworthy sends:\*\*/i)[1];
      if (!!sendsSection) {
        const sends = sendsSection
          .split(/(-|\n)/)
          .filter((s) => !!s.match(gradeRegEx));
        console.log(sends);

        return sends.map((s) => {
          const grade = s.match(gradeRegEx)[0];
          return {
            name: s.replace(`, ${grade}`, "").trim(),
            grade,
          };
        });
      }

      return null;
    })
    .filter((s) => !!s)
    .flat();

module.exports = {
  parseNotes,
};
