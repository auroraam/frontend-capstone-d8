"use client";
import Image from "next/image";
import { Comic_Neue } from 'next/font/google'
import { useState } from "react";
import PopUp from "./components/popUp";
import axios from "axios";
import PopUpPisang from "./components/popUpPisang";

const comic = Comic_Neue({
    subsets: ["latin"],
    weight: "700",
    variable: "--font-comic"
});

export default function Home() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popup, setPopup] = useState({
    isOpen: false,
    status: "loading",
    message: "Loading",
  });

  const [result, setResult] = useState({
    klasifikasi: "...",
    prediksi: "...",
    tvoc: "...",
    co2: "...",
    r: "...",
    g: "...",
    b: "...",
  });

  const handleSubmit = async (data) => {
    setPopup({
      isOpen: true,
      status: "loading",
      message: "Loading",
    });
    try {
      console.log("Data dari form:", data);
      const res = await axios.post(`http://localhost:3500/pisang`, data);
      setResult(res.data);
      setPopup({
        isOpen: true,
        status: "success",
        message: "Berhasil Menambah Data",
      });
    } catch (error) {
      setPopup({
        isOpen: true,
        status: "error",
        message: error.response?.data?.message || "Terjadi kesalahan server",
      });
    }    
  };

  return (
    <div className={`min-h-screen bg-bg ${comic.className}`}>
      {/* Header */}
      <header className="satu-bg px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full tiga-bg"></div>
          <h1 className="font-semibold tiga-text">Capstone D-8</h1>
        </div>
      </header>

      <div className="px-40 mt-10">
        {/* opening */}
        <div className="flex flex-row gap-8">
          <div className="relative w-full h-48 rounded-sm overflow-hidden">
            <Image
              src="/image1.png" 
              alt="Hero"
              layout="fill"
              objectFit="cover"
            />
          </div>
          <div className="flex flex-col justify-between">
            <h2 className="text-xl font-bold tiga-text">
              Klasifikasi dan Prediksi Tingkat Kematangan
            </h2>
            <p className="mt-2 tiga-text">
              Prediksi kematangan buah pisang yang lebih akurat menggunakan sistem dengan sensor gas, sensor warna, dan kecerdasan buatan.
            </p>
            <div className="flex flex-row justify-between gap-3">
              <button 
                onClick={() => setIsPopupOpen(true)}
                className={`flex-1 mt-4 tiga-bg satu-text px-4 py-2 rounded-lg shadow hover:bg-gray-500`}>
                Simpan Data
              </button>
              <button 
                onClick={() => setIsPopupOpen(true)}
                className={`flex-1 mt-4 tiga-bg satu-text px-4 py-2 rounded-lg shadow hover:bg-gray-500`}>
                Mulai Analisis Data
              </button>
            </div>
          </div>
        </div>

        {/* Hasil */}
        <div className="flex flex-col dua-bg mt-8 px-8 rounded-lg">
          <h2 className="text-xl font-bold empat-text pt-4 pb-2">
            Hasil Klasifikasi dan Prediksi
          </h2>
          <div className="flex flex-row justify-between pb-4 gap-4">
            <div className="flex flex-row gap-3 empat-border p-4 rounded-lg">
              <div className="relative w-full h-24 rounded-sm overflow-hidden">
                <Image
                  src="/image2.png" 
                  alt="Hero"
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <div className="flex flex-col justify-between">
                <h2 className="text-base font-bold empat-text">
                  Kategori Kematangan: {result.klasifikasi}
                </h2>
                <p className="mt-2 empat-text text-xs">
                  Kategori ini menunjukkan tingkat kematangan buah berdasarkan hasil analisis sensor warna yang diproses menggunakan algoritma Machine Learning. Nilai ini membantu menentukan apakah buah sudah matang, masih mentah, atau busuk.
                </p>
              </div>
            </div>
            <div className="flex flex-row gap-3 empat-border p-4 rounded-lg">
              <div className="relative w-full h-24 rounded-sm overflow-hidden">
                <Image
                  src="/image3.png" 
                  alt="Hero"
                  layout="fill"
                  objectFit="cover"
                />
              </div>
              <div className="flex flex-col justify-between">
                <h2 className="text-base font-bold empat-text">
                  Hari Menuju Matang: {result.prediksi}
                </h2>
                <p className="mt-2 empat-text text-xs">
                  Perkiraan jumlah hari yang dibutuhkan hingga buah mencapai tingkat kematangan ideal. Nilai ini dihitung dari pola perubahan gas yang terdeteksi oleh sensor, sehingga pengguna dapat mengetahui waktu terbaik untuk memanen atau mengonsumsi buah.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* nilai sensor */}
        <div className="flex flex-col satu-bg mt-8 px-8 rounded-lg">
          <h2 className="text-xl font-bold tiga-text pt-4 pb-2">
            Nilai dari Sensor Gas
          </h2>
          <div className="flex flex-row justify-between pb-4 gap-4">
            <div className="flex flex-col tiga-bg p-4 rounded-lg">
              <h2 className="text-lg font-bold text-white">
                = {result.tvoc}
              </h2>
              <h2 className="text-xl font-bold text-white">
                TVOC
              </h2>
              <p className="mt-2 text-white text-xs">
                Menunjukkan total senyawa organik volatil yang dilepaskan oleh buah selama proses pematangan. Semakin tinggi nilai TVOC, umumnya menandakan bahwa buah sedang berada pada fase aktif pematangan akibat peningkatan aktivitas biokimia di dalamnya.
              </p>
            </div>
            <div className="flex flex-col tiga-bg p-4 rounded-lg">
              <h2 className="text-lg font-bold text-white">
                = {result.co2}
              </h2>
              <h2 className="text-xl font-bold text-white">
                CO₂eq
              </h2>
              <p className="mt-2 text-white text-xs">
                Menggambarkan jumlah gas karbon dioksida ekuivalen yang dihasilkan oleh buah. Nilai ini berhubungan dengan proses respirasi buah—semakin matang buah, biasanya semakin tinggi kadar CO₂ yang terdeteksi.
              </p>
            </div>
          </div>
        </div>

        {/* nilai warna */}
        <div className="flex flex-col tiga-bg mt-8 px-8 rounded-lg">
          <h2 className="text-xl font-bold satu-text pt-4 pb-2">
            Nilai dari Sensor Gas
          </h2>
          <div className="flex flex-row justify-between pb-4 gap-4">
            <div className="flex flex-col dua-bg p-4 rounded-lg">
              <h2 className="text-lg font-bold satu-text">
                = {result.r}
              </h2>
              <h2 className="text-xl font-bold satu-text">
                Red
              </h2>
              <p className="mt-2 satu-text text-xs">
                Menunjukkan intensitas warna merah pada permukaan kulit buah. Peningkatan nilai merah sering kali menandakan buah sedang mendekati kematangan sempurna, karena pigmen alami seperti karotenoid mulai muncul.
              </p>
            </div>
            <div className="flex flex-col dua-bg p-4 rounded-lg">
              <h2 className="text-lg font-bold satu-text">
                = {result.g}
              </h2>
              <h2 className="text-xl font-bold satu-text">
                Green
              </h2>
              <p className="mt-2 satu-text text-xs">
                Menggambarkan tingkat warna hijau pada kulit buah. Semakin rendah nilai hijau, semakin besar kemungkinan bahwa klorofil dalam kulit buah mulai berkurang—tanda bahwa buah sedang menuju fase matang.
              </p>
            </div>
            <div className="flex flex-col dua-bg p-4 rounded-lg">
              <h2 className="text-lg font-bold satu-text">
                = {result.b}
              </h2>
              <h2 className="text-xl font-bold satu-text">
                Blue
              </h2>
              <p className="mt-2 satu-text text-xs">
                Merepresentasikan kandungan komponen biru pada warna kulit buah. Nilai ini membantu sistem dalam mengenali perubahan warna secara lebih akurat, terutama ketika buah mengalami transisi dari hijau ke kuning atau kemerahan.
              </p>
            </div>
          </div>
        </div>
      </div>

      <PopUp
        isOpen={popup.isOpen}
        onClose={() => setPopup((prev) => ({ ...prev, isOpen: false }))}
        status={popup.status}
        message={popup.message}
      />

      <PopUpPisang
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
