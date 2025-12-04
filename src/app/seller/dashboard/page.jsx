"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Settings,
  MapPin,
  Lightbulb,
  Plus,
  Star,
  Image as ImageIcon,
  LogOut,
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  // Dummy data untuk menu agar terlihat seperti desain
  const [menuItems, setMenuItems] = useState([
    {
      id: 1,
      name: "Fish Burger",
      price: "15.000",
      rating: 5,
      image: "/food-1.jpg",
    },
    {
      id: 2,
      name: "Beef Burger",
      price: "20.000",
      rating: 4.8,
      image: "/food-2.jpg",
    },
    {
      id: 3,
      name: "Cheese Burger",
      price: "18.000",
      rating: 5,
      image: "/food-3.jpg",
    },
  ]);

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans">
      {/* --- HEADER --- */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-20">
        <div className="flex items-center gap-3">
          {/* Avatar Placeholder */}
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center overflow-hidden">
            <span className="text-xl">👨‍🍳</span>
          </div>
          <div>
            <h2 className="font-bold text-gray-900 leading-tight">
              Pak Budi (Bakso)
            </h2>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-xs text-green-600 font-medium">Online</span>
            </div>
          </div>
        </div>
        <button
          onClick={() => router.push("/seller/onboarding")} // Pindah halaman saat diklik
          className="p-2 hover:bg-gray-100 rounded-full transition cursor-pointer"
        >
          <Settings className="text-gray-600" size={24} />
        </button>
      </nav>

      <main className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2px_1fr] gap-8">
          {/* --- KOLOM KIRI: STATUS & OPERASIONAL --- */}
          <section className="flex flex-col gap-8">
            {/* 1. Status GPS Card */}
            <div className="bg-blue-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
              {/* Background decorative circle */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500 rounded-full blur-2xl opacity-50"></div>

              <div className="relative z-10 text-center space-y-4 py-4">
                <p className="text-blue-100 text-sm font-medium">Status GPS</p>
                <h2 className="text-3xl font-bold tracking-wide">
                  KAMU SEDANG LIVE!
                </h2>
                <p className="text-blue-100 text-sm">
                  Lokasi terupdate otomatis tiap kamu bergerak.
                </p>

                <div className="flex items-center justify-center gap-2 mt-4">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                  </span>
                  <span className="font-semibold tracking-wider text-sm">
                    Tracking Active...
                  </span>
                </div>
              </div>
            </div>

            {/* 2. AI Suggestion Card */}
            <div className="bg-[#FFF8F0] border border-orange-100 rounded-2xl p-6 relative">
              <div className="flex gap-4">
                <div className="mt-1">
                  <Lightbulb
                    className="text-yellow-500 fill-yellow-500"
                    size={24}
                  />
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold text-orange-800">Saran AI:</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {"'"}Pak, di{" "}
                    <span className="font-bold text-gray-800">
                      SD N 1 Malang
                    </span>{" "}
                    jam 11:00 nanti anak-anak pulang sekolah. Geser ke sana yuk!
                    {"'"}
                  </p>
                  <button className="bg-orange-200 hover:bg-orange-300 text-orange-800 text-xs font-bold px-4 py-1.5 rounded-full mt-2 transition-colors">
                    Oke, OTW! 🚀
                  </button>
                </div>
              </div>
            </div>

            {/* 3. Stop Button */}
            <div className="mt-auto pt-8">
              <button className="w-full bg-red-100 hover:bg-red-200 text-red-600 font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98]">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                STOP JUALAN (PULANG)
              </button>
            </div>
          </section>

          {/* --- DIVIDER VERTIKAL (Hanya di Desktop) --- */}
          <div className="hidden lg:block bg-gray-100 h-full w-full rounded-full"></div>

          {/* --- KOLOM KANAN: MANAJEMEN MENU --- */}
          <section className="flex flex-col gap-8">
            {/* 1. Katalog Menu */}
            <div>
              <h2 className="text-xl font-bold mb-4">Katalog Menu</h2>
              <div className="grid grid-cols-2 gap-4">
                {menuItems.map((item) => (
                  <div
                    key={item.id}
                    className="border border-gray-100 rounded-xl p-3 shadow-sm hover:shadow-md transition bg-white"
                  >
                    {/* Image Placeholder */}
                    <div className="h-24 bg-gray-200 rounded-lg mb-3 relative overflow-hidden">
                      {/* Gunakan Next/Image di sini real-nya */}
                      <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                        <span className="text-xs">Foto Menu</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-1">
                        <Star
                          size={12}
                          className="text-yellow-400 fill-yellow-400"
                        />
                        <span className="text-[10px] text-gray-500 font-bold tracking-widest">
                          ★★★★★
                        </span>
                      </div>
                      <h3 className="font-bold text-sm text-gray-800 truncate">
                        {item.name}
                      </h3>
                      <div className="flex justify-between items-end">
                        <span className="text-purple-600 font-bold text-sm">
                          Rp {item.price}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Tambahkan Menu Form */}
            <div>
              <h2 className="text-xl font-bold mb-4">Tambahkan Menu</h2>
              <form className="space-y-4">
                {/* Upload Area */}
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 bg-gray-200 rounded-lg flex flex-col items-center justify-center text-gray-500 cursor-pointer hover:bg-gray-300 transition">
                    <ImageIcon size={24} />
                  </div>
                  <span className="text-sm font-medium text-gray-600">
                    Unggah Gambar
                  </span>
                </div>

                {/* Inputs */}
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">
                    Nama Item:
                  </label>
                  <input
                    type="text"
                    className="w-full bg-gray-200 border-none rounded-md px-4 py-2 text-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">
                    Harga:
                  </label>
                  <input
                    type="number"
                    className="w-full bg-gray-200 border-none rounded-md px-4 py-2 text-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                {/* Tombol Tambah (Opsional, tidak ada di gambar tapi UX butuh) */}
                <button
                  type="button"
                  className="w-full bg-black text-white font-bold py-3 rounded-lg mt-2 hover:bg-gray-800 transition"
                >
                  Tambah Menu Baru
                </button>
              </form>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
