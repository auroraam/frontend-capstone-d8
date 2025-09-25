import { useState } from "react";

export default function PopUpPisang({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    r: "",
    g: "",
    b: "",
    tvoc: "",
    co2: "",
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData); // kirim ke parent
    setFormData({ r: "", g: "", b: "", tvoc: "", co2: "" }); // reset form
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black opacity-30 z-40"></div>
      <div className="fixed inset-0 flex justify-center items-center z-50 p-4">
        <div className="satu-bg rounded-lg max-w-md w-full p-6 shadow-md border">
          <h2 className="text-xl font-semibold mb-4 text-center">
            Tambah Data Pisang
          </h2>

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="number"
              name="r"
              placeholder="Nilai R"
              className="w-full p-2 border rounded text-black"
              value={formData.r}
              onChange={handleChange}
            />
            <input
              type="number"
              name="g"
              placeholder="Nilai G"
              className="w-full p-2 border rounded text-black"
              value={formData.g}
              onChange={handleChange}
            />
            <input
              type="number"
              name="b"
              placeholder="Nilai B"
              className="w-full p-2 border rounded text-black"
              value={formData.b}
              onChange={handleChange}
            />
            <input
              type="number"
              name="tvoc"
              placeholder="Nilai TVOC"
              className="w-full p-2 border rounded text-black"
              value={formData.tvoc}
              onChange={handleChange}
            />
            <input
              type="number"
              name="co2"
              placeholder="Nilai CO2"
              className="w-full p-2 border rounded text-black"
              value={formData.co2}
              onChange={handleChange}
            />

            <div className="flex justify-end gap-2 pt-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-1 rounded border empat-bg hover:bg-gray-400 transition"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-1 rounded border empat-bg text-white hover:bg-blue-700 transition"
              >
                Simpan
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
