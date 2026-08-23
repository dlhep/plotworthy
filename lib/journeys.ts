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

// ---------------------------------------------------------------------------
// New build — a new home / self-build on a plot
// ---------------------------------------------------------------------------
const newBuild: Journey = {
  slug: "new-build",
  name: "Build a new home",
  shortName: "New build",
  emoji: "🧱",
  tagline: "Take a plot of land through to a finished, warranted new home.",
  intro:
    "A new build gives you the most control of any project — but it lives or dies on the plot, its planning position and the numbers. PlotWorthy walks you from land to finished home one decision at a time, and brings in the right professional exactly when you need them.",
  defaultStage: 0,
  stages: [
    {
      n: 1,
      title: "Your goal",
      clientSees: "Decide what you want to build and why.",
      collapsedNote: "Where the journey begins — your brief.",
      actions: [
        "Describe the home you want to build — size, style and number of bedrooms.",
        "Decide whether it's to live in, to sell, or to rent out.",
        "Set a rough budget and how hands-on you want to be (self-manage, contractor or turnkey).",
      ],
      decision: "What are you building, for whom, and to what budget?",
      documents: ["Rough budget", "Accommodation you want", "Your goals for the finished home"],
      professionals: ["PlotWorthy adviser (brief definition)"],
      afterwards: "We confirm the plot you'll build on, or help you work out what to look for.",
    },
    {
      n: 2,
      title: "The property",
      clientSees: "Confirm the plot — one you own, one you're considering, or one to find.",
      collapsedNote: "You'll confirm the plot before viability.",
      actions: [
        "Tell us whether you own the plot, are considering one, or need help finding land.",
        "Gather the plot's boundaries, access, tenure and any existing planning history.",
        "Check what services (water, drainage, power) reach the plot.",
      ],
      decision: "Is this the right plot, and does it have — or could it get — planning?",
      documents: ["Plot address and boundaries", "Tenure and access rights", "Any existing planning permission"],
      professionals: ["Land agent / sourcing", "Surveyor", "Valuer"],
      afterwards: "With the plot confirmed, we test whether a new home there actually stacks up.",
    },
    {
      n: 3,
      title: "Is it viable?",
      clientSees: "Establish whether a new home can be built here — and whether the numbers work.",
      collapsedNote: "The go / no-go stage before you commit money.",
      actions: [
        "Check the planning potential and any local policy or constraints for the plot.",
        "Assess ground conditions, access and services, and the likely build cost.",
        "Compare total cost (land + build + fees) against the finished value.",
      ],
      decision: "Does this stack up — on planning, ground conditions and the numbers — before you spend on design?",
      documents: [
        "Planning potential / pre-application view",
        "Ground and services information",
        "Cost vs end-value appraisal",
      ],
      professionals: ["Architect (feasibility)", "Planning consultant", "Commercial / finance adviser"],
      afterwards: "If it's viable, you move to securing planning permission for your home.",
    },
    {
      n: 4,
      title: "Get permission",
      clientSees: "Design your home and secure planning permission.",
      collapsedNote: "You'll deal with this once viability is confirmed.",
      actions: [
        "Decide between outline and full planning permission.",
        "Develop a design that fits the plot and local planning policy.",
        "Prepare and submit the planning application, with any supporting reports.",
      ],
      decision: "What design will win permission, and by which route?",
      documents: ["Site and proposed drawings", "Design & access / planning statement", "Any specialist reports (ecology, flood, access)"],
      professionals: ["Architect", "Planning consultant", "Specialist consultants"],
      afterwards: "With permission in place, the design is worked up into a buildable, warranted package.",
    },
    {
      n: 5,
      title: "Make it buildable",
      clientSees: "Turn the approved design into a compliant, warrantable technical package.",
      collapsedNote: "The detailed structural, energy and building-control stage.",
      actions: [
        "Develop Building Regulations drawings, foundation and structural design.",
        "Complete the energy (SAP) assessment and specify insulation and services.",
        "Appoint building control and a structural warranty provider.",
      ],
      decision: "Is the design fully compliant, warrantable and ready to price and build?",
      documents: [
        "Building Regulations & structural drawings",
        "SAP / energy assessment",
        "Foundation design for the ground conditions",
      ],
      professionals: ["Architect", "Structural engineer", "SAP / energy assessor", "Building control & warranty"],
      afterwards: "With a buildable package, you appoint who will build it.",
    },
    {
      n: 6,
      title: "Deliver the project",
      clientSees: "Choose how to build it, agree a contract, and construct your home.",
      collapsedNote: "Tendering, contracts and construction.",
      actions: [
        "Decide how to build — self-manage, a main contractor, or a turnkey package.",
        "Compare quotes on a like-for-like basis and agree a proper contract.",
        "Manage the build with staged payments tied to inspections.",
      ],
      decision: "Who builds it, under what contract, and how are cost and quality controlled?",
      documents: ["Tender package", "Building contract", "Construction programme and payment schedule"],
      professionals: ["Main contractor / builder", "Contract administrator", "Structural warranty inspector"],
      afterwards: "As the build completes, you close it out and move in — or sell.",
    },
    {
      n: 7,
      title: "Complete and operate",
      clientSees: "Sign the home off, get your warranty, and move in or sell.",
      collapsedNote: "Completion, warranty and handover.",
      actions: [
        "Get building-control completion sign-off and your structural warranty.",
        "Resolve snags before releasing the final payment.",
        "Reclaim self-build VAT where eligible, then occupy or sell.",
      ],
      decision: "Is everything signed off, warranted and documented for living in or selling?",
      documents: ["Completion certificate", "Structural warranty", "Certificates, warranties and VAT reclaim paperwork"],
      professionals: ["Building control & warranty", "Builder", "Sales agent (if selling)"],
      afterwards: "Your new home is complete — keep the certificates and warranties safe.",
    },
  ],
};

