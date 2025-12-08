"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getData, postMultipart, API_BASE } from "@/lib/api";
import {
  Image as ImageIcon,
  Star,
  Settings,
  Lightbulb,
  LogOut,
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const [menus, setMenus] = useState([]);
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newImage, setNewImage] = useState(null);
  const [newImagePreview, setNewImagePreview] = useState(null);
  const [shop, setShop] = useState(null);

  const [editMenu, setEditMenu] = useState(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editImage, setEditImage] = useState(null);
  const [editPreview, setEditPreview] = useState(null);
  const editImageRef = useRef(null);

  const [isLive, setIsLive] = useState(false);
  const [aiText, setAiText] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  const imageInputRef = useRef(null);

  useEffect(() => {
    async function load() {
      const res = await getData("/api/seller", token);

      if (res.ok && res.data.status === "ready") {
        setShop(res.data.data);
        setMenus(res.data.data.menus);
      }
    }
    load();
  }, []);

  const handleGoLive = async () => {
    setAiLoading(true); 
    setAiText(null);

    const token = localStorage.getItem("token");
    if (!token) return alert("Token hilang, login ulang!");

    // MINTA LOKASI BROWSER
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const latitude = pos.coords.latitude;
        const longitude = pos.coords.longitude;

        console.log("GPS:", latitude, longitude);

        const res = await fetch(`${API_BASE}/api/seller/status`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            is_live: true,
            latitude,
            longitude,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          alert(data.message || "Gagal mengaktifkan Live!");
          return;
        }

        setIsLive(true);
        loadAiInsight(); // 🔥 Panggil AI setelah Live
      },

      // ❌ ERROR MENDAPATKAN GPS
      (err) => {
        console.error(err);
        alert("GPS tidak aktif. Izinkan lokasi pada browser Anda.");
      }
    );
  };

  const loadAiInsight = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_BASE}/api/seller/ai-insight`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    console.log("AI Response:", data); // 🔥 CEK APA YANG KELUAR

    if (res.ok) {
      const msg = data.data?.message || "";
      const location = data.data?.target_location || "";

      // 🔥 Format sesuai permintaan kamu
      const finalText = `Rekomendasi berjualan di ${location}\n${msg}. Geser ke sana yuk!`;

      setAiText(finalText);
    }
    setAiLoading(false);
  };

  const handleStop = async () => {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_BASE}/api/seller/status`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        is_live: false,
      }),
    });

    setIsLive(false);
    setAiLoading(false);
    setAiText("");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    router.push("/seller/login");
  };

  // ===========================
  // HANDLE UPLOAD GAMBAR
  // ===========================
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setNewImage(file);
    setNewImagePreview(URL.createObjectURL(file));
  };

  // ===========================
  // TAMBAH MENU BARU
  // ===========================
  const handleAddMenu = async () => {
    if (!newName || !newPrice || !newImage) {
      alert("Lengkapi semua data menu!");
      return;
    }
    const formData = new FormData();
    formData.append("name", newName);
    formData.append("price", newPrice);
    formData.append("image", newImage);

    const res = await postMultipart("/api/seller/menu", formData, token);

    if (!res.ok) {
      alert("Gagal menambahkan menu!");
      return;
    }

    alert("Menu berhasil ditambahkan!");
    setMenus((prev) => [...prev, res.data.data]);
    setNewName("");
    setNewPrice("");
    setNewImage(null);
    setNewImagePreview(null);
  };

  const handleUpdateMenu = async () => {
    if (!editName || !editPrice) {
      alert("Nama & harga wajib diisi");
      return;
    }

    const formData = new FormData();
    formData.append("name", editName);
    formData.append("price", editPrice);

    if (editImage) {
      formData.append("image", editImage);
    }

    const response = await fetch(
      `${API_BASE}/api/seller/menu/${editMenu.id}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "X-HTTP-Method-Override": "PUT",
        },
        body: formData,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      alert("Gagal update menu!");
      return;
    }

    // update state menu
    setMenus((prev) => prev.map((m) => (m.id === editMenu.id ? data.data : m)));

    // tutup modal
    setEditMenu(null);
  };

  const handleEditImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setEditImage(file);
    setEditPreview(URL.createObjectURL(file));
  };

  const startEdit = (menu) => {
    setEditMenu(menu);
    setEditName(menu.name);
    setEditPrice(menu.price);
    setEditPreview(menu.image);
  };

  // ===========================
  // HAPUS MENU
  // ===========================
  const handleDelete = async (id) => {
    const yes = confirm("Yakin ingin menghapus menu?");
    if (!yes) return;

    const res = await fetch(`${API_BASE}/api/seller/menu/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      alert("Gagal menghapus!");
      return;
    }

    setMenus((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans">
      {/* --- HEADER --- */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-20">
        <div className="flex items-center gap-3">
          {/* Avatar Placeholder */}
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            {shop?.profile_image ? (
              <Image
                src={shop.profile_image}
                alt="Profile"
                width={40}
                height={40}
                className="rounded-full object-cover"
                unoptimized
              />
            ) : (
              <span className="text-xl">👤</span>
            )}
          </div>

          <div>
            <h2 className="font-bold text-gray-900 leading-tight mb-1.5">
              {shop ? `${shop.name} (${shop.category})` : "Memuat..."}
            </h2>
            <div className="flex items-center gap-1.5">
              {!isLive && (
                <>
                  <span className="w-2 h-2 rounded-full bg-gray-500 animate-pulse"></span>
                  <span className="text-xs text-gray-600 font-medium">
                    Offline
                  </span>
                </>
              )}
              {isLive && (
                <>
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  <span className="text-xs text-green-600 font-medium">
                    Online
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Settings */}
          <button
            onClick={() => router.push("/seller/onboarding")}
            className="p-2 hover:bg-gray-100 rounded-full transition cursor-pointer"
          >
            <Settings className="text-gray-600" size={24} />
          </button>

          {/* 🔥 LOGOUT BUTTON */}
          <button
            onClick={handleLogout}
            className="p-2 hover:bg-red-100 rounded-full transition cursor-pointer"
          >
            <LogOut className="text-red-500" size={24} />
          </button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2px_1fr] gap-8">
          {/* --- KOLOM KIRI: STATUS & OPERASIONAL --- */}
          <section className="flex flex-col gap-8">
            {/* 1. Status GPS Card */}
            {/* OFFLINE MODE */}
            {!isLive && (
              <>
                <div className="bg-red-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-red-500 rounded-full blur-2xl opacity-50"></div>

                  <div className="relative z-10 text-center space-y-4 py-4">
                    <p className="text-red-100 text-sm font-medium">
                      Status GPS
                    </p>
                    <h2 className="text-3xl font-bold tracking-wide">
                      KAMU OFFLINE!
                    </h2>
                    <p className="text-red-100 text-sm">
                      Segera aktifkan GPS untuk melacak lokasi.
                    </p>

                    <div className="flex items-center justify-center gap-2 mt-4">
                      <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                      </span>
                      <span className="font-semibold tracking-wider text-sm">
                        Tracking Non-Active...
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* ONLINE MODE */}
            {isLive && (
              <>
                <div className="bg-blue-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500 rounded-full blur-2xl opacity-50"></div>

                  <div className="relative z-10 text-center space-y-4 py-4">
                    <p className="text-blue-100 text-sm font-medium">
                      Status GPS
                    </p>
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
              </>
            )}

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
                  <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                    {!isLive
                      ? "Aktifkan mode Live untuk mendapatkan rekomendasi AI."
                      : aiLoading && !aiText
                      ? "Sedang memproses rekomendasi AI..."
                      : aiText
                      ? aiText
                      : "Menunggu rekomendasi AI..."}
                  </p>
                  <button className="bg-orange-200 hover:bg-orange-300 text-orange-800 text-xs font-bold px-4 py-1.5 rounded-full mt-2 transition-colors">
                    Oke, OTW! 🚀
                  </button>
                </div>
              </div>
            </div>

            {/* 3. Stop Button */}
            <div className="mt-auto pt-8">
              {!isLive && (
                <>
                  <button
                    onClick={handleGoLive}
                    className="cursor-pointer w-full bg-blue-100 hover:bg-blue-200 text-blue-600 font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                  >
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    MULAI JUALAN
                  </button>
                </>
              )}

              {isLive && (
                <>
                  <button
                    onClick={handleStop}
                    className="cursor-pointer w-full bg-red-100 hover:bg-red-200 text-red-600 font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                  >
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    STOP JUALAN (PULANG)
                  </button>
                </>
              )}
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
                {menus.map((item) => (
                  <div
                    key={item.id}
                    className="border border-gray-100 rounded-xl p-3 shadow-sm hover:shadow-md transition bg-white"
                  >
                    {/* Image Placeholder */}
                    <div className="h-24 bg-gray-200 rounded-lg mb-3 relative overflow-hidden">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                          <span className="text-xs">Foto Menu</span>
                        </div>
                      )}
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
                      <div className="flex justify-between mt-4">
                        <button
                          onClick={() => startEdit(item)}
                          className="text-blue-600 text-xs font-bold cursor-pointer"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-red-600 text-xs font-bold cursor-pointer"
                        >
                          Hapus
                        </button>
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
                  <div
                    onClick={() => imageInputRef.current?.click()}
                    className="w-24 h-24 bg-gray-200 rounded-lg flex flex-col items-center justify-center text-gray-500 cursor-pointer hover:bg-gray-300 transition overflow-hidden"
                  >
                    {newImagePreview ? (
                      <Image
                        src={newImagePreview}
                        alt="Preview"
                        width={96}
                        height={96}
                        className="object-cover rounded-lg"
                        unoptimized
                      />
                    ) : (
                      <ImageIcon size={24} />
                    )}

                    <input
                      type="file"
                      ref={imageInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
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
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full bg-gray-200 border-none rounded-md px-4 py-2 text-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">
                    Harga:
                  </label>
                  <input
                    type="number"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="w-full bg-gray-200 border-none rounded-md px-4 py-2 text-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>

                {/* Tombol Tambah (Opsional, tidak ada di gambar tapi UX butuh) */}
                <button
                  type="button"
                  onClick={handleAddMenu}
                  className="w-full bg-black text-white font-bold py-3 rounded-lg mt-2 hover:bg-gray-800 transition cursor-pointer"
                >
                  Tambah Menu Baru
                </button>
              </form>
            </div>
          </section>
        </div>
      </main>
      {editMenu && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-80 space-y-4 shadow-xl">
            <h2 className="text-lg font-bold">Edit Menu</h2>

            {/* Gambar */}
            <div
              className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center cursor-pointer overflow-hidden"
              onClick={() => editImageRef.current?.click()}
            >
              {editPreview ? (
                <Image
                  src={editPreview}
                  width={120}
                  height={120}
                  alt="Preview"
                  className="object-cover rounded-lg"
                  unoptimized
                />
              ) : (
                <span className="text-gray-500 text-sm">Upload Gambar</span>
              )}

              <input
                type="file"
                ref={editImageRef}
                className="hidden"
                accept="image/*"
                onChange={handleEditImage}
              />
            </div>

            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full border p-2 rounded-lg"
            />

            <input
              type="number"
              value={editPrice}
              onChange={(e) => setEditPrice(e.target.value)}
              className="w-full border p-2 rounded-lg"
            />

            <div className="flex justify-between">
              <button
                onClick={() => setEditMenu(null)}
                className="px-4 py-2 bg-gray-300 rounded-lg cursor-pointer"
              >
                Batal
              </button>

              <button
                onClick={handleUpdateMenu}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
