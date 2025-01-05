// src/types/news.ts
export type NewsStatus = "pending" | "approved" | "rejected";

export interface NewsItem {
  id?: string;
  title: string;
  detail: string;
  imageUrl: string;
  status: NewsStatus;
  createdByUser: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface NewsFormData {
  title: string;
  detail: string;
}
