"use client";

import { useState } from "react";
import Image from "next/image"; // Gunakan jika nanti ada preview gambar
import { Store, Camera, User, Utensils, Coffee, Disc } from "lucide-react";
import { useRouter } from "next/navigation";

export default function OnboardingPage() {
  const [selectedCategory, setSelectedCategory] = useState("Bakso/Mie");
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault(); // <--- INI KUNCINYA: Mencegah browser refresh halaman

    // Di sini nanti bisa tambah logika cek password/email valid
    // Jika sukses, baru pindah halaman:
    router.push("/seller/dashboard");
  };

  // Data dummy untuk kategori
  const categories = [
    { name: "Bakso/Mie", icon: "🍜" },
    { name: "Sate", icon: "🍢" },
    { name: "Siomay", icon: "🥟" },
    { name: "Minuman/Es", icon: "🥤" },
    { name: "Nasi", icon: "🍚" },
    { name: "Lainnya", icon: "⚪" },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* --- HEADER --- */}
      <header className="border-b border-gray-200 py-4 px-6 flex justify-between items-center sticky top-0 bg-white z-10">
        <h1 className="text-xl font-bold text-gray-800">Isi Data Lapak</h1>
        <button className="bg-red-100 text-red-500 hover:bg-red-200 px-6 py-2 rounded-lg font-semibold text-sm transition-colors">
          KELUAR
        </button>
      </header>

      {/* --- MAIN CONTENT --- */}
      <main className="max-w-3xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold mb-6">Isi Data Lapak</h2>

        <form className="space-y-6">
          {/* Nama Lapak Input */}
          <div className="space-y-2">
            <label className="font-bold text-gray-800">Nama Lapak:</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-blue-600">
                <Store size={20} />
              </div>
              <input
                type="text"
                placeholder="Contoh: Siomay Kang Asep"
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
              />
            </div>
          </div>

          {/* Deskripsi Lapak */}
          <div className="space-y-2">
            <label className="font-bold text-gray-800">Deskripsi Lapak:</label>
            <textarea
              rows={3}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 resize-none"
            ></textarea>
          </div>

          {/* Nomor Whatsapp */}
          <div className="space-y-2">
            <label className="font-bold text-gray-800">Nomor Whatsapp:</label>
            <input
              type="tel"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
            />
          </div>

          {/* Kategori Jualan */}
          <div className="space-y-2">
            <label className="text-sm text-gray-600 font-semibold block mb-2">
              Kategori Jualan Utama
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  type="button"
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors border ${
                    selectedCategory === cat.name
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-gray-100 text-gray-600 border-gray-200 hover:bg-gray-200"
                  }`}
                >
                  <span>{cat.icon}</span>
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Upload Foto Area */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            {/* Foto Profile Upload */}
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-gray-100 transition cursor-pointer h-48">
              <div className="bg-blue-600 p-2 rounded-full text-white mb-2">
                <Camera size={20} />
              </div>
              <p className="font-bold text-sm mb-2">Foto Profile</p>
              {/* Icon User Placeholder */}
              <div className="bg-white border-2 border-black rounded-full p-2 w-16 h-16 flex items-center justify-center">
                <User size={40} className="text-black" />
              </div>
            </div>

            {/* Foto Gerobak Upload */}
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-gray-100 transition cursor-pointer h-48">
              <div className="bg-blue-600 p-2 rounded-full text-white mb-2">
                <Camera size={20} />
              </div>
              <p className="font-bold text-sm mb-2">Foto Gerobak (Opsional)</p>
              {/* Icon Gerobak Placeholder (bisa diganti img aset) */}
              <div className="bg-white/50 rounded-lg p-2 w-16 h-16 flex items-center justify-center">
                {/* Menggunakan icon Store sebagai representasi gerobak jika tidak ada gambar aset */}
                <Store size={48} className="text-orange-400" />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-6">
            <button
              onClick={handleSubmit}
              type="button"
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 rounded-lg shadow-lg flex justify-center items-center gap-2 transition-transform active:scale-[0.99]"
            >
              Simpan & Mulai Jualan!
              {/* Dekorasi bintang kecil seperti di gambar */}
              <span className="text-yellow-300">✦</span>
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
