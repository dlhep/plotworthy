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

export function normalisePostcode(postcode: string) {
  return postcode.replace(/\s+/g, "").toUpperCase();
}
