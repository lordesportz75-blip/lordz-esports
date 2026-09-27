export interface Player {
  id: string;
  ign: string;
  realName: string;
  jerseyNumber?: string;
  role: "IGL" | "RUSHER" | "SNIPER" | "SUPPORT" | "FRAGGER";
  game: string;
  team: string;
  about: string;
  instagram: string;
  image?: string;
  avatarUrl?: string;
  featuredQuote?: string;
  kdRatio?: string;
  headshotRate?: string;
  matchesPlayed?: number;
  avatarBg?: string;
  isCaptain?: boolean;
}

export const playersData: Player[] = [
  {
    id: "player-beast",
    ign: "LORD ZORO",
    realName: "Zoro",
    jerseyNumber: "00",
    role: "IGL",
    game: "FREE FIRE MAX",
    team: "LORDZ ESPORTS",
    about: "Tactics win rounds. Pure conviction wins championships.",
    instagram: "@lordz_zoro",
    image: "https://res.cloudinary.com/jonhcrfa/image/upload/f_auto,q_auto,w_500/v1789908131/lordz-esports/players/xvmfygpyoqrv2syc4yjv.png",
    avatarUrl: "https://res.cloudinary.com/jonhcrfa/image/upload/f_auto,q_auto,w_500/v1789908131/lordz-esports/players/xvmfygpyoqrv2syc4yjv.png",
    featuredQuote: "Tactics win rounds. Pure conviction wins championships.",
    avatarBg: "insta:@lordz_zoro",
    isCaptain: true,
  },
  {
    id: "player-shadow",
    ign: "LORD DINESH",
    realName: "Dinesh",
    jerseyNumber: "07",
    role: "SUPPORT",
    game: "FREE FIRE MAX",
    team: "LORDZ ESPORTS",
    about: "First through the smoke, last man standing.",
    instagram: "@lordz_shadow",
    image: "https://res.cloudinary.com/jonhcrfa/image/upload/f_auto,q_auto,w_500/v1789908246/lordz-esports/players/ys7yajdrrkxnlgjefydc.png",
    avatarUrl: "https://res.cloudinary.com/jonhcrfa/image/upload/f_auto,q_auto,w_500/v1789908246/lordz-esports/players/ys7yajdrrkxnlgjefydc.png",
    featuredQuote: "First through the smoke, last man standing.",
    avatarBg: "insta:@lordz_shadow",
    isCaptain: false,
  },
  {
    id: "player-falcon",
    ign: "LORD HAR!SH",
    realName: "Harish",
    jerseyNumber: "21",
    role: "SNIPER",
    game: "FREE FIRE MAX",
    team: "LORDZ ESPORTS",
    about: "One bullet, one territory secured.",
    instagram: "@lordz_falcon",
    image: "https://res.cloudinary.com/jonhcrfa/image/upload/f_auto,q_auto,w_500/v1789908306/lordz-esports/players/nm6iwfmzkqlmj0nkkpnl.png",
    avatarUrl: "https://res.cloudinary.com/jonhcrfa/image/upload/f_auto,q_auto,w_500/v1789908306/lordz-esports/players/nm6iwfmzkqlmj0nkkpnl.png",
    featuredQuote: "One bullet, one territory secured.",
    avatarBg: "insta:@lordz_falcon",
    isCaptain: false,
  },
  {
    id: "player-viper",
    ign: "LORD LUFFY",
    realName: "Luffy",
    jerseyNumber: "99",
    role: "RUSHER",
    game: "FREE FIRE MAX",
    team: "LORDZ ESPORTS",
    about: "Covering the angles that secure the crown.",
    instagram: "@lordz_viper",
    image: "https://res.cloudinary.com/jonhcrfa/image/upload/f_auto,q_auto,w_500/v1789908353/lordz-esports/players/a5vfklf4rrzu7knkhm66.png",
    avatarUrl: "https://res.cloudinary.com/jonhcrfa/image/upload/f_auto,q_auto,w_500/v1789908353/lordz-esports/players/a5vfklf4rrzu7knkhm66.png",
    featuredQuote: "Covering the angles that secure the crown.",
    avatarBg: "insta:@lordz_viper",
    isCaptain: false,
  },
];
