"use client";

import { NewsItem } from "@/types/news";
import { Edit, Trash } from "lucide-react";

interface NewsCardProps {
  news: NewsItem;
  onEdit: (news: NewsItem) => void;
  onDelete: (id: string) => void;
}

export default function NewsCard({ news, onEdit, onDelete }: NewsCardProps) {
  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg text-black font-semibold">{news.title}</h3>
          <span
            className={`px-2 py-1 rounded-full text-xs ${
              statusColors[news.status]
            }`}
          >
            {news.status.charAt(0).toUpperCase() + news.status.slice(1)}
          </span>
        </div>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{news.detail}</p>
        <div className="flex justify-end gap-2">
          <button
            onClick={() => onEdit(news)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
          >
            <Edit className="h-5 w-5" />
          </button>
          <button
            onClick={() => onDelete(news.id!)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-full"
          >
            <Trash className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
