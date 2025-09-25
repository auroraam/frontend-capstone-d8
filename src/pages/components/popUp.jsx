import { useEffect, useState } from "react";

export default function PopUp({ isOpen, onClose, status, message }) {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black opacity-30 z-40"></div>
      <div className="fixed inset-0 flex justify-center items-center z-50 p-4">
        <div className="bg-bg rounded-lg max-w-md w-full p-6 shadow-md text-center border empat-border">
          <p className="mb-4 text-black">{message}</p>

          {status === "loading" ? (
            <div className="flex justify-center space-x-2">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className="w-4 h-4 bg-gray-600 rounded-full animate-pulse"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
          ) : (
            <button
              onClick={onClose}
              className="bg-gray-600 text-white px-6 py-2 rounded hover:bg-gray-700 transition"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </>
  );
}
