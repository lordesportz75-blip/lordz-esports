import { motion, useTransform } from "framer-motion";
import { useMouseParallax } from "../hooks/useMouseParallax";
import { GoldButton } from "../components/common/GoldButton";
import { OutlineButton } from "../components/common/OutlineButton";
import { TemplePattern } from "../components/common/TemplePattern";
import logoImg from "../assets/lordz-logo.png";
import trophyImg from "../assets/lord-championship-trophy.png";
import { Trophy, ChevronDown, Sparkles } from "lucide-react";

// Subtle floating energy particles for the Free Fire character
const characterParticles = [
  { id: 1, x: "14%", y: "24%", duration: 4.2, delay: 0 },
  { id: 2, x: "84%", y: "20%", duration: 5.1, delay: 1.2 },
  { id: 3, x: "16%", y: "60%", duration: 4.6, delay: 2.0 },
  { id: 4, x: "82%", y: "56%", duration: 5.4, delay: 0.8 },
  { id: 5, x: "22%", y: "40%", duration: 4.4, delay: 1.6 },
  { id: 6, x: "78%", y: "36%", duration: 5.0, delay: 2.6 },
  { id: 7, x: "50%", y: "10%", duration: 3.8, delay: 1.0 },
];

interface HeroSectionProps {
  onExploreTournaments: () => void;
  onJoinLordz: () => void;
}

