// src/services/facebookPixel.ts
import ReactPixel from "react-facebook-pixel";

const PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID;

export const initPixel = () => {
  if (typeof window === "undefined") return;

  const options = {
    autoConfig: true,
    debug: process.env.NODE_ENV !== "production",
  };

  if (PIXEL_ID) {
    ReactPixel.init(PIXEL_ID, undefined, options);
  }
};

export const trackLogin = (userId: string) => {
  ReactPixel.track("Login", {
    userId: userId,
  });
};

export const trackNewsCreated = (newsId: string, title: string) => {
  ReactPixel.track("NewsCreated", {
    newsId,
    title,
  });
};

export const trackNewsReviewed = (newsId: string, status: string) => {
  ReactPixel.track("NewsReviewed", {
    newsId,
    status,
  });
};

export const trackWeatherSearch = (city: string) => {
  ReactPixel.track("WeatherSearch", {
    city,
  });
};

export const trackPageView = () => {
  ReactPixel.pageView();
};

export const trackCustomEvent = (eventName: string, data?: any) => {
  ReactPixel.trackCustom(eventName, data);
};
