import { PageHero } from "../components/common/PageHero";
import { CommunitySection } from "../sections/CommunitySection";
import { SEO } from "../components/common/SEO";

export const CommunityPage = () => {
  return (
    <div className="min-h-screen bg-[#070709] w-full max-w-full overflow-x-hidden">
      <SEO
        title="LORD ESPORTZ Community | Discord, WhatsApp &amp; Gaming Guild"
        description="Join the official LORD ESPORTZ community. Connect with competitive players, participate in daily Free Fire scrims, and access official Discord and WhatsApp hubs."
        canonicalPath="/community"
        breadcrumbs={[
          { name: "Home", item: "/" },
          { name: "Community", item: "/community" },
        ]}
      />

      <PageHero
        badge="INDIAN GAMING GUILD"
        title="JOIN THE"
        titleHighlight="COMMUNITY"
        subtitle="Connect with over 100,000+ passionate competitive gamers, tier-1 scrim players, and tournament fans across our official channels."
      />

      <CommunitySection showHeader={false} />
    </div>
  );
};
