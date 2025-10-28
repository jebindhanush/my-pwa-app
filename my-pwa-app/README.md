
## 🧠 **my-pwa-app**

### *Build Once. Run Everywhere.*

A modern **Progressive Web App (PWA)** built using **React + Vite**, enhanced with **Capacitor** to run as a **native Android app** — all from a single codebase.
This project demonstrates offline support with **IndexedDB**, native mobile packaging, and PWA best practices.

---

## 🚀 **Features**

✅ **Progressive Web App (PWA)**

* Works offline
* Installable directly from browser
* Lightning-fast loading using caching and service workers

✅ **IndexedDB Integration**

* Stores notes locally for offline use
* Data persists across browser sessions
* Shows sync status (e.g., not synced with server)

✅ **Capacitor Integration**

* Easily converts your web app into a mobile app (Android/iOS)
* Access native device features (Camera, Storage, etc.)
* Compatible with modern frameworks and plugins

✅ **Responsive & Modern UI**

* Built with **Bootstrap 5** and **AOS animations**
* Clean gradient-based design
* Interactive modal for note management

✅ **Offline & Mobile Ready**

* Works seamlessly even without network connectivity
* Can be installed as an Android APK via Capacitor

---

## 🛠 **Tech Stack**

| Category        | Technology               |
| --------------- | ------------------------ |
| Frontend        | React + Vite             |
| Styling         | Bootstrap 5 + Custom CSS |
| Offline Storage | IndexedDB                |
| Native Bridge   | Capacitor by Ionic       |
| Deployment      | GitHub Pages             |
| Animation       | AOS (Animate On Scroll)  |

---

## 🧩 **Project Structure**

```
my-pwa-app/
│
├── public/                  # Static assets (favicon, manifest, etc.)
├── src/
│   ├── components/
│   │   └── Notes.tsx        # IndexedDB Notes Modal
│   ├── Home.tsx             # Main homepage
│   ├── Home.css             # Styling for gradients and layout
│   ├── db.ts                # IndexedDB logic
│   └── main.tsx             # React entry point
│
├── capacitor.config.ts      # Capacitor configuration
├── package.json
├── vite.config.ts
└── README.md
```

---

## ⚙️ **Setup Instructions**

### **1️⃣ Install Dependencies**

```bash
npm install
```

### **2️⃣ Run Locally**

```bash
npm run dev
```

App will be available at → **[http://localhost:5173](http://localhost:5173)**

### **3️⃣ Build for Production**

```bash
npm run build
```

This generates optimized static files inside the `/dist` folder.

### **4️⃣ Deploy to GitHub Pages**

```bash
npm run deploy
```

> Make sure your repository is linked and the `homepage` path in `vite.config.ts` is set correctly.

---

## 📱 **Convert to Mobile App (Android)**

1. **Install Capacitor**

   ```bash
   npm install @capacitor/core @capacitor/cli
   ```

2. **Initialize Capacitor**

   ```bash
   npx cap init
   ```

3. **Add Android Platform**

   ```bash
   npx cap add android
   ```

4. **Build the Web App**

   ```bash
   npm run build
   ```

5. **Sync with Capacitor**

   ```bash
   npx cap sync
   ```

6. **Open Android Studio**

   ```bash
   npx cap open android
   ```

7. **Generate the APK**

   * In **Android Studio**, open **Build → Build Bundle(s) / APK(s) → Build APK(s)**
   * Locate your APK in `android/app/build/outputs/apk/debug/app-debug.apk`

---

## 🌐 **Hosted Demo**

🔗 **Live Site:**
👉 [https://jebindhanush.github.io/my-pwa-app/](https://jebindhanush.github.io/my-pwa-app/)

📦 **Android APK Download:**
👉 [app-debug.apk](https://github.com/jebindhanush/my-pwa-app/releases/download/test/app-debug.apk)

> ⚠️ *This is an unsigned test APK. Your device may show a warning before installation.*

---

## 🧠 **About IndexedDB**

**IndexedDB** is a browser-based database that allows web apps to store large amounts of data locally — even when offline.
Unlike `localStorage`, it supports structured data, transactions, and asynchronous operations.
This makes it ideal for PWAs that need offline-first functionality.

---

## 🧾 **App Info**

| Name        | my-pwa-app                                                    |
| ----------- | ------------------------------------------------------------- |
| Version     | 1.0.0                                                         |
| Description | Sample app to test PWA functionality and mobile APK packaging |
| License     | MIT                                                           |

--- 

## 🧑‍💻 **Author**

**👤 Jebin Dhanush**
📎 GitHub: [@jebindhanush](https://github.com/jebindhanush)
