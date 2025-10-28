import React from "react";
import "./Home.css";

const Home: React.FC = () => {
  return (
    <div className="home bg-light">
      {/* Header */}
      <header className="bg-success text-white py-5 mb-4">
        <div className="container-fluid px-4">
          <h1 className="fw-bold display-5 mb-2">POC PWA</h1>
          <p className="lead mb-0">
            A modern Progressive Web App built with React + TypeScript + Bootstrap + Capacitor.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container-fluid px-4 pb-5">
        {/* About */}
        <section className="mb-5" data-aos="fade-up">
          <h2 className="fw-semibold mb-3">About</h2>
          <p className="text-secondary">
            This PWA works seamlessly across browsers and mobile devices. You can install it, use it offline,
            and even access native device features when converted using Capacitor.
          </p>
        </section>

        {/* Features */}
        <section className="mb-5" data-aos="fade-up" data-aos-delay="100">
          <h2 className="fw-semibold mb-3">Features</h2>
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-2 row-cols-lg-2 g-3">
            {[
              "Offline support and caching",
              "Responsive across all screen sizes",
              "Installable on Android, iOS, and Desktop",
              "Access native features like Camera, Bluetooth, etc.",
            ].map((feature, i) => (
              <div className="col" key={i}>
                <div className="card h-100 border-0 shadow-sm p-3">
                  <p className="mb-0 text-muted">{feature}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* PWA Advantages & Disadvantages */}
        <section className="mb-5" data-aos="fade-up" data-aos-delay="150">
          <h2 className="fw-semibold mb-4">PWA: Pros & Cons</h2>
          <div className="row g-4">
            <div className="col-12 col-md-6">
              <div className="card border-success h-100">
                <div className="card-header bg-success text-white">
                  <h3 className="h5 mb-0">Advantages</h3>
                </div>
                <div className="card-body">
                  <ul className="list-unstyled mb-0">
                    <li className="mb-2">✅ Faster loading through Service Workers</li>
                    <li className="mb-2">✅ Lower development & maintenance costs</li>
                    <li className="mb-2">✅ Cross-platform compatibility</li>
                    <li className="mb-2">✅ No app store submission required</li>
                    <li className="mb-2">✅ Automatic updates</li>
                    <li>✅ Lower storage requirements</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="card border-danger h-100">
                <div className="card-header bg-danger text-white">
                  <h3 className="h5 mb-0">Disadvantages</h3>
                </div>
                <div className="card-body">
                  <ul className="list-unstyled mb-0">
                    <li className="mb-2">❌ Limited access to native features</li>
                    <li className="mb-2">❌ iOS support limitations</li>
                    <li className="mb-2">❌ Higher battery consumption</li>
                    <li className="mb-2">❌ No app store presence</li>
                    <li className="mb-2">❌ Browser compatibility issues</li>
                    <li>❌ Limited background processing</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Storage with IndexedDB */}
        <section className="mb-5" data-aos="fade-up" data-aos-delay="200">
          <h2 className="fw-semibold mb-4">Storage with IndexedDB</h2>
          <div className="card border-info">
            <div className="card-header bg-info text-white">
              <h3 className="h5 mb-0">Local Storage Solutions</h3>
            </div>
            <div className="card-body">
              <div className="row g-4">
                <div className="col-12 col-md-6">
                  <h4 className="h6 fw-bold mb-3">IndexedDB Features</h4>
                  <ul className="list-unstyled">
                    <li className="mb-2">💾 Large data storage capacity</li>
                    <li className="mb-2">💾 Structured data support</li>
                    <li className="mb-2">💾 Asynchronous operations</li>
                    <li>💾 Transaction support</li>
                  </ul>
                </div>
                <div className="col-12 col-md-6">
                  <h4 className="h6 fw-bold mb-3">Storage Limits</h4>
                  <ul className="list-unstyled">
                    <li className="mb-2">📊 Chrome: ~80% of free space</li>
                    <li className="mb-2">📊 Firefox: No fixed limit</li>
                    <li className="mb-2">📊 Safari: ~50MB limit</li>
                    <li>📊 Mobile browsers: Varies</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Capacitor & Ionic */}
        <section className="mb-5" data-aos="fade-up" data-aos-delay="250">
          <h2 className="fw-semibold mb-4">Native Integration</h2>
          <div className="row g-4">
            <div className="col-12 col-md-6">
              <div className="card h-100 border-primary">
                <div className="card-header bg-primary text-white">
                  <h3 className="h5 mb-0">Capacitor Benefits</h3>
                </div>
                <div className="card-body">
                  <ul className="list-unstyled mb-0">
                    <li className="mb-2">🚀 Native API access</li>
                    <li className="mb-2">🚀 Modern web features</li>
                    <li className="mb-2">🚀 Cross-platform plugins</li>
                    <li className="mb-2">🚀 Simple web-to-native bridge</li>
                    <li>🚀 Active community support</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-6">
              <div className="card h-100 border-warning">
                <div className="card-header bg-warning text-dark">
                  <h3 className="h5 mb-0">Ionic Framework</h3>
                </div>
                <div className="card-body">
                  <ul className="list-unstyled mb-0">
                    <li className="mb-2">⚡ Pre-built UI components</li>
                    <li className="mb-2">⚡ Platform-specific designs</li>
                    <li className="mb-2">⚡ Performance optimized</li>
                    <li className="mb-2">⚡ Extensive plugin ecosystem</li>
                    <li>⚡ Framework agnostic</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="mb-5" data-aos="fade-up" data-aos-delay="200">
          <h2 className="fw-semibold mb-3">Team</h2>
          <div className="row g-4">
            {["Alex", "Riya", "Noah"].map((name, idx) => (
              <div className="col-12 col-sm-6 col-md-4" key={idx}>
                <div className="card border-0 shadow-lg h-100">
                  <img
                    src={`https://via.placeholder.com/300x200?text=${name}`}
                    alt={name}
                    className="card-img-top img-fluid"
                  />
                  <div className="card-body text-center">
                    <h5 className="card-title mb-1">{name}</h5>
                    <p className="card-text text-muted small mb-0">
                      Frontend Developer
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section className="mb-5" data-aos="fade-up" data-aos-delay="300">
          <h2 className="fw-semibold mb-3">Contact</h2>
          <p className="text-secondary">
            📧 Email us at{" "}
            <a
              href="mailto:hello@POC.com"
              className="text-success text-decoration-none fw-semibold"
            >
              hello@POC.com
            </a>
          </p>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-dark text-white text-center py-3 mt-auto w-100">
        © {new Date().getFullYear()} POC. All rights reserved.
      </footer>
    </div>
  );
};

export default Home;
