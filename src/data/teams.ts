export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  ign?: string;
  specialty: string;
}

export interface TeamLead {
  name: string;
  role: string;
  ign: string;
  focus: string;
  avatar?: string;
  statement?: string;
}

export interface TeamDivision {
  id: string;
  number: string;
  name: string;
  shortName: string;
  discipline: string;
  description: string;
  lead: TeamLead;
  responsibilities: string[];
  members: TeamMember[];
}

export interface CollectiveMember {
  id: string;
  name: string;
  handle: string;
  primaryRole: string;
  divisions: string[];
  focus: string;
  avatar?: string;
  initials: string;
  instagram?: string;
  linkedin?: string;
}

export const teamDivisions: TeamDivision[] = [
  {
    id: "tech",
    number: "01",
    name: "Development & Technology",
    shortName: "Technology",
    discipline: "SYSTEMS ARCHITECTURE & PLATFORM ENGINEERING",
    description:
      "Engineering high-concurrency web portals, automated tournament scoring pipelines, encrypted authentication, and athlete passport infrastructure.",
    lead: {
      name: "Jeremiah Paul",
      role: "Lead Systems Architect",
      ign: "LZ_ARCHITECT",
      focus: "Cloud scale, distributed infrastructure & platform security",
      statement: "Reliable systems build championship confidence. Fast, secure, and always operational.",
    },
    responsibilities: [
      "Full-stack web application development & edge cloud performance",
      "Real-time tournament bracket scoring and standings engines",
      "Athlete verification, secure authentication, and session handling",
      "Database architecture, relational integrity, and API scalability",
    ],
    members: [
      {
        id: "mem-karthik",
        name: "Karthik R",
        role: "Senior Frontend Engineer",
        ign: "LZ_FRONTEND",
        specialty: "Interactive web aesthetics, responsive layouts & UX",
      },
      {
        id: "mem-dinesh",
        name: "Dinesh Kumar",
        role: "Backend & Systems Specialist",
        ign: "LZ_SYSTEMS",
        specialty: "Database transactions, data pipelines & API security",
      },
      {
        id: "mem-harish",
        name: "Harish V.",
        role: "Platform QA & Security Auditor",
        ign: "LZ_SENTINEL",
        specialty: "Stress testing, verification audits & bug mitigation",
      },
    ],
  },
  {
    id: "tournaments",
    number: "02",
    name: "Tournament Operations",
    shortName: "Tournament Ops",
    discipline: "MATCH DISCIPLINE & LEAGUE GOVERNANCE",
    description:
      "Managing custom lobby security, match schedules, anti-cheat arbitrations, and live leaderboard calculations across competitive circuits.",
    lead: {
      name: "Silvest AJ",
      role: "Head of Tournament Operations",
      ign: "SILVEST",
      focus: "Rulebook enforcement, dispute resolution & lobby logistics",
      statement: "Integrity is the foundation of competitive gaming. Every point and every circle is audited.",
    },
    responsibilities: [
      "Custom lobby creation, slot verification, and player check-in",
      "Anti-cheat arbitrations and in-game POV screen-recording checks",
      "Live match scoring, placement multipliers, and tiebreaker rules",
      "Captain briefings, rulebook compliance, and bracket coordination",
    ],
    members: [
      {
        id: "mem-dinesh-tourn",
        name: "Dinesh Kumar",
        role: "Match Scrims & Bracket Coordinator",
        ign: "LZ_SYSTEMS",
        specialty: "Lobby bracket tracking & match result verification",
      },
      {
        id: "mem-harish-tourn",
        name: "Harish V.",
        role: "Custom Room Security & Verification",
        ign: "LZ_SENTINEL",
        specialty: "Player identity confirmation & fair play surveillance",
      },
    ],
  },
  {
    id: "admin",
    number: "03",
    name: "Administration & Management",
    shortName: "Administration",
    discipline: "ORGANIZATIONAL GOVERNANCE & STRATEGY",
    description:
      "Directing organizational strategy, financial transparency, merchandise logistics, partner compliance, and athlete contract agreements.",
    lead: {
      name: "Jeremiah Paul",
      role: "Executive Director & Clan Management",
      ign: "LORD_JEREMIAH",
      focus: "Strategic vision, clan expansion & operational discipline",
      statement: "A championship organization requires quiet precision, clear governance, and dedicated people.",
    },
    responsibilities: [
      "Strategic franchise growth and regional competitive roadmap",
      "Financial accounting, prize pool escrow, and sponsor compliance",
      "Merchandise fulfillment coordination and quality management",
      "Clan policies, ethical guidelines, and legal athlete agreements",
    ],
    members: [
      {
        id: "mem-karthik-admin",
        name: "Karthik R",
        role: "Operations & Strategic Alliances",
        ign: "FALCON",
        specialty: "Partner onboarding & tournament scheduling coordination",
      },
      {
        id: "mem-dinesh-admin",
        name: "Dinesh Kumar",
        role: "Logistics & Resource Management",
        ign: "DINESH",
        specialty: "Operational workflows & administrative coordination",
      },
    ],
  },
  {
    id: "creative",
    number: "04",
    name: "Creative & Media Studio",
    shortName: "Creative Media",
    discipline: "VISUAL IDENTITY & BROADCAST PRODUCTION",
    description:
      "Creating tournament broadcast graphics, motion highlights, visual branding kits, match announcement reels, and athlete digital content.",
    lead: {
      name: "Tishbian Meshach S",
      role: "Creative Director & Visual Identity",
      ign: "TISHBIAN",
      focus: "Brand typography, graphic kits & broadcast aesthetics",
      statement: "Every moment of competitive glory deserves timeless, compelling visual storytelling.",
    },
    responsibilities: [
      "Broadcast streaming graphics, overlays, and transition packs",
      "Match highlight montages, motion design, and teaser edits",
      "Official team jersey artwork and brand asset kits",
      "Social media narrative visuals and tournament announcement art",
    ],
    members: [
      {
        id: "mem-deva",
        name: "Deva Dharshan",
        role: "Media Production & Motion Graphics",
        ign: "DEVA",
        specialty: "Video editing, motion lower-thirds & event promos",
      },
      {
        id: "mem-silvest",
        name: "Silvest AJ",
        role: "Broadcast Technical Operator",
        ign: "SILVEST",
        specialty: "OBS Studio stream mixing & multi-camera coordination",
      },
    ],
  },
  {
    id: "talent",
    number: "05",
    name: "Player Development & Talent",
    shortName: "Talent Scouting",
    discipline: "ATHLETE SCOUTING & COMPETITIVE CONDITIONING",
    description:
      "Identifying emerging competitive talent, coordinating daily practice scrims, analyzing tactical gameplay VODs, and conditioning tournament rosters.",
    lead: {
      name: "Karthik R",
      role: "Head of Player Performance & Scouting",
      ign: "FALCON",
      focus: "Rotational strategy, clutch performance & talent scouting",
      statement: "Mechanics open the round; team chemistry and circle anticipation win major championships.",
    },
    responsibilities: [
      "Grassroots scouting across community tournaments and scrims",
      "In-depth match VOD reviews and tactical drop-zone analysis",
      "Aim conditioning, crosshair placement, and reflex routines",
      "Roster synergy coordination and tournament mental composure",
    ],
    members: [
      {
        id: "mem-harish-talent",
        name: "Harish V.",
        role: "Tactical Gameplay Analyst",
        ign: "HARISH",
        specialty: "Zone rotation patterns & utility deployment review",
      },
      {
        id: "mem-deva-talent",
        name: "Deva Dharshan",
        role: "Player Media & Talent Relations",
        ign: "DEVA",
        specialty: "Athlete communications & media availability prep",
      },
    ],
  },
  {
    id: "community",
    number: "06",
    name: "Partnerships & Community",
    shortName: "Community Guild",
    discipline: "COMMUNITY ECOSYSTEMS & PARTNER ENGAGEMENT",
    description:
      "Fostering active clan discussion channels, coordinating community polls, hosting fan giveaways, and managing sponsor partner relationships.",
    lead: {
      name: "HariHaran R",
      role: "Head of Community & Partnerships",
      ign: "HARIHARAN",
      focus: "Community culture, fan safety & brand collaborations",
      statement: "A clan lives through the dedication of its community. We build lasting connections.",
    },
    responsibilities: [
      "Discord community server management and safety moderation",
      "Partner brand activations and collaborative gaming tournaments",
      "Official community MVP elections and interactive voting events",
      "Fan engagement initiatives, giveaways, and announcement channels",
    ],
    members: [
      {
        id: "mem-deva-comm",
        name: "Deva Dharshan",
        role: "Community Events & Engagement",
        ign: "DEVA",
        specialty: "Fan interaction, tournament queries & event hosting",
      },
      {
        id: "mem-tishbian-comm",
        name: "Tishbian Meshach S",
        role: "Brand Design & Partner Media",
        ign: "TISHBIAN",
        specialty: "Partner promotional art & fan club graphics",
      },
    ],
  },
];

