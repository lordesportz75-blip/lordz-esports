import { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import logoImg from "../../assets/lordz-logo.png";
import { GoldButton } from "../common/GoldButton";
import { OutlineButton } from "../common/OutlineButton";
import {
  ShieldCheck,
  ChevronDown,
  LogOut,
  Trophy,
  Gamepad2,
  User,
  ExternalLink,
} from "lucide-react";
import { useScrollPosition } from "../../hooks/useScrollPosition";
import { MobileMenu } from "./MobileMenu";
import { useModals } from "../../context/useModals";
import { useAuth } from "../../context/AuthContext";
import { NotificationCenter } from "../notifications/NotificationCenter";

// Straight Desktop Nav Items (PLAYERS & TEAMS consolidated into ABOUT)
const straightNavItems = [
  { label: "HOME", path: "/" },
  { label: "TOURNAMENTS", path: "/tournaments" },
  { label: "VOTING", path: "/voting" },
  { label: "PRODUCTS", path: "/products" },
  { label: "PARTNERS", path: "/partners" },
  { label: "PARTNER WITH US", path: "/partner-with-us" },
  { label: "MEDIA", path: "/media" },
  { label: "NEWS", path: "/news" },
  { label: "ABOUT", path: "/about" },
  { label: "COMMUNITY", path: "/community" },
];

export const Navbar = () => {
  const { isScrolled } = useScrollPosition(30);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { pathname } = useLocation();
  const { openJoinTournament, openLogin } = useModals();
  const { user, isAuthenticated, logout } = useAuth();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 w-full max-w-full z-[7000] h-16 sm:h-[68px] flex items-center transition-all duration-300 ${
          isScrolled
            ? "bg-[#070708] border-b border-[#FFBE32]/25 shadow-[0_4px_30px_rgba(0,0,0,0.9)]"
            : "bg-[#070708]/95 backdrop-blur-md border-b border-white/10 shadow-[0_2px_15px_rgba(0,0,0,0.6)]"
        }`}
      >
        <div className="w-full max-w-[1600px] mx-auto px-3.5 sm:px-6 lg:px-8 flex items-center justify-between gap-3 sm:gap-4">
          {/* Logo & Brand */}
          <Link
            to="/"
            className="flex items-center gap-2 sm:gap-3 group cursor-pointer focus:outline-none shrink-0"
          >
            <div className="relative shrink-0">
              <img
                src={logoImg}
                alt="LORD ESPORTZ Official Crest Logo"
                width={40}
                height={40}
                className="h-8 sm:h-10 w-auto object-contain transition-transform duration-300 group-hover:scale-105 drop-shadow-[0_0_12px_rgba(255,190,50,0.35)]"
              />
            </div>
            <div className="flex flex-col shrink-0">
              <span className="font-display text-base sm:text-xl xl:text-2xl leading-none uppercase tracking-widest text-white whitespace-nowrap">
                LORD <span className="text-[#FFBE32]">ESPORTZ</span>
              </span>
              <span className="font-heading text-[7.5px] sm:text-[9px] tracking-[0.25em] text-[#9CA3AF] uppercase whitespace-nowrap">
                India's Elite Clan
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links — Straight Row Layout for xl+ screens */}
          <nav className="hidden xl:flex items-center gap-3 2xl:gap-5 text-[11px] 2xl:text-xs font-heading font-bold uppercase tracking-wider text-gray-300">
            {straightNavItems.map((item) => {
              const isActive =
                item.path === "/about"
                  ? pathname === "/about" || pathname === "/players" || pathname === "/teams"
                  : pathname === item.path;
              return (
                <Link
                  key={item.label}
                  to={item.path}
                  className={`relative py-1 transition-colors hover:text-[#FFBE32] whitespace-nowrap ${
                    isActive ? "text-[#FFBE32] font-extrabold" : "text-gray-300"
                  } after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-[#FFBE32] ${
                    isActive ? "after:scale-x-100" : "after:scale-x-0"
                  } hover:after:scale-x-100 after:transition-transform after:origin-center`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action CTAs */}
          <div className="hidden sm:flex items-center gap-2.5 sm:gap-3 shrink-0">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-2.5 sm:gap-3">
                {/* Real-Time Notification Bell */}
                <NotificationCenter />

                <div className="relative" ref={dropdownRef}>
                  {/* Cyber-Esports Athlete Badge */}
                  <button
                    type="button"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-full border border-[#FFBE32]/35 bg-gradient-to-r from-[#0C0C0E]/95 via-[#141418] to-[#0A0A0C]/95 hover:border-[#FFBE32] hover:shadow-[0_0_20px_rgba(255,190,50,0.25)] transition-all cursor-pointer group"
                  >
                    {/* Glowing Hexagonal Avatar with Live Pulse */}
                    <div className="relative shrink-0">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#FFBE32] via-[#FFD54F] to-[#FFA000] p-[1.5px] shadow-[0_0_10px_rgba(255,190,50,0.4)]">
                        <div className="w-full h-full rounded-full bg-[#070709] flex items-center justify-center font-display text-xs font-black text-[#FFBE32] uppercase">
                          {user.ign?.slice(0, 2).toUpperCase() || user.username?.slice(0, 2).toUpperCase() || "LZ"}
                        </div>
                      </div>
                      {/* Live Online Dot */}
                      <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#22C55E] opacity-75" />
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#22C55E] border border-[#070708]" />
                      </span>
                    </div>

                    {/* Player Name & Verified Badge */}
                    <div className="flex flex-col text-left">
                      <span className="text-xs font-heading font-extrabold uppercase tracking-wider text-white group-hover:text-[#FFBE32] transition-colors leading-tight">
                        {user.ign || user.username}
                      </span>
                      <span className="text-[8px] font-mono tracking-widest text-[#FFBE32] uppercase leading-tight mt-0.5 flex items-center gap-1">
                        <ShieldCheck className="h-2.5 w-2.5 text-[#22C55E] shrink-0" />
                        {user.primaryGame === "FREE FIRE" ? "FREE FIRE" : "FF MAX"} PRO
                      </span>
                    </div>

                    <ChevronDown
                      className={`h-3.5 w-3.5 text-gray-400 group-hover:text-[#FFBE32] transition-transform duration-200 ${
                        dropdownOpen ? "rotate-180 text-[#FFBE32]" : ""
                      }`}
                    />
                  </button>

                  {/* Dropdown HUD Menu */}
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2.5 w-80 rounded-2xl border border-[#FFBE32]/30 bg-[#0A0A0D]/95 backdrop-blur-2xl p-4 shadow-[0_20px_60px_rgba(0,0,0,0.95),0_0_25px_rgba(255,190,50,0.15)] z-[8000] animate-in fade-in slide-in-from-top-2 duration-150">
                      {/* Header Info */}
                      <div className="flex items-center gap-3 pb-3.5 border-b border-white/10">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#FFBE32] to-[#FFD54F] p-0.5 shadow-[0_0_12px_rgba(255,190,50,0.3)] shrink-0">
                          <div className="w-full h-full bg-[#09090B] rounded-[10px] flex items-center justify-center font-display text-lg font-black text-[#FFBE32]">
                            {user.ign?.slice(0, 2).toUpperCase() || user.username?.slice(0, 2).toUpperCase() || "LZ"}
                          </div>
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <h4 className="font-display text-base text-white uppercase tracking-wider truncate">
                              {user.ign || user.username}
                            </h4>
                            <span className="px-1.5 py-0.2 rounded text-[8px] font-heading font-black bg-[#FFBE32]/20 text-[#FFBE32] border border-[#FFBE32]/30 uppercase">
                              ATHLETE
                            </span>
                          </div>
                          <p className="text-[11px] text-gray-400 font-mono">@{user.username}</p>
                          {user.fullName && (
                            <p className="text-[11px] text-gray-300 font-medium truncate">{user.fullName}</p>
                          )}
                        </div>
                      </div>

                      {/* Stats & Game Chips */}
                      <div className="grid grid-cols-2 gap-2 my-3">
                        <div className="bg-black/50 rounded-xl p-2 border border-white/5">
                          <span className="text-[9px] font-mono text-gray-400 uppercase flex items-center gap-1 mb-0.5">
                            <Gamepad2 className="h-2.5 w-2.5 text-[#FFBE32]" /> Game
                          </span>
                          <span className="text-[11px] font-semibold text-white truncate block">
                            {user.primaryGame || "FREE FIRE MAX"}
                          </span>
                        </div>
                        <div className="bg-black/50 rounded-xl p-2 border border-white/5">
                          <span className="text-[9px] font-mono text-gray-400 uppercase flex items-center gap-1 mb-0.5">
                            <Trophy className="h-2.5 w-2.5 text-[#FFBE32]" /> Tier
                          </span>
                          <span className="text-[11px] font-semibold text-[#FFBE32] truncate block">
                            {user.gamingExperience || "Semi-Pro"}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="space-y-1.5 pt-1">
                        <Link
                          to="/my-tournaments"
                          onClick={() => setDropdownOpen(false)}
                          className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-[#FFBE32]/20 to-[#FFA000]/20 hover:from-[#FFBE32]/30 hover:to-[#FFA000]/30 border border-[#FFBE32]/40 text-[#FFBE32] font-heading font-bold text-xs uppercase tracking-wider flex items-center justify-between cursor-pointer transition-all"
                        >
                          <span className="flex items-center gap-2">
                            <Trophy className="h-3.5 w-3.5" />
                            <span>MY TOURNAMENTS</span>
                          </span>
                          <span className="h-2 w-2 rounded-full bg-[#FFBE32] animate-pulse" />
                        </Link>

                        <button
                          type="button"
                          onClick={() => {
                            setDropdownOpen(false);
                            openLogin();
                          }}
                          className="w-full py-2 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-white font-heading font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all border border-white/10"
                        >
                          <User className="h-3.5 w-3.5 text-[#FFBE32]" />
                          <span>VIEW ATHLETE PASSPORT</span>
                          <ExternalLink className="h-3 w-3 text-gray-400" />
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setDropdownOpen(false);
                            logout();
                          }}
                          className="w-full py-2 px-3 rounded-xl border border-red-500/30 bg-red-950/20 hover:bg-red-950/40 text-red-300 font-heading font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all"
                        >
                          <LogOut className="h-3.5 w-3.5" />
                          <span>SIGN OUT</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <OutlineButton
                onClick={openLogin}
                className="py-2 px-3 sm:px-4 text-[11px] font-heading font-bold"
              >
                LOGIN
              </OutlineButton>
            )}
            <GoldButton
              onClick={() => openJoinTournament()}
              className="py-2 px-3 sm:px-4 text-[11px] font-heading font-bold"
              showArrow={false}
            >
              JOIN TOURNAMENT
            </GoldButton>
          </div>

          {/* Mobile / Tablet Hamburger Toggle - Precision 3-bar layout */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open navigation menu"
            className="xl:hidden shrink-0 flex items-center justify-center p-2 rounded-xl text-white hover:text-[#FFBE32] hover:bg-white/5 active:bg-white/10 transition-colors focus:outline-none cursor-pointer"
          >
            <div className="w-5.5 sm:w-6 h-4 sm:h-[18px] flex flex-col justify-between items-center shrink-0" aria-hidden="true">
              <span className="w-full h-[2px] bg-current rounded-full transition-transform" />
              <span className="w-full h-[2px] bg-current rounded-full transition-transform" />
              <span className="w-full h-[2px] bg-current rounded-full transition-transform" />
            </div>
          </button>
        </div>
      </header>

      {/* Full-Screen Mobile Drawer */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        onOpenJoin={() => {
          setMobileMenuOpen(false);
          openJoinTournament();
        }}
        onOpenLogin={() => {
          setMobileMenuOpen(false);
          openLogin();
        }}
        currentPath={pathname}
      />
    </>
  );
};
