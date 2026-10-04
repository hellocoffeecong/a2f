import { z } from "zod";
import {
  AWARD_ACTIVITY_TYPES,
  AWARD_DEGREES,
  LIMITS,
  MEMBER_TYPES,
  PROJECT_CATEGORIES,
  TEAM_DEGREES,
} from "@/config/content";
import type { DataKey } from "@/config/storage";
import {
  dateSchema,
  idSchema,
  imageRefSchema,
  listDocument,
  objectDocument,
  optionalText,
  recordTimestamps,
  requiredText,
} from "./common";

// Home ------------------------------------------------------------------

export const researchFieldSchema = z.object({
  id: idSchema,
  title: requiredText,
  subtitle: optionalText, // Korean heading shown on the card
  description: optionalText,
  order: z.number().int().nonnegative(),
});

// Admin-editable Home text only. Logo, navigation labels, research field icons and
// decorative elements are fixed in code. Footer/contact text lives in settings.json.
export const homeSchema = z.object({
  introduction: z.object({
    paragraphs: z.array(requiredText),
  }),
  why: z.object({
    // Exact split of the highlighted lead ("We study") is to be confirmed in Figma.
    statementLead: optionalText,
    statement: optionalText,
    description: optionalText,
  }),
  researchFields: z.array(researchFieldSchema).length(LIMITS.researchFields),
});

// Award & Activity ------------------------------------------------------

export const awardPersonSchema = z.object({
  name: requiredText,
  degree: z.enum(AWARD_DEGREES),
  role: optionalText,
  profileImage: imageRefSchema.optional(),
});

export const awardSchema = z.object({
  id: idSchema,
  type: z.enum(AWARD_ACTIVITY_TYPES),
  title: requiredText, // event / project name
  label: requiredText, // e.g. "Excellence Prize", "Academic Conference"
  date: dateSchema,
  body: optionalText,
  images: z.array(imageRefSchema),
  people: z.array(awardPersonSchema).max(LIMITS.awardPeople),
  ...recordTimestamps,
});

// Project ---------------------------------------------------------------

// Entered directly; not linked to Team data.
export const projectMemberSchema = z.object({
  name: requiredText,
  degree: z.enum(AWARD_DEGREES),
  profileImage: imageRefSchema.optional(),
});

export const projectSchema = z.object({
  id: idSchema,
  title: requiredText,
  date: dateSchema,
  body: optionalText,
  category: z.enum(PROJECT_CATEGORIES),
  customTag: optionalText, // exactly one free-text tag, never an array
  member: projectMemberSchema.nullable(), // at most LIMITS.projectMembers (1)
  images: z.array(imageRefSchema), // images[0] is the representative image
  ...recordTimestamps,
});

// Professor -------------------------------------------------------------

const sectionLines = z.array(requiredText);

// The "Prof." prefix before the English name is rendered by the UI, not stored.
export const professorSchema = z.object({
  name: requiredText,
  nameKo: optionalText,
  title: optionalText,
  department: optionalText,
  addressLines: z.array(requiredText),
  phone: optionalText,
  email: z.union([z.email(), z.literal("")]),
  education: sectionLines,
  experience: sectionLines,
  research: sectionLines,
  projects: sectionLines,
  images: z.array(imageRefSchema).max(LIMITS.professorImages),
});

// Student / Alumni ------------------------------------------------------

export const memberSchema = z.object({
  id: idSchema,
  type: z.enum(MEMBER_TYPES),
  degree: z.enum(TEAM_DEGREES),
  name: requiredText,
  email: z.union([z.email(), z.literal("")]),
  field: optionalText,
  profileImage: imageRefSchema.nullable(),
  order: z.number().int().nonnegative(),
  ...recordTimestamps,
});

// Settings --------------------------------------------------------------

// Site-wide settings. The Publication URL stays in NOTION_PUBLICATION_URL, not here.
export const settingsSchema = z.object({
  contact: z.object({
    addressLines: z.array(requiredText),
    phone: optionalText,
    email: z.union([z.email(), z.literal("")]),
  }),
  // One sentence split into phrases; the footer joins them per breakpoint
  // (1920: 1 line, 1440/768: first phrase + rest, 365: one phrase per line).
  footerLines: z.array(requiredText).min(1).max(6),
});

// Stored documents --------------------------------------------------------

export const documentSchemas = {
  home: objectDocument(homeSchema),
  awards: listDocument(awardSchema),
  projects: listDocument(projectSchema),
  professor: objectDocument(professorSchema),
  members: listDocument(memberSchema),
  settings: objectDocument(settingsSchema),
} as const satisfies Record<DataKey, z.ZodType>;

export type ContentDocuments = {
  [K in DataKey]: z.infer<(typeof documentSchemas)[K]>;
};

// A document's content without the version metadata that saveDocument manages.
export type DocumentContent<K extends DataKey> = Omit<ContentDocuments[K], "version" | "updatedAt">;
