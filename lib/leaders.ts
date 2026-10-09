// Server-only: resolves the roles in data/leaders.ts to real profiles.
import "server-only";
import { roles } from "@/data/leaders";
import { allStudents } from "@/lib/students";

export interface RoleHolder {
  /** Missing for someone without a profile on the site. */
  slug?: string;
  name: string;
  profilePic: string;
}

export interface RoleView {
  id: string;
  title: string;
  group: string;
  note?: string;
  holder: RoleHolder;
}

const byName = new Map(allStudents.map((student) => [student.name, student]));

export const roleViews: RoleView[] = roles.map((role) => {
  const student = byName.get(role.holder);
  if (!student && !role.noProfile) {
    // Fail the build instead of silently dropping a role.
    throw new Error(`data/leaders.ts: no student named "${role.holder}" (role "${role.title}")`);
  }
  return {
    id: role.id,
    title: role.title,
    group: role.group,
    note: role.note,
    holder: student
      ? { slug: student.slug, name: student.name, profilePic: student.profilePic }
      : { name: role.holder, profilePic: "" },
  };
});

/** Role titles a student holds or has held, for the badges on their profile. */
export const getRoleTitlesFor = (slug: string) =>
  roleViews.filter((role) => role.holder.slug === slug).map((role) => role.title);
