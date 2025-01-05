"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { initPixel, trackPageView } from "@/services/facebookPixel";

export default function AnalyticsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    initPixel();
  }, []);

  useEffect(() => {
    trackPageView();
  }, [pathname, searchParams]);

  return children;
}
