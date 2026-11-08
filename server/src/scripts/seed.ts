import bcrypt from "bcryptjs";
import { prisma } from "../config/prisma.js";

async function main() {
  console.log("🌱 Starting Lord Esports database seeding...");

  // 1. Create Super Admin
  const adminEmail = process.env.ADMIN_EMAIL || "admin@lordz.gg";
  const adminHash = process.env.ADMIN_PASSWORD_HASH || (await bcrypt.hash("heyramlord28", 10));

  const superAdmin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash: adminHash,
      role: "ADMIN",
      ign: "LORDZ_OVERLORD",
      fullName: "Lordz Administrator",
    },
    create: {
      email: adminEmail,
      passwordHash: adminHash,
      role: "ADMIN",
      ign: "LORDZ_OVERLORD",
      fullName: "Lordz Administrator",
      phone: "+91 98765 00001",
      discord: "admin#0001",
    },
  });
  console.log(`✅ Admin verified: ${adminEmail}`);

  // 2. Additional Admin Account
  await prisma.user.upsert({
    where: { email: "tournaments@lordz.gg" },
    update: { role: "ADMIN" },
    create: {
      email: "tournaments@lordz.gg",
      passwordHash: adminHash,
      role: "ADMIN",
      ign: "LORDZ_MARSHAL",
      fullName: "Tournament Ops Admin",
      phone: "+91 98765 00002",
      discord: "marshal#0002",
    },
  });

  // 3. Seed Tournaments
  const tournaments = [
    {
      id: "fog-season-2",
      title: "FLAME OF GLORY - FINALS",
      game: "FREE FIRE MAX",
      gameCategory: "FREE FIRE MAX",
      status: "LIVE",
      prizePool: "₹50,000",
      entryFee: "FREE ENTRY",
      slots: "32 TEAMS",
      date: "LIVE TODAY • 6:00 PM IST",
      format: "BATTLE ROYALE • 6 MATCHES",
      featured: true,
      tagline: "The pinnacle championship of South Indian esports supremacy.",
      streamUrl: "https://www.youtube.com",
      registeredTeams: 32,
      totalTeams: 32,
    },
    {
      id: "lordz-clutch-cup",
      title: "LORDZ CLUTCH CUP S1",
      game: "FREE FIRE MAX",
      gameCategory: "FREE FIRE MAX",
      status: "UPCOMING",
      prizePool: "₹1,00,000",
      entryFee: "₹250 / SQUAD",
      slots: "64 TEAMS",
      date: "SEP 20, 2026 • 5:00 PM IST",
      format: "BERMUDA & PURGATORY • HARDCORE",
      featured: true,
      tagline: "India's fiercest mobile Free Fire squads clash for the crown.",
      registeredTeams: 48,
      totalTeams: 64,
    },
    {
      id: "tamil-nadu-clash",
      title: "TAMIL NADU INVITATIONAL",
      game: "FREE FIRE MAX",
      gameCategory: "FREE FIRE MAX",
      status: "UPCOMING",
      prizePool: "₹35,000",
      entryFee: "INVITE ONLY",
      slots: "18 TEAMS",
      date: "SEP 25, 2026 • 7:00 PM IST",
      format: "BERMUDA MASTERS",
      featured: false,
      tagline: "Elite regional showdown organized directly by Lordz.",
      registeredTeams: 16,
      totalTeams: 18,
    },
    {
      id: "val-ignite-series",
      title: "IGNITE PROTOCOL: PURGATORY",
      game: "FREE FIRE MAX",
      gameCategory: "FREE FIRE MAX",
      status: "UPCOMING",
      prizePool: "₹75,000",
      entryFee: "FREE ENTRY",
      slots: "32 TEAMS",
      date: "OCT 02, 2026 • 4:00 PM IST",
      format: "BATTLE ROYALE • 6 ROUNDS",
      featured: false,
      tagline: "High-octane Free Fire MAX championship for emerging squads.",
      registeredTeams: 22,
      totalTeams: 32,
    },
    {
      id: "daily-grind-scrims",
      title: "LORDZ DAILY TIER-1 SCRIMS",
      game: "FREE FIRE",
      gameCategory: "FREE FIRE",
      status: "LIVE",
      prizePool: "₹5,000 DAILY",
      entryFee: "FREE VERIFIED",
      slots: "12 TEAMS",
      date: "EVERYDAY • 8:00 PM IST",
      format: "TIER 1 PRO SCRIMS",
      featured: false,
      tagline: "High-cadence tournament preparation against vetted top squads.",
      registeredTeams: 12,
      totalTeams: 12,
    },
    {
      id: "fog-season-1",
      title: "FLAME OF GLORY S1",
      game: "FREE FIRE MAX",
      gameCategory: "FREE FIRE MAX",
      status: "COMPLETED",
      prizePool: "₹25,000",
      entryFee: "COMPLETED",
      slots: "24 TEAMS",
      date: "AUGUST 2026",
      format: "CHAMPIONSHIP FINALS",
      featured: false,
      tagline: "Season 1 concluded with Lord Esports podium triumph.",
      registeredTeams: 24,
      totalTeams: 24,
    },
  ];

  for (const t of tournaments) {
    await prisma.tournament.upsert({
      where: { id: t.id },
      update: t,
      create: t,
    });
  }
  console.log(`✅ Seeded ${tournaments.length} Tournaments`);

  // 4. Seed Tournament Registrations
  const sampleRegistrations = [
    {
      tournamentId: "lordz-clutch-cup",
      teamName: "SOUL WARRIORS",
      captainIgn: "SOUL_VIPER",
      whatsapp: "+91 98765 43210",
      discordTag: "viper#1234",
      status: "APPROVED",
      slotNumber: 1,
    },
    {
      tournamentId: "lordz-clutch-cup",
      teamName: "GODLIKE CLAN",
      captainIgn: "JONATHAN_X",
      whatsapp: "+91 98450 11223",
      discordTag: "jonathan#9988",
      status: "APPROVED",
      slotNumber: 2,
    },
    {
      tournamentId: "tamil-nadu-clash",
      teamName: "VEERA TAMIZHAN",
      captainIgn: "TAMIL_HUNTER",
      whatsapp: "+91 97890 55443",
      discordTag: "hunter#4433",
      status: "PENDING",
    },
    {
      tournamentId: "fog-season-2",
      teamName: "DFG ESPORTS",
      captainIgn: "DFG_MAHESH",
      whatsapp: "+91 99000 88776",
      discordTag: "dfg_lead#0001",
      status: "APPROVED",
      slotNumber: 3,
    },
  ];

  for (const reg of sampleRegistrations) {
    await prisma.tournamentRegistration.create({ data: reg });
  }
  console.log(`✅ Seeded ${sampleRegistrations.length} Sample Registrations`);

  // 5. Seed Matches
  const matches = [
    {
      id: "match-live-1",
      tournamentId: "fog-season-2",
      tournamentName: "FLAME OF GLORY S2",
      status: "LIVE",
      stage: "GRAND FINALS • MATCH 3",
      game: "FREE FIRE MAX",
      map: "BERMUDA",
      teamAName: "LORD ESPORTS",
      teamATag: "LORD",
      teamAScore: 38,
      teamAPoints: 22,
      teamBName: "DFG ESPORTS",
      teamBTag: "DFG",
      teamBScore: 53,
      teamBPoints: 32,
      streamUrl: "https://www.youtube.com",
    },
    {
      id: "match-up-1",
      tournamentId: "fog-season-2",
      tournamentName: "FLAME OF GLORY S2",
      status: "UPCOMING",
      stage: "GRAND FINALS • MATCH 4",
      game: "FREE FIRE MAX",
      map: "PURGATORY",
      teamAName: "LORD ESPORTS",
      teamATag: "LORD",
      teamBName: "TB ESPORTS",
      teamBTag: "TBE",
      startTime: "TODAY • 7:45 PM IST",
      countdownSeconds: 8075,
    },
    {
      id: "match-res-1",
      tournamentId: "fog-season-2",
      tournamentName: "FLAME OF GLORY S2",
      status: "RESULT",
      stage: "GRAND FINALS • MATCH 2",
      game: "FREE FIRE MAX",
      map: "KALAHARI",
      teamAName: "LORD ESPORTS",
      teamATag: "LORD",
      teamAScore: 24,
      teamAPoints: 12,
      teamBName: "EYEGLACIERS",
      teamBTag: "EYE",
      teamBScore: 14,
      teamBPoints: 8,
      winner: "LORD ESPORTS",
    },
  ];

  for (const m of matches) {
    await prisma.match.upsert({
      where: { id: m.id },
      update: m,
      create: m,
    });
  }
  console.log(`✅ Seeded ${matches.length} Match fixtures`);

  // 6. Seed Standings
  const standings = [
    { rank: "01", team: "DFG ESPORTS", tag: "DFG", chickenDinner: "01", matches: "02", position: "21", finishes: "32", total: "53", isTopThree: true, sortOrder: 1 },
    { rank: "02", team: "TB ESPORTS", tag: "TBE", chickenDinner: "01", matches: "02", position: "20", finishes: "31", total: "51", isTopThree: true, sortOrder: 2 },
    { rank: "03", team: "LORD ESPORTS", tag: "LORDZ", chickenDinner: "00", matches: "02", position: "16", finishes: "22", total: "38", isTopThree: true, sortOrder: 3 },
    { rank: "04", team: "EYEGLACIERS", tag: "EYE", chickenDinner: "00", matches: "02", position: "13", finishes: "12", total: "25", isTopThree: false, sortOrder: 4 },
    { rank: "05", team: "DW ESP", tag: "DWE", chickenDinner: "00", matches: "02", position: "10", finishes: "15", total: "25", isTopThree: false, sortOrder: 5 },
    { rank: "06", team: "ELITE BLAZE ESPORTS", tag: "EBE", chickenDinner: "00", matches: "02", position: "12", finishes: "03", total: "15", isTopThree: false, sortOrder: 6 },
    { rank: "07", team: "ST UNITY", tag: "STU", chickenDinner: "00", matches: "02", position: "10", finishes: "03", total: "13", isTopThree: false, sortOrder: 7 },
    { rank: "08", team: "GODLIKE INVINCIBLE", tag: "GLI", chickenDinner: "00", matches: "02", position: "08", finishes: "04", total: "12", isTopThree: false, sortOrder: 8 },
  ];

  for (const s of standings) {
    await prisma.standing.create({
      data: {
        tournamentId: "fog-season-2",
        ...s,
      },
    });
  }
  console.log(`✅ Seeded ${standings.length} Standings rows`);

  // 7. Seed Active Pro Players
  const players = [
    {
      id: "player-beast",
      ign: "BEAST",
      realName: "Akash Sharma",
      jerseyNumber: "00",
      role: "IGL",
      game: "FREE FIRE MAX",
      team: "LORD ESPORTS",
      kdRatio: "4.82",
      headshotRate: "68%",
      matchesPlayed: 142,
      featuredQuote: "Tactics win rounds. Pure conviction wins championships.",
      isCaptain: true,
      sortOrder: 1,
    },
    {
      id: "player-shadow",
      ign: "SHADOW",
      realName: "Vikram Raman",
      jerseyNumber: "07",
      role: "RUSHER",
      game: "FREE FIRE MAX",
      team: "LORD ESPORTS",
      kdRatio: "5.15",
      headshotRate: "72%",
      matchesPlayed: 128,
      featuredQuote: "First through the smoke, last man standing.",
      isCaptain: false,
      sortOrder: 2,
    },
    {
      id: "player-falcon",
      ign: "FALCON",
      realName: "Karthik Raja",
      jerseyNumber: "21",
      role: "SNIPER",
      game: "FREE FIRE MAX",
      team: "LORD ESPORTS",
      kdRatio: "4.40",
      headshotRate: "81%",
      matchesPlayed: 115,
      featuredQuote: "One bullet, one territory secured.",
      isCaptain: false,
      sortOrder: 3,
    },
    {
      id: "player-viper",
      ign: "VIPER",
      realName: "Dinesh Kumar",
      jerseyNumber: "99",
      role: "SUPPORT",
      game: "FREE FIRE MAX",
      team: "LORD ESPORTS",
      kdRatio: "3.95",
      headshotRate: "59%",
      matchesPlayed: 134,
      featuredQuote: "Covering the angles that secure the crown.",
      isCaptain: false,
      sortOrder: 4,
    },
  ];

  for (const p of players) {
    await prisma.player.upsert({
      where: { ign: p.ign },
      update: p,
      create: p,
    });
  }
  console.log(`✅ Seeded ${players.length} Pro Athletes`);

  // 8. Seed Old Players / Legends Section
  const legends = [
    {
      id: "legend-thunder",
      ign: "THUNDER",
      realName: "Praveen Raj",
      role: "FOUNDING RUSHER",
      activeYears: "2023 - 2024",
      retiredJerseyNumber: "10",
      achievements: "Inaugural Booyah MVP, Season 1 Regional Champion, 32 Squad Wipes",
      hallOfFameBio: "Pioneered the hyper-aggressive Clock Tower breach tactics that defined early Lordz dominance. Retired after lifting the Season 1 trophy.",
      sortOrder: 1,
    },
    {
      id: "legend-phantom",
      ign: "PHANTOM",
      realName: "Suresh Iyer",
      role: "TACTICAL SNIPER",
      activeYears: "2022 - 2024",
      retiredJerseyNumber: "03",
      achievements: "88% Career Headshot Accuracy, National Tier-1 Clutch King",
      hallOfFameBio: "Regarded as one of the deadliest AWM sharpshooters in South Indian mobile esports history. Anchored the team during the historic 2023 championship run.",
      sortOrder: 2,
    },
    {
      id: "legend-cyclone",
      ign: "CYCLONE",
      realName: "Aravind Swamy",
      role: "SENIOR STRATEGIST",
      activeYears: "2023 - 2025",
      retiredJerseyNumber: "44",
      achievements: "2x Grand Finals MVP, Hall of Fame Inductee 2025",
      hallOfFameBio: "Architect of Lordz' signature late-zone rotation protocols. Mentored the current roster including Beast and Shadow.",
      sortOrder: 3,
    },
  ];

  for (const l of legends) {
    await prisma.legend.upsert({
      where: { ign: l.ign },
      update: l,
      create: l,
    });
  }
  console.log(`✅ Seeded ${legends.length} Hall of Fame Legends`);

  // 9. Merchandise and News are managed purely dynamically through the Admin Portal.
  // Template/mock products and articles have been removed as per production specifications.

  // 10. Seed Partners
  const partners = [
    { id: "esports-pro", name: "ESPORTS PRO", category: "Tournament Platform", tier: "MAIN SPONSOR", logoImage: "/uploads/partner-esportspro.png", sortOrder: 1 },
    { id: "espotz-live", name: "ESPOTZ LIVE", category: "Livestream Production", tier: "BROADCAST PARTNER", logoImage: "/uploads/partner-espotz.png", sortOrder: 2 },
    { id: "infinix", name: "INFINIX", category: "Official Gaming Smartphone", tier: "MAIN SPONSOR", logoImage: "/uploads/partner-infinix.png", sortOrder: 3 },
    { id: "free-fire-max", name: "FREE FIRE MAX", category: "Official Battle Royale Title", tier: "OFFICIAL PARTNER", logoImage: "/uploads/partner-freefire.png", sortOrder: 4 },
    { id: "fusion-crystals", name: "FUSION CRYSTALS", category: "Energy & Performance", tier: "OFFICIAL PARTNER", logoImage: "/uploads/partner-fusion.png", sortOrder: 5 },
    { id: "esports-world-cup", name: "ESPORTS WORLD CUP", category: "Global Circuit", tier: "OFFICIAL PARTNER", logoImage: "/uploads/partner-ewc.png", sortOrder: 6 },
  ];

  for (const part of partners) {
    await prisma.partner.upsert({
      where: { id: part.id },
      update: part,
      create: part,
    });
  }
  console.log(`✅ Seeded ${partners.length} Partners`);

  // 13. Seed Media Items
  const media = [
    {
      id: "media-sh-1",
      type: "VIDEOS",
      title: "T1 GRAND FINALS HIGHLIGHTS ( LORD.LUFFY)",
      duration: "00:30",
      views: "89K VIEWS",
      date: "LAST WEEK",
      game: "FREE FIRE MAX",
      youtubeId: "o-1d_Ez_LcA",
      thumbnail: "https://img.youtube.com/vi/o-1d_Ez_LcA/hqdefault.jpg",
      tag: "PREMIERE",
      featured: true,
      description: "Official Grand Finals highlights of Lord Esports starring Lord Luffy dominating Bermuda.",
    },
    {
      id: "media-hl-1",
      type: "HIGHLIGHTS",
      title: "BEAST 1v4 CLUTCH TO SECURE MATCH 2 BOOYAH",
      duration: "01:18",
      views: "34K VIEWS",
      date: "YESTERDAY",
      game: "FREE FIRE MAX",
      youtubeId: "sphPuFUveuM",
      thumbnail: "https://img.youtube.com/vi/sphPuFUveuM/hqdefault.jpg",
      tag: "CLUTCH",
      featured: true,
      description: "Insane 1v4 spray transfer in the final zone by team captain Beast to seal the championship booyah.",
    },
    {
      id: "media-vid-1",
      type: "VIDEOS",
      title: "FLAME OF GLORY S2 • OFFICIAL TRAILER & TEAM REVEAL",
      duration: "02:45",
      views: "48K VIEWS",
      date: "2 DAYS AGO",
      game: "FREE FIRE MAX",
      youtubeId: "fJ9rUzIMcZQ",
      thumbnail: "https://img.youtube.com/vi/fJ9rUzIMcZQ/hqdefault.jpg",
      tag: "FEATURED",
      featured: true,
      description: "The grand cinematic reveal of Flame of Glory Season 2, featuring all 32 qualified squads.",
    },
    {
      id: "media-hl-2",
      type: "HIGHLIGHTS",
      title: "LORDZ SQUAD WIPE VS EYEGLACIERS • FINAL CIRCLE",
      duration: "00:54",
      views: "21K VIEWS",
      date: "3 DAYS AGO",
      game: "FREE FIRE MAX",
      youtubeId: "o-1d_Ez_LcA",
      thumbnail: "https://img.youtube.com/vi/o-1d_Ez_LcA/hqdefault.jpg",
      tag: "TOP PLAY",
      featured: true,
      description: "Flawless tactical smoke push and coordinated flank eliminating the tournament favorites.",
    },
  ];

  for (const m of media) {
    await prisma.mediaItem.upsert({
      where: { id: m.id },
      update: m,
      create: m,
    });
  }
  console.log(`✅ Seeded ${media.length} Media items`);

  // 14. Seed Website Settings
  const defaultSettings = [
    { key: "liveTicker", value: "🔥 FLAME OF GLORY S2 GRAND FINALS LIVE NOW • PRIZE POOL ₹50,000 • WATCH STREAM ON YOUTUBE", category: "TICKER" },
    { key: "emergencyBanner", value: "OFFICIAL REGISTRATIONS OPEN FOR LORDZ CLUTCH CUP S1 (₹1,00,000 PRIZE POOL)", category: "HERO" },
    { key: "emergencyBannerActive", value: "true", category: "HERO" },
    { key: "tournamentsCount", value: "25+", category: "STATS" },
    { key: "playersCount", value: "500+", category: "STATS" },
    { key: "teamsCount", value: "50+", category: "STATS" },
    { key: "prizePoolCount", value: "₹5L+", category: "STATS" },
    { key: "discordUrl", value: "https://discord.gg/Q8KR7tU96", category: "SOCIAL" },
    { key: "whatsappUrl", value: "https://whatsapp.com/channel/0029Vb8sSc66hENsTW35hd11", category: "SOCIAL" },
    { key: "whatsappScrimsUrl", value: "https://whatsapp.com/channel/0029Vb8fM218kyySLfM90o0l", category: "SOCIAL" },
    { key: "youtubeUrl", value: "https://youtube.com/@lord-esportz07", category: "SOCIAL" },
    { key: "instagramUrl", value: "https://www.instagram.com/lord.esportz", category: "SOCIAL" },
    { key: "businessEmail", value: "lordesportz75@gmail.com", category: "CONTACT" },
  ];

  for (const s of defaultSettings) {
    await prisma.websiteSetting.upsert({
      where: { key: s.key },
      update: s,
      create: s,
    });
  }
  console.log(`✅ Seeded ${defaultSettings.length} Website settings`);

  // 15. Create Initial Audit Log Entry
  await prisma.auditLog.create({
    data: {
      adminId: superAdmin.id,
      adminEmail: superAdmin.email,
      action: "INITIAL_SEED",
      resource: "Database",
      details: "Seeded initial Lord Esports data and Super Admin account.",
    },
  });

  console.log("🚀 Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
