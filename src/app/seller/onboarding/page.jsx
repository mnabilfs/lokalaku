"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Store, Camera, User, ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { postMultipart, getData } from "@/lib/api";

export default function OnboardingPage() {
  // FORM STATE
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [whatsapp, setWhatsapp] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("Bakso/Mie");

  const [profileImage, setProfileImage] = useState(null);
  const [cartImage, setCartImage] = useState(null);

  const [profilePreview, setProfilePreview] = useState(null);
  const [cartPreview, setCartPreview] = useState(null);

  const [loading, setLoading] = useState(false);

  const profileInputRef = useRef(null);
  const cartInputRef = useRef(null);

  const [hasShop, setHasShop] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    async function loadShop() {
      const res = await getData("/api/seller", token);

      if (res.ok && res.data.status === "ready") {
        setHasShop(true);
        const d = res.data.data;

        console.log("Profile URL:", d.profile_image);

        setName(d.name || "");
        setDescription(d.description || "");
        setWhatsapp(d.whatsapp_number || "");
        setSelectedCategory(d.category || "");

        if (d.profile_image) setProfilePreview(d.profile_image);
        if (d.cart_image) setCartPreview(d.cart_image);
      }
    }

    loadShop();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("whatsapp_number", whatsapp);
    formData.append("category", selectedCategory);

    if (profileImage) formData.append("profile_image", profileImage);
    if (cartImage) formData.append("cart_image", cartImage);

    const res = await postMultipart("/api/seller/setup", formData, token);

    setLoading(false);

    if (!res.ok) {
      alert(res.data.message || "Gagal menyimpan data lapak");
      return;
    }

    alert("Data lapak berhasil disimpan!");
    router.push("/seller/dashboard");
  };

  // FOTO PROFILE
  const handleProfileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setProfileImage(file);
    setProfilePreview(URL.createObjectURL(file));
  };

  // FOTO CART
  const handleCartChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCartImage(file);
    setCartPreview(URL.createObjectURL(file));
  };

  useEffect(() => {
    return () => {
      if (profilePreview) URL.revokeObjectURL(profilePreview);
      if (cartPreview) URL.revokeObjectURL(cartPreview);
    };
  }, [profilePreview, cartPreview]);

  const categories = [
    { name: "Makanan Berkuah", icon: "🍜" },
    { name: "Gorengan & Cemilan", icon: "🍟" },
    { name: "Sate & Panggang", icon: "🍢" },
    { name: "Mie", icon: "🥟" },
    { name: "Minuman", icon: "🥤" },
    { name: "Lainnya", icon: "⚪" },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <header className="border-b border-gray-200 py-4 px-6 flex items-center gap-3 sticky top-0 bg-white z-10 h-18">
        {/* 🔙 Hanya tampil jika seller sudah punya data */}
        {hasShop && (
          <button
            onClick={() => router.push("/seller/dashboard")}
            className="p-2 rounded-full hover:bg-gray-100 transition cursor-pointer"
          >
            <ChevronLeft size={24} />
          </button>
        )}

        <h1 className="text-xl font-bold">Isi Data Lapak</h1>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">
        <h2 className="text-2xl font-bold mb-6">Isi Data Lapak</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* NAMA */}
          <div>
            <label className="font-bold">Nama Lapak:</label>
            <input
              type="text"
              placeholder="Contoh: Siomay Kang Asep"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-3 border rounded-lg"
            />
          </div>

          {/* DESKRIPSI */}
          <div>
            <label className="font-bold">Deskripsi:</label>
            <textarea
              rows="3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 border rounded-lg"
            />
          </div>

          {/* WHATSAPP */}
          <div>
            <label className="font-bold">Nomor WhatsApp:</label>
            <input
              type="tel"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              required
              className="w-full px-4 py-3 border rounded-lg"
            />
          </div>

          {/* KATEGORI */}
          <div>
            <label className="font-bold">Kategori Jualan:</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  type="button"
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`px-4 py-2 rounded-full border ${
                    selectedCategory === cat.name
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {cat.icon} {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* UPLOAD GAMBAR */}
          <div className="grid grid-cols-2 gap-6">
            {/* Foto profile */}
            <div
              className="border-2 border-dashed rounded-xl p-6 cursor-pointer"
              onClick={() => profileInputRef.current?.click()}
            >
              <p className="font-bold mb-2">Foto Profil</p>
              {profilePreview ? (
                <Image
                  src={profilePreview}
                  alt="Profil"
                  width={80}
                  height={80}
                  className="rounded-full"
                  unoptimized={true}
                />
              ) : (
                <User size={50} />
              )}
              <input
                type="file"
                ref={profileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleProfileChange}
              />
            </div>

            {/* Foto gerobak */}
            <div
              className="border-2 border-dashed rounded-xl p-6 cursor-pointer"
              onClick={() => cartInputRef.current?.click()}
            >
              <p className="font-bold mb-2">Foto Gerobak</p>
              {cartPreview ? (
                <Image
                  src={cartPreview}
                  alt="Gerobak"
                  width={80}
                  height={80}
                  className="rounded-lg"
                  unoptimized={true}
                />
              ) : (
                <Store size={50} />
              )}
              <input
                type="file"
                ref={cartInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleCartChange}
              />
            </div>
          </div>

          {/* BUTTON SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-orange-600 text-white font-bold rounded-lg"
          >
            {loading ? "Menyimpan..." : "Simpan & Mulai Jualan!"}
          </button>
        </form>
      </main>
    </div>
  );
}
