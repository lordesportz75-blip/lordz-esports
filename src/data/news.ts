export interface NewsArticle {
  id: string;
  category: "TOURNAMENT" | "TEAM" | "PLAYER" | "COMMUNITY" | "ESPORTS" | string;
  title: string;
  slug?: string;
  excerpt: string;
  content?: string;
  description?: string;
  date: string;
  readTime: string;
  badgeColor?: string;
  author: string;
  coverImage?: string;
  image?: string;
  bannerImage?: string;
  published?: boolean;
  featured?: boolean;
}

export const newsData: NewsArticle[] = [];
