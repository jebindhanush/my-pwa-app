import React, { useEffect } from "react";
import "./Home.css";

import AOS from "aos";
import NotesModal from "./components/Notes";

const Home: React.FC = () => {
      useEffect(() => {
    AOS.init({
      duration: 1000, // Animation duration in ms
      once: true,     // Only animate once per scroll
      easing: "ease-in-out",
    });
  }, []);

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero text-white d-flex flex-column justify-content-center align-items-start px-4 px-md-5">
        <h1 className="display-4 fw-bold mb-3">Build Once. Run Everywhere 🌍</h1>
        <p className="lead mb-4">
          Create a blazing-fast <strong>Progressive Web App (PWA)</strong> using <strong>React</strong>,  
          then transform it into a fully functional <strong>mobile app</strong> with Capacitor by Ionic.
        </p>
        <a
          href="#details"
          className="btn btn-light btn-lg fw-semibold shadow-sm rounded-pill"
        >
          Learn More
        </a>
      </section> 
   

      {/* Overview Section */}
      <section id="details" className="py-5 px-4 px-md-5 bg-light text-dark" data-aos="fade-up">
        <div className="text-center mb-5">
          <h2 className="fw-bold">What is a PWA?</h2>
          <p className="text-secondary">
            A <strong>Progressive Web App (PWA)</strong> is a web application that behaves like a native app.
            It’s fast, installable, and works offline — all from a single codebase.
          </p>
        </div>

        <div className="row g-4">
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body text-center">
                <i className="bi bi-lightning-charge text-success fs-1 mb-3"></i>
                <h5 className="card-title fw-semibold">Fast & Reliable ⚡</h5>
                <p className="card-text text-muted">
                  PWAs load instantly and offer offline access using service workers and caching.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body text-center">
                <i className="bi bi-phone text-success fs-1 mb-3"></i>
                <h5 className="card-title fw-semibold">Installable 📱</h5>
                <p className="card-text text-muted">
                  Users can install your app directly from the browser — no app store required.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body text-center">
                <i className="bi bi-wifi-off text-success fs-1 mb-3"></i>
                <h5 className="card-title fw-semibold">Works Offline 🌐</h5>
                <p className="card-text text-muted">
                  Continue using the app even without an internet connection, thanks to caching strategies.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

        <section className="py-5 capacitor-section text-center text-white">
        <div className="container">
            <h2>Local Storage (IndexedDB Demo)</h2>
            <p className="text-light mb-4" style={{ opacity: 0.9 }}>
            <strong>IndexedDB</strong> is a powerful in-browser database that lets your web app 
            store structured data locally. It’s ideal for offline support, caching, and 
            syncing user data when internet access returns — making it perfect for 
            Progressive Web Apps (PWAs) and modern hybrid mobile experiences.
            </p>
            <NotesModal />
        </div>
        </section>


      {/* React Integration Section */}
      <section className="py-5 px-4 px-md-5 bg-white text-dark" data-aos="fade-up">
        <div className="row align-items-center g-5">
          <div className="col-md-6">
            <h2 className="fw-bold mb-3 text-success">React + PWA</h2>
            <p className="text-secondary">
              React makes it easy to build a dynamic, component-based frontend.
              When combined with a <strong>PWA manifest</strong> and <strong>service worker</strong>,
              your React app becomes installable and offline-ready instantly.
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

      {/* Capacitor Section */}
      <section className="py-5 px-4 px-md-5 text-white capacitor-section">
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
              <li>📦 Run <code>npm install @capacitor/core @capacitor/cli</code></li>
              <li>🔧 Initialize: <code>npx cap init</code></li>
              <li>📱 Add platforms: <code>npx cap add android</code> / <code>ios</code></li>
              <li>⚡ Build & Sync: <code>npm run build && npx cap sync</code></li>
              <li>🚀 Open in native IDE: <code>npx cap open android</code></li>
            </ul>
          </div>
        </div>
      </section>

      {/* PWA Advantages & Challenges Section */}
      <section className="py-5 px-4 px-md-5 bg-light" data-aos="fade-up">
        <h2 className="fw-bold text-center mb-5">PWA Insights 🎯</h2>
        <div className="row g-4">
          <div className="col-md-6">
            <div className="card h-100 border-0 shadow-sm bg-success text-white">
              <div className="card-body">
                <h3 className="card-title h4 fw-bold mb-4">Advantages 🚀</h3>
                <ul className="list-unstyled mb-0">
                  <li className="mb-3 d-flex align-items-center">
                    <i className="bi bi-check-circle-fill me-2"></i>
                    <span>Faster loading with Service Workers</span>
                  </li>
                  <li className="mb-3 d-flex align-items-center">
                    <i className="bi bi-check-circle-fill me-2"></i>
                    <span>Cost-effective development cycle</span>
                  </li>
                  <li className="mb-3 d-flex align-items-center">
                    <i className="bi bi-check-circle-fill me-2"></i>
                    <span>Cross-platform by default</span>
                  </li>
                  <li className="mb-3 d-flex align-items-center">
                    <i className="bi bi-check-circle-fill me-2"></i>
                    <span>Instant updates & deployment</span>
                  </li>
                  <li className="d-flex align-items-center">
                    <i className="bi bi-check-circle-fill me-2"></i>
                    <span>Lower storage requirements</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card h-100 border-0 shadow-sm bg-danger text-white">
              <div className="card-body">
                <h3 className="card-title h4 fw-bold mb-4">Challenges 🤔</h3>
                <ul className="list-unstyled mb-0">
                  <li className="mb-3 d-flex align-items-center">
                    <i className="bi bi-exclamation-circle-fill me-2"></i>
                    <span>Limited iOS PWA support</span>
                  </li>
                  <li className="mb-3 d-flex align-items-center">
                    <i className="bi bi-exclamation-circle-fill me-2"></i>
                    <span>Restricted native features</span>
                  </li>
                  <li className="mb-3 d-flex align-items-center">
                    <i className="bi bi-exclamation-circle-fill me-2"></i>
                    <span>Battery usage concerns</span>
                  </li>
                  <li className="mb-3 d-flex align-items-center">
                    <i className="bi bi-exclamation-circle-fill me-2"></i>
                    <span>No app store visibility</span>
                  </li>
                  <li className="d-flex align-items-center">
                    <i className="bi bi-exclamation-circle-fill me-2"></i>
                    <span>Limited background tasks</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Storage Section */}
      <section className="py-5 px-4 px-md-5 bg-white" data-aos="fade-up">
        <h2 className="fw-bold text-center mb-5">Storage Solutions 💾</h2>
        <div className="card border-0 shadow-lg">
          <div className="card-body p-4">
            <div className="row g-4">
              <div className="col-md-6">
                <h3 className="h4 fw-bold text-primary mb-4">IndexedDB Power</h3>
                <div className="d-flex align-items-start mb-3">
                  <i className="bi bi-database-fill text-primary fs-4 me-3"></i>
                  <div>
                    <h4 className="h6 fw-bold mb-2">Large Data Storage</h4>
                    <p className="text-muted mb-0">Store complex objects and files with no practical size limits</p>
                  </div>
                </div>
                <div className="d-flex align-items-start mb-3">
                  <i className="bi bi-arrow-repeat text-primary fs-4 me-3"></i>
                  <div>
                    <h4 className="h6 fw-bold mb-2">Async Operations</h4>
                    <p className="text-muted mb-0">Non-blocking database operations for better performance</p>
                  </div>
                </div>
                <div className="d-flex align-items-start">
                  <i className="bi bi-shield-check text-primary fs-4 me-3"></i>
                  <div>
                    <h4 className="h6 fw-bold mb-2">Transaction Support</h4>
                    <p className="text-muted mb-0">Ensure data integrity with built-in transactions</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6">
                <h3 className="h4 fw-bold text-success mb-4">Browser Limits</h3>
                <div className="card bg-light border-0">
                  <div className="card-body">
                    <ul className="list-group list-group-flush">
                      <li className="list-group-item bg-transparent">
                        <i className="bi bi-chrome text-success me-2"></i>
                        Chrome: ~80% of available disk
                      </li>
                      <li className="list-group-item bg-transparent">
                        <i className="bi bi-firefox text-success me-2"></i>
                        Firefox: Dynamic allocation
                      </li>
                      <li className="list-group-item bg-transparent">
                        <i className="bi bi-safari text-success me-2"></i>
                        Safari: 50MB cap
                      </li>
                      <li className="list-group-item bg-transparent">
                        <i className="bi bi-phone text-success me-2"></i>
                        Mobile: Varies by device
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Native Features Section */}
      <section className="py-5 px-4 px-md-5 text-white" data-aos="fade-up">
        <h2 className="fw-bold text-center mb-5">Native Integration 📱</h2>
        <div className="row g-4">
          <div className="col-md-6">
            <div className="card bg-primary text-white h-100 border-0">
              <div className="card-body p-4">
                <h3 className="card-title h4 fw-bold mb-4">
                  <i className="bi bi-lightning-charge-fill me-2"></i>
                  Capacitor Features
                </h3>
                <ul className="list-unstyled mb-0">
                  <li className="mb-3">
                    <strong>🔌 Native API Bridge:</strong>
                    <p className="small mb-0">Seamless access to device features</p>
                  </li>
                  <li className="mb-3">
                    <strong>🔄 Live Reload:</strong>
                    <p className="small mb-0">Rapid development cycle</p>
                  </li>
                  <li className="mb-3">
                    <strong>🛠 Custom Plugins:</strong>
                    <p className="small mb-0">Extend functionality easily</p>
                  </li>
                  <li>
                    <strong>📱 Platform Support:</strong>
                    <p className="small mb-0">iOS, Android, and Electron</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card bg-warning text-dark h-100 border-0">
              <div className="card-body p-4">
                <h3 className="card-title h4 fw-bold mb-4">
                  <i className="bi bi-grid-fill me-2"></i>
                  Ionic Components
                </h3>
                <ul className="list-unstyled mb-0">
                  <li className="mb-3">
                    <strong>🎨 Native UI:</strong>
                    <p className="small mb-0">Platform-specific design patterns</p>
                  </li>
                  <li className="mb-3">
                    <strong>⚡ Performance:</strong>
                    <p className="small mb-0">Optimized for mobile devices</p>
                  </li>
                  <li className="mb-3">
                    <strong>🎭 Adaptability:</strong>
                    <p className="small mb-0">Works with any framework</p>
                  </li>
                  <li>
                    <strong>📚 Rich Ecosystem:</strong>
                    <p className="small mb-0">Extensive plugin collection</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center text-white py-3">
        © {new Date().getFullYear()} POC — React + PWA + Capacitor Integration.
      </footer>
    </div>
  );
};

export default Home;
