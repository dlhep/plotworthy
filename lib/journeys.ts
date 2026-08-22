// The universal seven-stage journey, filled in per project type.
// HMO is the fully-developed reference model; the others adapt the same spine.

export type Stage = {
  n: number;
  title: string; // universal stage name
  clientSees: string; // one-line summary of this stage for this project
  collapsedNote: string; // short "you'll deal with this later" note
  actions: string[]; // three immediate actions
  decision: string; // the important decision at this stage
  documents: string[]; // documents / information needed
  professionals: string[]; // professionals introduced at this stage
  afterwards: string; // what happens after this stage
};

export type Journey = {
  slug: string;
  name: string;
  shortName: string;
  emoji: string;
  tagline: string;
  intro: string;
  isReference?: boolean;
  defaultStage: number; // index (0-6) where a typical client lands
  stages: Stage[];
};

export const STAGE_TITLES = [
  "Your goal",
  "The property",
  "Is it viable?",
  "Get permission",
  "Make it buildable",
  "Deliver the project",
  "Complete and operate",
];

export const STAGE_SUPPORT = [
  "PlotWorthy helps define the brief",
  "Sourcing agent, valuer or surveyor if needed",
  "Architect, planning consultant, commercial adviser",
  "Architect, planning consultant and specialists",
  "Architect, engineer, fire consultant, building control",
  "Builders, contract administrator and specialists",
  "Letting agent, lease adviser, licensing or care specialists",
];

// ---------------------------------------------------------------------------
// HMO — the reference model
// ---------------------------------------------------------------------------
const hmo: Journey = {
  slug: "hmo",
  name: "Create or invest in an HMO",
  shortName: "HMO",
  emoji: "🏠",
  tagline: "Turn a property into a well-run, compliant house in multiple occupation.",
  intro:
    "An HMO can be a strong investment, but success depends on getting the planning, licensing and fire-safety position right before you spend money. PlotWorthy walks you through it one decision at a time and brings in the right professional exactly when you need them.",
  isReference: true,
  defaultStage: 2,
  stages: [
    {
      n: 1,
      title: "Your goal",
      clientSees: "Decide what you want this HMO to achieve.",
      collapsedNote: "Where the journey begins — your brief.",
      actions: [
        "Describe the kind of HMO you want (student, professional, supported, co-living).",
        "Set a rough target for rooms, budget and expected return.",
        "Note your timescale and how hands-on you want to be.",
      ],
      decision: "What kind of HMO are you trying to create, and for whom?",
      documents: ["Rough budget", "Target area or property", "Your goals for return and involvement"],
      professionals: ["PlotWorthy adviser (brief definition)"],
      afterwards: "We confirm the property you'll use, or help you find one that fits the brief.",
    },
    {
      n: 2,
      title: "The property",
      clientSees: "Confirm the property — one you own, one you're considering, or one to find.",
      collapsedNote: "You'll confirm the property before viability.",
      actions: [
        "Tell us whether you own it, are considering it, or need help finding it.",
        "Gather the address, tenure and any existing floor plans.",
        "Flag anything unusual — leasehold, listed status, existing tenants.",
      ],
      decision: "Is this the right building, or should you keep looking?",
      documents: ["Address and tenure", "Existing floor plans if available", "Purchase price or current value"],
      professionals: ["Sourcing agent", "Valuer", "Surveyor"],
      afterwards: "With the property confirmed, we test whether it can actually work as an HMO.",
    },
    {
      n: 3,
      title: "Is it viable?",
      clientSees: "Establish whether this property can work as an HMO.",
      collapsedNote: "The go / no-go stage before you commit money.",
      actions: [
        "Confirm the proposed number of occupants.",
        "Check the planning and Article 4 position for the address.",
        "Complete an initial layout and compliance review.",
      ],
      decision:
        "Does this stack up — on planning, licensing and numbers — before you spend on design?",
      documents: [
        "Proposed occupant numbers",
        "Local authority Article 4 / licensing position",
        "Initial room layout sketch",
      ],
      professionals: ["Architect (feasibility)", "Planning consultant", "Commercial / finance adviser"],
      afterwards:
        "If it's viable, you move to securing any permissions and licences you need.",
    },
    {
      n: 4,
      title: "Get permission",
      clientSees: "Secure planning permission and the right HMO licence.",
      collapsedNote: "You'll deal with this once viability is confirmed.",
      actions: [
        "Confirm whether planning permission or prior approval is required.",
        "Prepare and submit the planning application if needed.",
        "Start the mandatory or additional HMO licence application.",
      ],
      decision: "Which consents apply to your scheme, and in what order?",
      documents: ["Existing and proposed plans", "Planning statement", "Licence application details"],
      professionals: ["Planning consultant", "Architect", "Licensing specialist"],
      afterwards: "With permission in place, the scheme is worked up into buildable detail.",
    },
    {
      n: 5,
      title: "Make it buildable",
      clientSees: "Turn the approved scheme into fire-safe, regulation-compliant technical design.",
      collapsedNote: "The detailed fire, escape and building-control stage.",
      actions: [
        "Develop Building Regulations drawings and specification.",
        "Design fire doors, escape routes and detection to the HMO standard.",
        "Appoint building control and any specialist consultants.",
      ],
      decision: "Is the design fully compliant and ready to price and build?",
      documents: [
        "Building Regulations drawings",
        "Fire strategy and detection design",
        "Room and amenity schedule",
      ],
      professionals: ["Architect", "Structural engineer", "Fire consultant", "Building control"],
      afterwards: "The completed design goes out to builders for pricing.",
    },
    {
      n: 6,
      title: "Deliver the project",
      clientSees: "Appoint a builder and complete the conversion works.",
      collapsedNote: "Tendering, contracts and construction.",
      actions: [
        "Tender the works to a shortlist of suitable builders.",
        "Agree a contract and payment schedule.",
        "Set up site inspections and progress reporting.",
      ],
      decision: "Which builder and contract give you the best balance of price and certainty?",
      documents: ["Tender pack", "Building contract", "Programme and payment schedule"],
      professionals: ["Builder / contractor", "Contract administrator", "Specialist trades"],
      afterwards: "Once works pass inspection, the HMO is signed off and made ready to let.",
    },
    {
      n: 7,
      title: "Complete and operate",
      clientSees: "Sign off, licence and let the finished HMO.",
      collapsedNote: "Completion, licensing sign-off and letting.",
      actions: [
        "Obtain completion and building-control sign-off.",
        "Finalise the HMO licence and safety certificates.",
        "Market rooms and appoint letting or management support.",
      ],
      decision: "Will you self-manage or appoint a managing agent?",
      documents: ["Completion certificate", "HMO licence", "Gas, electrical and fire certificates"],
      professionals: ["Letting agent", "Managing agent", "Licensing specialist"],
      afterwards: "Your HMO is operating — PlotWorthy stays available for renewals and future projects.",
    },
  ],
};

