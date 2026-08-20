export const guides = [
  {
    slug: "hmo-conversion",
    title: "Converting a house into an HMO",
    summary: "The planning, licensing and building-regulation questions to separate before you begin.",
    category: "HMO",
    readTime: "7 min read",
    sections: [
      ["Planning and licensing are different", "An HMO may need planning permission, an HMO licence, both, or neither depending on its occupancy, planning use, location and the council's current scheme. Treat these as separate checks."],
      ["Check Article 4 precisely", "A council can remove a permitted development right in a defined area. Confirm the current mapped boundary, effective date and wording rather than relying on a postcode-level assumption."],
      ["Evidence to collect", "Confirm the existing lawful use, proposed number of people and households, room sizes, amenity standards, fire strategy, refuse and cycle arrangements, nearby licensing evidence and relevant planning decisions."],
      ["A sensible next step", "Ask a planning professional or architect who understands local HMO policy to review the property, then speak to the council's licensing team where required."]
    ]
  },
  {
    slug: "house-into-flats",
    title: "Converting a house into flats",
    summary: "Why subdivision normally needs planning permission and what a credible early review should cover.",
    category: "Conversions",
    readTime: "6 min read",
    sections: [
      ["Expect a planning application", "Creating separate self-contained flats from a house is normally a material change of use requiring planning permission. It should not be presented as a likely permitted development route."],
      ["Policy and quality matter", "Councils may assess housing mix, internal space, daylight, outlook, privacy, noise, access, refuse, cycle storage, parking and the effect on the character of the area."],
      ["Check the building as well as the map", "A measured survey helps test layouts, stairs, fire separation, escape, acoustic upgrades, services and whether each home can meet the relevant standards."],
      ["Build a useful brief", "Collect planning history, title information, measurements and constraint evidence before asking an architect to advise on a layout and consent strategy."]
    ]
  },
  {
    slug: "planning-permission",
    title: "Do I need planning permission?",
    summary: "A practical way to distinguish planning permission, permitted development and prior approval.",
    category: "Planning",
    readTime: "8 min read",
    sections: [
      ["Start with the current lawful position", "The answer depends on what the property lawfully is now, what you propose, previous permissions and conditions, and local restrictions. Establishing the baseline is essential."],
      ["Permitted development has limits", "Some works and changes can proceed under national permitted development rights, but limits, exclusions, prior approval and Article 4 directions can change the route."],
      ["A certificate can provide clarity", "Where permitted development appears to apply, a lawful development certificate can provide formal evidence that the proposed operation or use is lawful for planning purposes."],
      ["Use authoritative sources", "Check the current legislation and Planning Portal guidance, then confirm site-specific questions with the local planning authority or a suitably qualified adviser."]
    ]
  },
  {
    slug: "c2-change-of-use",
    title: "Considering a C2 change of use",
    summary: "How operational model, planning use and building requirements interact for residential institutions.",
    category: "Change of use",
    readTime: "7 min read",
    sections: [
      ["Use class follows the real operation", "C2 can cover residential institutions such as care homes and some other uses, but classification depends on how the premises will actually operate. A label alone does not decide it."],
      ["Avoid absolute assumptions", "Staffing, care, residents, management, layout and the relationship between occupants all matter. Some proposals may fall into another use class or be treated as sui generis."],
      ["Review wider requirements", "Planning is only one part of the project. Building regulations, fire safety, accessibility, registration, commissioning and operational standards may all be relevant."],
      ["Document the model", "Prepare a clear operational statement and obtain planning advice before acquiring or altering a property on the assumption that a particular use class applies."]
    ]
  }
] as const;

export function getGuide(slug: string) {
  return guides.find((guide) => guide.slug === slug);
}
