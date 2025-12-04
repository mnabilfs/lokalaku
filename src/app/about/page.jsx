"use client";

import Link from "next/link";
import { Soup, Heart, Users, TrendingUp, ArrowRight } from "lucide-react"; 

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#FFFBF7] font-sans selection:bg-blue-200 flex flex-col relative overflow-hidden">
      
      {/* --- NAVBAR (Konsisten dengan Landing Page) --- */}
      <nav className="w-full max-w-7xl mx-auto px-6 py-8 flex items-center justify-center relative z-50">
        <div className="absolute left-6 md:left-6 flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-12 h-12 rounded-full border-2 border-blue-600 flex items-center justify-center bg-white">
              <Soup className="text-blue-600" size={24} />
            </div>
            <span className="font-bold text-xl text-blue-600 hidden md:block">Lokalaku</span>
          </Link>
        </div>

        <div className="bg-blue-600 rounded-full px-6 md:px-8 py-3 flex gap-4 md:gap-8 shadow-lg shadow-blue-200">
          <Link href="/" className="text-white text-sm md:text-base font-medium hover:text-blue-100 transition opacity-80 hover:opacity-100">Beranda</Link>
          <Link href="/about" className="text-white text-sm md:text-base font-bold border-b-2 border-white">Tentang Kami</Link>
          <Link href="/contact" className="text-white text-sm md:text-base font-medium hover:text-blue-100 transition opacity-80 hover:opacity-100">Kontak</Link>
        </div>
      </nav>

      {/* --- CONTENT --- */}
      <main className="flex-grow w-full max-w-6xl mx-auto px-6 py-12 flex flex-col items-center">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mb-16 space-y-6">
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight">
            Misi Kami: <span className="text-blue-600">Memberdayakan</span> Rasa Lokal.
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            Lokalaku lahir dari kerinduan akan suara {"'"}Tek Tek{"'"} dan {"'"}Tingtung{"'"} yang mulai jarang terdengar. Kami membangun jembatan digital antara penikmat kuliner dan pahlawan keliling.
          </p>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full mb-20">
          {/* Card 1 */}
          <div className="bg-white p-8 rounded-3xl shadow-xl shadow-blue-100/50 border border-blue-50 flex flex-col items-center text-center hover:-translate-y-2 transition duration-300">
            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mb-6 text-red-600">
              <Heart size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Lestarikan Budaya</h3>
            <p className="text-gray-500">
              Menjaga eksistensi kuliner gerobakan agar tidak tergerus zaman modernisasi.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white p-8 rounded-3xl shadow-xl shadow-blue-100/50 border border-blue-50 flex flex-col items-center text-center hover:-translate-y-2 transition duration-300">
            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-6 text-blue-600">
              <Users size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Komunitas Kuat</h3>
            <p className="text-gray-500">
              Membangun ekosistem saling dukung antara warga lokal dan pedagang kecil.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white p-8 rounded-3xl shadow-xl shadow-blue-100/50 border border-blue-50 flex flex-col items-center text-center hover:-translate-y-2 transition duration-300">
            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-6 text-green-600">
              <TrendingUp size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">Ekonomi Digital</h3>
            <p className="text-gray-500">
              Membantu pedagang tradisional beradaptasi dengan teknologi tanpa menghilangkan ciri khas.
            </p>
          </div>
        </div>

        {/* Story Section / CTA */}
        <div className="w-full bg-blue-600 rounded-3xl p-8 md:p-16 text-white flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl relative overflow-hidden">
          {/* Decorative Blob */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          
          <div className="relative z-10 max-w-xl space-y-4 text-center md:text-left">
            <h2 className="text-3xl font-bold">Siap menjadi bagian dari cerita kami?</h2>
            <p className="text-blue-100">Bergabunglah sebagai mitra penjual atau mulailah petualangan rasa sebagai pembeli.</p>
          </div>
          
          <div className="relative z-10 flex gap-4">
            <Link href="/seller/login" className="bg-white text-blue-600 px-8 py-3 rounded-xl font-bold hover:bg-gray-100 transition flex items-center gap-2">
              Gabung Mitra <ArrowRight size={18} />
            </Link>
          </div>
        </div>

      </main>
    </div>
  );
}