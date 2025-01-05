export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL_ID as string;

declare global {
  interface Window {
    fbq: (...args: any[]) => void;
  }
}

export const pageview = () => {
  window.fbq('track', 'PageView');
};

export const event = (name: string, options = {}) => {
  window.fbq('track', name, options);
};

export const trackNewsEvent = (eventName: string, newsData: any = {}) => {
  window.fbq('track', eventName, {
    ...newsData,
    timestamp: new Date().toISOString()
  });
};