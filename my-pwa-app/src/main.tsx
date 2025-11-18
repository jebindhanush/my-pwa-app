import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import Home from './Home.tsx';
import BluetoothPage from './pages/Bluetooth';
import React, { useEffect, useState } from 'react';

// Import AOS (Animate on Scroll)
import AOS from 'aos';
import 'aos/dist/aos.css';

// Bootstrap styles
import 'bootstrap/dist/css/bootstrap.min.css';

// PWA Service Worker
import { registerSW } from 'virtual:pwa-register';

// Register Service Worker for PWA
registerSW({ immediate: true });

// Initialize AOS when app starts
AOS.init({
  duration: 1000,
  once: true,
  offset: 100,
});

const AppRouter: React.FC = () => {
  const [route, setRoute] = useState<string>(window.location.hash || '#/');
  useEffect(() => {
    const onHash = () => setRoute(window.location.hash || '#/');
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  if (route === '#/bluetooth') return <BluetoothPage />;
  return <Home />;
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppRouter />
  </StrictMode>
);
