import { PageHero } from "../components/common/PageHero";
import { NewsSection } from "../sections/NewsSection";
import { useModals } from "../context/useModals";
import { SEO } from "../components/common/SEO";
import { SITE_URL } from "../config/seo";

export const NewsPage = () => {
  const { openArticle } = useModals();

  const newsSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "LORD ESPORTZ News & Dispatches",
    description: "Official competitive reports and announcements from LORD ESPORTZ.",
    url: `${SITE_URL}/news`,
    numberOfItems: 0,
    itemListElement: [],
  };

  return (
    <div className="min-h-screen bg-[#070709] w-full max-w-full overflow-x-hidden">
      <SEO
        title="LORD ESPORTZ News | Tournament Briefs &amp; Roster Updates"
        description="Stay up to date with the latest dispatches, competitive match debriefs, tournament announcements, and roster updates from LORD ESPORTZ."
        canonicalPath="/news"
        breadcrumbs={[
          { name: "Home", item: "/" },
          { name: "News", item: "/news" },
        ]}
        structuredData={newsSchema}
      />

      <PageHero
        badge="EDITORIAL & MEDIA DISPATCHES"
        title="LATEST FROM"
        titleHighlight="LORD"
        subtitle="Roster movements, official tournament briefings, tier-1 scrim announcements, and competitive post-match debriefs."
      />

      <NewsSection onSelectArticle={openArticle} showHeader={false} />
    </div>
  );
};
