// "Most likely to..." highlights, filled in by the class. Each award can be left
// without winners (it shows "Winner to be announced").
//
// To fill one in, put the winner's exact `name` from data/studentsData.ts in
// `winners` (one or several). The build fails with a clear message if a name
// doesn't match a profile. `reason` is optional: a short line shown under the
// winners. Winners also get a badge on their profile. To add an award, copy an
// entry and give it a new `id` and `title`. Keep awards positive.
//
// Example:
//   { id: "tutorial-master", title: "Tutorial Master",
//     winners: ["Stephanie Emenike"], reason: "Explained it better than the lecturer." },

export interface Award {
  id: string;
  title: string;
  /** Exact names from data/studentsData.ts. Leave empty until decided. */
  winners: string[];
  /** Optional line under the winners. */
  reason?: string;
}

export const awards: Award[] = [
  { id: "tutorial-master", title: "Tutorial Master", winners: [] },
  { id: "first-out-of-class", title: "First Out of Class", winners: [] },
  { id: "most-opinionated", title: "Most Opinionated", winners: [] },
  { id: "most-likely-to-run-samsung", title: "Most Likely to Run the Next Samsung", winners: [] },
  { id: "class-coder", title: "Class Coder", winners: [] },
  { id: "fashion-icons", title: "Fashion Icons", winners: [] },
  { id: "robot-builders", title: "Most Likely to Build the Robots", winners: [] },
  { id: "cyber-guardians", title: "Most Likely to Secure Your Network", winners: [] },
  { id: "kindest", title: "Kindest", winners: [] },
  { id: "most-bubbly", title: "Most Bubbly", winners: [] },
  { id: "most-positive", title: "Most Positive", winners: [] },
];
