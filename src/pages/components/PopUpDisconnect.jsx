"use client";
export default function PopUpDisconnect({ isOpen, onClose, onDisconnect, idDevice }) {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black opacity-30 z-40"></div>
      <div className="fixed inset-0 flex justify-center items-center z-50 p-4">
        <div className="satu-bg rounded-lg max-w-md w-full p-6 shadow-md border">
          <h2 className="text-xl font-semibold mb-4 text-center text-black">
            Disconnect Device
          </h2>
          <p className="mb-4 text-center text-black">
            Apakah kamu yakin ingin memutuskan koneksi dengan device <b>{idDevice}</b>?
          </p>
          <div className="flex justify-end gap-2">
            <button
              onClick={onClose}
              className="px-4 py-1 rounded border bg-gray-400 text-white hover:bg-gray-500 transition"
            >
              Batal
            </button>
            <button
              onClick={() => {
                onDisconnect();
                onClose();
              }}
              className="px-4 py-1 rounded border bg-red-600 text-white hover:bg-red-700 transition"
            >
              Disconnect
            </button>
          </div>
        </div>
      </div>
    </>
  );
}