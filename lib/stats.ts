// Server-only: "Class by the Numbers", computed from the survey answers at build time.
import "server-only";
import { allStudents } from "@/lib/students";
import { formatLevel, hasValue, type PublicStudent } from "@/lib/student-utils";

export interface StatPerson {
  slug: string;
  name: string;
}

export interface StatBucket {
  label: string;
  count: number;
  people: StatPerson[];
}

export interface StatGroup {
  id: string;
  title: string;
  subtitle: string;
  /** How many people gave a usable answer to this question. */
  answered: number;
  buckets: StatBucket[];
  /** Answers given by only one person, which are left out of the chart. */
  others: number;
}

export interface ClassStats {
  total: number;
  facts: { label: string; value: number }[];
  groups: StatGroup[];
}

interface Entry {
  label: string;
  student: PublicStudent;
}

const toPerson = (student: PublicStudent): StatPerson => ({ slug: student.slug, name: student.name });

/** Counts people per label (each person once per label). */
function tally(
  entries: Entry[],
  { minCount = 2, limit = 8, order = "count" }: { minCount?: number; limit?: number; order?: "count" | "label" } = {},
) {
  const byLabel = new Map<string, Map<string, PublicStudent>>();
  for (const { label, student } of entries) {
    const people = byLabel.get(label) ?? new Map<string, PublicStudent>();
    people.set(student.slug, student);
    byLabel.set(label, people);
  }
  const all: StatBucket[] = [...byLabel.entries()].map(([label, people]) => ({
    label,
    count: people.size,
    people: [...people.values()].map(toPerson).sort((a, b) => a.name.localeCompare(b.name)),
  }));
  const kept = all.filter((bucket) => bucket.count >= minCount);
  kept.sort(
    order === "label"
      ? (a, b) => a.label.localeCompare(b.label, undefined, { numeric: true })
      : (a, b) => b.count - a.count || a.label.localeCompare(b.label),
  );
  return { buckets: kept.slice(0, limit), others: all.filter((bucket) => bucket.count < minCount).length };
}

const answeredBy = (entries: Entry[]) => new Set(entries.map((entry) => entry.student.slug)).size;

const capitalise = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

// ---- Slang -----------------------------------------------------------------

