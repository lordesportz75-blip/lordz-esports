import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { SectionHeading } from "../components/common/SectionHeading";
import { playersData, type Player } from "../data/players";
import { playersApi } from "../api/players";
import logoImg from "../assets/lordz-logo.png";
import { Crosshair, Shield, Zap, Target } from "lucide-react";

// Social SVG Icons
const InstagramIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

interface PlayersSectionProps {
  showHeader?: boolean;
}

export const PlayersSection = ({ showHeader = true }: PlayersSectionProps) => {
  const [players, setPlayers] = useState<Player[]>(playersData);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  useEffect(() => {
    playersApi
      .getAll()
      .then((data) => {
        if (data && data.length > 0) setPlayers(data);
      })
      .catch(() => {});
  }, []);

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "IGL":
        return <Shield className="h-4 w-4 text-[#FFBE32]" />;
      case "RUSHER":
        return <Zap className="h-4 w-4 text-[#FFBE32]" />;
      case "SNIPER":
        return <Crosshair className="h-4 w-4 text-[#FFBE32]" />;
      default:
        return <Target className="h-4 w-4 text-[#FFBE32]" />;
    }
  };

  return (
    <section
      id="players"
      className={`relative ${showHeader ? "py-24" : "py-12 sm:py-16"} px-4 sm:px-6 lg:px-8 bg-[#050505] overflow-hidden`}
    >
      {/* Background Ambience */}
      <div className="absolute right-0 top-1/4 w-96 h-96 bg-[#FFBE32]/6 blur-[130px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        {showHeader && (
          <SectionHeading
            badge="PRO ROSTER"
            title="MEET THE PLAYERS"
            subtitle="The championship athletes representing LORD ESPORTZ across premier national mobile stages."
          />
        )}

        {/* Players Sports Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {players.map((player) => {
            const isBeast = player.ign === "BEAST" || player.id === "player-beast";
            const isImageFailed = failedImages[player.id];
            const athleteImg = !isImageFailed && (player.image || player.avatarUrl || (isBeast ? "/players/player-beast.jpg" : null));
            const instaHandle = player.instagram?.trim();
            const instaUrl = instaHandle
              ? instaHandle.startsWith("http")
                ? instaHandle
                : `https://instagram.com/${instaHandle.replace(/^@/, "")}`
              : null;

            return (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.2 }}
                whileHover={{ y: -8 }}
                className="group relative flex flex-col justify-between rounded-2xl bg-gradient-to-b from-[#141418] via-[#0C0C0E] to-[#070709] border border-white/10 hover:border-[#FFBE32]/70 p-4 sm:p-5 shadow-[0_15px_40px_rgba(0,0,0,0.8)] hover:shadow-[0_20px_45px_rgba(255,190,50,0.25)] transition-all duration-300 overflow-hidden"
              >
                {/* Top Chamfer Cut & Gold Strip */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#FFBE32] to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />

                <div>
                  {/* Card Header */}
                  <div className="flex items-center justify-between z-10 mb-3">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/70 border border-white/10 text-[10px] font-heading font-bold uppercase tracking-wider text-gray-300">
                      {getRoleIcon(player.role)}
                      <span>{player.role}</span>
                    </div>

                    {/* Indian Region Badge */}
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-black/60 border border-white/5 text-[11px] font-mono">
                      <span className="text-xs" title="India">🇮🇳</span>
                      <span className="text-[10px] font-heading font-bold text-gray-400 tracking-wider">INDIA</span>
                    </div>
                  </div>

                  {/* Athlete Visual Anchor / Player Image */}
                  <div className="relative aspect-[4/5] sm:aspect-[3/4] max-h-[320px] sm:max-h-none w-full rounded-xl overflow-hidden bg-gradient-to-b from-[#181820] to-[#0C0C0E] border border-white/5 flex items-center justify-center mb-4 group-hover:border-[#FFBE32]/40 transition-all shadow-inner">
                    {athleteImg ? (
                      <div className="relative h-full w-full">
                        <img
                          src={athleteImg}
                          alt={`${player.ign} (${player.realName}) - Pro Free Fire Athlete for LORD ESPORTZ`}
                          onError={() => setFailedImages((prev) => ({ ...prev, [player.id]: true }))}
                          loading="eager"
                          decoding="async"
                          className="h-full w-full object-cover object-top filter contrast-105 group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0C0C0E] via-black/20 to-transparent opacity-85" />
                        
                        {/* Overlay Role / Captain Badge */}
                        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between pointer-events-none">
                          {player.isCaptain ? (
                            <span className="font-heading text-[10px] font-black text-black bg-[#FFBE32] px-2.5 py-0.5 rounded uppercase tracking-wider shadow-[0_0_12px_rgba(255,190,50,0.6)]">
                              CAPTAIN / IGL
                            </span>
                          ) : (
                            <span className="font-heading text-[10px] font-bold text-white bg-black/70 backdrop-blur-sm border border-white/15 px-2 py-0.5 rounded uppercase tracking-wider">
                              {player.role}
                            </span>
                          )}
                          <img src={logoImg} alt="LORD ESPORTZ" width={20} height={20} className="h-5 w-5 object-contain drop-shadow" />
                        </div>
                      </div>
                    ) : (
                      // Graphic fallback if no athlete image
                      <div className="relative h-full w-full flex flex-col items-center justify-center p-4 text-center bg-gradient-to-b from-neutral-900 to-black">
                        <div className="absolute inset-0 bg-esports-grid opacity-20" />
                        <div className="h-20 w-20 rounded-full bg-black/80 border border-[#FFBE32]/30 flex items-center justify-center text-[#FFBE32] mb-3 shadow-[0_0_20px_rgba(255,190,50,0.15)] group-hover:scale-110 transition-transform">
                          <span className="font-display text-3xl font-bold">{player.ign.slice(0, 2)}</span>
                        </div>
                        <span className="font-heading text-xs text-gray-400 font-bold uppercase tracking-wider">
                          {player.team}
                        </span>
                        <span className="font-heading text-xs text-[#FFBE32] font-extrabold uppercase tracking-widest mt-2">
                          {player.role}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Player Typography */}
                  <div className="z-10">
                    <div className="flex items-baseline justify-between">
                      <h3 className="font-display text-3xl uppercase tracking-wider text-white group-hover:text-[#FFBE32] transition-colors leading-none">
                        {player.ign}
                      </h3>
                    </div>
                    <div className="text-xs text-[#9CA3AF] font-body mt-1">
                      {player.realName} • <span className="text-gray-300 font-semibold">{player.game || "FREE FIRE MAX"}</span>
                    </div>

                    {/* About The Player */}
                    <div className="mt-3 p-3 rounded-xl bg-black/50 border border-white/5">
                      <span className="block text-[9px] font-heading font-bold uppercase tracking-widest text-[#FFBE32] mb-1">
                        ABOUT ATHLETE
                      </span>
                      <p className="text-[12px] text-gray-300 font-body leading-snug line-clamp-3">
                        {player.about || player.featuredQuote || "Pro athlete competing under the banner of LORD ESPORTZ."}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Instagram Action Button */}
                <div className="mt-4 pt-3 border-t border-white/5 z-10">
                  {instaUrl ? (
                    <a
                      href={instaUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-xl bg-gradient-to-r from-[#E1306C]/15 via-[#FD1D1D]/10 to-[#F56040]/15 hover:from-[#E1306C]/30 hover:to-[#F56040]/30 border border-[#E1306C]/30 hover:border-[#E1306C]/80 text-[#FF5B84] hover:text-white transition-all duration-200 group/insta shadow-sm"
                      title={`Follow ${player.ign} on Instagram`}
                    >
                      <InstagramIcon className="h-4 w-4 text-[#E1306C] group-hover/insta:scale-115 transition-transform shrink-0" />
                      <span className="font-mono text-xs font-semibold text-gray-200 group-hover/insta:text-white truncate">
                        {instaHandle.startsWith("@") ? instaHandle : `@${instaHandle}`}
                      </span>
                    </a>
                  ) : (
                    <div className="flex items-center justify-center gap-2 w-full py-2 px-3 rounded-xl bg-white/5 border border-white/5 text-gray-500 text-xs font-mono">
                      <InstagramIcon className="h-4 w-4 text-gray-500" />
                      <span>@lordesports</span>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