// ---------------------------------------------------------------------------
// Extension / improvement
// ---------------------------------------------------------------------------
const extension: Journey = {
  slug: "extension",
  name: "Extend or improve a home",
  shortName: "Extension",
  emoji: "📐",
  tagline: "Add space and value to a home you own or plan to buy.",
  intro:
    "Whether it's a rear extension, a loft conversion or a wider remodel, the path is the same: get the idea clear, test what's possible, secure permission, then build it well. PlotWorthy keeps each step simple.",
  defaultStage: 0,
  stages: [
    {
      n: 1,
      title: "Your goal",
      clientSees: "Decide what you want to change and why.",
      collapsedNote: "Where the journey begins — your brief.",
      actions: [
        "Describe the space or problem you want to solve.",
        "Set a rough budget and a must-have vs nice-to-have list.",
        "Note your timescale and how you'll live through the works.",
      ],
      decision: "What does 'success' look like for this home?",
      documents: ["Rough budget", "Wish list", "Photos of the current space"],
      professionals: ["PlotWorthy adviser (brief definition)"],
      afterwards: "We confirm the property and its constraints.",
    },
    {
      n: 2,
      title: "The property",
      clientSees: "Confirm the home and gather what's known about it.",
      collapsedNote: "You'll confirm the property before viability.",
      actions: [
        "Confirm ownership and tenure.",
        "Collect existing plans, title and any past applications.",
        "Note boundaries, trees, drains and neighbours.",
      ],
      decision: "Is this the property the project will be built on?",
      documents: ["Title / deeds", "Existing floor plans", "Site photos"],
      professionals: ["Surveyor", "Valuer"],
      afterwards: "We test what's realistically possible on the plot.",
    },
    {
      n: 3,
      title: "Is it viable?",
      clientSees: "Test what you can build, and roughly what it costs.",
      collapsedNote: "The go / no-go stage before you commit money.",
      actions: [
        "Confirm permitted development vs full planning route.",
        "Check constraints — conservation area, listing, party walls.",
        "Get an initial design idea and a rough cost range.",
      ],
      decision: "Is the scheme worth taking into design and planning?",
      documents: ["Constraints check", "Initial sketch", "Rough cost range"],
      professionals: ["Architect (feasibility)", "Planning consultant"],
      afterwards: "If it's viable, we work up designs and any permission needed.",
    },
    {
      n: 4,
      title: "Get permission",
      clientSees: "Prepare designs and secure planning or prior approval.",
      collapsedNote: "You'll deal with this once viability is confirmed.",
      actions: [
        "Develop the design to planning standard.",
        "Confirm whether permission or prior approval applies.",
        "Submit and manage the application.",
      ],
      decision: "Which planning route gives the best chance of approval?",
      documents: ["Existing and proposed drawings", "Design and access notes", "Application forms"],
      professionals: ["Architect", "Planning consultant"],
      afterwards: "With permission granted, the design is made buildable.",
    },
    {
      n: 5,
      title: "Make it buildable",
      clientSees: "Produce Building Regulations drawings and structural design.",
      collapsedNote: "The detailed technical and structural stage.",
      actions: [
        "Prepare Building Regulations package.",
        "Get structural calculations for openings and new spans.",
        "Resolve party-wall matters with neighbours.",
      ],
      decision: "Is the design fully specified and ready to price?",
      documents: ["Building Regulations drawings", "Structural calculations", "Party-wall notices"],
      professionals: ["Architect", "Structural engineer", "Party-wall surveyor", "Building control"],
      afterwards: "The package goes to builders for quotes.",
    },
    {
      n: 6,
      title: "Deliver the project",
      clientSees: "Choose a builder and run the works.",
      collapsedNote: "Tendering, contracts and construction.",
      actions: [
        "Get comparable quotes from vetted builders.",
        "Agree a contract and payment stages.",
        "Set up simple progress checks.",
      ],
      decision: "Which builder and contract give the best value and certainty?",
      documents: ["Quotes", "Building contract", "Programme"],
      professionals: ["Builder / contractor", "Contract administrator"],
      afterwards: "Works complete and are signed off.",
    },
    {
      n: 7,
      title: "Complete and operate",
      clientSees: "Sign off the works and enjoy or let the finished home.",
      collapsedNote: "Completion and handover.",
      actions: [
        "Obtain building-control completion certificate.",
        "Snag and close out any defects.",
        "Update insurance and, if letting, arrange management.",
      ],
      decision: "Keep, sell or let the improved home?",
      documents: ["Completion certificate", "Warranties", "Updated insurance"],
      professionals: ["Letting agent (if letting)"],
      afterwards: "Project complete — PlotWorthy stays available for the next one.",
    },
  ],
};

