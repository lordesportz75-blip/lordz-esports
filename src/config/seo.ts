/**
 * Centralized SEO Configuration for LORDZ ESPORTS
 * Single source of truth for site origin, brand identity, social channels, and structured data schemas.
 */

// Resolves canonical origin: VITE_SITE_URL environment variable takes precedence,
// strictly falling back to the intended production domain https://lordzesports.com.
// NEVER outputs localhost, staging, or vercel.app preview URLs as canonical, OG, or schema metadata.
export const getSiteUrl = (): string => {
  const envUrl = import.meta.env.VITE_SITE_URL;
  if (envUrl && typeof envUrl === "string" && envUrl.trim().length > 0) {
    const trimmed = envUrl.trim().replace(/\/+$/, "");
    // Guard against accidental localhost or vercel preview URLs being treated as canonical
    if (!trimmed.includes("localhost") && !trimmed.includes("127.0.0.1") && !trimmed.includes(".vercel.app")) {
      return trimmed;
    }
  }

  // Canonical production domain
  return "https://lordzesports.com";
};

export const SITE_URL = getSiteUrl();

export const BRAND_CONFIG = {
  brandName: "LORDZ ESPORTS",
  legalName: "LORDZ ESPORTS",
  alternateNames: ["Lord Esports", "Lordz"],
  tagline: "Compete. Improve. Build Your Legacy.",
  description:
    "LORDZ ESPORTS is India's premier competitive gaming organization and esports tournament platform hosting daily scrims, national championships, and pro athlete rosters for Free Fire and Free Fire MAX.",
  themeColor: "#050505",
  logoUrl: `${SITE_URL}/lordz-logo.png`,
  ogImageUrl: `${SITE_URL}/og-image.jpg`,
  contactEmail: "lordesportz75@gmail.com",
  location: {
    locality: "Chennai",
    region: "Tamil Nadu",
    country: "IN",
  },
  socials: {
    instagram: "https://www.instagram.com/lord.esportz",
    youtube: "https://youtube.com/@lord-esportz07",
    discord: "https://discord.gg/Q8KR7tU96",
    whatsappMain: "https://whatsapp.com/channel/0029Vb8sSc66hENsTW35hd11",
    whatsappScrims: "https://whatsapp.com/channel/0029Vb8fM218kyySLfM90o0l",
  },
};

/**
 * Builds standard Organization JSON-LD Schema based solely on verified project data.
 */
export const buildOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "SportsOrganization",
  "@id": `${SITE_URL}/#organization`,
  name: BRAND_CONFIG.brandName,
  alternateName: BRAND_CONFIG.alternateNames,
  url: SITE_URL,
  logo: {
    "@type": "ImageObject",
    url: BRAND_CONFIG.logoUrl,
    width: "512",
    height: "512",
  },
  image: BRAND_CONFIG.ogImageUrl,
  description: BRAND_CONFIG.description,
  email: BRAND_CONFIG.contactEmail,
  address: {
    "@type": "PostalAddress",
    addressLocality: BRAND_CONFIG.location.locality,
    addressRegion: BRAND_CONFIG.location.region,
    addressCountry: BRAND_CONFIG.location.country,
  },
  sameAs: [
    BRAND_CONFIG.socials.instagram,
    BRAND_CONFIG.socials.youtube,
    BRAND_CONFIG.socials.discord,
    BRAND_CONFIG.socials.whatsappMain,
    BRAND_CONFIG.socials.whatsappScrims,
  ],
  sport: "Esports",
});

/**
 * Builds WebSite JSON-LD Schema for site name and brand entity recognition.
 */
export const buildWebSiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${SITE_URL}/#website`,
  url: SITE_URL,
  name: BRAND_CONFIG.brandName,
  alternateName: BRAND_CONFIG.alternateNames[0],
  publisher: {
    "@id": `${SITE_URL}/#organization`,
  },
  inLanguage: "en-US",
});
