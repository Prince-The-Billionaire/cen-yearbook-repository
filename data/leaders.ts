// Leadership roles people in the class have held. Unlike the Highlights awards these are
// positions, not votes.
//
// `holder` is the exact `name` from data/studentsData.ts; the build fails with a clear
// message if it doesn't match a profile. Someone without a profile (for example a
// graduate who isn't in the yearbook directory) can be listed with `noProfile: true`;
// they then show as plain text. `title` is also the badge shown on the person's profile,
// so it should make sense on its own. To add a role, copy an entry; `group` decides which
// heading it appears under on the Leaders page.

export interface Role {
  id: string;
  /** Heading the role appears under on the Leaders page. */
  group: string;
  /** Short and self-contained: it is also the badge on the profile. */
  title: string;
  holder: string;
  /** Set for someone who has no profile on the site. */
  noProfile?: boolean;
  /** Optional line under the holder. */
  note?: string;
}

const CLASS = "The Class";
const AEIES = "AEIES Executive, 2025/2026 Session";
const PAST = "Past AEIES Executives";
const CAMPUS = "Campus Leadership";

export const roles: Role[] = [
  // ---- The Class
  { id: "course-rep-male", group: CLASS, title: "Male Course Rep", holder: "Oladipupo David" },
  { id: "course-rep-female", group: CLASS, title: "Female Course Rep", holder: "Ayoola Oreofeoluwa Praise" },
  { id: "course-rep-former", group: CLASS, title: "Former Course Rep", holder: "Kadeba Oluwapelumi Ayobami" },

  // ---- AEIES Executive
  { id: "aeies-president", group: AEIES, title: "AEIES President (2025/2026)", holder: "Kadeba Oluwapelumi Ayobami" },
  { id: "aeies-vp", group: AEIES, title: "AEIES Vice President (2025/2026)", holder: "Ayoola Oreofeoluwa Praise" },
  { id: "aeies-welfare", group: AEIES, title: "AEIES Welfare Officer (2025/2026)", holder: "Akinwunmi Naomi" },
  { id: "aeies-academic", group: AEIES, title: "AEIES Academic Officer (2025/2026)", holder: "Genesis Oghenetejiri Ighomwaye" },
  { id: "aeies-pro", group: AEIES, title: "AEIES PRO (2025/2026)", holder: "Toyin-Apata Oluwateniola" },
  { id: "aeies-financial-secretary", group: AEIES, title: "AEIES Financial Secretary (2025/2026)", holder: "Etta Queendolin-Effa Emmanuel" },

  // ---- Past AEIES Executives
  { id: "aeies-exec-secretary-former", group: PAST, title: "Former AEIES Executive Secretary", holder: "Edionwe Osagie Precious" },
  { id: "aeies-vp-former", group: PAST, title: "Former AEIES Vice President", holder: "Edionwe Osagie Precious" },
  { id: "aeies-academic-former", group: PAST, title: "Former AEIES Academic Officer", holder: "Ngorka Uchechukwu Gerald" },

  // ---- Campus Leadership
  { id: "cuet-head", group: CAMPUS, title: "Head of CUET", holder: "Rhema Teniade Adefarakan", note: "Covenant University Evangelism Team" },
  { id: "cutg-director", group: CAMPUS, title: "Director of CUTG", holder: "EGERE JOSHUA CHIBUGOM", note: "Covenant University Theatre Group" },
  { id: "technical-unit-head", group: CAMPUS, title: "Head of Technical Unit", holder: "Inim Bright Kudos", note: "Covenant University" },
  { id: "student-council-community", group: CAMPUS, title: "Student Council Community Development Officer", holder: "Edionwe Osagie Precious" },
  { id: "basketball-male-coach", group: CAMPUS, title: "CU Basketball Team Male Coach", holder: "Ekundayo Shalom Chuwkuma" },
  { id: "gdg-robotics-lead", group: CAMPUS, title: "Former Robotics Lead, GDG", holder: "Omeyimi Mustapha" },
  { id: "rain-robotics-lead", group: CAMPUS, title: "Former Robotics Lead, RAIN", holder: "Omeyimi Mustapha" },
  { id: "rain-in-head", group: CAMPUS, title: "Head of RAIN-IN", holder: "Etta Queendolin-Effa Emmanuel", note: "Covenant University" },
];