// ---------------------------------------------------------------------------
// House to flats
// ---------------------------------------------------------------------------
const houseToFlats: Journey = {
  slug: "house-to-flats",
  name: "Convert a house into flats",
  shortName: "House to flats",
  emoji: "🏢",
  tagline: "Split a house into self-contained flats — more units, more value.",
  intro:
    "Converting a house into flats can significantly increase value, but planning, space standards and fire separation all have to line up. PlotWorthy takes you through it in the right order.",
  defaultStage: 1,
  stages: [
    {
      n: 1,
      title: "Your goal",
      clientSees: "Decide how many flats and what mix you're aiming for.",
      collapsedNote: "Where the journey begins — your brief.",
      actions: [
        "Set a target number and size of flats.",
        "Decide whether to sell, let or hold.",
        "Set a rough budget and return target.",
      ],
      decision: "What flat mix best suits the building and the market?",
      documents: ["Budget", "Target unit mix", "Return expectations"],
      professionals: ["PlotWorthy adviser (brief definition)"],
      afterwards: "We confirm the building you'll convert.",
    },
    {
      n: 2,
      title: "The property",
      clientSees: "Confirm the house and its key facts.",
      collapsedNote: "You'll confirm the property before viability.",
      actions: [
        "Confirm ownership, tenure and any existing use.",
        "Collect plans and measure the building.",
        "Check parking, amenity space and access.",
      ],
      decision: "Is this building suitable for subdivision?",
      documents: ["Title / tenure", "Measured plans", "Site photos"],
      professionals: ["Surveyor", "Valuer", "Sourcing agent"],
      afterwards: "We test whether the conversion actually works.",
    },
    {
      n: 3,
      title: "Is it viable?",
      clientSees: "Test the number of flats against planning and space standards.",
      collapsedNote: "The go / no-go stage before you commit money.",
      actions: [
        "Check planning policy and precedent for conversions locally.",
        "Test layouts against national space standards.",
        "Get a rough build cost and end-value appraisal.",
      ],
      decision: "Do the numbers and the layouts both work?",
      documents: ["Planning check", "Test layouts", "Appraisal / cost range"],
      professionals: ["Architect (feasibility)", "Planning consultant", "Commercial adviser"],
      afterwards: "If viable, we prepare designs and the planning application.",
    },
    {
      n: 4,
      title: "Get permission",
      clientSees: "Design the flats and secure planning permission.",
      collapsedNote: "You'll deal with this once viability is confirmed.",
      actions: [
        "Develop flat layouts to planning standard.",
        "Prepare supporting statements.",
        "Submit and manage the application.",
      ],
      decision: "Does the scheme meet policy on mix, amenity and parking?",
      documents: ["Proposed plans", "Planning statement", "Application forms"],
      professionals: ["Architect", "Planning consultant"],
      afterwards: "With permission, the scheme is made buildable.",
    },
    {
      n: 5,
      title: "Make it buildable",
      clientSees: "Design fire separation, sound insulation and structure between flats.",
      collapsedNote: "The detailed fire, acoustic and structural stage.",
      actions: [
        "Produce Building Regulations drawings.",
        "Design compartmentation, fire and acoustic separation.",
        "Resolve structure, services and metering per flat.",
      ],
      decision: "Is each flat independently compliant and ready to price?",
      documents: ["Building Regulations drawings", "Fire and acoustic strategy", "Services / metering plan"],
      professionals: ["Architect", "Structural engineer", "Fire consultant", "Building control"],
      afterwards: "The package goes to builders for pricing.",
    },
    {
      n: 6,
      title: "Deliver the project",
      clientSees: "Appoint a builder and complete the conversion.",
      collapsedNote: "Tendering, contracts and construction.",
      actions: [
        "Tender to vetted builders.",
        "Agree contract and payment stages.",
        "Set up inspections and reporting.",
      ],
      decision: "Which builder and contract give the best certainty?",
      documents: ["Tender pack", "Building contract", "Programme"],
      professionals: ["Builder / contractor", "Contract administrator"],
      afterwards: "Works complete and each flat is signed off.",
    },
    {
      n: 7,
      title: "Complete and operate",
      clientSees: "Sign off, set up leases and sell or let the flats.",
      collapsedNote: "Completion, leases and sale or letting.",
      actions: [
        "Obtain completion certificates.",
        "Set up leases and any freehold structure.",
        "Sell or let each flat.",
      ],
      decision: "Sell the flats, let them, or a mix?",
      documents: ["Completion certificates", "Leases", "EPCs and safety certificates"],
      professionals: ["Lease adviser / conveyancer", "Letting or sales agent"],
      afterwards: "The flats are complete and operating — PlotWorthy stays on hand.",
    },
  ],
};

