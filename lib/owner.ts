// Owner / internal accounts that get coverage as a free override (no packs
// required). Every other professional pays for coverage via postcode packs.
const OWNER_EMAILS = ["info@hepburnarchitects.com"];

export function isOwnerEmail(email?: string | null): boolean {
  return !!email && OWNER_EMAILS.includes(email.trim().toLowerCase());
}
