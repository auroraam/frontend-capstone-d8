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
        `${process.env.NEXT_PUBLIC_API_BASE_URL_TEST}/api/predict/start`,
        { idDevice: deviceId }
      );

      // Buat koneksi MQTT
      const client = mqtt.connect(process.env.NEXT_PUBLIC_MQTT_URL || "ws://test.mosquitto.org:8080");

      client.on("connect", () => {
        const predictionTopic = `device-${deviceId}/prediction`;
        client.subscribe(predictionTopic, { qos: 1 });
        console.log("Subscribed to:", predictionTopic);
      });

      client.on("message", (topic, message) => {
        try {
          const payload = JSON.parse(message.toString());
          console.log("Prediction received:", payload);
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
  const idDevice = "stm-001";

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
        `${process.env.NEXT_PUBLIC_API_BASE_URL_TEST}/api/predict/stop`,
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

  return (
    <div className={`min-h-screen bg-bg ${comic.className}`}>
      {/* Header */}
      <Header onConnect={() => setIsDevicePopupOpen(true)} idDevice={idDevice} onDisconnect={() => setIsDisconnectPopupOpen(true)} />

      <div className="px-40 mt-10">
        {/* opening */}
        <div className="flex flex-row gap-8">
          <div className="relative w-full h-48 rounded-sm overflow-hidden">
            <Image
              src="/capstone_1.png" 
              alt="Hero"
              fill
              style={{ objectFit: "cover" }}
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
              <button 
                onClick={() => handleTesting("Start")}
                className={`flex-1 mt-4 tiga-bg satu-text px-4 py-2 rounded-lg shadow hover:bg-gray-500`}>
                Test
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
                  src="/capstone_3.png" 
                  alt="Hero"
                  fill
                  style={{ objectFit: "contain" }}
                />
              </div>
              <div className="flex flex-col justify-between">
                <h2 className="text-base font-bold empat-text">
                  Kategori Kematangan: {result.klasifikasi != null ? result.klasifikasi : "..."}
                </h2>
                <p className="mt-2 empat-text text-xs">
                  Kategori ini menunjukkan tingkat kematangan buah berdasarkan hasil analisis sensor warna yang diproses menggunakan algoritma Machine Learning. Nilai ini membantu menentukan apakah buah sudah matang, masih mentah, atau busuk.
                </p>
              </div>
            </div>
            <div className="flex flex-row gap-3 empat-border p-4 rounded-lg">
              <div className="relative w-full h-24 rounded-sm overflow-hidden">
                <Image
                  src="/capstone_4.png" 
                  alt="Hero"
                  fill
                  style={{ objectFit: "contain" }}
                />
              </div>
              <div className="flex flex-col justify-between">
                <h2 className="text-base font-bold empat-text">
                  Hari Menuju Fase Kematangan Berikutnya : {result.prediksi != null ? result.prediksi : "..."}
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
                = {result.tvoc != null ? result.tvoc : "..."}
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
                = {result.co2 != null ? result.co2 : "..."}
              </h2>
              <h2 className="text-xl font-bold text-white">
                CO₂
              </h2>
              <p className="mt-2 text-white text-xs">
                Menggambarkan jumlah gas karbon dioksida ekuivalen yang dihasilkan oleh buah. Nilai ini berhubungan dengan proses respirasi buah—semakin matang buah, biasanya semakin tinggi kadar CO₂ yang terdeteksi.
              </p>
            </div>
          </div>
        </div>

        {/* nilai warna */}
        <div className="flex flex-col empat-bg mt-8 px-8 rounded-lg">
          <h2 className="text-xl font-bold satu-text pt-4 pb-2">
            Nilai dari Sensor Warna
          </h2>
          <div className="flex flex-row justify-between pb-4 gap-4">
            <div className="flex flex-col tiga-bg p-4 rounded-lg">
              <h2 className="text-lg font-bold satu-text">
                = {result.r != null ? result.r : "..."}
              </h2>
              <h2 className="text-xl font-bold satu-text">
                Red
              </h2>
              <p className="mt-2 satu-text text-xs">
                Menunjukkan intensitas warna merah pada permukaan kulit buah. Peningkatan nilai merah sering kali menandakan buah sedang mendekati kematangan sempurna, karena pigmen alami seperti karotenoid mulai muncul.
              </p>
            </div>
            <div className="flex flex-col tiga-bg p-4 rounded-lg">
              <h2 className="text-lg font-bold satu-text">
                = {result.g != null ? result.g : "..."}
              </h2>
              <h2 className="text-xl font-bold satu-text">
                Green
              </h2>
              <p className="mt-2 satu-text text-xs">
                Menggambarkan tingkat warna hijau pada kulit buah. Semakin rendah nilai hijau, semakin besar kemungkinan bahwa klorofil dalam kulit buah mulai berkurang—tanda bahwa buah sedang menuju fase matang.
              </p>
            </div>
            <div className="flex flex-col tiga-bg p-4 rounded-lg">
              <h2 className="text-lg font-bold satu-text">
                = {result.b != null ? result.b : "..."}
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

        <div className="flex flex-row mt-10 empat-text">
          <div className="w-full h-0.5 empat-bg mb-15">
          <p className="text-lg text-center mt-5">© Tim Capstone D-08 - DTETI UGM.</p>
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
