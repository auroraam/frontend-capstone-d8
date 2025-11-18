"use client";
import Image from "next/image";
import { Comic_Neue } from 'next/font/google'
import { useState, useEffect } from "react";
import axios from "axios";
import mqtt from "mqtt";

import PopUp from "./components/popUp";
import Header from "./components/Header";
import PopUpDevice from "./components/PopUpDevice";
import PopUpDisconnect from "./components/PopUpDisconnect";
import PopUpPisang from "./components/popUpPisang";

const comic = Comic_Neue({
    subsets: ["latin"],
    weight: "700",
    variable: "--font-comic"
});

export default function Home() {
  const [isPopupOpen, setIsPopupOpen] = useState(false); // untuk PopUpPisang
  const [isDevicePopupOpen, setIsDevicePopupOpen] = useState(false); // untuk connect
  const [isDisconnectPopupOpen, setIsDisconnectPopupOpen] = useState(false); // untuk disconnect
  const [idDevice, setIdDevice] = useState(null);
  const [mqttClient, setMqttClient] = useState(null);


  const [popup, setPopup] = useState({
    isOpen: false,
    status: "loading",
    message: "Loading",
  });

  const [result, setResult] = useState({
    klasifikasi: null,
    prediksi: null,
    tvoc: null,
    co2: null,
    r: null,
    g: null,
    b: null,
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

  // Auto-connect saat reload
  useEffect(() => {
    const savedId = localStorage.getItem("idDevice");
    if (savedId) setIdDevice(savedId);
  }, []);

  const handleConnectDevice = async (deviceId) => {
    localStorage.setItem("idDevice", deviceId);
    setIdDevice(deviceId);

    try {
      // Panggil REST API startPredict
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/predict/start`,
        { idDevice: deviceId }
      );

      // Buat koneksi MQTT
      const client = mqtt.connect(process.env.NEXT_PUBLIC_MQTT_URL);

      client.on("connect", () => {
        const predictionTopic = `device-${deviceId}/prediction`;
        client.subscribe(predictionTopic, { qos: 1 });
        console.log("Subscribed to:", predictionTopic);
      });

      client.on("message", (topic, message) => {
        try {
          console.log("Topic:", topic);
          const payload = JSON.parse(message.toString());
          setResult({
            klasifikasi: payload.ripeness || null,
            prediksi: payload.nextPhase || null,
            tvoc: payload.sensor?.tvoc || null,
            co2: payload.sensor?.co2 || null,
            r: payload.sensor?.r || null,
            g: payload.sensor?.g || null,
            b: payload.sensor?.b || null,
          });
        } catch (e) {
          console.error("Invalid prediction payload:", e);
        }
      });

      setMqttClient(client);
    } catch (err) {
      console.error("Gagal memulai prediksi:", err);
    }
  };

  const handleTesting = async (kataKirim) => {
    const idDevice = "esp32/cpstn";

    if (!kataKirim) {
      console.error("Tidak ada kata yang dikirim!");
      return;
    }

    try {
      console.log(`Mengirim: idDevice="${idDevice}", kata="${kataKirim}"`);

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/testing/dummy`, 
        { 
          idDevice: idDevice, 
          kata: kataKirim
        }
      );

      console.log("Sukses! Respons server:", res.data);
    
    } catch (error) { 
      console.error("Error:", error.response?.data?.message || error.message);
    }
  };

  const handleDisconnectDevice = async () => {
    if (!idDevice) return;

    try {
      // Panggil REST API stopPredict
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/predict/stop`,
        { idDevice }
      );
      console.log("Backend unsubscribed for device:", idDevice);
    } catch (err) {
      console.error("Gagal stopPredict:", err);
    }

    // Unsubscribe dan end MQTT client
    if (mqttClient) {
      const predictionTopic = `device-${idDevice}/prediction`;
      mqttClient.unsubscribe(predictionTopic, () => {
        console.log("Unsubscribed from:", predictionTopic);
        mqttClient.end();
        setMqttClient(null);
      });
    }

    localStorage.removeItem("idDevice");
    setIdDevice(null);
    setResult({
      klasifikasi: null,
      prediksi: null,
      tvoc: null,
      co2: null,
      r: null,
      g: null,
      b: null,
    });
  };

  const ExpandableText = ({ text, limit = 80, className = "empat-text", buttonColor = "text-blue-600" }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    if (text.length <= limit) {
      return <p className={`mt-2 text-xs leading-relaxed ${className}`}>{text}</p>;
    }
    return (
      <p className={`mt-2 text-xs leading-relaxed ${className} transition-all duration-300`}>
        {isExpanded ? text : `${text.substring(0, limit)}...`}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`ml-1 font-bold cursor-pointer hover:underline focus:outline-none ${buttonColor}`}
        >
          {isExpanded ? "Sembunyikan" : "Selengkapnya"}
        </button>
      </p>
    );
  };

  return (
    <div className={`min-h-screen bg-bg ${comic.className}`}>
      {/* Header */}
      <Header onConnect={() => setIsDevicePopupOpen(true)} idDevice={idDevice} onDisconnect={() => setIsDisconnectPopupOpen(true)} />

      {/* Main Container: Responsive Padding */}
      <div className="px-4 md:px-10 lg:px-20 xl:px-40 mt-6 md:mt-10">
        
        {/* Hero Section */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Gambar Hero */}
          <div className="relative w-full lg:w-1/2 h-64 md:h-80 rounded-sm overflow-hidden shrink-0 bg-white p-4 flex items-center justify-center">
            <Image
              src="/capstone_1_2.png" 
              alt="Hero"
              fill
              style={{ objectFit: "contain" }}
            />
          </div>
          
          {/* Teks & Tombol */}
          <div className="flex flex-col justify-between w-full lg:w-1/2">
            <div>
              <h2 className="text-xl md:text-2xl font-bold tiga-text">
                Klasifikasi dan Prediksi Tingkat Kematangan
              </h2>
              <p className="mt-2 tiga-text text-sm md:text-base">
                Prediksi kematangan buah pisang yang lebih akurat menggunakan sistem dengan sensor gas, sensor warna, dan kecerdasan buatan.
              </p>
            </div>
            
            {/* Tombol Actions */}
            <div className="flex flex-col sm:flex-row justify-between gap-3 mt-4 lg:mt-0">
              <button 
                onClick={() => setIsPopupOpen(true)}
                className={`flex-1 three-bg satu-text px-4 py-3 rounded-lg shadow hover:bg-gray-500 text-sm md:text-base bg-[#yourColorHere] tiga-bg`}>
                {/* Note: Pastikan class 'tiga-bg' memiliki definisi background-color */}
                Simpan Data
              </button>
              <button 
                onClick={() => setIsPopupOpen(true)}
                className={`flex-1 three-bg satu-text px-4 py-3 rounded-lg shadow hover:bg-gray-500 text-sm md:text-base tiga-bg`}>
                Mulai Analisis
              </button>
              <button 
                onClick={() => handleTesting("Start")}
                className={`flex-1 three-bg satu-text px-4 py-3 rounded-lg shadow hover:bg-gray-500 text-sm md:text-base tiga-bg`}>
                Test
              </button>
            </div>
          </div>
        </div>

        {/* Hasil Section */}
        <div className="flex flex-col dua-bg mt-8 px-4 md:px-8 py-4 rounded-lg">
          <h2 className="text-xl font-bold empat-text pb-4">
            Hasil Klasifikasi dan Prediksi
          </h2>
          
          {/* Grid untuk Kartu Hasil */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Kartu 1: Klasifikasi */}
            <div className="flex flex-row empat-border gap-4 p-4 rounded-lg bg-white/50 items-center">
              <div className="relative h-16 w-16 rounded-sm overflow-hidden shrink-0">
                <Image
                  src="/capstone_3.png" 
                  alt="Klasifikasi"
                  fill
                  style={{ objectFit: "contain" }}
                />
              </div>
              <div className="flex flex-col justify-center w-full sm:w-2/3">
                <h2 className="text-base font-bold empat-text text-lg">
                  Kategori Kematangan: {result.klasifikasi != null ? result.klasifikasi : "..."}
                </h2>
                <ExpandableText 
                  className="empat-text"
                  text="Kategori ini menunjukkan tingkat kematangan buah berdasarkan hasil analisis sensor warna yang diproses menggunakan algoritma Machine Learning. Nilai ini membantu menentukan apakah buah sudah matang, masih mentah, atau busuk."
                />
              </div>
            </div>

            {/* Kartu 2: Prediksi */}
            <div className="flex flex-row gap-4 empat-border p-4 rounded-lg bg-white/50 items-center">
              <div className="relative h-16 w-16 rounded-sm overflow-hidden shrink-0">
                <Image
                  src="/capstone_4.png" 
                  alt="Prediksi"
                  fill
                  style={{ objectFit: "contain" }}
                />
              </div>
              <div className="flex flex-col justify-center w-full sm:w-2/3">
                <h2 className="text-base font-bold empat-text text-lg">
                  Next Phase: {result.prediksi != null ? result.prediksi : "..."}
                </h2>
                <ExpandableText 
                   className="empat-text"
                   text="Perkiraan jumlah hari yang dibutuhkan hingga buah mencapai tingkat kematangan ideal. Nilai ini dihitung dari pola perubahan gas yang terdeteksi oleh sensor, sehingga pengguna dapat mengetahui waktu terbaik untuk memanen atau mengonsumsi buah."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Nilai Sensor Gas */}
        <div className="flex flex-col satu-bg mt-8 px-4 md:px-8 py-4 rounded-lg">
          <h2 className="text-xl font-bold tiga-text pb-4">
            Nilai dari Sensor Gas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col tiga-bg p-4 rounded-lg">
              <h2 className="text-2xl font-bold text-white">
                {result.tvoc != null ? result.tvoc : "..."}
              </h2>
              <h2 className="text-lg font-bold text-white">TVOC</h2>
              <ExpandableText 
                className="text-white"
                text="Menunjukkan total senyawa organik volatil yang dilepaskan oleh buah selama proses pematangan. Semakin tinggi nilai TVOC, umumnya menandakan bahwa buah sedang berada pada fase aktif pematangan akibat peningkatan aktivitas biokimia di dalamnya."
              />
            </div>
            <div className="flex flex-col tiga-bg p-4 rounded-lg">
              <h2 className="text-2xl font-bold text-white">
                {result.co2 != null ? result.co2 : "..."}
              </h2>
              <h2 className="text-lg font-bold text-white">CO₂</h2>
              <ExpandableText 
                className="text-white" 
                text="Menggambarkan jumlah gas karbon dioksida ekuivalen yang dihasilkan oleh buah. Nilai ini berhubungan dengan proses respirasi buah—semakin matang buah, biasanya semakin tinggi kadar CO₂ yang terdeteksi."
              />
            </div>
          </div>
        </div>

        {/* Nilai Sensor Warna */}
        <div className="flex flex-col empat-bg mt-8 px-4 md:px-8 py-4 rounded-lg">
          <h2 className="text-xl font-bold satu-text pb-4">
            Nilai dari Sensor Warna
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col tiga-bg p-4 rounded-lg">
              <h2 className="text-2xl font-bold satu-text">
                {result.r != null ? result.r : "..."}
              </h2>
              <h2 className="text-lg font-bold satu-text">Red</h2>
              <ExpandableText 
                className="satu-text"
                text="Menunjukkan intensitas warna merah pada permukaan kulit buah. Peningkatan nilai merah sering kali menandakan buah sedang mendekati kematangan sempurna, karena pigmen alami seperti karotenoid mulai muncul."
              />
            </div>
            <div className="flex flex-col tiga-bg p-4 rounded-lg">
              <h2 className="text-2xl font-bold satu-text">
                {result.g != null ? result.g : "..."}
              </h2>
              <h2 className="text-lg font-bold satu-text">Green</h2>
              <ExpandableText 
                className="satu-text"
                text="Menggambarkan tingkat warna hijau pada kulit buah. Semakin rendah nilai hijau, semakin besar kemungkinan bahwa klorofil dalam kulit buah mulai berkurang—tanda bahwa buah sedang menuju fase matang."
              />
            </div>
            <div className="flex flex-col tiga-bg p-4 rounded-lg">
              <h2 className="text-2xl font-bold satu-text">
                {result.b != null ? result.b : "..."}
              </h2>
              <h2 className="text-lg font-bold satu-text">Blue</h2>
              <ExpandableText 
                className="satu-text"
                text="Merepresentasikan kandungan komponen biru pada warna kulit buah. Nilai ini membantu sistem dalam mengenali perubahan warna secara lebih akurat, terutama ketika buah mengalami transisi dari hijau ke kuning atau kemerahan."
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-row mt-10 empat-text">
          <div className="w-full h-0.5 empat-bg mb-15">
            <p className="text-sm md:text-lg text-center mt-5">© Tim Capstone D-08 - DTETI UGM.</p>
          </div>
        </div>
      </div>

      {/* Popup Connect Device */}
      <PopUpDevice
        isOpen={isDevicePopupOpen}
        onClose={() => setIsDevicePopupOpen(false)}
        onConnect={handleConnectDevice}
      />

      {/* Popup Disconnect Device */}
      <PopUpDisconnect
        isOpen={isDisconnectPopupOpen}
        onClose={() => setIsDisconnectPopupOpen(false)}
        onDisconnect={handleDisconnectDevice}
        idDevice={idDevice}
      />

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