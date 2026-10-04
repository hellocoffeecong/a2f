// Fixed content options and limits shared by validation, admin forms and public pages.

export const AWARD_ACTIVITY_TYPES = ["AWARD", "ACTIVITY"] as const;

export const AWARD_DEGREES = [
  "N/A",
  "Associate",
  "Bachelor",
  "Master",
  "Doctor",
  "Honorary Doctorate",
  "Microdegree",
  "Professor",
] as const;

// "All" is a filter option, not a stored category.
export const PROJECT_CATEGORIES = ["UX/UI", "BX/BI", "Planning", "Graphic", "ETC"] as const;

// Award degrees and Team degrees are intentionally separate lists.
export const TEAM_DEGREES = ["N/A", "AA.", "BA.", "MA.", "Dr.", "Hon. D.", "Prof."] as const;

export const MEMBER_TYPES = ["STUDENT", "ALUMNI"] as const;

export const LIMITS = {
  awardPeople: 4,
  projectMembers: 1,
  professorImages: 3,
  researchFields: 6,
} as const;

export const PROJECT_PAGE_SIZE = 9;

// Award detail pages (/award/[id]) arrive in step 5. Until they exist and are verified, award
// cards do not link anywhere (no 404 links on the public site).
export const AWARD_DETAIL_AVAILABLE = false;
