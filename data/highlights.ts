// "Most likely to..." highlights, filled in by the class. Each award can be left
// without winners (it shows "Winner to be announced").
//
// To fill one in, put the winner's exact `name` from data/studentsData.ts in
// `winners` (one or several). The build fails with a clear message if a name
// doesn't match a profile. `reason` is optional: a short line shown under the
// winners. Winners also get a badge on their profile. To add an award, copy an
// entry and give it a new `id` and `title`; `group` decides which heading it
// appears under on the Highlights page. Keep awards positive.
//
// Example:
//   { id: "tutorial-master", group: ACADEMICS, title: "Tutorial Master",
//     winners: ["Stephanie Emenike"], reason: "Explained it better than the lecturer." },

export interface Award {
  id: string;
  /** Heading the award appears under on the Highlights page. */
  group: string;
  title: string;
  /** Exact names from data/studentsData.ts. Leave empty until decided. */
  winners: string[];
  /** Optional line under the winners. */
  reason?: string;
}

const ACADEMICS = "Academics & Career";
const CAMPUS = "Campus & Personality";

export const awards: Award[] = [
  // ---- Academics & Career
  { id: "class-genius", group: ACADEMICS, title: "Class Genius", winners: [] },
  { id: "tutorial-master", group: ACADEMICS, title: "Tutorial Master", winners: [] },
  { id: "best-coder", group: ACADEMICS, title: "Best Coder", winners: [] },
  { id: "hardware-whiz", group: ACADEMICS, title: "Hardware Whiz", winners: [] },
  { id: "group-project-mvp", group: ACADEMICS, title: "Group Project MVP", winners: [] },
  { id: "most-hardworking", group: ACADEMICS, title: "Most Hardworking", winners: [] },
  { id: "quiet-genius", group: ACADEMICS, title: "Quiet Genius", winners: [] },
  { id: "most-likely-ceo-or-billionaire", group: ACADEMICS, title: "Most Likely to Be a CEO or Billionaire", winners: [] },
  { id: "most-likely-start-a-startup", group: ACADEMICS, title: "Most Likely to Start a Startup", winners: [] },
  { id: "most-likely-big-tech", group: ACADEMICS, title: "Most Likely to Work at Big Tech", winners: [] },
  { id: "most-likely-japa", group: ACADEMICS, title: "Most Likely to Japa", winners: [] },
  { id: "most-likely-fashion", group: ACADEMICS, title: "Most Likely to Make It in Fashion", winners: [] },
  { id: "most-likely-content-creator", group: ACADEMICS, title: "Most Likely to Become a Content Creator", winners: [] },
  { id: "most-likely-footballer", group: ACADEMICS, title: "Most Likely to Become a Footballer", winners: [] },
  { id: "most-likely-athlete", group: ACADEMICS, title: "Most Likely to Become an Athlete", winners: [] },
  { id: "most-likely-marry-first-boy", group: ACADEMICS, title: "Most Likely to Marry First (Boy)", winners: [] },
  { id: "most-likely-marry-first-girl", group: ACADEMICS, title: "Most Likely to Marry First (Girl)", winners: [] },

  // ---- Campus & Personality
  { id: "most-clutchest-boy", group: CAMPUS, title: "Most Clutch-est (Boy)", winners: [] },
  { id: "most-clutchest-girl", group: CAMPUS, title: "Most Clutch-est (Girl)", winners: [] },
  { id: "class-clown", group: CAMPUS, title: "Class Clown", winners: [] },
  { id: "best-dressed-boy", group: CAMPUS, title: "Best Dressed (Boy)", winners: [] },
  { id: "best-dressed-girl", group: CAMPUS, title: "Best Dressed (Girl)", winners: [] },
  { id: "biggest-hustler", group: CAMPUS, title: "Biggest Hustler", winners: [] },
  { id: "funniest", group: CAMPUS, title: "Funniest", winners: [] },
  { id: "kindest", group: CAMPUS, title: "Kindest", winners: [] },
  { id: "glow-up-of-the-year-boy", group: CAMPUS, title: "Glow-Up of the Year (Boy)", winners: [] },
  { id: "glow-up-of-the-year-girl", group: CAMPUS, title: "Glow-Up of the Year (Girl)", winners: [] },
  { id: "most-punctual-boy", group: CAMPUS, title: "Most Punctual (Boy)", winners: [] },
  { id: "most-punctual-girl", group: CAMPUS, title: "Most Punctual (Girl)", winners: [] },
];
