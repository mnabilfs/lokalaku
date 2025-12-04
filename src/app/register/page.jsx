"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white p-4">
      <div className="flex flex-col md:flex-row items-center gap-10 md:gap-20">
        
        {/* Bagian Kiri: Logo */}
        <div className="flex-shrink-0 hidden md:block">
           {/* Ganti dengan logo kamu */}
           <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full border-4 border-blue-500 flex items-center justify-center p-4">
             <span className="text-blue-500 font-bold text-xl text-center">
               [Place Logo Here]
             </span>
          </div>
        </div>

        {/* Bagian Kanan: Form Register */}
        <div className="w-full max-w-md bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] p-8 border border-gray-100">
          <h1 className="text-2xl font-bold text-blue-500 mb-2">Register</h1>
          <p className="text-sm text-gray-600 mb-6">
            Have an account?{" "}
            <Link href="/login" className="text-blue-500 hover:underline">
              Login here
            </Link>
          </p>

          <form className="space-y-4">
            {/* Fullname */}
            <div>
              <input
                type="text"
                placeholder="Fullname"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 placeholder-gray-400"
              />
            </div>

            {/* Username */}
            <div>
              <input
                type="text"
                placeholder="Username"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 placeholder-gray-400"
              />
            </div>

            {/* Email */}
            <div>
              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 placeholder-gray-400"
              />
            </div>

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 placeholder-gray-400 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Confirm Password (Input ke-2 yg terlihat seperti password) */}
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Password" // Sesuai gambar labelnya tetap Password atau Confirm Password
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 placeholder-gray-400 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Button Daftar */}
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition duration-200 mt-4"
            >
              Daftar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}