import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { SectionHeading } from "../components/common/SectionHeading";
import { type Tournament, getTournamentBannerUrl, DEFAULT_TOURNAMENT_BANNER } from "../data/tournaments";
import { tournamentsApi, getMyTournaments } from "../api/tournaments";
import { useAuth } from "../context/AuthContext";
import { Trophy, Calendar, Shield, ArrowRight, CheckCircle2 } from "lucide-react";
import { formatCurrency, formatDate } from "../utils/formatters";

interface TournamentsSectionProps {
  onSelectTournament: (tournament: Tournament) => void;
  showHeader?: boolean;
}

type GameFilter = "ALL" | "FREE FIRE MAX" | "FREE FIRE";
type StatusFilter = "ALL" | "LIVE" | "UPCOMING";

export const TournamentsSection = ({
  onSelectTournament,
  showHeader = true,
}: TournamentsSectionProps) => {
  const { isAuthenticated } = useAuth();
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [userTournaments, setUserTournaments] = useState<any[]>([]);
  const [selectedGame, setSelectedGame] = useState<GameFilter>("ALL");
  const [selectedStatus, setSelectedStatus] = useState<StatusFilter>("ALL");

  useEffect(() => {
    setLoading(true);
    tournamentsApi
      .getAll()
      .then((data) => {
        setTournaments(Array.isArray(data) ? data : []);
      })
      .catch(() => {
        setTournaments([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      getMyTournaments()
        .then((res) => {
          if (Array.isArray(res)) {
            setUserTournaments(res);
          }
        })
        .catch(() => {});
    } else {
      setUserTournaments([]);
    }
  }, [isAuthenticated]);

  // Map user registrations by tournament id or slug
  const userRegistrationMap = useMemo(() => {
    const map = new Map<string, { status: string; paymentStatus?: string; isInvitationPending?: boolean }>();
    userTournaments.forEach((item) => {
      const tId = item.tournament?.id || item.tournamentId;
      const tSlug = item.tournament?.slug;
      const status = item.registration?.status || item.status || "PENDING";
      const paymentStatus = item.registration?.paymentStatus || item.paymentStatus;
      const isInvitationPending = Boolean(item.isInvitationPending);

      const info = { status, paymentStatus, isInvitationPending };
      if (tId) map.set(tId, info);
      if (tSlug) map.set(tSlug, info);
    });
    return map;
  }, [userTournaments]);

  const gameFilters: GameFilter[] = [
    "ALL",
    "FREE FIRE MAX",
    "FREE FIRE",
  ];

  const statusFilters: { label: string; value: StatusFilter }[] = [
    { label: "ALL ACTIVE", value: "ALL" },
    { label: "LIVE NOW", value: "LIVE" },
    { label: "UPCOMING", value: "UPCOMING" },
  ];

  const filteredTournaments = useMemo(() => {
    return tournaments.filter((t) => {
      // Completed, Archived, and Cancelled tournaments are automatically removed from the main website
      if (t.status === "COMPLETED" || t.status === "ARCHIVED" || t.status === "CANCELLED") {
        return false;
      }

      const matchGame = selectedGame === "ALL" || t.gameCategory === selectedGame;
      let matchStatus = true;
      if (selectedStatus === "LIVE") {
        matchStatus = t.status === "LIVE" || t.status === "ONGOING";
      } else if (selectedStatus === "UPCOMING") {
        matchStatus = ["UPCOMING", "REGISTRATION_OPEN", "CLOSING_SOON", "FULL", "REGISTRATION_CLOSED"].includes(t.status);
      }
      return matchGame && matchStatus;
    });
  }, [tournaments, selectedGame, selectedStatus]);

  return (
    <section
      id="tournaments"
      className={`relative ${showHeader ? "py-24" : "py-12 sm:py-16"} px-4 sm:px-6 lg:px-8 bg-[#050505]`}
    >
      {/* Subtle Background Glow */}
      <div className="absolute top-1/3 left-0 w-96 h-96 bg-[#FFBE32]/5 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        {showHeader && (
          <SectionHeading
            badge="COMPETITIVE BRACKETS"
            title="ENTER THE ARENA"
            subtitle="Your next match starts here. Register your roster, compete for verified cash pools, and earn national circuit ranking."
          />
        )}

        {/* Filters Bar */}
        <div className="mb-10 flex flex-col md:flex-row items-center justify-between gap-4 border-b border-white/10 pb-6">
          {/* Game category tabs */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5 sm:gap-2">
            {gameFilters.map((game) => (
              <button
                key={game}
                onClick={() => setSelectedGame(game)}
                className={`px-3 sm:px-4 py-1.5 text-xs font-heading font-bold uppercase tracking-wider rounded transition-all cursor-pointer ${
                  selectedGame === game
                    ? "bg-[#FFBE32] text-black shadow-[0_0_15px_rgba(255,190,50,0.3)]"
                    : "bg-[#111113] text-gray-400 hover:text-white hover:bg-[#1A1A1D] border border-white/5"
                }`}
              >
                {game}
              </button>
            ))}
          </div>

          {/* Status filter tabs */}
          <div className="flex items-center gap-1 bg-[#0D0D10] p-1 rounded-lg border border-white/10">
            {statusFilters.map((sf) => (
              <button
                key={sf.value}
                onClick={() => setSelectedStatus(sf.value)}
                className={`px-3 py-1 text-[11px] font-heading font-bold uppercase tracking-wider rounded transition-all cursor-pointer ${
                  selectedStatus === sf.value
                    ? "bg-white/15 text-white"
                    : "text-gray-400 hover:text-gray-200"
                }`}
              >
                {sf.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tournament Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div
                key={`skel-${i}`}
                className="rounded-xl bg-[#0C0C0E] border border-white/5 p-4 space-y-4 animate-pulse"
              >
                <div className="h-40 w-full bg-white/5 rounded-lg" />
                <div className="h-6 w-3/4 bg-white/5 rounded" />
                <div className="h-4 w-1/2 bg-white/5 rounded" />
                <div className="h-10 w-full bg-white/5 rounded mt-4" />
              </div>
            ))
          ) : (
            <AnimatePresence mode="popLayout">
            {filteredTournaments.length > 0 ? (
              filteredTournaments.map((t, index) => {
                const isLive = t.status === "LIVE";
                const userReg = userRegistrationMap.get(t.id) || (t.slug ? userRegistrationMap.get(t.slug) : undefined);
                const isUserRegistered = Boolean(userReg);
                const isConfirmed = userReg?.status === "CONFIRMED";
                const isUnderReview =
                  userReg?.status === "PAYMENT_UNDER_REVIEW" || userReg?.paymentStatus === "UNDER_REVIEW";
                const isPendingInvitation = Boolean(userReg?.isInvitationPending);

                return (
                  <motion.div
                    key={t.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    className="group relative flex flex-col justify-between rounded-xl bg-[#0C0C0E] border border-white/10 hover:border-[#FFBE32]/60 hover:-translate-y-1.5 transition-all duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_15px_35px_rgba(255,190,50,0.15)] overflow-hidden"
                  >
                    {/* Top Banner Image / Accent */}
                    <div className="relative h-40 w-full overflow-hidden bg-gradient-to-br from-[#121218] via-[#1a1a24] to-black">
                      <img
                        src={getTournamentBannerUrl(t.bannerImage, t.title)}
                        alt={t.title}
                        loading="eager"
                        decoding="async"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = DEFAULT_TOURNAMENT_BANNER;
                        }}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-75 filter saturate-125"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0C0C0E] via-transparent to-black/60 pointer-events-none" />

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
                        <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[10px] font-heading font-bold uppercase tracking-widest bg-black/80 border border-white/10 text-gray-300 backdrop-blur-md">
                          <Shield className="h-3 w-3 text-[#FFBE32]" />
                          {t.game}
                        </span>

                        {isUserRegistered ? (
                          <span
                            className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[10px] font-heading font-black uppercase tracking-wider backdrop-blur-md ${
                              isConfirmed
                                ? "bg-[#22C55E]/20 text-[#22C55E] border border-[#22C55E]/40 shadow-[0_0_12px_rgba(34,197,94,0.3)]"
                                : isPendingInvitation
                                ? "bg-amber-500/20 text-[#FFBE32] border border-[#FFBE32]/40 animate-pulse"
                                : "bg-[#FFBE32]/20 text-[#FFBE32] border border-[#FFBE32]/40"
                            }`}
                          >
                            <CheckCircle2 className="h-3 w-3" />
                            {isConfirmed
                              ? "REGISTERED ✓"
                              : isPendingInvitation
                              ? "INVITATION PENDING"
                              : isUnderReview
                              ? "PAYMENT PENDING"
                              : "REGISTERED"}
                          </span>
                        ) : (() => {
                          const isFull = t.status === "FULL" || (t.availableSlots !== undefined && t.availableSlots <= 0);
                          const isClosingSoon = t.status === "CLOSING_SOON" || (!isFull && t.availableSlots !== undefined && t.availableSlots <= 5);

                          if (isLive) {
                            return (
                              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[10px] font-heading font-bold uppercase tracking-wider backdrop-blur-md bg-red-950/80 text-red-400 border border-red-500/30 animate-pulse">
                                <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                                LIVE NOW
                              </span>
                            );
                          }
                          if (isFull) {
                            return (
                              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[10px] font-heading font-bold uppercase tracking-wider backdrop-blur-md bg-red-950/90 text-red-400 border border-red-500/40">
                                SLOTS FULL
                              </span>
                            );
                          }
                          if (isClosingSoon) {
                            return (
                              <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[10px] font-heading font-bold uppercase tracking-wider backdrop-blur-md bg-amber-500/20 text-[#FFBE32] border border-[#FFBE32]/50 animate-pulse">
                                CLOSING SOON
                              </span>
                            );
                          }
                          return (
                            <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[10px] font-heading font-bold uppercase tracking-wider backdrop-blur-md bg-emerald-950/70 text-emerald-400 border border-emerald-500/30">
                              REGISTRATION OPEN
                            </span>
                          );
                        })()}
                      </div>

                      {/* Live Dynamic Registration Count Banner */}
                      <div className="absolute bottom-2 left-3 px-2.5 py-1 rounded bg-black/80 border border-[#FFBE32]/40 text-[#FFBE32] font-heading font-extrabold text-[10px] uppercase tracking-wider backdrop-blur-md flex items-center gap-1.5">
                        <span>
                          {t.confirmedTeams ?? t.registeredTeams ?? 0} / {t.totalTeams || 32} TEAMS CONFIRMED
                        </span>
                        {t.availableSlots !== undefined && (
                          <span className="text-gray-400 font-mono text-[9px]">
                            ({t.availableSlots} SLOTS LEFT)
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="p-6 pt-4">
                      {/* Title */}
                      <Link to={`/tournaments/${t.slug || t.id}`}>
                        <h3 className="font-display text-2xl tracking-wide uppercase text-white group-hover:text-[#FFBE32] transition-colors leading-tight">
                          {t.title}
                        </h3>
                      </Link>
                      <p className="mt-1.5 text-xs text-gray-400 font-body line-clamp-2">
                        {t.tagline || t.shortDescription}
                      </p>

                      {/* Prize Pool Spotlight */}
                      <div className="mt-4 p-3 rounded-lg bg-black/50 border border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Trophy className="h-5 w-5 text-[#FFBE32]" />
                          <span className="text-xs text-gray-400 font-heading uppercase tracking-wider">
                            Prize Pool
                          </span>
                        </div>
                        <span className="font-display text-2xl font-bold text-[#FFBE32] tracking-wider">
                          {formatCurrency(t.prizePool)}
                        </span>
                      </div>

                      {/* Metadata Grid */}
                      <div className="mt-3.5 grid grid-cols-2 gap-2 text-xs text-gray-300">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-gray-500 shrink-0" />
                          <span className="truncate">{formatDate(t.date || t.startDate)}</span>
                        </div>
                        <div className="flex items-center gap-1.5 justify-end">
                          <span className="text-[#FFBE32] font-bold">
                            {formatCurrency(t.feeAmount ?? t.entryFee)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Card Footer Actions */}
                    <div className="p-6 pt-0 flex gap-2">
                      {isUserRegistered ? (
                        <Link
                          to="/my-tournaments"
                          className="flex-1 py-2.5 px-3 rounded font-heading text-xs font-bold uppercase tracking-wider bg-[#22C55E]/15 hover:bg-[#22C55E]/25 text-[#22C55E] border border-[#22C55E]/40 text-center transition-all duration-200 flex items-center justify-center gap-1.5 shadow-[0_0_10px_rgba(34,197,94,0.15)]"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>VIEW IN MY TOURNAMENTS</span>
                        </Link>
                      ) : (() => {
                        const isFull = t.status === "FULL" || (t.availableSlots !== undefined && t.availableSlots <= 0);
                        if (isFull) {
                          return (
                            <Link
                              to={`/tournaments/${t.slug || t.id}`}
                              className="flex-1 py-2.5 px-3 rounded font-heading text-xs font-bold uppercase tracking-wider bg-white/5 border border-white/10 text-gray-400 hover:text-white text-center transition-all duration-200"
                            >
                              SLOTS FULL • VIEW ARENA
                            </Link>
                          );
                        }
                        return (
                          <button
                            onClick={() => onSelectTournament(t)}
                            className="flex-1 py-2.5 px-3 rounded font-heading text-xs font-bold uppercase tracking-wider bg-[#FFBE32] hover:bg-[#FFA000] text-black text-center transition-all duration-200 cursor-pointer shadow-[0_0_12px_rgba(255,190,50,0.25)]"
                          >
                            Register Squad Now
                          </button>
                        );
                      })()}

                      <Link
                        to={`/tournaments/${t.slug || t.id}`}
                        className="py-2.5 px-3.5 rounded font-heading text-xs font-bold uppercase tracking-wider bg-[#141417] hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 flex items-center justify-center transition-all duration-200"
                        title="View Tournament Arena"
                      >
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </motion.div>
                );
              })
            ) : tournaments.length === 0 || tournaments.every((t) => t.status === "COMPLETED" || t.status === "ARCHIVED" || t.status === "CANCELLED") ? (
              <div className="col-span-full py-20 px-6 rounded-2xl bg-[#0D0D10]/80 border border-white/10 text-center max-w-lg mx-auto shadow-2xl backdrop-blur-md">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-[#FFBE32]/10 border border-[#FFBE32]/30 flex items-center justify-center text-[#FFBE32]">
                  <Trophy className="w-8 h-8 opacity-70" />
                </div>
                <h3 className="font-display text-xl uppercase tracking-wider text-white">
                  NO TOURNAMENTS AVAILABLE
                </h3>
                <p className="font-body text-xs text-gray-400 mt-2 leading-relaxed">
                  There are currently no active tournaments open for registration. Check back soon or join our community for upcoming circuit schedules!
                </p>
              </div>
            ) : (
              <div className="col-span-full py-16 text-center text-gray-500">
                <Trophy className="h-12 w-12 mx-auto mb-3 opacity-30 text-[#FFBE32]" />
                <p className="font-heading text-base uppercase tracking-wider text-gray-400">
                  No tournaments found for this filter combination.
                </p>
                <button
                  onClick={() => {
                    setSelectedGame("ALL");
                    setSelectedStatus("ALL");
                  }}
                  className="mt-3 text-xs text-[#FFBE32] underline cursor-pointer"
                >
                  Reset filters
                </button>
              </div>
            )}
          </AnimatePresence>
        )}
        </div>
      </div>
    </section>
  );
};

