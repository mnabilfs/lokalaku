"use client";

import Link from "next/link";
import { Soup, Mail, Phone, MapPin, Send } from "lucide-react"; 

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#FFFBF7] font-sans selection:bg-blue-200 flex flex-col relative overflow-hidden">
      
      {/* --- NAVBAR (Konsisten) --- */}
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
          <Link href="/about" className="text-white text-sm md:text-base font-medium hover:text-blue-100 transition opacity-80 hover:opacity-100">Tentang Kami</Link>
          <Link href="/contact" className="text-white text-sm md:text-base font-bold border-b-2 border-white">Kontak</Link>
        </div>
      </nav>

      {/* --- CONTENT --- */}
      <main className="flex-grow flex items-center justify-center w-full px-6 py-10 relative z-10">
        <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-start">
          
          {/* Left Column: Text & Info */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900">
                Halo! <br /> Ada yang bisa dibantu?
              </h1>
              <p className="text-gray-600 text-lg">
                Jangan ragu untuk menyapa kami. Baik itu saran, kritik, atau ajakan kolaborasi, pintu kami selalu terbuka.
              </p>
            </div>

            {/* Contact Details Card */}
            <div className="bg-white p-6 rounded-2xl shadow-lg shadow-blue-100/50 border border-blue-50 space-y-6">
              
              <div className="flex items-start gap-4">
                <div className="bg-blue-100 p-3 rounded-lg text-blue-600">
                  <Mail size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Email</h4>
                  <p className="text-gray-600">halo@lokalaku.id</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-orange-100 p-3 rounded-lg text-orange-600">
                  <Phone size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Whatsapp</h4>
                  <p className="text-gray-600">+62 812-3456-7890</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-green-100 p-3 rounded-lg text-green-600">
                  <MapPin size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">Kantor</h4>
                  <p className="text-gray-600">Malang Creative Center (MCC)<br/>Jalan A. Yani No. 53, Malang</p>
                </div>
              </div>

            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="bg-white p-8 md:p-10 rounded-3xl shadow-2xl shadow-blue-200/50 relative overflow-hidden">
             {/* Decorative Top Bar */}
             <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-purple-500"></div>

             <h3 className="text-2xl font-bold text-gray-800 mb-6">Kirim Pesan</h3>
             
             <form className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Nama Lengkap</label>
                  <input type="text" placeholder="John Doe" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Email</label>
                  <input type="email" placeholder="john@example.com" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Pesan</label>
                  <textarea rows={4} placeholder="Tulis pesanmu di sini..." className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"></textarea>
                </div>

                <button type="button" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg transition flex items-center justify-center gap-2 group">
                  <span>Kirim Sekarang</span>
                  <Send size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
             </form>
          </div>

        </div>
      </main>
    </div>
  );
}