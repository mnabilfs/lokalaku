"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { postData } from "@/lib/api";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fullname, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    if (password !== confirm) {
      alert("Password tidak sama!");
      return;
    }

    const res = await postData("/api/register/seller", {
      fullname,
      username,
      email,
      password,
      role: "seller"
    });

    if (!res.ok) {
      alert(res.data.message || "Register gagal");
      return;
    }

    alert("Register sukses, silakan login.");
  };

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
            <Link href="/seller/login" className="text-blue-500 hover:underline">
              Login here
            </Link>
          </p>

          <form onSubmit={handleRegister} className="space-y-4">
            <input
              type="text"
              placeholder="Fullname"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg border-gray-300 text-gray-700 placeholder-gray-400"
            />

            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg border-gray-300 text-gray-700 placeholder-gray-400"
            />

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg border-gray-300 text-gray-700 placeholder-gray-400" 
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg pr-10 border-gray-300 text-gray-700 placeholder-gray-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 border-gray-300 text-gray-400 placeholder-gray-400 "
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>

            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg pr-10 border-gray-300 text-gray-400 placeholder-gray-400 "
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showConfirmPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white font-bold py-3 rounded-lg mt-4"
            >
              Daftar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