export const HeroSection = ({
  onExploreTournaments,
  onJoinLordz,
}: HeroSectionProps) => {
  // Desktop mouse parallax coordinates via MotionValues (zero React re-renders)
  const { x: mouseX, y: mouseY } = useMouseParallax(12);
  const lightBlobX = useTransform(mouseX, (v) => v * -1.5);
  const lightBlobY = useTransform(mouseY, (v) => v * -1.5);
  const characterX = useTransform(mouseX, (v) => v * 1.2);
  const characterY = useTransform(mouseY, (v) => v * 1.2);

  return (
    <section
      id="home"
      className="relative min-h-[92vh] sm:min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#050505] pt-24 pb-16"
    >
      {/* 1. Atmospheric Ambient Gradients & Particle Line Art */}
      <div className="absolute inset-0 bg-esports-grid opacity-30 pointer-events-none" />

      {/* Subtle Temple Gopuram Architectural Lines */}
      <TemplePattern className="opacity-[0.06] scale-125 translate-y-10" />

      {/* Subtle Floating Gold Light Blobs — GPU transform style */}
      <motion.div
        style={{
          x: lightBlobX,
          y: lightBlobY,
        }}
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[450px] w-[450px] sm:h-[600px] sm:w-[600px] rounded-full bg-[#FFBE32]/10 blur-[90px] pointer-events-none will-change-transform"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center min-h-[75vh]">
          
          {/* LEFT: Cinematic Copy & Branding (lg:col-span-7) */}
          <div className="lg:col-span-7 text-center lg:text-left flex flex-col items-center lg:items-start pt-4">
            
            {/* Top Badge with Logo */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-[#FFBE32]/35 bg-[#FFBE32]/10 backdrop-blur-md mb-6"
            >
              <img
                src={logoImg}
                alt="LORD ESPORTZ Official Crest"
                width={16}
                height={16}
                className="h-4 w-4 object-contain drop-shadow-[0_0_8px_#FFBE32]"
              />
              <span className="font-heading text-xs font-bold uppercase tracking-[0.25em] text-[#FFBE32]">
                LORD ESPORTZ
              </span>
              <span className="h-1 w-1 rounded-full bg-white/40" />
              <span className="font-heading text-[11px] text-gray-300 tracking-widest">
                OFFICIAL PLATFORM
              </span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-3xl xs:text-4xl sm:text-6xl md:text-7xl lg:text-[4.5rem] xl:text-[5.2rem] leading-[1.06] uppercase tracking-tight text-white font-extrabold"
            >
              <span className="sr-only">LORD ESPORTZ — </span>
              FORGE YOUR <br />
              <span className="text-gold-gradient">LEGACY.</span>
            </motion.h1>

            {/* Supporting Copy */}
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="mt-6 text-base sm:text-lg md:text-xl text-[#9CA3AF] font-body max-w-lg leading-relaxed"
            >
              Compete. Improve. Build your name. Join LORD ESPORTZ, India's elite competitive esports network for daily scrims, championship tournaments, and legacy recognition.
            </motion.p>

            {/* Quick Micro-Highlight Metrics */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="mt-6 flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 text-xs font-heading font-semibold text-gray-300 tracking-wider"
            >
              <div className="flex items-center gap-1.5">
                <Trophy className="h-4 w-4 text-[#FFBE32]" />
                <span>₹5,00,000+ TOTAL PRIZE POOL</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-[#FFBE32]" />
                <span>FREE FIRE &amp; FREE FIRE MAX EXCLUSIVE</span>
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.55 }}
              className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
            >
              <GoldButton
                onClick={onExploreTournaments}
                size="lg"
                className="w-full sm:w-auto"
              >
                EXPLORE TOURNAMENTS
              </GoldButton>
              <OutlineButton
                onClick={onJoinLordz}
                size="lg"
                className="w-full sm:w-auto"
                showArrow
              >
                JOIN LORD
              </OutlineButton>
            </motion.div>
          </div>

          {/* RIGHT: Freestanding Free Fire Character Showcase (lg:col-span-5) */}
          <div className="lg:col-span-5 flex justify-center items-center relative min-h-[480px] sm:min-h-[580px] lg:min-h-[660px]">
            
            {/* 1. Ambient Energy Halos (Dual Flame Gold & Amber Glow) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-80 w-80 sm:h-[460px] sm:w-[460px] rounded-full bg-gradient-to-tr from-[#FFBE32]/15 via-orange-500/20 to-red-500/10 blur-[120px] pointer-events-none" />

            {/* 2. Dynamic Esports Diagonal Energy Blade / Line Accent (Matching theme) */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
              <svg className="w-full h-full opacity-70" viewBox="0 0 500 600" fill="none">
                <defs>
                  <linearGradient id="cyberLineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFBE32" stopOpacity="0" />
                    <stop offset="35%" stopColor="#FFBE32" stopOpacity="0.9" />
                    <stop offset="65%" stopColor="#f97316" stopOpacity="0.85" />
                    <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                  </linearGradient>
                  <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="6" result="glow" />
                    <feComposite in="SourceGraphic" in2="glow" operator="over" />
                  </filter>
                </defs>
                {/* Dynamic angled cyber beam behind character */}
                <motion.line
                  x1="30"
                  y1="200"
                  x2="480"
                  y2="520"
                  stroke="url(#cyberLineGrad)"
                  strokeWidth="3.5"
                  filter="url(#glowFilter)"
                  animate={{
                    opacity: [0.5, 0.9, 0.5],
                  }}
                  transition={{
                    duration: 3.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </svg>
            </div>

            {/* 3. Freestanding Character Container with Mouse Parallax */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              style={{
                x: characterX,
                y: characterY,
              }}
              className="relative flex flex-col items-center justify-end z-10 w-full h-full will-change-transform"
            >
              {/* Animated Energy Aura behind Character — GPU opacity and scale without image repainting */}
              <motion.div
                animate={{
                  scale: [0.94, 1.08, 0.96, 1.06, 0.94],
                  opacity: [0.4, 0.75, 0.45, 0.8, 0.4],
                  rotate: [0, 4, -4, 2, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 sm:w-80 sm:h-80 rounded-full bg-gradient-to-tr from-[#FFBE32]/35 via-orange-500/30 to-red-500/20 blur-[50px] pointer-events-none"
              />

              {/* Core Radial Flash */}
              <motion.div
                animate={{
                  opacity: [0.3, 0.65, 0.3],
                  scale: [0.92, 1.06, 0.92],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-44 h-44 sm:w-52 sm:h-52 rounded-full bg-amber-400/25 blur-[40px] pointer-events-none"
              />

              {/* Floating Golden/Amber Energy Particles */}
              {characterParticles.map((p) => (
                <motion.div
                  key={p.id}
                  style={{ left: p.x, top: p.y }}
                  className="absolute pointer-events-none w-1.5 h-1.5 rounded-full bg-amber-300 shadow-[0_0_8px_#f59e0b,0_0_16px_#ea580c] z-20"
                  animate={{
                    y: [0, -22, 0],
                    x: [0, p.id % 2 === 0 ? 8 : -8, 0],
                    opacity: [0.2, 0.9, 0.2],
                    scale: [0.8, 1.3, 0.8],
                  }}
                  transition={{
                    duration: p.duration,
                    repeat: Infinity,
                    delay: p.delay,
                    ease: "easeInOut",
                  }}
                />
              ))}

              {/* The Standing Character with Floating Levitation — Responsive height for mobile & desktop */}
              <motion.div
                className="relative z-10 flex items-end justify-center"
                animate={{
                  y: [0, -10, 0],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <motion.img
                  src={trophyImg}
                  alt="LORD ESPORTZ Lord Championship Cup Trophy"
                  fetchPriority="high"
                  className="max-h-[300px] xs:max-h-[360px] sm:max-h-[520px] lg:max-h-[640px] xl:max-h-[680px] w-auto object-contain select-none pointer-events-none filter contrast-[1.06] brightness-[1.04] drop-shadow-[0_0_24px_rgba(255,190,50,0.55)] transition-all"
                />
              </motion.div>

              {/* Realistic Ground Shadow & Energy Ring Beneath Character */}
              <div className="relative w-48 sm:w-80 h-10 -mt-6 pointer-events-none z-0 flex items-center justify-center">
                {/* Dark contact shadow */}
                <div className="w-40 sm:w-64 h-5 rounded-full bg-black/85 blur-[12px]" />
                {/* Amber ambient floor glow */}
                <div className="absolute w-44 sm:w-72 h-8 rounded-full bg-amber-500/25 blur-[18px]" />
              </div>

              {/* Floating Esports Nameplate / Badge (Sleek minimalist Pill) */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="mt-3 inline-flex items-center gap-2 sm:gap-2.5 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-[#0B0C10]/90 border border-[#FFBE32]/35 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.8),0_0_20px_rgba(255,190,50,0.2)]"
              >
                <span className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-[#FFBE32] animate-ping" />
                <span className="font-heading text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] sm:tracking-[0.25em] text-[#FFBE32]">
                  FREE FIRE
                </span>
                <span className="h-3 w-px bg-white/20" />
                <span className="font-display text-[10px] sm:text-xs tracking-wider uppercase text-white font-bold">
                  APEX OPERATOR
                </span>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Subtle Scroll Down Indicator */}
      <a
        href="#jersey"
        className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-gray-400 hover:text-[#FFBE32] transition-colors z-20 group"
      >
        <span className="font-heading text-[9px] sm:text-[10px] tracking-[0.2em] sm:tracking-[0.25em] uppercase text-gray-500 group-hover:text-[#FFBE32]">
          SCROLL
        </span>
        <ChevronDown className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-bounce text-[#FFBE32]" />
      </a>
    </section>
  );
};
