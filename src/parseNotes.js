const gradeRegEx = /(5\.\d+[a-d]|V\d+)/;

export const parseNotes = (notes) =>
  notes
    .map((note) => {
      const sendsSection = note.body.split(/\*\*noteworthy sends:\*\*/i)[1];
      if (!!sendsSection) {
        const sends = sendsSection
          .split(/(-|\n)/)
          .filter((s) => !!s.match(gradeRegEx));

        // Hack for paper log dates
        let year;
        const { title } = note;
        if (title.includes("Old Paper Logs")) {
          const yearsFromPaperLogs = ["2020", "2021", "2022", "2023"];
          let index = 0;
          while (!year) {
            if (title.indexOf(yearsFromPaperLogs[index]) !== -1) {
              year = yearsFromPaperLogs[index];
            }
            index += 1;
          }
        }

        return sends.map((s) => {
          const grade = s.match(gradeRegEx)[0];
          return {
            name: s.replace(`, ${grade}`, "").trim(),
            grade,
            sendDate: year ?? new Date(note.createdAt),
          };
        });
      }

      return null;
    })
    .filter((s) => !!s)
    .flat();
