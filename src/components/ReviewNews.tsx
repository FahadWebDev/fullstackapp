// components/Review.tsx
'use client';

import { useEffect, useState } from 'react';
import { NewsItem } from '@/types/news';
import { Check, X, Filter } from 'lucide-react';

type StatusFilter = 'all' | 'pending' | 'approved' | 'rejected';

export default function Review() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<StatusFilter>('pending');

  useEffect(() => {
    fetchAllNews();
  }, [selectedFilter]);

  const fetchAllNews = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/news?status=${selectedFilter}`);
      if (!response.ok) throw new Error('Failed to fetch news');
      const data = await response.json();
      setNews(data);
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateNewsStatus = async (newsId: string, status: 'approved' | 'rejected') => {
    try {
      const response = await fetch(`/api/news/${newsId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) throw new Error('Failed to update news status');
      
      // Refresh news list
      fetchAllNews();
    } catch (error) {
      console.error('Error updating news status:', error);
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-black">News Review</h2>
        
        {/* Filter Dropdown */}
        <div className="relative inline-block">
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value as StatusFilter)}
            className="appearance-none bg-white border border-gray-300 rounded-md pl-3 pr-10 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-black"
          >
            <option value="all">All News</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <Filter className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {news.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-500">No news articles found with the selected filter.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {news.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-black">{item.title}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <p className="text-sm text-gray-500">By: {item.createdByUser}</p>
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusBadgeColor(item.status)}`}>
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </span>
                  </div>
                </div>
                {item.status === 'pending' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateNewsStatus(item.id!, 'approved')}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-full transition-colors"
                      title="Approve"
                    >
                      <Check className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => updateNewsStatus(item.id!, 'rejected')}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                      title="Reject"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                )}
              </div>
              <p className="text-gray-600">{item.detail}</p>
              <p className="text-sm text-gray-400 mt-4">
                Created: {new Date(item.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}