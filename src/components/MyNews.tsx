"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { NewsFormData, NewsItem } from "@/types/news";
import NewsCard from "@/components/NewsCard";
import { Plus } from "lucide-react";
import NewsFormModal from "./NewsForm";

export default function MyNews() {
  const { user } = useAuth();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNews, setSelectedNews] = useState<NewsItem | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchNews();
    }
  }, [user]);

  const fetchNews = async () => {
    try {
      const response = await fetch(`/api/news?userId=${user?.uid}`);
      const data = await response.json();
      setNews(data);
    } catch (error) {
      console.error("Error fetching news:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData: NewsFormData) => {
    try {
      const response = await fetch(
        selectedNews ? `/api/news/${selectedNews.id}` : "/api/news",
        {
          method: selectedNews ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            userId: user!.uid,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to save news");

      fetchNews();
      setIsModalOpen(false);
      setSelectedNews(undefined);
    } catch (error) {
      console.error("Error saving news:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this news?")) return;

    try {
      const response = await fetch(`/api/news/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete news");

      fetchNews();
    } catch (error) {
      console.error("Error deleting news:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => {
            setSelectedNews(undefined);
            setIsModalOpen(true);
          }}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ml-auto"
        >
          <Plus className="h-5 w-5 mr-2" />
          Create News
        </button>
      </div>

      {news.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">
            No news articles yet. Create your first one!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((item) => (
            <NewsCard
              key={item.id}
              news={item}
              onEdit={(news) => {
                setSelectedNews(news);
                setIsModalOpen(true);
              }}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <NewsFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedNews(undefined);
        }}
        onSubmit={handleSubmit}
        initialData={selectedNews}
      />
    </div>
  );
}
