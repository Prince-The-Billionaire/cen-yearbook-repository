// Server-only: resolves the awards in data/highlights.ts to real profiles.
import "server-only";
import { awards } from "@/data/highlights";
import { allStudents } from "@/lib/students";

export interface AwardWinner {
  slug: string;
  name: string;
  profilePic: string;
}

export interface AwardView {
  id: string;
  title: string;
  reason?: string;
  winners: AwardWinner[];
}

const byName = new Map(allStudents.map((student) => [student.name, student]));

export const awardViews: AwardView[] = awards.map((award) => ({
  id: award.id,
  title: award.title,
  reason: award.reason,
  winners: award.winners.map((name) => {
    const student = byName.get(name);
    if (!student) {
      // Fail the build instead of silently dropping a winner.
      throw new Error(`data/highlights.ts: no student named "${name}" (award "${award.title}")`);
    }
    return { slug: student.slug, name: student.name, profilePic: student.profilePic };
  }),
}));

/** Award titles a student has won, for the badge on their profile. */
export const getAwardTitlesFor = (slug: string) =>
  awardViews.filter((award) => award.winners.some((winner) => winner.slug === slug)).map((award) => award.title);
