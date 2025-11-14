"use client";
import React from "react";

export default function Header({ idDevice, onConnect, onDisconnect }) {
  return (
    <header className="satu-bg px-4 md:px-10 lg:px-40 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <div className="w-3 h-3 rounded-full tiga-bg"></div>
        <h1 className="font-semibold tiga-text text-lg md:text-2xl">Capstone D-8</h1>
      </div>

      {idDevice ? (
        <button
          onClick={onDisconnect}
          className="flex items-center gap-2 text-sm md:text-lg px-3 py-2 rounded-lg shadow tiga-bg text-white hover:opacity-80"
        >
          {idDevice}
        </button>
      ) : (
        <button
          onClick={onConnect}
          className="flex items-center gap-2 text-sm md:text-lg satu-text px-3 py-2 rounded-lg shadow bg-gray-400 hover:bg-gray-500"
        >
          🔌 Connect Device
        </button>
      )}
    </header>
  );
}