// ---------------------------------------------------------------------------
// Office / commercial to residential
// ---------------------------------------------------------------------------
const officeToResi: Journey = {
  slug: "office-to-residential",
  name: "Convert an office or commercial building into homes",
  shortName: "Office to homes",
  emoji: "🏬",
  tagline: "Bring a commercial building back to life as new homes.",
  intro:
    "Commercial-to-residential conversions can be efficient — often via permitted development — but light, space and building-control standards must be met. PlotWorthy guides the route from prior approval to completed homes.",
  defaultStage: 2,
  stages: [
    {
      n: 1,
      title: "Your goal",
      clientSees: "Decide the type and number of homes you want to create.",
      collapsedNote: "Where the journey begins — your brief.",
      actions: [
        "Set target unit numbers and tenure (sale or rent).",
        "Set budget and return expectations.",
        "Note your timescale and exit plan.",
      ],
      decision: "What residential product suits this building and location?",
      documents: ["Budget", "Target unit mix", "Return / exit plan"],
      professionals: ["PlotWorthy adviser (brief definition)"],
      afterwards: "We confirm the building to be converted.",
    },
    {
      n: 2,
      title: "The property",
      clientSees: "Confirm the commercial building and its status.",
      collapsedNote: "You'll confirm the property before viability.",
      actions: [
        "Confirm ownership, tenure and current use class.",
        "Collect existing plans and surveys.",
        "Check leases, tenants and vacancy dates.",
      ],
      decision: "Is this the building the scheme is built on?",
      documents: ["Title and use class", "Existing plans", "Lease / tenancy details"],
      professionals: ["Surveyor", "Valuer", "Commercial agent"],
      afterwards: "We test whether conversion is deliverable.",
    },
    {
      n: 3,
      title: "Is it viable?",
      clientSees: "Test permitted development / planning route and daylight, space and numbers.",
      collapsedNote: "The go / no-go stage before you commit money.",
      actions: [
        "Check whether prior approval (Class MA) or full planning applies.",
        "Test layouts against space and daylight standards.",
        "Prepare a development appraisal.",
      ],
      decision: "Is the conversion viable on both consent route and numbers?",
      documents: ["Prior-approval / planning check", "Test layouts", "Development appraisal"],
      professionals: ["Architect (feasibility)", "Planning consultant", "Commercial adviser"],
      afterwards: "If viable, we secure prior approval or permission.",
    },
    {
      n: 4,
      title: "Get permission",
      clientSees: "Secure prior approval or planning permission.",
      collapsedNote: "You'll deal with this once viability is confirmed.",
      actions: [
        "Prepare the prior-approval or planning submission.",
        "Provide required daylight, noise and transport information.",
        "Submit and manage the determination.",
      ],
      decision: "Which consent route is fastest and most certain here?",
      documents: ["Proposed plans", "Prior-approval reports (light, noise, flood, contamination)", "Application forms"],
      professionals: ["Planning consultant", "Architect", "Specialist consultants"],
      afterwards: "With approval, the scheme is worked up to build.",
    },
    {
      n: 5,
      title: "Make it buildable",
      clientSees: "Design structure, fire strategy, services and each home's compliance.",
      collapsedNote: "The detailed fire, structural and services stage.",
      actions: [
        "Produce Building Regulations drawings.",
        "Design fire strategy, compartmentation and means of escape.",
        "Plan structure, façade, insulation and services.",
      ],
      decision: "Is every home compliant and the building ready to price?",
      documents: ["Building Regulations package", "Fire strategy", "Structural and services design"],
      professionals: ["Architect", "Structural engineer", "Fire consultant", "M&E engineer", "Building control"],
      afterwards: "The design goes out to contractors.",
    },
    {
      n: 6,
      title: "Deliver the project",
      clientSees: "Appoint a contractor and build out the homes.",
      collapsedNote: "Tendering, contracts and construction.",
      actions: [
        "Tender to suitable contractors.",
        "Agree a building contract.",
        "Set up cost and progress monitoring.",
      ],
      decision: "Which contractor and contract best manage the risk?",
      documents: ["Tender pack", "Building contract", "Programme and cost plan"],
      professionals: ["Main contractor", "Contract administrator / project manager", "Quantity surveyor"],
      afterwards: "Construction completes and homes are signed off.",
    },
    {
      n: 7,
      title: "Complete and operate",
      clientSees: "Sign off, warranty and sell or let the homes.",
      collapsedNote: "Completion, warranties and sale or letting.",
      actions: [
        "Obtain completion certificates and warranties.",
        "Set up leases or sale packs.",
        "Sell or let the completed homes.",
      ],
      decision: "Sell, let or hold the finished homes?",
      documents: ["Completion certificates", "Building warranty", "Leases / sale packs"],
      professionals: ["Lease adviser / conveyancer", "Sales or letting agent"],
      afterwards: "The scheme is complete — PlotWorthy stays available for the next.",
    },
  ],
};

