"use client";

import Link from "next/link";
import { Search, MapPin, Soup, Utensils } from "lucide-react"; 

export default function LandingPage() {
  return (
    // UBAH 1: Container utama jadi flex column agar bisa mengatur vertical center
    <div className="min-h-screen bg-[#FFFBF7] font-sans selection:bg-blue-200 flex flex-col relative overflow-hidden">
      
      {/* --- NAVBAR --- */}
      {/* UBAH 2: Relative positioning agar logo bisa ditaruh di pojok kiri tanpa mengganggu center menu */}
      <nav className="w-full max-w-7xl mx-auto px-6 py-8 flex items-center justify-center relative z-50">
        
        {/* Logo (Position Absolute di Kiri) */}
        <div className="absolute left-6 md:left-6 flex items-center gap-2">
          <div className="w-12 h-12 rounded-full border-2 border-blue-600 flex items-center justify-center bg-white">
             <Soup className="text-blue-600" size={24} />
          </div>
          <span className="font-bold text-xl text-blue-600 hidden md:block">Lokalaku</span>
        </div>

        {/* Menu Tengah (Tetap Center) */}
        <div className="bg-blue-600 rounded-full px-6 md:px-8 py-3 flex gap-4 md:gap-8 shadow-lg shadow-blue-200">
          <Link href="/" className="text-white text-sm md:text-base font-medium hover:text-blue-100 transition">Beranda</Link>
          <Link href="/about" className="text-white text-sm md:text-base font-medium hover:text-blue-100 transition">Tentang Kami</Link>
          <Link href="/contact" className="text-white text-sm md:text-base font-medium hover:text-blue-100 transition">Kontak</Link>
        </div>

        {/* Tombol Login Kanan SUDAH DIHAPUS sesuai request */}
      </nav>

      {/* --- HERO SECTION --- */}
      {/* UBAH 3: Tambahkan 'flex-grow', 'flex', 'items-center' agar konten turun pas ke tengah vertikal */}
      <main className="flex-grow flex items-center justify-center w-full relative z-10">
        <div className="max-w-7xl w-full px-6 flex flex-col md:flex-row items-center gap-12 md:gap-20">
          
          {/* --- LEFT CONTENT (Text) --- */}
          <div className="flex-1 space-y-6 text-center md:text-left">
            <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 leading-[1.1]">
              Jajan Keliling Ga <br />
              <span className="text-gray-900">Pake Ghosting.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-lg mx-auto md:mx-0">
              Temukan Bakso & Jajanan Keliling di Sekitarmu, Real-Time dengan AI.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center md:justify-start">
              {/* Button 1: Pembeli */}
              <Link 
                href="/user/login" 
                className="px-8 py-4 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold rounded-lg transition text-center"
              >
                Mulai Jajan (Pembeli)
              </Link>
              
              {/* Button 2: Penjual */}
              <Link 
                href="/seller/login"
                className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg shadow-blue-200 transition text-center"
              >
                Gabung Jadi Penjual
              </Link>
            </div>
          </div>

          {/* --- RIGHT CONTENT (Laptop Graphic Mockup) --- */}
          <div className="flex-1 w-full relative transform scale-90 md:scale-100">
              {/* Laptop Base Body */}
              <div className="relative z-10 bg-blue-600 rounded-t-3xl p-4 md:p-6 pb-0 shadow-2xl mx-4 md:mx-0">
                  {/* Screen Bezel */}
                  <div className="bg-white rounded-t-xl overflow-hidden h-64 md:h-80 relative flex flex-col">
                      
                      {/* Mock Browser Header */}
                      <div className="bg-white border-b border-gray-100 p-4 flex items-center justify-center gap-2">
                          <MapPin className="text-blue-600" size={20} />
                          <span className="font-bold text-gray-700 text-lg">Lokalaku Web</span>
                      </div>

                      {/* Mock Search Bar */}
                      <div className="px-6 py-2">
                          <div className="bg-gray-50 border border-gray-200 rounded-lg p-2 flex items-center gap-2 text-gray-400 text-sm">
                              <Search size={16} />
                              <span>Cari abang bakso...</span>
                          </div>
                      </div>

                      {/* Mock Map Area */}
                      <div className="flex-1 bg-blue-50 relative p-4 overflow-hidden">
                          {/* Map Grid Lines */}
                          <div className="absolute inset-0 grid grid-cols-4 gap-px opacity-10 pointer-events-none">
                              <div className="border-r border-gray-400 h-full"></div>
                              <div className="border-r border-gray-400 h-full"></div>
                              <div className="border-r border-gray-400 h-full"></div>
                          </div>

                          {/* Location Pins */}
                          <MapPin className="absolute top-1/4 left-1/4 text-orange-500 drop-shadow-md animate-bounce" size={32} />
                          <MapPin className="absolute top-1/3 right-1/3 text-orange-500 drop-shadow-md" size={32} />
                          
                          {/* Blue Dot (Current Loc) */}
                          <div className="absolute bottom-1/3 right-1/4 w-6 h-6 bg-blue-600 border-4 border-white rounded-full shadow-lg"></div>

                          {/* Food Popups */}
                          <div className="absolute bottom-4 left-6 bg-white p-2 rounded-xl shadow-lg border border-gray-100 flex gap-2 animate-pulse">
                               <div className="bg-orange-100 p-2 rounded-lg">
                                  <Soup className="text-orange-600" size={20} />
                               </div>
                               <div className="bg-orange-100 p-2 rounded-lg">
                                  <Utensils className="text-orange-600" size={20} />
                               </div>
                          </div>
                      </div>
                  </div>
              </div>
              
              {/* Laptop Keyboard Area (Bottom Part) */}
              <div className="h-6 bg-blue-800 rounded-b-xl mx-0 md:-mx-4 shadow-xl relative z-20 flex justify-center">
                   {/* Trackpad notch */}
                   <div className="w-1/3 h-2 bg-blue-700 rounded-b-lg"></div>
              </div>

              {/* Background Blob Decoration */}
              <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-blue-100 rounded-full blur-3xl -z-10 opacity-70"></div>
          </div>

        </div>
      </main>
    </div>
  );
}