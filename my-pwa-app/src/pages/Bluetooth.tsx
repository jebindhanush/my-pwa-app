// Home.tsx
import React, { useEffect, useState, useRef } from "react";
import AOS from "aos";

// Capacitor BLE client
import { BleClient, numbersToDataView } from "@capacitor-community/bluetooth-le";

const Home: React.FC = () => {
  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      easing: "ease-in-out",
    });
  }, []);

  /* ---------------- Bluetooth state & helpers ---------------- */
  const [btAvailable, setBtAvailable] = useState<"unknown" | "web" | "capacitor" | "none">("unknown");
  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [deviceName, setDeviceName] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [services, setServices] = useState<string[]>([]);
  const [lastMessage, setLastMessage] = useState<string | null>(null);
const notificationCallbackRef = useRef<((ev: any) => void) | null>(null);


  useEffect(() => {
    // Feature detection: prefer Capacitor plugin if available (native app), otherwise Web Bluetooth
    (async () => {
      try {
        // Try to initialize BleClient (works in native & web builds if plugin supports web)
        await BleClient.initialize();
        setBtAvailable("capacitor");
        setLastMessage("Capacitor BLE plugin available (initialized).");
      } catch (e) {
        // If plugin init fails, fallback to Web Bluetooth detection
        if (typeof navigator !== "undefined" && "bluetooth" in navigator) {
          setBtAvailable("web");
          setLastMessage("Web Bluetooth available (fallback).");
        } else {
          setBtAvailable("none");
          setLastMessage("No Bluetooth support detected.");
        }
      }
    })();
  }, []);

  /* ----------- Capacitor BLE helpers (preferred) -------------- */

  // Request device and connect using the Capacitor plugin
  const capRequestAndConnect = async (serviceUuids: string[] = []) => {
    try {
      setLastMessage("Initializing BLE and requesting device...");
      await BleClient.initialize();

      // `requestDevice` opens a native picker (Android) or uses Web Bluetooth where supported.
      const device = await BleClient.requestDevice({
        services: serviceUuids,
        // if you pass an empty array it allows scanning devices (UI may show many)
        // prefer enumerating known service UUIDs for targeted UX
      });

      if (!device) {
        setLastMessage("No device selected.");
        return;
      }

      // plugin device shape can differ between platforms; coerce to any for safety
      const d: any = device;
      setDeviceId(d.deviceId ?? d.id ?? null);
      setDeviceName(d.name ?? d.localName ?? d.id ?? null);

      // Connect (BleClient.connect may return void depending on plugin version)
      await BleClient.connect(d.deviceId ?? d.id);
      setIsConnected(true);
      setLastMessage(`Connected to ${d.name ?? d.deviceId ?? d.id}`);

      // List primary services and normalize to strings
      const svcs = await BleClient.getServices(d.deviceId ?? d.id);
      setServices((svcs || []).map((s: any) => s.service ?? s.uuid ?? s));
    } catch (err: any) {
      console.error("capRequestAndConnect:", err);
      setLastMessage(`Error: ${err?.message ?? err}`);
    }
  };

  const capDisconnect = async () => {
    try {
      if (!deviceId) {
        setLastMessage("No device to disconnect.");
        return;
      }
      await BleClient.disconnect(deviceId);
      setIsConnected(false);
      setLastMessage("Disconnected (capacitor).");
      setServices([]);
    } catch (err: any) {
      console.error("capDisconnect:", err);
      setLastMessage(`Disconnect error: ${err?.message ?? err}`);
    }
  };

  // Read a characteristic (returns DataView)
  const capRead = async (svc: string, char: string) => {
    try {
      if (!deviceId) throw new Error("Not connected to device.");
  const result = await BleClient.read(deviceId, svc, char);
  // plugin may return a DataView directly or an object with `.value` — normalize
  const dv: DataView | undefined = (result as any)?.value ?? (result as any);
      let human = "";
      if (dv) {
        // try decode as UTF-8 text
        try {
          const bytes = new Uint8Array(dv.buffer);
          human = new TextDecoder().decode(bytes);
        } catch {
          human = Array.from(new Uint8Array(dv.buffer))
            .map((b) => b.toString(16).padStart(2, "0"))
            .join(" ");
        }
      }
      setLastMessage(`Read (${char}): ${human}`);
      return dv;
    } catch (err: any) {
      console.error("capRead:", err);
      setLastMessage(`Read error: ${err?.message ?? err}`);
      return null;
    }
  };

  // Write UTF-8 string to a characteristic
  const capWrite = async (svc: string, char: string, text: string) => {
    try {
      if (!deviceId) throw new Error("Not connected to device.");
      const bytes = new TextEncoder().encode(text);
      // plugin expects base64able array buffer; write accepts numbersToDataView helper
      await BleClient.write(deviceId, svc, char, numbersToDataView(Array.from(bytes)));
      setLastMessage(`Wrote to ${char}: ${text}`);
    } catch (err: any) {
      console.error("capWrite:", err);
      setLastMessage(`Write error: ${err?.message ?? err}`);
    }
  };

  // Notifications: start