// "Not sure yet" is surfaced but routes to guidance / adviser.
export const JOURNEYS: Journey[] = [extension, houseToFlats, officeToResi, hmo, care, newBuild];

export function getJourney(slug: string): Journey | undefined {
  return JOURNEYS.find((j) => j.slug === slug);
}

// ---------------------------------------------------------------------------
// Deeper detail for the stage a client is actively working through.
// Keyed by journey slug, then stage number (1–7).
// ---------------------------------------------------------------------------
export type StageExtra = {
  overview: string;
  considerations: string[];
  timescale: string;
  leads: string;
};

export const STAGE_EXTRA: Record<string, Record<number, StageExtra>> = {
  extension: {
    1: { overview: "This stage turns a vague ambition into a clear, costed brief everyone can work to.", considerations: ["Be honest about budget — design to it, not beyond it.", "Separate must-haves from nice-to-haves early.", "Think about how you'll live on-site during the works."], timescale: "Usually 1–2 weeks of thinking and gathering.", leads: "You, with a PlotWorthy adviser." },
    2: { overview: "Here you pin down the facts about the home the project will be built on.", considerations: ["Old or missing drawings can slow everything later.", "Boundaries, drains and trees often dictate what's possible.", "Neighbours matter — especially for anything near a boundary."], timescale: "1–3 weeks, faster if plans already exist.", leads: "You, with a surveyor if needed." },
    3: { overview: "The go/no-go stage: what can realistically be built, under which route, and roughly at what cost.", considerations: ["Permitted development can save months — but not every home qualifies.", "A conservation area or listing changes the rules significantly.", "A rough cost range now prevents an expensive surprise later."], timescale: "2–4 weeks for a feasibility view.", leads: "An architect and, if needed, a planning consultant." },
    4: { overview: "Work the design up to the standard a planning application needs, then submit and manage it.", considerations: ["A well-prepared application is far more likely to be approved first time.", "Pre-application advice from the council can de-risk the submission.", "Determination typically takes around 8 weeks once validated."], timescale: "8–12 weeks including preparation.", leads: "Your architect and planning consultant." },
    5: { overview: "Turn the approved design into a fully specified, structurally sound package a builder can price and build from.", considerations: ["Structural calculations are needed for any new openings or spans.", "Party-wall agreements can take weeks — start them early.", "Clear drawings reduce disputes and variations on site."], timescale: "3–6 weeks.", leads: "Architect, structural engineer and building control." },
    6: { overview: "Choose the right builder on more than price, agree a proper contract, and keep the works on track.", considerations: ["Compare like-for-like quotes, not just headline figures.", "A written contract with staged payments protects both sides.", "Agree how variations and delays will be handled up front."], timescale: "Tendering 3–6 weeks; build varies by scope.", leads: "Your builder, with a contract administrator." },
    7: { overview: "Close the project out properly — sign-off, snagging, and the paperwork you'll need later.", considerations: ["Don't release final payment until snags are resolved.", "Keep completion certificates and warranties safe for selling or letting.", "Update buildings insurance to reflect the new value."], timescale: "1–2 weeks to close out.", leads: "You, with your builder and building control." },
  },
  "house-to-flats": {
    1: { overview: "Set out how many flats, what size and mix, and whether you'll sell, let or hold — the numbers that drive everything else.", considerations: ["The right unit mix depends on the building and local demand.", "Selling, letting and holding carry very different tax and finance implications.", "Be realistic about budget before committing to a scheme."], timescale: "1–2 weeks.", leads: "You, with a PlotWorthy adviser." },
    2: { overview: "Confirm the building and gather the facts that decide whether it can be subdivided at all.", considerations: ["Ceiling heights, access and light limit how many flats work.", "Parking and amenity space are common planning sticking points.", "Existing tenants or leases can complicate timing."], timescale: "1–3 weeks.", leads: "You, with a surveyor and valuer." },
    3: { overview: "Test the number of flats against planning policy and space standards, and check the numbers still work.", considerations: ["Councils often resist over-intensive conversions — precedent matters.", "Every flat must meet national space standards to be lettable or sellable.", "Build cost plus purchase must leave room in the end value."], timescale: "3–5 weeks.", leads: "Architect, planning consultant and a commercial adviser." },
    4: { overview: "Design compliant flat layouts and secure planning permission for the change of use.", considerations: ["Amenity, parking and refuse/cycle storage are frequent conditions.", "Strong supporting statements improve approval odds.", "Allow around 8 weeks for determination after validation."], timescale: "8–12 weeks.", leads: "Architect and planning consultant." },
    5: { overview: "Design the fire separation, sound insulation and structure that make each flat independently compliant.", considerations: ["Compartmentation and fire separation between flats are non-negotiable.", "Acoustic separation is a Building Regs requirement, not a nicety.", "Separate metering and services must be planned into the design."], timescale: "4–6 weeks.", leads: "Architect, structural and fire engineers, building control." },
    6: { overview: "Appoint a capable builder, agree the contract, and run the conversion to completion.", considerations: ["Conversions uncover surprises — keep a contingency.", "Stage payments tied to inspections protect your cash.", "A single point of responsibility avoids gaps between trades."], timescale: "Tender 3–6 weeks; build varies.", leads: "Builder and contract administrator." },
    7: { overview: "Sign off each flat, set up the leases and freehold structure, and sell or let.", considerations: ["Leases and any freehold company should be set up before sale.", "Each flat needs its own EPC and safety certificates.", "Sales and lettings timing affects your cash-flow and finance."], timescale: "2–6 weeks to set up; sales vary.", leads: "Lease adviser/conveyancer and a sales or letting agent." },
  },
  "office-to-residential": {
    1: { overview: "Decide the residential product — number, size and tenure of homes — that suits the building and the market.", considerations: ["The building's floorplate shapes what homes are possible.", "Sale versus rent changes your finance and design decisions.", "Set the exit plan before committing."], timescale: "1–2 weeks.", leads: "You, with a PlotWorthy adviser." },
    2: { overview: "Confirm the commercial building, its use class and its legal and tenancy position.", considerations: ["Current use class determines the conversion route.", "Existing leases and vacancy dates drive your timeline.", "Older commercial buildings can hide structural and services issues."], timescale: "2–4 weeks.", leads: "You, with a surveyor and commercial agent." },
    3: { overview: "Establish the consent route (often prior approval) and test light, space and the development numbers.", considerations: ["Class MA prior approval has qualifying criteria — check them carefully.", "Daylight, noise and flood assessments can make or break approval.", "An appraisal confirms the scheme stacks up before you spend."], timescale: "3–6 weeks.", leads: "Architect, planning consultant and a commercial adviser." },
    4: { overview: "Secure prior approval or full permission, providing the technical evidence the council requires.", considerations: ["Prior approval is faster but only covers specified matters.", "Missing reports (light, noise, contamination) cause refusals.", "Determination periods differ between prior approval and full planning."], timescale: "8–12 weeks.", leads: "Planning consultant, architect and specialists." },
    5: { overview: "Design the structure, fire strategy, façade, insulation and services that turn a commercial shell into compliant homes.", considerations: ["Fire strategy and means of escape are critical in larger buildings.", "Existing structure may need strengthening or adaptation.", "M&E and insulation upgrades are often the biggest cost."], timescale: "5–8 weeks.", leads: "Architect, structural, fire and M&E engineers, building control." },
    6: { overview: "Appoint a main contractor, agree a building contract, and manage cost and progress to completion.", considerations: ["Larger schemes benefit from a QS and project manager.", "Fixed-price contracts transfer more risk to the contractor.", "Regular monitoring keeps cost and programme under control."], timescale: "Tender 4–8 weeks; build varies by scale.", leads: "Main contractor, project manager and quantity surveyor." },
    7: { overview: "Complete, warranty and hand over the homes, then sell or let them.", considerations: ["A recognised building warranty aids sales and mortgages.", "Completion certificates are needed before occupation.", "Phased handover can bring cash in sooner on larger schemes."], timescale: "2–6 weeks to close out.", leads: "Lease adviser/conveyancer and a sales or letting agent." },
  },
  hmo: {
    1: { overview: "Define the kind of HMO you want, who it's for, and the return you're targeting — the brief the whole project serves.", considerations: ["Student, professional and supported HMOs have very different requirements.", "Article 4 areas and licensing shape what's viable before you start.", "Be clear how hands-on you want to be — it drives the model."], timescale: "1–2 weeks to shape the brief.", leads: "You, with a PlotWorthy adviser." },
    2: { overview: "Confirm the property — owned, under offer, or to be found — and gather the facts that decide if it can work as an HMO.", considerations: ["Room sizes and layout determine lettable bedrooms and compliance.", "Leasehold or existing tenants can restrict or delay conversion.", "A sourcing agent can find stock that already suits HMO use."], timescale: "1–4 weeks, depending on whether you're buying.", leads: "You, with a sourcing agent, valuer or surveyor." },
    3: { overview: "The go/no-go stage — confirm occupant numbers, the planning and Article 4 position, and that the layout can meet HMO standards before you spend on design.", considerations: ["An Article 4 direction may remove permitted-development rights for HMOs.", "Licensing thresholds (mandatory or additional) vary by council and size.", "Room sizes, amenities and fire escape must all work at the proposed occupancy."], timescale: "2–4 weeks for a feasibility and compliance view.", leads: "An architect, a planning consultant and a finance/commercial adviser." },
    4: { overview: "Secure the planning permission (where needed) and the correct HMO licence, in the right order.", considerations: ["Sui generis / large HMOs usually need full planning permission.", "Licence conditions can dictate room sizes, amenities and fire measures.", "Start the licence application early — councils can be slow."], timescale: "8–16 weeks across planning and licensing.", leads: "Planning consultant, architect and a licensing specialist." },
    5: { overview: "Turn the approved scheme into a fire-safe, Building-Regs-compliant technical design — fire doors, escape routes, detection and amenity provision to the HMO standard.", considerations: ["Fire strategy, compartmentation and detection are the heart of HMO compliance.", "Escape routes and travel distances must meet the standard for the occupancy.", "Amenity standards for kitchens and bathrooms scale with occupant numbers."], timescale: "3–6 weeks.", leads: "Architect, structural engineer, fire consultant and building control." },
    6: { overview: "Appoint a builder experienced in HMO conversions, agree a proper contract, and complete the works to the compliant spec.", considerations: ["Use a builder who understands HMO fire and compliance detailing.", "Stage payments against inspections keep quality and cash aligned.", "Keep evidence of compliant installation for licensing sign-off."], timescale: "Tender 3–6 weeks; build typically 8–16 weeks.", leads: "Builder/contractor, with a contract administrator." },
    7: { overview: "Get building-control and licensing sign-off, obtain the safety certificates, then let and manage the finished HMO.", considerations: ["Gas, electrical (EICR) and fire certificates are required to let legally.", "Self-management versus a managing agent affects your time and returns.", "Licences and certificates need renewing — diarise the dates."], timescale: "1–3 weeks to sign off and market.", leads: "Letting/managing agent and a licensing specialist." },
  },
  care: {
    1: { overview: "Define the care model, the people it serves and how it's funded — decisions that shape planning, registration and design.", considerations: ["The client group sets the accessibility and support requirements.", "Operating yourself versus leasing to an operator changes everything downstream.", "Funding source (self-funded or commissioned) affects viability."], timescale: "2–4 weeks to define the model.", leads: "You, with a care/commissioning specialist." },
    2: { overview: "Confirm the property and assess whether it suits the care model on use class, accessibility, location and space.", considerations: ["Accessibility and space standards are demanding for care use.", "Use class (C2 versus C3) affects planning from the outset.", "Location relative to services and staff matters for operation."], timescale: "2–4 weeks.", leads: "You, with a surveyor and valuer." },
    3: { overview: "Test the use class and planning route, the registration route, and whether the numbers and operations work.", considerations: ["C2 registered care and C3 supported living follow different routes.", "Registration standards (e.g. CQC) shape the building and operation.", "An operational appraisal confirms staffing and funding stack up."], timescale: "3–6 weeks.", leads: "Planning consultant, a care/registration specialist and a commercial adviser." },
    4: { overview: "Secure planning for the use, design to care and accessibility standards, and begin the registration process.", considerations: ["Planning and registration run in parallel — sequence them well.", "Layouts must meet both planning and care-operator standards.", "Early pre-application with the regulator de-risks registration."], timescale: "8–16 weeks across planning and registration.", leads: "Architect, planning consultant and a registration specialist." },
    5: { overview: "Design the fire strategy, accessibility, structure and care-standard fit-out — hoists, accessible bathrooms, nurse call and services.", considerations: ["Fire strategy must suit residents who may need help to evacuate.", "Accessible bathrooms, hoists and nurse-call systems need designing in.", "The build must satisfy both Building Regs and operator standards."], timescale: "5–8 weeks.", leads: "Architect, fire consultant, structural/M&E engineers and building control." },
    6: { overview: "Appoint a contractor experienced in care fit-out and complete the works to both building and care standards.", considerations: ["Care fit-out is specialist — experience matters.", "Inspect against care standards as well as Building Regs.", "Coordinate with the operator's mobilisation timeline."], timescale: "Build varies by scale; allow a generous programme.", leads: "Main contractor and a contract administrator." },
    7: { overview: "Complete the build, achieve registration, and open the service — directly or via a registered operator.", considerations: ["Registration approval is required before you can operate.", "Operational policies and staffing must be in place to open.", "Leasing to a registered operator can de-risk running it."], timescale: "Registration can take weeks to months.", leads: "A care/registration specialist, lease adviser and the operator." },
  },
  "new-build": {
    1: { overview: "This stage turns the idea of building your own home into a clear, costed brief.", considerations: ["Design to a realistic budget, including land, build and fees.", "Be honest about how hands-on you can be — it drives the build route.", "A replacement dwelling and a bare plot follow different planning paths."], timescale: "1–2 weeks to shape the brief.", leads: "You, with a PlotWorthy adviser." },
    2: { overview: "Confirm the plot and gather the facts that decide whether a home can be built on it.", considerations: ["A plot with planning already granted removes a lot of risk.", "Access, boundaries and services can make or break a plot.", "Check for covenants, rights of way and ransom strips."], timescale: "1–4 weeks, longer if you're still searching.", leads: "You, with a surveyor and valuer." },
    3: { overview: "The go/no-go stage — planning potential, ground conditions and whether the numbers work before you spend on design.", considerations: ["Poor ground or awkward services can add serious cost.", "Local policy and any designations shape what you can build.", "Land plus build plus fees must leave room in the end value."], timescale: "3–6 weeks for a feasibility view.", leads: "An architect, a planning consultant and a finance/commercial adviser." },
    4: { overview: "Design a home that suits the plot and local policy, then secure planning permission.", considerations: ["Outline permission tests the principle; full permission approves the detail.", "Pre-application advice from the council de-risks the submission.", "Design quality and neighbour impact drive planning decisions."], timescale: "8–14 weeks including preparation.", leads: "Your architect and planning consultant." },
    5: { overview: "Turn the approved design into a compliant, warrantable package — structure, foundations, energy and services.", considerations: ["Foundation design depends heavily on the ground conditions.", "A structural warranty is usually needed for mortgages and resale.", "Energy (SAP) and airtightness standards must be designed in early."], timescale: "5–8 weeks.", leads: "Architect, structural engineer, SAP assessor and building control/warranty." },
    6: { overview: "Choose how to build — self-manage, main contractor or turnkey — agree a contract and construct the home.", considerations: ["Each build route trades cost against time and your involvement.", "A fixed-price contract transfers more risk to the builder.", "Keep a healthy contingency — new builds uncover surprises too."], timescale: "Build typically 9–18 months by scale and route.", leads: "Main contractor or package company, with a contract administrator." },
    7: { overview: "Complete the home, get sign-off and warranty, then move in or sell — and reclaim self-build VAT where eligible.", considerations: ["Don't release final payment until snags are resolved.", "Keep the completion certificate and structural warranty safe.", "Self-builders can often reclaim VAT on eligible costs."], timescale: "2–4 weeks to close out.", leads: "You, with building control, your builder and the warranty provider." },
  },
};

