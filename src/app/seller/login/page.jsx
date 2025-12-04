"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { postData } from "@/lib/api";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);

    const res = await postData("/api/login", {
      email,
      password,
      role: "seller",
    });

    setLoading(false);

    if (!res.ok) {
      alert(res.data.message || "Login gagal");
      return;
    }
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("role", res.data.user.role);
    router.push("/seller/onboarding");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white p-4">
      <div className="flex flex-col md:flex-row items-center gap-10 md:gap-20">
        {/* Bagian Kiri: Logo */}
        <div className="flex-shrink-0">
          {/* Ganti '/logo-lokalaku.png' dengan path gambarmu */}
          <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full border-4 border-blue-500 flex items-center justify-center p-4">
            {/* Gunakan Image component Next.js jika aset sudah ada */}
            {/* <Image src="/logo.png" alt="Lokalaku Logo" width={200} height={200} /> */}
            <span className="text-blue-500 font-bold text-xl text-center">
              [Place Logo Here]
            </span>
          </div>
        </div>

        {/* Bagian Kanan: Form Login */}
        <div className="w-full max-w-md bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] p-8 border border-gray-100">
          <h1 className="text-2xl font-bold text-blue-500 mb-2">Login</h1>
          <p className="text-sm text-gray-600 mb-6">
            Don{"'"}t have an account?{" "}
            <Link
              href="/seller/register"
              className="text-blue-500 hover:underline"
            >
              Register here
            </Link>
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email Field */}
            <div>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg border-gray-300 text-gray-700 placeholder-gray-400"
              />
            </div>

            {/* Password Field */}
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
                className="absolute right-3 top-1/2 -translate-y-1/2 border-gray-300 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {/* Button Masuk */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg mt-4"
            >
              {loading ? "Loading..." : "Masuk"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
