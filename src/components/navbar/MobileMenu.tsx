import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  X,
  Trophy,
  Shirt,
  Newspaper,
  Video,
  MessageSquare,
  Handshake,
  Award,
  Info,
  Home,
  Vote,
} from "lucide-react";
import logoImg from "../../assets/lordz-logo.png";
import { GoldButton } from "../common/GoldButton";
import { OutlineButton } from "../common/OutlineButton";
import { useAuth } from "../../context/AuthContext";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenJoin: () => void;
  onOpenLogin: () => void;
  currentPath: string;
}

const navLinks = [
  { name: "HOME", path: "/", icon: Home },
  { name: "TOURNAMENTS", path: "/tournaments", icon: Trophy },
  { name: "VOTING", path: "/voting", icon: Vote },
  { name: "PRODUCTS", path: "/products", icon: Shirt },
  { name: "BRAND PARTNERS", path: "/partners", icon: Handshake },
  { name: "PARTNER WITH US", path: "/partner-with-us", icon: Award },
  { name: "ABOUT (ROSTER & TEAMS)", path: "/about", icon: Info },
  { name: "NEWS", path: "/news", icon: Newspaper },
  { name: "MEDIA", path: "/media", icon: Video },
  { name: "COMMUNITY", path: "/community", icon: MessageSquare },
];

export const MobileMenu = ({
  isOpen,
  onClose,
  onOpenJoin,
  onOpenLogin,
  currentPath,
}: MobileMenuProps) => {
  const { user, isAuthenticated } = useAuth();
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[8000] xl:hidden bg-[#050505]/98 backdrop-blur-2xl flex flex-col justify-between p-4 sm:p-6 pb-6 overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-[#FFBE32]/20 shrink-0">
            <Link to="/" onClick={onClose} className="flex items-center gap-2.5 sm:gap-3">
              <img
                src={logoImg}
                alt="LORD ESPORTZ"
                className="h-8 w-8 sm:h-10 sm:w-10 object-contain drop-shadow-[0_0_12px_#FFBE32]"
              />
              <span className="font-display text-xl sm:text-2xl uppercase tracking-widest text-white">
                LORD <span className="text-[#FFBE32]">ESPORTZ</span>
              </span>
            </Link>
            <button
              onClick={onClose}
              className="p-1.5 sm:p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 cursor-pointer"
              aria-label="Close menu"
            >
              <X className="h-5 w-5 sm:h-6 sm:w-6 text-[#FFBE32]" />
            </button>
          </div>

          {/* Navigation Items Staggered */}
          <div className="py-3 sm:py-4 space-y-1 overflow-y-auto flex-1 my-1 sm:my-2">
            {navLinks.map((link, index) => {
              const isActive =
                link.path === "/about"
                  ? currentPath === "/about" || currentPath === "/players" || currentPath === "/teams"
                  : currentPath === link.path;
              const Icon = link.icon;

              return (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.02, duration: 0.2 }}
                >
                  <Link
                    to={link.path}
                    onClick={onClose}
                    className={`flex items-center justify-between py-2 sm:py-2.5 px-3 sm:px-3.5 rounded-lg font-heading text-xs sm:text-sm tracking-wider uppercase transition-all ${
                      isActive
                        ? "text-[#FFBE32] bg-[#FFBE32]/12 border border-[#FFBE32]/30 font-bold shadow-[0_0_15px_rgba(255,190,50,0.1)]"
                        : "text-gray-300 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 sm:gap-3">
                      <Icon className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${isActive ? "text-[#FFBE32]" : "text-gray-400"}`} />
                      <span>{link.name}</span>
                    </div>
                    {isActive && <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-[#FFBE32] animate-pulse" />}
                  </Link>
                </motion.div>
              );
            })}
          </div>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="pt-4 border-t border-white/10 space-y-2.5 shrink-0"
          >
            <GoldButton
              onClick={() => {
                onClose();
                onOpenJoin();
              }}
              className="w-full"
              size="md"
            >
              JOIN TOURNAMENT
            </GoldButton>
            {isAuthenticated && user ? (
              <>
                <Link
                  to="/my-tournaments"
                  onClick={onClose}
                  className="w-full py-2.5 px-4 rounded-xl border border-[#FFBE32]/60 bg-gradient-to-r from-[#FFBE32]/20 to-[#FFA000]/20 hover:from-[#FFBE32]/30 text-[#FFBE32] font-heading font-bold text-xs uppercase tracking-wider flex items-center justify-between transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-[#FFBE32]" />
                    <span>MY TOURNAMENTS</span>
                  </span>
                  <span className="h-2 w-2 rounded-full bg-[#FFBE32] animate-pulse" />
                </Link>
                <button
                  onClick={() => {
                    onClose();
                    onOpenLogin();
                  }}
                  className="w-full py-2.5 px-4 rounded-xl border border-[#FFBE32]/40 bg-[#FFBE32]/10 hover:bg-[#FFBE32]/20 text-white font-heading font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-colors"
                >
                  <div className="w-5 h-5 rounded-md bg-[#FFBE32] text-black font-display text-[10px] font-bold flex items-center justify-center">
                    {user.ign?.slice(0, 2).toUpperCase() || user.username?.slice(0, 2).toUpperCase() || "LZ"}
                  </div>
                  <span>ATHLETE PASSPORT ({user.ign || user.username})</span>
                </button>
              </>
            ) : (
              <OutlineButton
                onClick={() => {
                  onClose();
                  onOpenLogin();
                }}
                className="w-full"
                size="md"
              >
                PLAYER LOGIN / REGISTER
              </OutlineButton>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
