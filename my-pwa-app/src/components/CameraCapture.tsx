import React, { useRef, useState } from "react";
import { Capacitor } from "@capacitor/core";
import { Camera, CameraResultType } from "@capacitor/camera";
import { openDB } from "idb";

const CameraCapture: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isNative, setIsNative] = useState(Capacitor.getPlatform() !== "web");
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Initialize IndexedDB
  const initDB = async () => {
    return openDB("camera-db", 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("images")) {
          db.createObjectStore("images", { keyPath: "id", autoIncrement: true });
        }
      },
    });
  };

  // Save to IndexedDB
  const saveToDB = async (blob: Blob) => {
    const db = await initDB();
    const tx = db.transaction("images", "readwrite");
    await tx.store.add({ blob, date: new Date() });
    await tx.done;
    console.log("✅ Image stored in IndexedDB");
  };

  // Start camera (web only)
  const startCamera = async () => {
    if (isNative) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) {
      console.error("Camera error:", err);
    }
  };

  // Stop camera stream (web)
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach((t) => t.stop());
      videoRef.current.srcObject = null;
    }
  };

  // Open popup and start camera
  const openCameraPopup = async () => {
    setIsOpen(true);
    if (!isNative) {
      await startCamera();
    } else {
      await openNativeCamera();
    }
  };

  // Capture image from web camera
  const capturePhoto = async () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(async (blob) => {
      if (blob) {
        await saveToDB(blob);
        const url = URL.createObjectURL(blob);
        setImageUrl(url);
        closePopup();
      }
    }, "image/jpeg");
  };

  // Native (Capacitor) capture
  const openNativeCamera = async () => {
    try {
      const photo = await Camera.getPhoto({
        resultType: CameraResultType.Uri,
        quality: 90,
      });
      if (photo.webPath) {
        const response = await fetch(photo.webPath);
        const blob = await response.blob();
        await saveToDB(blob);
        setImageUrl(photo.webPath);
      }
    } catch (err) {
      console.error("Native camera error:", err);
    }
  };

  // Close popup
  const closePopup = () => {
    setIsOpen(false);
    stopCamera();
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 space-y-4">
      <h1 className="text-2xl font-bold text-green-600">📸 Capture Image</h1>

      <button
        onClick={openCameraPopup}
        className="bg-green-500 text-white px-5 py-2 rounded-lg hover:bg-green-600 transition-all"
      >
        Open Camera
      </button>

      {imageUrl && (
        <div className="mt-4">
          <h3 className="font-semibold text-gray-700 mb-2">Last Captured Image:</h3>
          <img src={imageUrl} alt="Captured" className="rounded-lg shadow-lg w-64" />
        </div>
      )}

      {/* Popup Modal */}
      {isOpen && !isNative && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-4 flex flex-col items-center gap-3 shadow-lg">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="rounded-lg w-64 h-48 bg-black"
            ></video>
            <canvas ref={canvasRef} style={{ display: "none" }}></canvas>

            <div className="flex gap-2 mt-2">
              <button
                onClick={capturePhoto}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
              >
                Capture
              </button>
              <button
                onClick={closePopup}
                className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CameraCapture;