// ---------------------------------------------------------------------------
// Care / supported accommodation (C2)
// ---------------------------------------------------------------------------
const care: Journey = {
  slug: "care",
  name: "Create a care or supported accommodation project",
  shortName: "Care / supported",
  emoji: "🤝",
  tagline: "Deliver care or supported living that meets both building and regulatory standards.",
  intro:
    "Care and supported accommodation carry extra layers — use class, registration and operator standards alongside the usual build. PlotWorthy coordinates the property, the design and the specialists so nothing is missed.",
  defaultStage: 0,
  stages: [
    {
      n: 1,
      title: "Your goal",
      clientSees: "Define the care model and who it serves.",
      collapsedNote: "Where the journey begins — your brief.",
      actions: [
        "Describe the client group and level of support.",
        "Decide whether you'll operate or lease to an operator.",
        "Set budget, funding source and return expectations.",
      ],
      decision: "What care model are you delivering, and who runs it?",
      documents: ["Care model outline", "Funding / commissioning source", "Budget"],
      professionals: ["PlotWorthy adviser (brief definition)", "Care / commissioning specialist"],
      afterwards: "We confirm the property and its suitability for the model.",
    },
    {
      n: 2,
      title: "The property",
      clientSees: "Confirm the property and its suitability for care use.",
      collapsedNote: "You'll confirm the property before viability.",
      actions: [
        "Confirm ownership, tenure and current use class.",
        "Assess accessibility, location and space.",
        "Collect plans and any existing surveys.",
      ],
      decision: "Is this property suitable for the care model?",
      documents: ["Title and use class", "Existing plans", "Accessibility assessment"],
      professionals: ["Surveyor", "Valuer", "Sourcing agent"],
      afterwards: "We test whether the project is deliverable and fundable.",
    },
    {
      n: 3,
      title: "Is it viable?",
      clientSees: "Test use class (C2/C3), registration route and numbers.",
      collapsedNote: "The go / no-go stage before you commit money.",
      actions: [
        "Confirm the use class and whether planning change is needed.",
        "Check the regulatory / registration route for the model.",
        "Prepare an operational and financial appraisal.",
      ],
      decision: "Is the scheme viable across planning, registration and funding?",
      documents: ["Use-class and planning check", "Registration route", "Operational appraisal"],
      professionals: ["Planning consultant", "Care / registration specialist", "Commercial adviser"],
      afterwards: "If viable, we secure the permissions and prepare for registration.",
    },
    {
      n: 4,
      title: "Get permission",
      clientSees: "Secure planning permission and prepare registration.",
      collapsedNote: "You'll deal with this once viability is confirmed.",
      actions: [
        "Prepare and submit the planning application for the use.",
        "Design layouts to meet care and accessibility standards.",
        "Begin the operator registration process.",
      ],
      decision: "Which consents and registrations apply, and in what order?",
      documents: ["Proposed plans", "Planning statement", "Registration pre-application"],
      professionals: ["Architect", "Planning consultant", "Registration specialist"],
      afterwards: "With permission secured, the scheme is made buildable.",
    },
    {
      n: 5,
      title: "Make it buildable",
      clientSees: "Design fire, accessibility, structure and care-standard fit-out.",
      collapsedNote: "The detailed fire, accessibility and technical stage.",
      actions: [
        "Produce Building Regulations drawings to care standards.",
        "Design fire strategy, escape and detection for the client group.",
        "Specify accessible bathrooms, hoists, nurse call and services.",
      ],
      decision: "Does the design meet both building and care-operator standards?",
      documents: ["Building Regulations package", "Fire strategy", "Care-standard specification"],
      professionals: ["Architect", "Fire consultant", "Structural / M&E engineers", "Building control"],
      afterwards: "The completed design goes out to contractors.",
    },
    {
      n: 6,
      title: "Deliver the project",
      clientSees: "Appoint a contractor and complete the works.",
      collapsedNote: "Tendering, contracts and construction.",
      actions: [
        "Tender to contractors experienced in care fit-out.",
        "Agree a building contract.",
        "Set up inspections against care and building standards.",
      ],
      decision: "Which contractor best understands care requirements?",
      documents: ["Tender pack", "Building contract", "Programme"],
      professionals: ["Main contractor", "Contract administrator", "Specialist trades"],
      afterwards: "Construction completes and is signed off.",
    },
    {
      n: 7,
      title: "Complete and operate",
      clientSees: "Sign off, register and open the service.",
      collapsedNote: "Completion, registration and operation.",
      actions: [
        "Obtain completion and building-control sign-off.",
        "Complete operator registration and inspections.",
        "Appoint or hand over to the operator and open.",
      ],
      decision: "Operate directly or lease to a registered operator?",
      documents: ["Completion certificate", "Registration approval", "Operational policies"],
      professionals: ["Care / registration specialist", "Lease adviser", "Managing operator"],
      afterwards: "The service is open — PlotWorthy stays available for expansion or renewal.",
    },
  ],
};

// "Not sure yet" and "New build" are surfaced but route to guidance / adviser.
export const JOURNEYS: Journey[] = [extension, houseToFlats, officeToResi, hmo, care];

export function getJourney(slug: string): Journey | undefined {
  return JOURNEYS.find((j) => j.slug === slug);
}
