// Home.tsx
import React, { useEffect, useState, useRef } from "react";
import AOS from "aos";

import { APP_VERSION } from "../version";

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
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
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

  // Helper: normalize friendly names or short UUIDs to 128-bit canonical UUIDs
  const expandUuid = (id: string) => {
    const map: Record<string, string> = {
      battery_service: "0000180f-0000-1000-8000-00805f9b34fb",
      battery_level: "00002a19-0000-1000-8000-00805f9b34fb",
      device_information: "0000180a-0000-1000-8000-00805f9b34fb",
    };
    if (map[id]) return map[id];
    const shortMatch = /^[0-9a-fA-F]{4}$/.test(id);
    const fullMatch = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(id);
    if (shortMatch) return `0000${id}-0000-1000-8000-00805f9b34fb`;
    if (fullMatch) return id;
    // unknown form: return as-is — plugin may error but we guard callers
    return id;
  };

  // Request device and connect using the Capacitor plugin
  const capRequestAndConnect = async (serviceUuids: string[] = []) => {
    try {
      setLastMessage("Initializing BLE and requesting device...");
      await BleClient.initialize();

      // `requestDevice` opens a native picker (Android) or uses Web Bluetooth where supported.
      const normalizedServices = (serviceUuids || []).map((s) => expandUuid(s));
      // `requestDevice` opens a native picker (Android) or uses Web Bluetooth where supported.
      const device = await BleClient.requestDevice({
        services: normalizedServices,
        // if you pass an empty array it allows scanning devices (UI may show many)
        // prefer enumerating known service UUIDs for targeted UX
      });

      if (!device) {
        setLastMessage("No device selected.");
        return;
      }

      // plugin device shape can differ between platforms; coerce to any for safety
      const d: any = device;
      const chosenId = d.deviceId ?? d.id ?? null;
      const chosenName = d.name ?? d.localName ?? d.id ?? null;
      setDeviceId(chosenId);
      setDeviceName(chosenName);

      // Debug: surface the picked device object so we can triage unsupported devices
      try {
        console.debug('Picked device object (capacitor):', d);
        setLastMessage(`Selected device: ${chosenName} (${chosenId})`);
      } catch (e) {
        // ignore stringify errors
      }

      // Connect (BleClient.connect may throw if device doesn't support required profiles)
      try {
        await BleClient.connect(chosenId);
      } catch (connectErr: any) {
        console.error('BleClient.connect failed:', connectErr);
        // Provide a clearer message for demo: unsupported or connection refused
        setLastMessage(`Connect failed: ${connectErr?.message ?? connectErr}`);
        setIsConnected(false);
        return;
      }

      setIsConnected(true);
      setLastMessage(`Connected to ${chosenName ?? chosenId}`);

      // List primary services and normalize to strings
      try {
        const svcs = await BleClient.getServices(chosenId);
        setServices((svcs || []).map((s: any) => s.service ?? s.uuid ?? s));
      } catch (svcErr: any) {
        console.warn('getServices failed:', svcErr);
        setLastMessage((prev) => `${prev} — getServices error: ${svcErr?.message ?? svcErr}`);
      }
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
    // Helper: decode various return shapes (DataView, object, base64 string)
    const decodeResult = (res: any) => {
      if (!res && res !== 0) return { text: null, bytes: null, dv: null };
      // If result has `.value`, unwrap
      const val = (res as any)?.value ?? res;

      // If it's a DataView
      if (val instanceof DataView) {
        const bytes = new Uint8Array(val.buffer);
        let text: string | null = null;
        try {
          text = new TextDecoder().decode(bytes);
        } catch {
          text = Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join(" ");
        }
        return { text, bytes, dv: val };
      }

      // If it's an ArrayBuffer or TypedArray
      if (val && val.buffer && val.byteLength !== undefined) {
        const bytes = new Uint8Array(val.buffer ?? val);
        let text: string | null = null;
        try {
          text = new TextDecoder().decode(bytes);
        } catch {
          text = Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join(" ");
        }
        return { text, bytes, dv: new DataView(bytes.buffer) };
      }

      // If it's a base64 string
      if (typeof val === "string") {
        try {
          // atob -> binary string
          const bin = atob(val);
          const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
          let text: string | null = null;
          try {
            text = new TextDecoder().decode(bytes);
          } catch {
            text = Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join(" ");
          }
          return { text, bytes, dv: new DataView(bytes.buffer) };
        } catch (e) {
          // not base64, treat as plain string
          return { text: String(val), bytes: null, dv: null };
        }
      }

      return { text: String(val), bytes: null, dv: null };
    };

    // Expand candidates to accept short or canonical forms
    const expandCandidates = (id: string) => {
      if (!id) return [id];
      const map: Record<string, string[]> = {
        battery_service: ["0000180f-0000-1000-8000-00805f9b34fb"],
        battery_level: ["00002a19-0000-1000-8000-00805f9b34fb"],
      };
      if (map[id]) return map[id];
      // short 4-hex
      if (/^[0-9a-fA-F]{4}$/.test(id)) return [`0000${id}-0000-1000-8000-00805f9b34fb`];
      // canonical 128
      if (/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(id)) return [id];
      return [id];
    };

    const svcCandidates = expandCandidates(svc);
    const charCandidates = expandCandidates(char);

    let lastErr: any = null;
    try {
      if (!deviceId) throw new Error("Not connected to device.");

      // Try combinations of service/characteristic identifiers so we work across plugin versions
      for (const s of svcCandidates) {
        for (const c of charCandidates) {
            try {
            const result = await BleClient.read(deviceId, s, c);
            const decoded = decodeResult(result);
            setLastMessage(`Read (${c}): ${decoded.text ?? "<binary>"}`);
            // If a single-byte battery percentage is returned, update visual battery
            if (decoded.bytes && decoded.bytes.length === 1) {
              setBatteryLevel(decoded.bytes[0]);
            }
            return decoded.dv ?? null;
          } catch (innerErr) {
            lastErr = innerErr;
            // continue trying other formats
          }
        }
      }

      // If we get here, all attempts failed
      throw lastErr ?? new Error("Read returned no result");
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
      // Try normalized UUID forms for write (some plugin versions expect 128-bit strings)
      const svcCandidates = [expandUuid(svc)];
      const charCandidates = [expandUuid(char)];
      let wrote = false;
      let lastErr: any = null;
      for (const s of svcCandidates) {
        for (const c of charCandidates) {
          try {
            await BleClient.write(deviceId, s, c, numbersToDataView(Array.from(bytes)));
            wrote = true;
            break;
          } catch (e: any) {
            lastErr = e;
          }
        }
        if (wrote) break;
      }
      if (!wrote) throw lastErr ?? new Error('Write failed');
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

    // Expand possible UUID forms and try to start notifications on the first that succeeds
    const svcCandidates = [svc].flatMap((s) => {
      if (s === 'battery_service') return [expandUuid('battery_service')];
      if (/^[0-9a-fA-F]{4}$/.test(s)) return [`0000${s}-0000-1000-8000-00805f9b34fb`];
      return [s];
    });
    const charCandidates = [char].flatMap((c) => {
      if (c === 'battery_level') return [expandUuid('battery_level')];
      if (/^[0-9a-fA-F]{4}$/.test(c)) return [`0000${c}-0000-1000-8000-00805f9b34fb`];
      return [c];
    });

    let started = false;
    let lastErr: any = null;
    for (const s of svcCandidates) {
      for (const c of charCandidates) {
        try {
          await BleClient.startNotifications(deviceId, s, c, cb);
          setLastMessage(`Notifications started for ${c}`);
          started = true;
          break;
        } catch (e: any) {
          lastErr = e;
        }
      }
      if (started) break;
    }
    if (!started) throw lastErr ?? new Error('startNotifications failed');
  } catch (err: any) {
    console.error("capStartNotifications:", err);
    setLastMessage(`startNotifications error: ${err?.message ?? err}`);
  }
};


  const capStopNotifications = async (svc: string, char: string) => {
    try {
      if (!deviceId) throw new Error("Not connected to device.");
      // Try normalized candidates for stopNotifications as well
      const svc128 = expandUuid(svc);
      const char128 = expandUuid(char);
      try {
        await BleClient.stopNotifications(deviceId, svc128, char128);
      } catch (e) {
        // best-effort: try raw values as fallback
        await BleClient.stopNotifications(deviceId, svc, char);
      }
      notificationCallbackRef.current = null;
      setLastMessage(`Notifications stopped for ${char}`);
    } catch (err: any) {
      console.error("capStopNotifications:", err);
      setLastMessage(`stopNotifications error: ${err?.message ?? err}`);
    }
  };

  // Reference some helpers so TypeScript/linters don't mark them as unused in builds where
  // the example buttons are removed for the demo page.
  void capWrite;
  void capStopNotifications;

  /* ---------------- Web Bluetooth fallback (kept minimal) ---------------- */
  // If running as PWA in browser and plugin unavailable, keep your earlier navigator.bluetooth logic.
  const webRequestAndConnect = async (serviceUuids: string[] = []) => {
    try {
      if (!(navigator as any).bluetooth) throw new Error("Web Bluetooth API not available.");

      // Helper mapping for friendly names to common UUIDs
      // Map friendly names to valid UUID forms (128-bit canonical format).
      // Web Bluetooth rejects literal names like "battery_service", so only provide
      // acceptable UUID strings (128-bit) or 16-bit numeric forms (0x180f) if needed.
      const uuidMap: Record<string, string[]> = {
        battery_service: ["0000180f-0000-1000-8000-00805f9b34fb"],
        battery_level: ["00002a19-0000-1000-8000-00805f9b34fb"],
        device_information: ["0000180a-0000-1000-8000-00805f9b34fb"],
      };

      // Build optionalServices list including provided serviceUuids and some sensible defaults
      const optionalServices = new Set<string>([...serviceUuids]);
      // always include battery and device info as useful defaults for the demo
      ['battery_service','device_information'].forEach((k) => optionalServices.add(k));

      // Expand friendly names to actual UUID strings for broader compatibility
      const expanded: string[] = [];
      for (const s of Array.from(optionalServices)) {
        if (uuidMap[s]) {
          uuidMap[s].forEach((u) => expanded.push(u));
          continue;
        }

        // If the caller passed a short 16-bit hex (e.g. '180f' or '2a19') or a
        // 128-bit UUID include it directly. Reject literal friendly names here
        // because Web Bluetooth will throw for them.
        const isShort = /^[0-9a-fA-F]{4}$/.test(s);
        const is128 = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(s);
        if (isShort) {
          // Convert short form to 128-bit canonical string
          expanded.push(`0000${s}-0000-1000-8000-00805f9b34fb`);
        } else if (is128) {
          expanded.push(s);
        } else {
          // Unknown form: skip to avoid Web Bluetooth throwing an error
          console.warn('Ignoring unknown service identifier for web requestDevice:', s);
        }
      }

      // If we have a targeted service, use filters to make the picker show relevant devices.
      const hasTarget = serviceUuids.length > 0;
      const requestOpts: any = hasTarget
        ? { filters: [{ services: expanded }] , optionalServices: expanded }
        : { acceptAllDevices: true, optionalServices: expanded };

      const device = await (navigator as any).bluetooth.requestDevice(requestOpts);

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
  const requestDevice = async (serviceUuids: string[] = []) => {
    if (btAvailable === "capacitor") {
      await capRequestAndConnect(serviceUuids);
    } else if (btAvailable === "web") {
      await webRequestAndConnect(serviceUuids);
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
        <div className="container">
          <div className="text-center mb-4">
            <h2 className="fw-bold">Bluetooth — Live Demo & Controls 🔵</h2>
            <p className="text-muted">Connect to a nearby BLE device, read characteristics, start notifications and inspect services — ideal for demos and POCs.</p>
          </div>

          {/* Feature cards */}
          <div className="row g-3 mb-4">
            <div className="col-sm-4">
              <div className="card h-100 border-0 shadow-sm text-center p-3">
                <div className="card-body">
                  <i className="bi bi-phone-fill fs-1 text-primary mb-2"></i>
                  <h5 className="card-title">Device Connect</h5>
                  <p className="small text-muted">Prompt device picker and establish a GATT connection (Capacitor or Web Bluetooth).</p>
                </div>
              </div>
            </div>
            <div className="col-sm-4">
              <div className="card h-100 border-0 shadow-sm text-center p-3">
                <div className="card-body">
                  <i className="bi bi-battery-half fs-1 text-success mb-2"></i>
                  <h5 className="card-title">Read Characteristics</h5>
                  <p className="small text-muted">Read battery, device information and custom characteristics in real-time.</p>
                </div>
              </div>
            </div>
            <div className="col-sm-4">
              <div className="card h-100 border-0 shadow-sm text-center p-3">
                <div className="card-body">
                  <i className="bi bi-broadcast-pin fs-1 text-warning mb-2"></i>
                  <h5 className="card-title">Notifications</h5>
                  <p className="small text-muted">Start notifications for characteristics and view incoming data live.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="row g-4">
            <div className="col-lg-5">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body">
                  <h4 className="mb-3">Device Panel</h4>

                  <div className="d-flex align-items-center mb-3">
                    <div className="me-3">
                      <i className="bi bi-device-hdd-fill fs-1 text-secondary"></i>
                    </div>
                    <div>
                      <div className="fw-semibold">{deviceName ?? 'No device'}</div>
                      <div className="text-muted small">ID: {deviceId ?? '—'}</div>
                      <div className={`mt-2 badge ${isConnected ? 'bg-success' : 'bg-secondary'}`}>{isConnected ? 'Connected' : 'Disconnected'}</div>
                    </div>
                  </div>

                  <div className="mb-3">
                    <small className="text-muted">Controls</small>
                    <div className="d-flex gap-2 mt-2 flex-wrap">
                      <button className="btn btn-primary" onClick={() => requestDevice()}>
                        <i className="bi bi-search me-1" /> Scan & Connect
                      </button>
                      <button className="btn btn-secondary" onClick={() => requestDevice(['battery_service'])}>
                        <i className="bi bi-battery-half me-1" /> Connect (Battery)
                      </button>
                      <button className="btn btn-outline-danger" onClick={() => disconnect()}>
                        <i className="bi bi-x-circle me-1" /> Disconnect
                      </button>
                      <button className="btn btn-outline-primary" onClick={() => capRead('battery_service','battery_level')} disabled={!isConnected || btAvailable !== 'capacitor'}>
                        <i className="bi bi-battery-half me-1" /> Read Battery
                      </button>
                      <button className="btn btn-outline-warning" onClick={() => capStartNotifications('battery_service','battery_level')} disabled={!isConnected || btAvailable !== 'capacitor'}>
                        <i className="bi bi-bell me-1" /> Start Notifications
                      </button>
                    </div>
                  </div>

                  <div className="mb-3">
                    <small className="text-muted">Services</small>
                    <ul className="mt-2">
                      {services.length === 0 ? <li className="text-muted">No services discovered</li> : services.map((s) => <li key={s}><code>{s}</code></li>)}
                    </ul>
                  </div>

                </div>
              </div>
            </div>

            <div className="col-lg-7">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body">
                  <h4 className="mb-3">Live Activity & Logs</h4>
                  <div className="mb-3">
                    <small className="text-muted">Last message</small>
                    <div className="p-3 bg-light rounded mt-2" style={{minHeight: 80}}>
                      <code style={{whiteSpace: 'pre-wrap'}}>{lastMessage ?? 'No activity yet'}</code>
                    </div>
                  </div>

                  <div className="mb-3">
                    <small className="text-muted">Visual Battery</small>
                    <div className="progress mt-2" style={{height: 18}}>
                      {batteryLevel !== null ? (
                        <div className="progress-bar bg-success" role="progressbar" style={{width: `${batteryLevel}%`}}>
                          {batteryLevel}%
                        </div>
                      ) : (
                        <div className="progress-bar bg-secondary progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '100%'}}>
                          Unknown
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mt-4">
                    <small className="text-muted">Presentation-ready Notes</small>
                    <ul className="mt-2">
                      <li>Use this panel during demo to show a successful connection and live characteristic reads.</li>
                      <li>Start notifications and show incoming payloads in the 'Last message' box.</li>
                      <li>For Android native demos, run via Capacitor (ensure required permissions are set).</li>
                    </ul>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark text-center text-white py-3">
        © {new Date().getFullYear()} POC — React + PWA + Capacitor Integration.
  <span className="ms-3 text-white-50">v{APP_VERSION}</span>
      </footer>
    </div>
  );
};

export default Home;
