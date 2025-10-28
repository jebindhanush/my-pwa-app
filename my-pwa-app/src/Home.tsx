import React, { useEffect, useState } from "react";
import "./Home.css";
import AOS from "aos";
import NotesModal from "./components/NotesModal";
import { Capacitor } from "@capacitor/core";

const Home: React.FC = () => {
  const [isApp, setIsApp] = useState(false);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: "ease-in-out",
    });

    // ✅ Detect if running as native app or installed PWA
    const isCapacitorApp = Capacitor.isNativePlatform();
    const isStandalonePWA =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true;

    setIsApp(isCapacitorApp || isStandalonePWA);
  }, []);

  const handleDownloadClick = () => {
    alert("⚠️ Unsigned test APK — installation may show a warning.");
  };

  return (
    <div className="home position-relative">
      {/* 🔗 APK Download Button (hidden in app or installed PWA) */}
      {!isApp && (
        <div className="position-absolute top-0 end-0 p-3">
          <a
            href="https://github.com/jebindhanush/my-pwa-app/releases/download/test/app-debug.apk"
            onClick={handleDownloadClick}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline-light fw-semibold shadow-sm"
            style={{
              background: "linear-gradient(90deg, #5236ab, #e41937)",
              color: "white",
              border: "none",
              borderRadius: "20px",
            }}
          >
            📦 Download APK
          </a>
        </div>
      )}

      {/* 🌍 Top Section */}
      <section className="hero text-white d-flex flex-column justify-content-center align-items-start px-4 px-md-5">
        <h1 className="display-4 fw-bold mb-3">Build Once. Run Everywhere 🌍</h1>
        <p className="lead mb-4">
          Create a blazing-fast <strong>Progressive Web App (PWA)</strong> using{" "}
          <strong>React</strong>, then transform it into a fully functional{" "}
          <strong>mobile app</strong> with Capacitor by Ionic.
        </p>
        <a
          href="#details"
          className="btn btn-light btn-lg fw-semibold shadow-sm rounded-pill"
        >
          Learn More
        </a>
      </section>

      {/* 💡 What is a PWA */}
      <section
        id="details"
        className="py-5 px-4 px-md-5 bg-light text-dark"
        data-aos="fade-up"
      >
        <div className="text-center mb-5">
          <h2 className="fw-bold">What is a PWA?</h2>
          <p className="text-secondary">
            A <strong>Progressive Web App (PWA)</strong> is a web application
            that behaves like a native app — fast, installable, and works
            offline from a single codebase.
          </p>
        </div>

        <div className="row g-4">
          {[
            {
              icon: "bi-lightning-charge",
              title: "Fast & Reliable ⚡",
              text: "PWAs load instantly and offer offline access using service workers and caching.",
            },
            {
              icon: "bi-phone",
              title: "Installable 📱",
              text: "Users can install your app directly from the browser — no app store required.",
            },
            {
              icon: "bi-wifi-off",
              title: "Works Offline 🌐",
              text: "Continue using the app even without internet connectivity, thanks to caching.",
            },
          ].map(({ icon, title, text }) => (
            <div className="col-md-4" key={title}>
              <div className="card h-100 border-0 shadow-sm text-center">
                <div className="card-body">
                  <i className={`bi ${icon} text-success fs-1 mb-3`}></i>
                  <h5 className="fw-semibold">{title}</h5>
                  <p className="text-muted">{text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 💾 IndexedDB Demo */}
      <section className="py-5 notes text-center text-white" data-aos="fade-up">
        <div className="container">
          <h2 className="fw-bold mb-3">Local Storage (IndexedDB Demo)</h2>
          <p
            className="lead mx-auto mb-4"
            style={{ maxWidth: "700px", opacity: 0.9 }}
          >
            This demo showcases how data can be stored locally using{" "}
            <strong>IndexedDB</strong> — a browser-based database that allows your
            Progressive Web App (PWA) to work even when offline. Notes are stored
            securely on your device and can later sync with a remote server once
            you’re back online.
          </p>
          <NotesModal />
        </div>
      </section>

      {/* ⚛️ React + PWA */}
      <section className="py-5 px-4 px-md-5 bg-white text-dark" data-aos="fade-up">
        <div className="row align-items-center g-5">
          <div className="col-md-6">
            <h2 className="fw-bold mb-3 text-success">React + PWA</h2>
            <p className="text-secondary">
              React makes it easy to build a dynamic, component-based frontend.
              Combined with a <strong>PWA manifest</strong> and{" "}
              <strong>service worker</strong>, your React app becomes
              installable and offline-ready instantly.
            </p>
            <ul className="list-unstyled text-secondary mt-3">
              <li>✅ Build with Vite or CRA (Create React App)</li>
              <li>✅ Add <code>manifest.json</code> for app metadata</li>
              <li>✅ Register service worker for offline caching</li>
              <li>✅ Test using Lighthouse for PWA compliance</li>
            </ul>
          </div>
          <div className="col-md-6 text-center">
            <img
              src="react-pwa-diagram.png"
              alt="React PWA Diagram"
              className="img-fluid rounded-3 shadow"
            />
          </div>
        </div>
      </section>

      {/* ⚙️ Capacitor Section */}
      <section
        className="py-5 px-4 px-md-5 text-white capacitor-section"
        data-aos="fade-up"
      >
        <div className="row align-items-center g-5">
          <div className="col-md-6 text-center">
            <img
              src="capacitor-diagram.png"
              alt="Capacitor Diagram"
              className="img-fluid rounded-3 shadow"
            />
          </div>
          <div className="col-md-6">
            <h2 className="fw-bold mb-3">Capacitor by Ionic ⚙️</h2>
            <p className="lead">
              Capacitor lets you wrap your web app into a native shell for Android and iOS.
            </p>
            <ul className="list-unstyled mt-3">
              <li>📦 Install: <code>npm install @capacitor/core @capacitor/cli</code></li>
              <li>🔧 Initialize: <code>npx cap init</code></li>
              <li>📱 Add Platforms: <code>npx cap add android</code> / <code>ios</code></li>
              <li>⚡ Build & Sync: <code>npm run build && npx cap sync</code></li>
              <li>🚀 Open in IDE: <code>npx cap open android</code></li>
            </ul>
          </div>
        </div>
      </section>

      {/* 📱 Native Integration Section */}
      <section className="py-5 px-4 px-md-5 bg-white text-dark" data-aos="fade-up">
        <h2 className="fw-bold text-center mb-5">Native Integration 📱</h2>
        <div className="row g-4">
          <div className="col-md-6">
            <div className="card bg-primary text-white h-100 border-0 shadow-sm">
              <div className="card-body p-4">
                <h3 className="h4 fw-bold mb-4">
                  <i className="bi bi-lightning-charge-fill me-2"></i>
                  Capacitor Features
                </h3>
                <ul className="list-unstyled small mb-0">
                  <li>🔌 Native API Bridge – access to device features</li>
                  <li>🔄 Live Reload for faster development</li>
                  <li>🛠 Custom Plugins to extend functionality</li>
                  <li>📱 Platform Support: iOS, Android & Electron</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="col-md-6">
            <div className="card bg-warning text-dark h-100 border-0 shadow-sm">
              <div className="card-body p-4">
                <h3 className="h4 fw-bold mb-4">
                  <i className="bi bi-grid-fill me-2"></i>
                  Ionic Components
                </h3>
                <ul className="list-unstyled small mb-0">
                  <li>🎨 Native UI patterns for all platforms</li>
                  <li>⚡ Mobile-optimized performance</li>
                  <li>🎭 Works with any JS framework</li>
                  <li>📚 Huge ecosystem of plugins</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ⚫ Footer */}
      <footer className="text-center text-white py-3 bg-dark">
        © {new Date().getFullYear()} POC — React + PWA + Capacitor Integration.
      </footer>
    </div>
  );
};

export default Home;