export function getStageExtra(slug: string, n: number): StageExtra | undefined {
  return STAGE_EXTRA[slug]?.[n];
}

// ---------------------------------------------------------------------------
// Hub-level information: about-the-project facts + best-practice resources.
// ---------------------------------------------------------------------------
export type Resource = { label: string; host: string; url: string };
export type HubInfo = {
  timescale: string;
  consents: string;
  watch: string;
  resources: Resource[];
};

export const HUB_INFO: Record<string, HubInfo> = {
  extension: {
    timescale: "Typically 4–8 months, brief to completion.",
    consents: "Permitted development or full planning · Building Regulations · Party Wall Act.",
    watch: "Boundaries, party walls and conservation-area status shape what's possible.",
    resources: [
      { label: "Planning Portal — common householder projects", host: "planningportal.co.uk", url: "https://www.planningportal.co.uk/permission/common-projects" },
      { label: "When you need planning permission", host: "gov.uk", url: "https://www.gov.uk/planning-permission-england-wales" },
      { label: "Party Wall etc. Act 1996 — guidance", host: "gov.uk", url: "https://www.gov.uk/guidance/party-wall-etc-act-1996-guidance" },
      { label: "Building Regulations approval", host: "gov.uk", url: "https://www.gov.uk/building-regulations-approval" },
    ],
  },
  "house-to-flats": {
    timescale: "Typically 6–12 months, brief to completion.",
    consents: "Planning permission for change of use · space standards · fire & acoustic separation.",
    watch: "Every flat must meet space standards and independent fire/sound separation.",
    resources: [
      { label: "Change of use — planning", host: "gov.uk", url: "https://www.gov.uk/government/publications/change-of-use" },
      { label: "Nationally Described Space Standard", host: "gov.uk", url: "https://www.gov.uk/government/publications/technical-housing-standards-nationally-described-space-standard" },
      { label: "Approved Document B — fire safety", host: "gov.uk", url: "https://www.gov.uk/government/publications/fire-safety-approved-document-b" },
      { label: "Approved Document E — sound insulation", host: "gov.uk", url: "https://www.gov.uk/government/publications/resistance-to-sound-approved-document-e" },
    ],
  },
  "office-to-residential": {
    timescale: "Typically 8–14 months, brief to completion.",
    consents: "Prior approval (Class MA) or full planning · daylight, fire & structural upgrades.",
    watch: "Class MA prior approval has qualifying criteria; daylight and fire are decisive.",
    resources: [
      { label: "When is permission required (incl. Class MA)", host: "gov.uk", url: "https://www.gov.uk/guidance/when-is-permission-required" },
      { label: "Planning Portal — change of use", host: "planningportal.co.uk", url: "https://www.planningportal.co.uk/permission/common-projects/change-of-use" },
      { label: "BRE — daylight & sunlight", host: "bregroup.com", url: "https://www.bregroup.com/" },
      { label: "Building Regulations approval", host: "gov.uk", url: "https://www.gov.uk/building-regulations-approval" },
    ],
  },
  hmo: {
    timescale: "Typically 4–9 months, brief to letting.",
    consents: "Planning (often) · HMO licence · Article 4 · fire safety standards.",
    watch: "Article 4 directions and licensing thresholds vary by council — check early.",
    resources: [
      { label: "House in multiple occupation licence", host: "gov.uk", url: "https://www.gov.uk/house-in-multiple-occupation-licence" },
      { label: "Renting out a property — HMO rules", host: "gov.uk", url: "https://www.gov.uk/renting-out-a-property/houses-in-multiple-occupation" },
      { label: "LGA / LACORS fire safety guidance", host: "local.gov.uk", url: "https://www.local.gov.uk/" },
      { label: "Nationally Described Space Standard", host: "gov.uk", url: "https://www.gov.uk/government/publications/technical-housing-standards-nationally-described-space-standard" },
    ],
  },
  care: {
    timescale: "Typically 9–18 months, brief to opening.",
    consents: "Use class (C2/C3) · planning · CQC / operator registration · accessibility.",
    watch: "Registration standards and accessibility shape the building from the outset.",
    resources: [
      { label: "CQC — registering a service", host: "cqc.org.uk", url: "https://www.cqc.org.uk/guidance-providers/registration" },
      { label: "Use classes (incl. C2)", host: "gov.uk", url: "https://www.gov.uk/guidance/use-classes" },
      { label: "Approved Document M — access", host: "gov.uk", url: "https://www.gov.uk/government/publications/access-to-and-use-of-buildings-approved-document-m" },
      { label: "CQC — supported living", host: "cqc.org.uk", url: "https://www.cqc.org.uk/" },
    ],
  },
  "new-build": {
    timescale: "Typically 12–24 months, plot to completion.",
    consents: "Outline / full planning permission · Building Regulations · structural warranty · CIL.",
    watch: "The plot's planning position, ground conditions and services access make or break the numbers.",
    resources: [
      { label: "Planning permission — new homes", host: "gov.uk", url: "https://www.gov.uk/planning-permission-england-wales" },
      { label: "Self build and custom housebuilding", host: "gov.uk", url: "https://www.gov.uk/guidance/self-build-and-custom-housebuilding" },
      { label: "Building Regulations approval", host: "gov.uk", url: "https://www.gov.uk/building-regulations-approval" },
      { label: "Community Infrastructure Levy", host: "gov.uk", url: "https://www.gov.uk/guidance/community-infrastructure-levy" },
    ],
  },
};

export function getHubInfo(slug: string): HubInfo | undefined {
  return HUB_INFO[slug];
}

export function journeyDisciplineRoles(journey: Journey): string[] {
  // First professional role string seen for each distinct discipline area.
  const seen = new Set<string>();
  const out: string[] = [];
  journey.stages.forEach((s) =>
    s.professionals.forEach((p) => {
      const key = p.toLowerCase();
      if (!seen.has(key) && !key.includes("adviser")) {
        seen.add(key);
        out.push(p);
      }
    })
  );
  return out;
}