const capStartNotifications = async (svc: string, char: string) => {
  try {
    if (!deviceId) throw new Error("Not connected to device.");
    const cb = (event: any) => {
      const dv: DataView | undefined = event?.value;
      let text = "<no data>";
      if (dv) {
        try {
          text = new TextDecoder().decode(new Uint8Array(dv.buffer));
        } catch {
          text = Array.from(new Uint8Array(dv.buffer)).map((b) => b.toString(16).padStart(2, "0")).join(" ");
        }
      }
      setLastMessage(`Notification (${char}): ${text}`);
    };
    notificationCallbackRef.current = cb;
    await BleClient.startNotifications(deviceId, svc, char, cb);
    setLastMessage(`Notifications started for ${char}`);
  } catch (err: any) {
    console.error("capStartNotifications:", err);
    setLastMessage(`startNotifications error: ${err?.message ?? err}`);
  }
};


  const capStopNotifications = async (svc: string, char: string) => {
    try {
      if (!deviceId) throw new Error("Not connected to device.");
      await BleClient.stopNotifications(deviceId, svc, char);
      notificationCallbackRef.current = null;
      setLastMessage(`Notifications stopped for ${char}`);
    } catch (err: any) {
      console.error("capStopNotifications:", err);
      setLastMessage(`stopNotifications error: ${err?.message ?? err}`);
    }
  };

  /* ---------------- Web Bluetooth fallback (kept minimal) ---------------- */
  // If running as PWA in browser and plugin unavailable, keep your earlier navigator.bluetooth logic.
  const webRequestAndConnect = async () => {
    try {
  if (!(navigator as any).bluetooth) throw new Error("Web Bluetooth API not available.");
      const device = await (navigator as any).bluetooth.requestDevice({
        acceptAllDevices: true,
        optionalServices: ["battery_service", "device_information"],
      });
      // minimal connect flow
      const server = await device.gatt.connect();
      setDeviceName(device.name ?? device.id);
      setIsConnected(true);
      setLastMessage("Web Bluetooth connected");
      const svcs = await server.getPrimaryServices();
      setServices(svcs.map((s: any) => s.uuid));
    } catch (err: any) {
      console.error("webRequestAndConnect:", err);
      setLastMessage(`Web error: ${err?.message ?? err}`);
    }
  };

  /* ---------------- UI wiring helpers ---------------- */
  const requestDevice = async () => {
    if (btAvailable === "capacitor") {
      await capRequestAndConnect([]);
    } else if (btAvailable === "web") {
      await webRequestAndConnect();
    } else {
      setLastMessage("Bluetooth not available on this platform.");
    }
  };

  const disconnect = async () => {
    if (btAvailable === "capacitor") {
      await capDisconnect();
    } else if (btAvailable === "web") {
      // For web fallback, easiest is to reload or let the existing device disconnect via stored references.
      setLastMessage("Web fallback: reload to disconnect (or implement explicit server/device refs).");
    }
  };

  /* ---------------- End helpers ---------------- */

  return (
    <div className="home">
      {/* ... keep your existing sections above unchanged ... */}

      {/* Bluetooth Section (updated for Capacitor plugin) */}
      <section className="py-5 px-4 px-md-5 bg-white" data-aos="fade-up" id="bluetooth">
        <h2 className="fw-bold text-center mb-4">Bluetooth (Capacitor / BLE) — Android Focus 🔵</h2>

        <div className="row g-4">
          <div className="col-lg-6">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body">
                <h4 className="mb-3">Quick Controls</h4>

                <div className="mb-3">
                  <small className="text-muted">Feature available?</small>
                  <div>
                    {btAvailable === "unknown" && <span className="badge bg-secondary">Checking...</span>}
                    {btAvailable === "capacitor" && <span className="badge bg-success">Capacitor BLE</span>}
                    {btAvailable === "web" && <span className="badge bg-info">Web Bluetooth</span>}
                    {btAvailable === "none" && <span className="badge bg-danger">Not supported</span>}
                  </div>
                </div>

                <div className="d-grid gap-2 mb-3">
                  <button className="btn btn-primary" onClick={() => requestDevice()}>
                    Request & Connect Device
                  </button>
                  <button className="btn btn-outline-danger" onClick={() => disconnect()}>
                    Disconnect
                  </button>
                </div>

                <div className="mb-3">
                  <small className="text-muted">Connected device</small>
                  <div>
                    <strong>{deviceName ?? "—"}</strong>
                    <div className="small text-muted">Status: {isConnected ? "Connected" : "Disconnected"}</div>
                  </div>
                </div>

                <div className="mb-3">
                  <small className="text-muted">Available services</small>
                  <ul className="mb-0">
                    {services.length === 0 ? <li className="text-muted">None listed</li> : services.map((s) => <li key={s}><code>{s}</code></li>)}
                  </ul>
                </div>

                <hr />

                <h5 className="mb-2">Examples (Capacitor)</h5>
                <div className="mb-2">
                  <button className="btn btn-sm btn-outline-primary me-2"
                          onClick={() => capRead("battery_service", "battery_level")}
                          disabled={!isConnected || btAvailable !== "capacitor"}>
                    Read Battery Level
                  </button>

                  <button className="btn btn-sm btn-outline-primary me-2"
                          onClick={() => capRead("device_information", "manufacturer_name_string")}
                          disabled={!isConnected || btAvailable !== "capacitor"}>
                    Read Manufacturer
                  </button>

                  <button className="btn btn-sm btn-outline-success me-2"
                          onClick={() => capWrite("device_information", "serial_number_string", "HELLO")}
                          disabled={!isConnected || btAvailable !== "capacitor"}>
                    Write Example (serial_number_string)
                  </button>

                  <button className="btn btn-sm btn-outline-warning me-2"
                          onClick={() => capStartNotifications("battery_service", "battery_level")}
                          disabled={!isConnected || btAvailable !== "capacitor"}>
                    Start Notifications (battery_level)
                  </button>

                  <button className="btn btn-sm btn-outline-secondary"
                          onClick={() => capStopNotifications("battery_service", "battery_level")}
                          disabled={!isConnected || btAvailable !== "capacitor"}>
                    Stop Notifications
                  </button>
                </div>

              </div>
            </div>
          </div>

          <div className="col-lg-6">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body">
                <h4 className="mb-3">Notes & Platform Tips</h4>
                <ul className="list-unstyled text-muted">
                  <li><strong>Install:</strong> <code>npm install @capacitor-community/bluetooth-le</code> and <code>npx cap sync</code>.</li>
                  <li><strong>Android:</strong> Add BLUETOOTH_CONNECT, BLUETOOTH_SCAN, etc. to AndroidManifest and request runtime permissions on Android 12+. See plugin docs for specifics.</li>
                  <li><strong>Fallback:</strong> In browser (PWA in Chrome) the plugin may use Web Bluetooth or you can rely on <code>navigator.bluetooth</code>.</li>
                  <li><strong>Native features:</strong> For background scanning/foreground-service or advanced Android-only features consider native-capable plugins or deeper native code paths (foreground service).</li>
                </ul>

                <hr />

                <h5 className="mb-2">Last message</h5>
                <div className="small text-dark">
                  {lastMessage ?? <span className="text-muted">No activity yet</span>}
                </div>

                <div className="mt-4">
                  <small className="text-muted">Quick code tip</small>
                  <pre className="p-2 bg-light rounded" style={{ fontSize: 12 }}>
{`// Capacitor BLE pattern:
await BleClient.initialize();
const device = await BleClient.requestDevice({ services: ['your-service-uuid']});
await BleClient.connect(deviceId);
await BleClient.read(deviceId, svc, chr);
BleClient.startNotifications(deviceId, svc, chr, callback);`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-center text-white py-3">
        © {new Date().getFullYear()} POC — React + PWA + Capacitor Integration.
      </footer>
    </div>
  );
};

export default Home;