export const collectiveMembers: CollectiveMember[] = [
 
  {
    id: "dinesh-s",
    name: "Dinesh S",
    handle: "Developer",
    primaryRole: "Co Founder of Just Three Solutions & Backend,Systems Specialist",
    divisions: ["Developers"],
    focus: "Transactional flows, bracket scoring automation & data consistency",
    initials: "DS",
    avatar: "/members/dinesh.webp",
    instagram: "https://www.instagram.com/__dinesh__s_?stkn=MXFsMWdkaWRuZHJnaw==",
    linkedin: "https://www.linkedin.com/in/sdineshsivakumar/",
  },
   {
    id: "jeremiah-paul",
    name: "Jeremiah Paul",
    handle: "Developer",
    primaryRole: "Co Founder of Just Three Solutions & Lead Systems Architect",
    divisions: ["Developers"],
    focus: "Distributed systems, web infrastructure, platform security & governance",
    initials: "JP",
    avatar: "/members/jeremiah.webp",
    instagram: "https://www.instagram.com/iam_jeremiahpaul_?stkn=OTJka25yYWhkOWRk",
    linkedin: "https://www.linkedin.com/in/jeremiahpaull/",
  },
  {
    id: "karthik-r",
    name: "Karthik R",
    handle: "Developer",
    primaryRole: "Co Founder of Just Three Solutions Senior Frontend Engineer",
    divisions: ["Developers"],
    focus: "Modern web architecture, user experience, scouting & tactical gameplay",
    initials: "KR",
    avatar: "/members/karthik.webp",
    instagram: "https://www.instagram.com/karthi.z7?stkn=MTZsbG4yY25keGk3Mg==",
    linkedin: "https://www.linkedin.com/in/karthikravii/",
  },
  {
    id: "founder",
    name: "Ram",
    handle: "founder",
    primaryRole: "Founder",
    divisions: ["Leadership"],
    focus: "Organizational strategy, franchise roadmap, partnerships & clan leadership",
    initials: "RM",
    avatar: "/members/founder.webp",
    instagram: "https://www.instagram.com/ramm.lifts_?stkn=b3pndzczMm0zZmZo",
  },
  {
    id: "demo-community-manager",
    name: "VARSHINI",
    handle: "COMMUNITY_LEAD",
    primaryRole: "Head of Community & Relations",
    divisions: ["Community"],
    focus: "Discord ecosystem, fan safety, community tournaments & member support",
    initials: "WQ",
    avatar: "/members/varshini.webp",
    instagram: "https://www.instagram.com/warqueen.ff?stkn=MXV1OWEzM2V1dmZhYw==",
  },
  {
    id: "CEO",
    name: "Jaya Surya",
    handle: "CEO",
    primaryRole: "Chief Executive Officer",
    divisions: ["Leadership"],
    focus: "Brand identity, media outreach, franchise operations & content strategy",
    initials: "JS",
    avatar: "/members/surya.webp",
    instagram: "https://www.instagram.com/smiley__surya__07?stkn=dnQzZWt2MDJqcDdy",
  },
];

