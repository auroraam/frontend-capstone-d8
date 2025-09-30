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
              Sistem untuk memprediksi tingkat kematangan buah dengan sensor gas
              dan machine learning.
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
                  Sistem untuk memprediksi tingkat kematangan buah dengan sensor gas
                  dan Machine Learning.
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
                  Sistem untuk memprediksi tingkat kematangan buah dengan sensor gas
                  dan Machine Learning.
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
                Sistem untuk memprediksi tingkat kematangan buah dengan sensor gas
                dan Machine Learning.
              </p>
            </div>
            <div className="flex flex-col tiga-bg p-4 rounded-lg">
              <h2 className="text-lg font-bold text-white">
                = {result.co2}
              </h2>
              <h2 className="text-xl font-bold text-white">
                CO2eq
              </h2>
              <p className="mt-2 text-white text-xs">
                Sistem untuk memprediksi tingkat kematangan buah dengan sensor gas
                dan Machine Learning.
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
                Sistem untuk memprediksi tingkat kematangan buah dengan sensor gas
                dan Machine Learning.
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
                Sistem untuk memprediksi tingkat kematangan buah dengan sensor gas
                dan Machine Learning.
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
                Sistem untuk memprediksi tingkat kematangan buah dengan sensor gas
                dan Machine Learning.
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
