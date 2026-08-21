import { z } from "zod";

export const feasibilitySchema = z.object({
  address: z.string().trim().min(5, "Enter the property address").max(180),
  postcode: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/, "Enter a valid UK postcode"),
  projectType: z.enum(["hmo", "flats", "extension", "land", "other"]),
  propertyType: z.enum(["house", "flat", "commercial", "land", "other"]),
  bedrooms: z.coerce.number().int().min(0).max(30),
  notes: z.string().trim().max(600).optional().default("")
});

export type FeasibilityInput = z.infer<typeof feasibilitySchema>;

export const professionalApplicationSchema = z.object({
  businessName: z.string().trim().min(2, "Enter your business name").max(120),
  discipline: z.enum(["architect", "structural_engineer", "planning_consultant", "builder", "other"]),
  postcodes: z.string().trim().min(2, "Enter at least one postcode area").max(400),
  specialisms: z.string().trim().min(2, "Enter at least one specialism").max(600),
  website: z.union([z.literal(""), z.url("Enter a full website address, including https://")]),
  membership: z.string().trim().max(400).optional().default("")
});

export type ProfessionalApplicationInput = z.infer<typeof professionalApplicationSchema>;

export const professionalTypeSchema = z.enum([
  "architect",
  "builder",
  "planning_consultant",
  "structural_engineer"
]);

const optionalMoney = z.preprocess(
  (value) => value === "" || value === null ? undefined : value,
  z.coerce.number().int().min(0).max(10_000_000).optional()
);

export const publishProjectSchema = z.object({
  feasibilityRequestId: z.uuid(),
  title: z.string().trim().min(5, "Give the project a clear title").max(140),
  brief: z.string().trim().min(20, "Add a little more detail for professionals").max(1800),
  requiredProfessions: z.array(professionalTypeSchema).min(1, "Choose at least one professional type").max(4),
  budgetMin: optionalMoney,
  budgetMax: optionalMoney,
  targetStartDate: z.preprocess(
    (value) => value === "" || value === null ? undefined : value,
    z.iso.date().optional()
  )
}).refine(
  ({ budgetMin, budgetMax }) => budgetMin === undefined || budgetMax === undefined || budgetMax >= budgetMin,
  { message: "The maximum budget must be at least the minimum budget", path: ["budgetMax"] }
);

export const projectQuoteSchema = z.object({
  projectId: z.uuid(),
  fee: z.coerce.number().min(0, "Enter your proposed fee").max(10_000_000),
  message: z.string().trim().min(30, "Explain your approach in at least 30 characters").max(2400),
  timeframe: z.string().trim().min(2, "Add an expected timeframe").max(240),
  inclusions: z.string().trim().max(1600).optional().default("")
});

export const quoteResponseSchema = z.object({
  quoteId: z.uuid(),
  status: z.enum(["shortlisted", "accepted", "declined"])
});

export const professionalReviewSchema = z.object({
  applicationId: z.uuid(),
  status: z.enum(["reviewing", "approved", "declined"]),
  notes: z.string().trim().max(1200).optional().default("")
});

export const publicProfessionalProfileSchema = z.object({
  website: z.union([z.literal(""), z.url("Enter a full website address, including https://")]),
  summary: z.string().trim().min(30, "Add at least 30 characters about your practice").max(1200),
  postcodes: z.string().trim().min(2, "Add at least one postcode area").max(400),
  specialisms: z.string().trim().min(2, "Add at least one specialism").max(600)
});

export function normalisePostcode(postcode: string) {
  return postcode.replace(/\s+/g, "").toUpperCase();
}
