import { apiRequest } from "./client";
import { type NewsArticle } from "../data/news";

export const newsApi = {
  getAll: async (params?: { category?: string }): Promise<NewsArticle[]> => {
    const query = new URLSearchParams();
    if (params?.category && params.category !== "ALL") query.set("category", params.category);
    const qs = query.toString() ? `?${query.toString()}` : "";
    return apiRequest<NewsArticle[]>(`/news${qs}`, { method: "GET" }, []);
  },

  create: async (data: Partial<NewsArticle>): Promise<NewsArticle> => {
    return apiRequest<NewsArticle>("/news", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  update: async (id: string, data: Partial<NewsArticle>): Promise<NewsArticle> => {
    return apiRequest<NewsArticle>(`/news/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  delete: async (id: string): Promise<{ success: boolean }> => {
    return apiRequest<{ success: boolean }>(`/news/${id}`, {
      method: "DELETE",
    });
  },
};
