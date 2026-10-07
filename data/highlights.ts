// "Most likely to..." highlights. Add an award by adding an entry here: winners
// are listed by their exact `name` in data/studentsData.ts (the build fails with
// a clear message if a name doesn't match). Keep awards positive.
//
// These first awards come straight from what graduates wrote about themselves in
// the survey (their nickname, "remember me for" and dream path), so the reason
// quotes their own words. Class-voted awards can be added the same way.

export interface Award {
  id: string;
  title: string;
  /** Exact names from data/studentsData.ts. */
  winners: string[];
  reason: string;
}

export const awards: Award[] = [
  {
    id: "tutorial-master",
    title: "Tutorial Master",
    winners: ["Stephanie Emenike"],
    reason: "Goes by “Tutorial Master” and wants to be remembered for tutorials.",
  },
  {
    id: "first-out-of-class",
    title: "First Out of Class",
    winners: ["Ezenwa Eberechukwu Jennifer"],
    reason: "Wants to be remembered for “leaving the class as soon as the class is over”.",
  },
  {
    id: "most-opinionated",
    title: "Most Opinionated",
    winners: ["Okoyomoh Osholelumhe Itsemhe"],
    reason: "In her own words: “very opinionated and always arguing with lecturers”.",
  },
  {
    id: "most-likely-to-run-samsung",
    title: "Most Likely to Run the Next Samsung",
    winners: ["Ayoola Oreofeoluwa Praise"],
    reason: "Dream path: “CEO of the next Samsung (in terms of manufacturing)”.",
  },
  {
    id: "class-coder",
    title: "Class Coder",
    winners: ["Soye Inemesit Boma A. Itoro Usoroh"],
    reason: "Wants to be remembered for coding skills, and is heading into game dev and software development.",
  },
  {
    id: "fashion-icons",
    title: "Fashion Icons",
    winners: ["Ojo Abisola A.", "Rhema Teniade Adefarakan"],
    reason: "Both dream of fashion design, and one wants to be remembered for “being fashionable and colorful”.",
  },
  {
    id: "robot-builders",
    title: "Most Likely to Build the Robots",
    winners: ["Ezinwa-Obi Chidimma", "Akinwunmi Naomi", "Omeyimi Mustapha", "Inim Bright Kudos"],
    reason: "Their dream paths and passions all point to robotics.",
  },
  {
    id: "cyber-guardians",
    title: "Most Likely to Secure Your Network",
    winners: ["Uche-Nwachinemere Amarachukwu", "Ekundayo Shalom Chuwkuma"],
    reason: "Both are heading into cybersecurity.",
  },
  {
    id: "kindest",
    title: "Kindest",
    winners: ["Akinboboye Abisade Cheryl", "Ojo Abisola A."],
    reason: "Both asked to be remembered for being kind.",
  },
  {
    id: "most-bubbly",
    title: "Most Bubbly",
    winners: ["Uche-Nwachinemere Amarachukwu", "Rhema Teniade Adefarakan"],
    reason: "Wants to be remembered “for my bubbly nature”, and “energetic, bubbly, loveable”.",
  },
  {
    id: "most-positive",
    title: "Most Positive",
    winners: ["Genesis Oghenetejiri Ighomwaye"],
    reason: "Wants to be remembered “for my positivity” and tells everyone “You can make it!!!”.",
  },
];
