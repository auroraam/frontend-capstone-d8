"use client";
import { useState } from "react";

export default function PopUpDevice({ isOpen, onClose, onConnect }) {
  const [idDevice, setIdDevice] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (idDevice.trim() !== "") {
      onConnect(idDevice);
      setIdDevice("");
      onClose();
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black opacity-30 z-40"></div>
      <div className="fixed inset-0 flex justify-center items-center z-50 p-4">
        <div className="satu-bg rounded-lg max-w-md w-full p-6 shadow-md border">
          <h2 className="text-xl text-black font-semibold mb-4 text-center">
            Connect Device
          </h2>

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              placeholder="Masukkan ID Device"
              className="w-full p-2 border rounded text-black"
              value={idDevice}
              onChange={(e) => setIdDevice(e.target.value)}
            />

            <div className="flex justify-end gap-2 pt-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-1 rounded border bg-gray-400 text-white hover:bg-gray-500 transition"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-1 rounded border empat-bg opacity-90 text-white hover:opacity-100 transition"
              >
                Connect
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}