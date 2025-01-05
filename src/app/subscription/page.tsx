'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckCircle, XCircle } from 'lucide-react';

export default function SubscriptionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);

  const isSuccess = searchParams.get('success') === 'true';
  const isCanceled = searchParams.get('canceled') === 'true';

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/');
    }, 5000);

    setLoading(false);

    return () => clearTimeout(timer);
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full px-4">
        {isSuccess ? (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Subscription Successful!
            </h2>
            <p className="text-gray-600 mb-4">
              Thank you for subscribing. Your subscription is now active.
            </p>
            <button 
              onClick={() => router.push('/')}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Return to Home
            </button>
          </div>
        ) : isCanceled ? (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <XCircle className="mx-auto h-16 w-16 text-red-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Subscription Canceled
            </h2>
            <p className="text-gray-600 mb-4">
              The subscription process was canceled. No charges were made.
            </p>
            <button 
              onClick={() => router.push('/')}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Return to Home
            </button>
          </div>
        ) : (
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <XCircle className="mx-auto h-16 w-16 text-yellow-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Invalid Request
            </h2>
            <p className="text-gray-600 mb-4">
              Something went wrong. Please try again.
            </p>
            <button 
              onClick={() => router.push('/')}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Return to Home
            </button>
          </div>
        )}
        <p className="text-center text-sm text-gray-500 mt-4">
          You will be redirected to the dashboard automatically in 5 seconds...
        </p>
      </div>
    </div>
  );
}