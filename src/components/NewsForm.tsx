"use client";

import { useEffect, useState } from "react";
import { NewsItem, NewsFormData } from "@/types/news";
import { X } from "lucide-react";

interface NewsFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: NewsFormData) => Promise<void>;
  initialData?: NewsItem;
}

export default function NewsFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}: NewsFormModalProps) {
  const [formData, setFormData] = useState<NewsFormData>({
    title: initialData?.title || "",
    detail: initialData?.detail || "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error("Error submitting news:", error);
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setFormData({
      title: "",
      detail: "",
    });
    onClose();
  };
  useEffect(() => {
    if (isOpen && initialData) {
      setFormData({
        title: initialData.title,
        detail: initialData.detail,
      });
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-black">
            {initialData ? "Edit News" : "Create News"}
          </h2>
          <button
            onClick={closeModal}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="h-5 w-5"  color="black"/>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Detail
            </label>
            <textarea
              required
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={formData.detail}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  detail: e.target.value,
                }))
              }
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