// Backwards-compatibility for tournament divisions showcase
export interface Team {
  id: string;
  name: string;
  tag: string;
  game: string;
  rank: string;
  points: string;
  winRate: string;
  championships: number;
  rosterCount: number;
  region: string;
  status: "ACTIVE" | "REPRESENTATIVE";
}

export const teamsData: Team[] = [
  {
    id: "lordz-ff-main",
    name: "LORD ESPORTZ",
    tag: "LORD",
    game: "FREE FIRE MAX",
    rank: "#03",
    points: "1,240 PTS",
    winRate: "72%",
    championships: 3,
    rosterCount: 5,
    region: "INDIA (TN)",
    status: "REPRESENTATIVE",
  },
  {
    id: "dfg-esports",
    name: "DFG ESPORTS",
    tag: "DFG",
    game: "FREE FIRE MAX",
    rank: "#01",
    points: "1,480 PTS",
    winRate: "78%",
    championships: 4,
    rosterCount: 5,
    region: "INDIA",
    status: "ACTIVE",
  },
  {
    id: "tb-esports",
    name: "TB ESPORTS",
    tag: "TBE",
    game: "FREE FIRE MAX",
    rank: "#02",
    points: "1,390 PTS",
    winRate: "75%",
    championships: 2,
    rosterCount: 5,
    region: "INDIA",
    status: "ACTIVE",
  },
  {
    id: "eyeglaciers",
    name: "EYEGLACIERS",
    tag: "EYE",
    game: "FREE FIRE MAX",
    rank: "#04",
    points: "1,050 PTS",
    winRate: "64%",
    championships: 1,
    rosterCount: 4,
    region: "INDIA",
    status: "ACTIVE",
  },
  {
    id: "lordz-bgmi",
    name: "LORD BATTLEGROUNDS",
    tag: "LZR",
    game: "BGMI",
    rank: "#08",
    points: "920 PTS",
    winRate: "61%",
    championships: 1,
    rosterCount: 4,
    region: "INDIA",
    status: "REPRESENTATIVE",
  },
  {
    id: "lordz-val",
    name: "LORD PROTOCOL",
    tag: "LZP",
    game: "VALORANT",
    rank: "#12",
    points: "840 PTS",
    winRate: "59%",
    championships: 0,
    rosterCount: 5,
    region: "INDIA",
    status: "REPRESENTATIVE",
  },
];
