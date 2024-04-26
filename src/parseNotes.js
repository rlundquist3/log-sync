const gradeRegEx = /(5\.\d+[a-d]|V\d+)/;

export const parseNotes = (notes) =>
  notes
    .map((note) => {
      const sendsSection = note.body.split(/\*\*noteworthy sends:\*\*/i)[1];
      if (!!sendsSection) {
        const sends = sendsSection
          .split(/(-|\n)/)
          .filter((s) => !!s.match(gradeRegEx));

        return sends.map((s) => {
          const grade = s.match(gradeRegEx)[0];
          return {
            name: s.replace(`, ${grade}`, "").trim(),
            grade,
            sendDate: new Date(note.createdAt),
          };
        });
      }

      return null;
    })
    .filter((s) => !!s)
    .flat();
