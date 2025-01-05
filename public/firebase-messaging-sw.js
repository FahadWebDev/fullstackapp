// public/firebase-messaging-sw.js
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyBR32-M26nXHfk1LTCEqbTDNzq5c6PXkss",
  authDomain: "authentication-and-fires-64ab9.firebaseapp.com",
  projectId: "authentication-and-fires-64ab9",
  messagingSenderId: "798143581181",
  appId: "1:798143581181:web:c5634c0e3e772a8ca02794",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