function slangLabel(raw: string) {
  const text = raw
    .normalize("NFKC")
    .trim()
    .replace(/^["“”']+|["“”'.!?]+$/g, "");
  const lower = text.toLowerCase();
  if (/^o+m+o+(\b|$)/.test(lower)) return "Omo";
  if (/^as how na/.test(lower)) return "As how naw";
  return capitalise(text);
}

// ---- Courses (only answers that give a course code, never a lecturer's name) --

const COURSE_CODE = /\b([A-Za-z]{3})\s?(\d{3})\b/;
const COURSE_FAMILY = /\b(EIE|GST|CEN|GEC|EDS|CHM|PHY|MTH|MEE|ENG)\b/i;

// ---- Lecturers (favourites only) ---------------------------------------------

const LECTURER_ALIASES: Record<string, string> = {
  kennedy: "Dr Kennedy",
  tiwalade: "Dr Tiwalade",
  // "Dr Odu" and "Odu Tiwalade" are taken to be the same person.
  odu: "Dr Tiwalade",
  oshin: "Dr Oshin",
  omoruyi: "Dr Omoruyi",
};
const LECTURER_NOISE = /^(dr|mr|mrs|miss|prof|professor|engr|probably|two|docs|lmao|claude)$/i;

function lecturerLabels(raw: string): string[] {
  const labels: string[] = [];
  for (const part of raw.split(/,|&|\/|\band\b|\bor\b/i)) {
    const words = part
      .replace(/\./g, " ")
      .split(/\s+/)
      .filter((word) => word && !LECTURER_NOISE.test(word));
    if (words.length === 0) continue;
    const last = words[words.length - 1].toLowerCase().replace(/[^a-z]/g, "");
    if (!last) continue;
    const title = /prof/i.test(part) ? "Prof" : /\bmiss\b/i.test(part) ? "Miss" : /\bmrs\b/i.test(part) ? "Mrs" : /\bmr\b/i.test(part) ? "Mr" : "Dr";
    labels.push(LECTURER_ALIASES[last] ?? `${title} ${capitalise(last)}`);
  }
  return labels;
}

// ---- Themes (one answer can match several) -------------------------------------

const DREAM_THEMES: { label: string; test: RegExp }[] = [
  { label: "Software & dev", test: /software|soft ware|developer|full-stack|game dev|\bdev\b|\bweb\b/i },
  { label: "Business & money", test: /\bceo\b|entrepreneur|business|money|forbes|billion/i },
  { label: "Creative careers", test: /writer|director|acting|animator|fashion|chef|culinary/i },
  { label: "Cybersecurity", test: /cyber|security/i },
  { label: "AI & machine learning", test: /\bai\b|machine learning|\bml\b|intelligent|computer vision|\bcv\b/i },
  { label: "Robotics", test: /robot/i },
];

const FOOD_THEMES: { label: string; test: RegExp }[] = [
  { label: "Rice", test: /rice|basmati|jollof/i },
  { label: "Egg & potato", test: /egg|potato/i },
  { label: "Yamarita", test: /yamarita/i },
  { label: "Yam & plantain", test: /\byam\b|plantain/i },
  { label: "Noodles & pasta", test: /noodle|pasta|spaghetti/i },
  { label: "Pizza & waffles", test: /pizza|waffle/i },
];

function themeEntries(students: PublicStudent[], read: (student: PublicStudent) => string, themes: typeof DREAM_THEMES) {
  const entries: Entry[] = [];
  for (const student of students) {
    const text = read(student);
    if (!hasValue(text)) continue;
    for (const theme of themes) if (theme.test.test(text)) entries.push({ label: theme.label, student });
  }
  return entries;
}

// ---- Songs -------------------------------------------------------------------

function songLabel(raw: string) {
  const lower = raw.toLowerCase();
  if (lower.includes("gratitude")) return "Gratitude";
  if (lower.includes("who i be")) return "Who I Be";
  return raw.split(/\s+by\s+|\s+[-–—]\s*|[-–—]\s+/i)[0].trim();
}

// ----------------------------------------------------------------------------

export function getClassStats(): ClassStats {
  const students = allStudents;

  const slang: Entry[] = students.filter((s) => hasValue(s.slang)).map((s) => ({ label: slangLabel(s.slang), student: s }));

  const codes: Entry[] = [];
  const families: Entry[] = [];
  for (const student of students) {
    if (!hasValue(student.leastFavCourse)) continue;
    const code = student.leastFavCourse.match(COURSE_CODE);
    if (code) codes.push({ label: `${code[1].toUpperCase()} ${code[2]}`, student });
    const family = student.leastFavCourse.match(COURSE_FAMILY);
    if (family) families.push({ label: `${family[1].toUpperCase()} courses`, student });
  }

  const lecturers: Entry[] = students.flatMap((student) =>
    hasValue(student.favLecturerName) ? lecturerLabels(student.favLecturerName).map((label) => ({ label, student })) : [],
  );

  const levels: Entry[] = students.flatMap((student) =>
    student.bestEraArray.filter(hasValue).map((era) => ({ label: formatLevel(era), student })),
  );

  const dreams = themeEntries(students, (s) => s.dreamPath, DREAM_THEMES);
  const foods = themeEntries(students, (s) => s.favFood ?? "", FOOD_THEMES);
  const songs: Entry[] = students.filter((s) => hasValue(s.finalquote)).map((s) => ({ label: songLabel(s.finalquote), student: s }));

  const group = (
    id: string,
    title: string,
    subtitle: string,
    entries: Entry[],
    options?: Parameters<typeof tally>[1],
  ): StatGroup => ({ id, title, subtitle, answered: answeredBy(entries), ...tally(entries, options) });

  return {
    total: students.length,
    facts: [
      { label: "Profiles", value: students.length },
      { label: "Nicknames", value: students.filter((s) => hasValue(s.nickname)).length },
      { label: "Instagram accounts", value: students.filter((s) => hasValue(s.igHandle)).length },
    ],
    groups: [
      group("slang", "Most-used slang", "The words everyone kept saying", slang),
      group("lecturers", "Favourite lecturers", "Most mentioned by graduates", lecturers, { limit: 6 }),
      group("levels", "Best level", "Which year people loved most (people could pick more than one)", levels, { minCount: 1, order: "label" }),
      group("courses", "Least favourite courses", "Only answers that named a course code", codes, { limit: 6 }),
      group("families", "Least favourite course family", "Grouped by course prefix", families, { limit: 5 }),
      group("dreams", "Dream paths", "One answer can fit more than one group", dreams, { minCount: 1 }),
      group("foods", "Favourite CU food", "From the answers collected so far", foods, { minCount: 1 }),
      group("songs", "Farewell song", "The songs people picked to leave on", songs, { limit: 5 }),
    ],
  };
}
