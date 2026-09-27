import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionHeading } from "../components/common/SectionHeading";
import { mediaData, type MediaItem } from "../data/media";
import { mediaApi } from "../api/media";
import { Play, Flame } from "lucide-react";
import jerseyPromoImg from "../assets/jersey-promo.jpg";

interface MediaSectionProps {
  onPlayMedia: (item: MediaItem) => void;
  showHeader?: boolean;
}

type MediaTab = "ALL" | "VIDEOS" | "HIGHLIGHTS" | "PHOTOS" | "SHORTS";

export const MediaSection = ({
  onPlayMedia,
  showHeader = true,
}: MediaSectionProps) => {
  const [items, setItems] = useState<MediaItem[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem("lordz_cached_all_media");
        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch {}
    }
    return mediaData;
  });
  const [selectedTab, setSelectedTab] = useState<MediaTab>("ALL");

  useEffect(() => {
    const fetchMedia = () => {
      mediaApi
        .getAll()
        .then((data) => {
          if (data && data.length > 0) {
            setItems(data);
            try {
              localStorage.setItem("lordz_cached_all_media", JSON.stringify(data));
            } catch {}
          }
        })
        .catch(() => {
          // Use current fallback
        });
    };

    fetchMedia();

    window.addEventListener("focus", fetchMedia);
    const interval = setInterval(() => {
      if (!document.hidden) {
        fetchMedia();
      }
    }, 45000);

    return () => {
      window.removeEventListener("focus", fetchMedia);
      clearInterval(interval);
    };
  }, []);

  const tabs: MediaTab[] = ["ALL", "VIDEOS", "HIGHLIGHTS", "PHOTOS", "SHORTS"];

  const filteredMedia = items.filter((item) => {
    if (selectedTab === "ALL") return true;
    return item.type === selectedTab;
  });

  const featuredVideo =
    items.find((item) => item.tag === "PREMIERE") ||
    items.find((item) => item.featured) ||
    items[0] ||
    mediaData[0];

  const getThumbnail = (item: MediaItem) => {
    if (item.thumbnail) return item.thumbnail;
    if (item.youtubeId) return `https://img.youtube.com/vi/${item.youtubeId}/hqdefault.jpg`;
    return jerseyPromoImg;
  };

  return (
    <section
      id="media"
      className={`relative ${showHeader ? "py-24" : "py-12 sm:py-16"} px-4 sm:px-6 lg:px-8 bg-[#050505]`}
    >
      <div className="max-w-7xl mx-auto">
        {showHeader && (
          <SectionHeading
            badge="CINEMATICS & CLUTCHES"
            title="LORD MEDIA"
            subtitle="Match replays, clutch compilations, athlete shorts, and broadcast documentaries."
          />
        )}

        {/* Featured Video Highlight Card */}
        {featuredVideo && (
          <div className="mb-12">
            <div
              onClick={() => onPlayMedia(featuredVideo)}
              className="group relative w-full rounded-2xl border border-[#FFBE32]/35 bg-black overflow-hidden cursor-pointer shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_30px_rgba(255,190,50,0.15)] aspect-[16/9] sm:aspect-[21/9] flex items-end p-6 sm:p-10"
            >
              {/* Background Graphic Preview */}
              <div className="absolute inset-0 z-0">
                <img
                  src={getThumbnail(featuredVideo)}
                  alt="Featured Stream"
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover object-center filter brightness-60 group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
              </div>

              {/* Play Button Center Overlay */}
              <div className="absolute inset-0 z-10 flex items-center justify-center">
                <div className="flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-full bg-[#FFBE32] text-black shadow-[0_0_35px_#FFBE32] group-hover:scale-110 transition-transform duration-300">
                  <Play className="h-8 w-8 sm:h-10 sm:w-10 fill-current ml-1" />
                </div>
              </div>

              {/* Info overlay bottom */}
              <div className="relative z-20 w-full max-w-2xl">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-3 py-1 rounded bg-red-600 text-[10px] font-heading font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
                    <Flame className="h-3 w-3" /> FEATURED PREMIERE
                  </span>
                  <span className="px-2.5 py-0.5 rounded bg-black/70 border border-white/20 text-[10px] font-mono text-gray-300">
                    {featuredVideo.duration || "02:30"}
                  </span>
                </div>
                <h3 className="font-display text-2xl sm:text-4xl lg:text-5xl uppercase tracking-wider text-white group-hover:text-[#FFBE32] transition-colors leading-tight">
                  {featuredVideo.title}
                </h3>
                <div className="mt-2 flex items-center gap-3 text-xs font-mono text-gray-300">
                  <span>{featuredVideo.date}</span>
                  <span>•</span>
                  <span className="text-[#FFBE32] font-semibold">{featuredVideo.game}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Filters */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex flex-wrap justify-center gap-2 p-1.5 rounded-xl bg-[#0D0D10] border border-white/10">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`px-4 sm:px-5 py-2 rounded-lg font-heading text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  selectedTab === tab
                    ? "bg-[#FFBE32] text-black shadow-[0_0_15px_rgba(255,190,50,0.3)]"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Media Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredMedia.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={() => onPlayMedia(item)}
                className="group relative rounded-xl bg-[#0C0C0E] border border-white/10 hover:border-[#FFBE32]/60 overflow-hidden cursor-pointer shadow-[0_10px_25px_rgba(0,0,0,0.5)] transition-all duration-300 hover:-translate-y-1"
              >
                {/* Real YouTube Video Thumbnail */}
                <div className="relative aspect-video w-full bg-neutral-900 overflow-hidden flex items-center justify-center">
                  <img
                    src={getThumbnail(item)}
                    alt={item.title}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover object-center filter brightness-90 group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = jerseyPromoImg;
                    }}
                  />

                  {/* Play badge */}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-colors">
                    <div className="h-12 w-12 rounded-full bg-black/80 border border-[#FFBE32]/40 text-[#FFBE32] flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(255,190,50,0.4)]">
                      <Play className="h-5 w-5 fill-current ml-0.5" />
                    </div>
                  </div>

                  {item.duration && (
                    <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 font-mono text-[10px] text-white">
                      {item.duration}
                    </div>
                  )}

                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-[#FFBE32] text-black font-heading text-[10px] font-bold uppercase tracking-wider">
                    {item.type}
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-5">
                  <h4 className="font-display text-lg sm:text-xl uppercase tracking-wider text-white group-hover:text-[#FFBE32] transition-colors leading-snug line-clamp-2">
                    {item.title}
                  </h4>
                  <div className="mt-3 flex items-center justify-between text-xs text-gray-400 font-mono">
                    <span className="text-[#FFBE32] font-semibold">{item.game}</span>
                    <span>{item.date}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
