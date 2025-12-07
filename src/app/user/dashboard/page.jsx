"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, useMemo } from "react";
import { createPortal } from "react-dom";
import "leaflet/dist/leaflet.css";

/* ===== CONFIG ===== */
const DEVELOPER_MODE = false; // toggle developer mode
const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/* ===== MOCKS (dev mode) ===== */
const MOCK_WEATHER = "Rainy";
const WEATHER_RECOMMENDATIONS = {
  Rainy: "Bakso Hangat",
  Sunny: "Es Teh Dingin",
  Cold: "Sup Ayam",
  Hot: "Sate + Nasi",
};

const MOCK_SHOPS = [
  {
    id: 1,
    name: "Bakso Pak Budi",
    lat: -6.8865,
    lng: 107.6150,
    profile_image: null,
    is_live: true,
    distance: "120 m",
    description: "Bakso urat enak dan hangat.",
    whatsapp: "628123456789",
    menus: [
      { id: "m1", name: "Bakso Urat", price: 15000 },
      { id: "m2", name: "Es Teh", price: 3000 },
    ],
  },
  {
    id: 2,
    name: "Nasi Goreng Mbak Sari",
    lat: -6.8871,
    lng: 107.6136,
    profile_image: null,
    is_live: true,
    distance: "350 m",
    description: "Nasi goreng spesial pedas.",
    whatsapp: "628198765432",
    menus: [
      { id: "m3", name: "Nasi Goreng Spesial", price: 20000 },
      { id: "m4", name: "Ayam Goreng", price: 12000 },
    ],
  },
  {
    id: 3,
    name: "Cilok Bu Sari",
    lat: -6.8858,
    lng: 107.6148,
    profile_image: null,
    is_live: false,
    distance: "500 m",
    description: "Cilok dan bakar-cilok.",
    whatsapp: "628112233445",
    menus: [
      { id: "m5", name: "Cilok Original", price: 7000 },
      { id: "m6", name: "Cilok Pedas", price: 8000 },
    ],
  },
];

/* ===== react-leaflet dynamic imports (client-only) ===== */
const MapContainer = dynamic(
  () => import("react-leaflet").then((m) => m.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((m) => m.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((m) => m.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import("react-leaflet").then((m) => m.Popup),
  { ssr: false }
);
const Polyline = dynamic(
  () => import("react-leaflet").then((m) => m.Polyline),
  { ssr: false }
);

/* ===== helpers ===== */
function containsText(target = "", query = "") {
  return target?.toString().toLowerCase().includes(query.toString().toLowerCase());
}

/* Normalize various image path formats returned by backend to absolute URLs */
function normalizeImageUrl(imageUrl) {
  if (!imageUrl) return null;
  // already absolute
  if (typeof imageUrl === 'string' && /^https?:\/\//i.test(imageUrl)) return imageUrl;

  // backend may return '/storage/...' or 'storage/...' or 'some/path.jpg'
  if (imageUrl.startsWith('/')) {
    return `${API}${imageUrl}`;
  }

  return `${API}/${imageUrl}`;
}

/* ===== Page Component ===== */
export default function DashboardMapPage() {
  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const [mapInstance, setMapInstance] = useState(null);
  const [userPos, setUserPos] = useState(null);
  const [user, setUser] = useState(null); // logged-in user info
  const [token, setToken] = useState(null);
  const [devMode, setDevMode] = useState(DEVELOPER_MODE);
  const [shops, setShops] = useState([]);
  const [selectedShop, setSelectedShop] = useState(null); // used by side modal
  const [modalOpen, setModalOpen] = useState(false); // side modal open
  const [photoModal, setPhotoModal] = useState(null); // center image modal (shop object)
  const [route, setRoute] = useState(null);
  const [osrmInfo, setOsrmInfo] = useState(null);
  const [routeLoading, setRouteLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadingShops, setLoadingShops] = useState(false);
  const [loadingApis, setLoadingApis] = useState(false); // tracks if APIs are being fetched
  const [mapRawResponse, setMapRawResponse] = useState(null); // raw text when /api/buyer/map returns non-JSON
  const [shopRawResponse, setShopRawResponse] = useState(null); // raw text when shop detail returns non-JSON
  const [search, setSearch] = useState("");
  const [weather, setWeather] = useState(MOCK_WEATHER);
  const [aiRecommendation, setAiRecommendation] = useState(null); // { recommendation, reason, shop_name }
  const [weatherData, setWeatherData] = useState(null); // { temperature, feels_like, description, main, humidity, wind_speed }
  const [failedImages, setFailedImages] = useState(new Set()); // track images that failed to load

  /* load user info from localStorage */
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.warn('Failed to parse user from localStorage:', e);
      }
    }
    const t = localStorage.getItem('token');
    if (t) setToken(t);
    const dm = localStorage.getItem('developer_mode');
    if (dm !== null) setDevMode(dm === '1');
  }, []);
  useEffect(() => {
    if (typeof window === "undefined") return;
    import("leaflet")
      .then((L) => {
        L.Marker.prototype.options.icon = L.icon({
          iconUrl: "/marker-icon.png",
          shadowUrl: "/marker-shadow.png",
          iconSize: [25, 41],
          iconAnchor: [12, 41],
        });
        setLeafletLoaded(true);
      })
      .catch((e) => {
        console.error("Failed to load leaflet:", e);
      });
  }, []);

  /* get user geolocation */
  useEffect(() => {
    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      setError("Geolocation not available.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserPos([pos.coords.latitude, pos.coords.longitude]);
      },
      (err) => {
        console.warn("Geolocation refused or failed, using fallback coords for dev.");
        if (devMode) {
          setUserPos([-6.8868, 107.6146]); // near mock shops
        } else {
          setError("Unable to get location. Allow location access.");
        }
      },
      { enableHighAccuracy: true, maximumAge: 5000 }
    );
  }, []);

  /* logout function */
  async function handleLogout() {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        await fetch(`${API}/api/logout`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      // Clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Redirect to login
      window.location.href = '/user/login';
    } catch (e) {
      console.error('Logout failed:', e);
      // Still redirect on error
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/user/login';
    }
  }
  useEffect(() => {
    let root = document.getElementById("modal-root");
    if (!root) {
      root = document.createElement("div");
      root.id = "modal-root";
      document.body.appendChild(root);
    }
  }, []);

  /* update weather display color based on weather condition */
  useEffect(() => {
    const weatherDisplay = document.getElementById("weatherDisplay");
    if (!weatherDisplay) return;

    let colorClass = "text-gray-900"; // default

    if (weather) {
      const lowerWeather = weather.toLowerCase();
      
      if (lowerWeather.includes("rain") || lowerWeather.includes("hujan")) {
        colorClass = "text-blue-600"; // rainy = blue
      } else if (lowerWeather.includes("sun") || lowerWeather.includes("sunny") || lowerWeather.includes("cerah") || lowerWeather.includes("clear")) {
        colorClass = "text-yellow-600"; // sunny = yellow/gold
      } else if (lowerWeather.includes("cloud") || lowerWeather.includes("mendung") || lowerWeather.includes("overcast")) {
        colorClass = "text-gray-500"; // cloudy = gray
      } else if (lowerWeather.includes("snow") || lowerWeather.includes("salju")) {
        colorClass = "text-cyan-400"; // snowy = cyan
      } else if (lowerWeather.includes("storm") || lowerWeather.includes("badai")) {
        colorClass = "text-purple-700"; // stormy = purple
      } else if (lowerWeather.includes("wind") || lowerWeather.includes("angin")) {
        colorClass = "text-teal-600"; // windy = teal
      } else if (lowerWeather.includes("fog") || lowerWeather.includes("kabut")) {
        colorClass = "text-gray-400"; // foggy = light gray
      }
    }

    weatherDisplay.className = `font-semibold ${colorClass}`;
  }, [weather]);

  /* debug: log modal state changes to help diagnose visibility issues */
  useEffect(() => {
    console.log("modalOpen changed:", modalOpen, "selectedShop:", selectedShop);
  }, [modalOpen, selectedShop]);

  /* fetch shops when userPos ready */
  useEffect(() => {
    if (!userPos) return;
    fetchShops(userPos[0], userPos[1]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userPos]);

  async function fetchShops(lat, lng) {
    setError(null);
    setLoadingShops(true);
    setLoadingApis(true); // indicate APIs are being fetched
    setShops([]);

    if (devMode) {
      setTimeout(() => {
        setShops(MOCK_SHOPS);
        setLoadingShops(false);
        setLoadingApis(false);
      }, 300);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      console.log('fetchShops: token present?', !!token);

      // choose endpoint based on token availability
      // - If token exists, call protected POST `/api/buyer/map` with Bearer token
      // - If unauthenticated, call public GET `/api/buyer/map-data` which accepts query params
      let res = null;
      if (token) {
        const endpoint = `${API}/api/buyer/map`;
        const headers = {
          "Content-Type": "application/json",
          "Accept": "application/json",
          Authorization: `Bearer ${token}`,
        };

        res = await fetch(endpoint, {
          method: "POST",
          headers,
          body: JSON.stringify({ latitude: lat, longitude: lng, radius: 2 }),
        });
      } else {
        // Use GET /api/buyer/map-data for unauthenticated consumers (route exists in backend)
        const endpoint = `${API}/api/buyer/map-data?latitude=${encodeURIComponent(lat)}&longitude=${encodeURIComponent(lng)}&radius=2`;
        res = await fetch(endpoint, {
          method: "GET",
          headers: { "Accept": "application/json" },
        });
      }

      // Read as text first to avoid JSON.parse errors when backend returns HTML or empty responses
      const text = await res.text();
      let json = null;
      try {
        json = text ? JSON.parse(text) : {};
        // clear any previous raw response on success
        setMapRawResponse(null);
      } catch (parseError) {
        console.warn("Failed to parse JSON response for /api/buyer/map, response text:", text);
        json = null;
        // only surface raw response if it looks like HTML (error page) or response status is not OK
        const looksLikeHtml = typeof text === 'string' && /<\/?html|<!doctype/i.test(text);
        if (looksLikeHtml) {
          setMapRawResponse(text);
        } else {
          // do not show raw response for small non-JSON texts; treat as parse failure silently
          setMapRawResponse(null);
        }
      }

      // safe debug
      console.log("fetchShops -> res.ok:", res.ok, "status:", res.status);
      console.log("API BUYER MAP RAW RESPONSE:", text);
      console.log("API BUYER MAP PARSED JSON:", json);
      console.log("USER POS:", [lat, lng]);

      if (!res.ok) {
        // backend may return message or error; fall back to raw text when JSON missing
        const message = (json && (json.message || json.error)) || (text ? text : res.statusText);
        setError(message || "Failed fetching shops.");
        setLoadingShops(false);
        setLoadingApis(false);
        return;
      }
      // if parsed JSON is null (parsing failed) treat as error but keep raw response visible
      if (json === null) {
        setError("Failed parsing server response; see raw response below.");
        setLoadingShops(false);
        setLoadingApis(false);
        return;
      }

      // backend uses `nearby_shops`
      const shopList = Array.isArray(json.nearby_shops)
        ? json.nearby_shops
        : Array.isArray(json.data)
        ? json.data
        : json.shops ?? [];

      const normalized = shopList
        .map((s) => {
          // Build absolute image URL - handle various storage paths
          let imageUrl = null;
          if (s.profile_image) {
            if (s.profile_image.startsWith('http')) {
              imageUrl = s.profile_image;
            } else if (s.profile_image.startsWith('/')) {
              // Path starting with / - prepend API base
              imageUrl = `${API}${s.profile_image}`;
            } else {
              // Relative path - prepend API base with /
              imageUrl = `${API}/${s.profile_image}`;
            }
          }

          return {
              id: s.id ?? s.shop_id,
              name: s.name ?? s.shop_name ?? "Unnamed",
              lat: s.latitude ?? s.lat ?? s.location?.lat,
              lng: s.longitude ?? s.lng ?? s.location?.lng,
              profile_image: normalizeImageUrl(s.profile_image),
            is_live: s.is_live ?? true,
            distance: typeof s.distance === 'number' ? `${s.distance} m` : s.distance ?? (s.distance_km ? `${s.distance_km} km` : null),
            description: s.description ?? s.desc ?? s.category ?? "",
            whatsapp: s.whatsapp_number ?? s.whatsapp ?? null,
            menus: s.menus ?? s.menu ?? [],
          };
          })
        .filter((s) => s.lat != null && s.lng != null);

      setShops(normalized);
      
      // Extract weather and AI recommendation from backend response
      if (json.weather) {
        setWeatherData(json.weather);
        // update weather state to use description or main field
        setWeather(json.weather.description || json.weather.main || MOCK_WEATHER);
      }
      
      // If AI recommendation exists, use it; otherwise use first menu from nearest shop
      if (json.ai_recommendation) {
        setAiRecommendation(json.ai_recommendation);
      } else if (normalized.length > 0 && normalized[0].menus && normalized[0].menus.length > 0) {
        // Use first menu item from nearest shop as fallback recommendation
        const firstMenu = normalized[0].menus[0];
        setAiRecommendation({
          recommendation: firstMenu.name,
          reason: `Rekomendasi dari toko terdekat ${normalized[0].name}`,
          shop_name: normalized[0].name,
        });
      }
    } catch (e) {
      console.error(e);
      setError("Network error.");
    } finally {
      setLoadingShops(false);
      setLoadingApis(false);
    }
  }

  /* filtered shops by search (name or menu) */
  const filteredShops = useMemo(() => {
    if (!search?.trim()) return shops;
    const q = search.toLowerCase();
    return shops.filter((s) => {
      if (containsText(s.name, q)) return true;
      if (Array.isArray(s.menus) && s.menus.some((m) => containsText(m.name, q))) return true;
      return false;
    });
  }, [shops, search]);

  const recommendedDish = WEATHER_RECOMMENDATIONS[weather] ?? "Nasi Goreng";

  /* OSRM base options: primary and fallback */
  const OSRM_BASES = [
    "https://router.project-osrm.org", // default
    "https://routing.openstreetmap.de/routed-car", // fallback
  ];

  /* draw route using OSRM; accepts shop object */
  async function drawRouteToSelectedShop(shop) {
    if (!userPos || !shop) {
      console.warn("Missing userPos or shop for routing", userPos, shop);
      return;
    }
    setRoute(null);
    setOsrmInfo(null);
    setRouteLoading(true);

    const start = { lat: userPos[0], lng: userPos[1] };
    const end = { lat: shop.lat, lng: shop.lng };

    let lastError = null;

    for (const base of OSRM_BASES) {
      const url = `${base}/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full&geometries=geojson&steps=false`;
      try {
        const res = await fetch(url);
        const json = await res.json();

        // safe logging
        console.log("OSRM response from", base, json?.code);

        if (json && json.routes && json.routes.length > 0) {
          const coords = json.routes[0].geometry.coordinates.map((c) => [c[1], c[0]]);
          setRoute(coords);

          console.log("Route set successfully with", coords.length, "coordinates");

          setOsrmInfo({
            distance: json.routes[0].distance ? `${(json.routes[0].distance / 1000).toFixed(2)} km` : null,
            duration: json.routes[0].duration ? `${Math.ceil(json.routes[0].duration / 60)} min` : null,
          });

          setRouteLoading(false);
          // open side modal and set selection
          setSelectedShop(shop);
          setModalOpen(true);

          // fit map bounds if map instance available
          try {
            if (mapInstance && coords && coords.length > 0) {
              mapInstance.fitBounds(coords, { padding: [50, 50] });
            }
          } catch (e) {
            console.warn("fitBounds failed:", e);
          }

          return;
        } else {
          lastError = new Error("No routes");
        }
      } catch (e) {
        lastError = e;
        console.warn("OSRM fetch failed for base", base, e);
        // try next base
      }
    }

    setRouteLoading(false);
    setRoute(null);
    setOsrmInfo(null);
    alert("Gagal mengambil rute. Coba lagi nanti.");
    console.error("OSRM errors:", lastError);
  }

  /* open side modal */
  function openSideModal(shop) {
    console.log("openSideModal called for:", shop && shop.name);
    setSelectedShop(shop);
    setModalOpen(true);
    // do not reset route here; user might want to keep route visible
    // fetch more details from backend when not in dev mode
    if (!devMode && shop && shop.id) {
      fetchShopDetail(shop.id);
    }
  }

  /* fetch full shop detail (menus, images) from backend and merge into selectedShop */
  async function fetchShopDetail(shopId) {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await fetch(`${API}/api/buyer/shop/${shopId}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      const text = await res.text();
      let json = null;
      try {
        json = text ? JSON.parse(text) : {};
        setShopRawResponse(null);
      } catch (parseErr) {
        console.warn("Failed to parse shop detail JSON, response text:", text);
        json = null;
        setShopRawResponse(text);
      }

      console.log("Shop detail raw:", text);
      console.log("Shop detail parsed:", json);
      if (!res.ok) return;
      if (json === null) {
        // keep modal open but show raw response in modal
        return;
      }

      // normalize detail structure to match UI
      const detail = {
        id: json.id,
        name: json.name,
        description: json.description,
          // Ensure absolute URL for profile_image using helper
          profile_image: normalizeImageUrl(json.profile_image),
        is_live: json.is_live ?? true,
        distance: selectedShop?.distance ?? null,
        whatsapp: json.whatsapp_number ?? selectedShop?.whatsapp ?? null,
        menus: Array.isArray(json.menus)
          ? json.menus.map((m) => ({
              id: m.id,
              name: m.name,
              price: m.price,
                // Ensure absolute URL for menu images using helper
                image: normalizeImageUrl(m.image),
            }))
          : selectedShop?.menus ?? [],
      };

      setSelectedShop((prev) => ({ ...(prev || {}), ...detail }));
    } catch (e) {
      console.warn("Failed fetching shop detail:", e);
    }
  }

  /* open photo modal (center) */
  function openPhotoModal(shop) {
    setPhotoModal(shop);
  }

  /* close both modals helpers */
  function closeSideModal() {
    setModalOpen(false);
    setSelectedShop(null);
    // don't clear route here; let user clear manually if needed
  }
  function closePhotoModal() {
    setPhotoModal(null);
  }

  /* small placeholder for shop images */
  const placeholderImage = "/marker-icon.png"; // replace with nicer placeholder if available

  /* Render */
  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* LEFT PANEL */}
      <div className="w-[360px] min-w-[300px] bg-white border-r overflow-auto p-5">
        {devMode && (
          <div style={{ position: 'relative' }}>
            {/* Very hidden dev-mode toggle: tiny, near-invisible clickable area */}
            <button
              title="Dev mode toggle (hidden)"
              aria-label="Dev mode toggle"
              onClick={() => {
                const next = !devMode;
                setDevMode(next);
                localStorage.setItem('developer_mode', next ? '1' : '0');
              }}
              style={{
                position: 'absolute',
                top: 6,
                left: 6,
                width: 12,
                height: 12,
                padding: 0,
                margin: 0,
                border: 'none',
                background: '#000',
                opacity: 0.03,
                borderRadius: 2,
                cursor: 'pointer',
              }}
            />
          </div>
        )}

        {/* Raw server response banner for debugging when JSON parse fails */}
        {mapRawResponse && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="font-semibold">Server returned non-JSON response</div>
                <div className="text-xs text-red-600 mt-1">This is the raw response body returned by <code>/api/buyer/map</code>. It may be an HTML error page or other text.</div>
                <pre className="mt-2 max-h-40 overflow-auto bg-white p-2 rounded text-xs text-gray-800">{mapRawResponse}</pre>
              </div>
              <div>
                <button onClick={() => setMapRawResponse(null)} className="text-sm text-red-600 underline">Close</button>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-lg">🧭</div>
          <div>
            <div className="text-sm text-gray-600">Pembeli</div>
            <div className="font-semibold text-lg text-gray-900">{user?.fullname || 'Temukan Penjual Sekitar'}</div>
          </div>
        </div>

        {/* Weather & Recommendation */}
        <div className="mb-4 p-3 bg-gray-50 rounded-2xl">
          {loadingApis && (
            <div className="mb-2 text-sm text-blue-600 animate-pulse">⏳ Memuat data...</div>
          )}
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="text-xs text-gray-600">Cuaca</div>
              <div className="font-semibold text-gray-900" id="weatherDisplay">{weather}</div>
              {weatherData && (
                <div className="text-xs text-gray-600 mt-1">
                  {weatherData.temperature}°C, {weatherData.humidity}% humidity
                </div>
              )}
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-600">Rekomendasi</div>
              {aiRecommendation ? (
                <div className="font-semibold text-orange-600">{aiRecommendation.recommendation}</div>
              ) : (
                <div className="font-semibold text-orange-600">-</div>
              )}
              {aiRecommendation && (
                <div className="text-xs text-gray-600 mt-1">
                  @ {aiRecommendation.shop_name}
                </div>
              )}
            </div>
          </div>
          <div className="text-xs text-gray-700">
            {aiRecommendation ? aiRecommendation.reason : "Memuat rekomendasi..."}
          </div>
        </div>

        {/* Search */}
        <div className="mb-4">
          <label className="text-xs text-gray-600">Cari makanan / toko</label>
          <div className="flex gap-2 mt-2">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari: bakso, nasi goreng, cilok..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button onClick={() => {}} className="px-3 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700">Cari</button>
          </div>
        </div>

        <div className="flex items-center justify-between mb-2">
          <h3 className="font-bold text-gray-900">Pedagang Terdekat</h3>
          <div className="text-xs text-gray-600">{filteredShops.length} hasil</div>
        </div>

        {loadingShops && <div className="text-sm text-gray-600 mb-2">Memuat pedagang...</div>}
        {/* Authentication hint when no token */}
        {!token && (
          <div className="mb-3 p-2 bg-gray-50 border border-gray-200 rounded text-sm text-gray-700">
            Anda belum login — silakan masuk untuk melihat daftar penjual.
            <div className="mt-1">
              <a href="/user/login" className="text-sm text-blue-600 underline">Masuk</a>
            </div>
          </div>
        )}
        {error && <div className="text-sm text-red-600 mb-2">{error}</div>}

        <div className="space-y-3">
          {filteredShops.length === 0 && !loadingShops ? <div className="text-sm text-amber-700">Tidak ada pedagang terdekat.</div> : null}

          {filteredShops.map((s) => (
            <div
              key={s.id}
              className="p-3 bg-white rounded-2xl border hover:shadow cursor-pointer flex gap-3 items-start"
              onClick={() => {
                // quick debug log without introducing undefined variables
                console.log("Shop clicked:", s.name);
                openSideModal(s);
              }}
            >
                <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center text-xl overflow-hidden">
                <img
                  src={s.profile_image || placeholderImage}
                  alt={s.name}
                  className="w-full h-full object-cover rounded-lg"
                  onError={(e) => {
                    try {
                      if (s.profile_image) {
                        console.error(`🖼️ Image failed to load for "${s.name}": ${s.profile_image}`);
                        setFailedImages(prev => new Set(prev).add(s.profile_image));
                      }
                      // replace broken image with placeholder
                      e.currentTarget.src = placeholderImage;
                    } catch (err) {
                      console.warn('Image onError handler failed', err);
                    }
                  }}
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold text-gray-900">{s.name || 'Unnamed Shop'}</div>
                    <div className="text-xs text-gray-600">{s.description || 'Tidak ada deskripsi'}</div>
                  </div>
                  <div className="text-right">
                    <div className={`text-xs font-semibold ${s.is_live ? "text-green-600" : "text-red-500"}`}>
                      {s.is_live ? "ONLINE" : "OFFLINE"}
                    </div>
                    <div className="text-xs text-gray-600">{s.distance || '—'}</div>
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-600">
                  {s.menus && Array.isArray(s.menus) && s.menus.length > 0 ? (
                    s.menus.slice(0, 2).map((m) => (
                      <span key={m.id} className="inline-block mr-2 px-2 py-1 bg-gray-100 rounded-md">{m.name}</span>
                    ))
                  ) : (
                    <span className="text-gray-400 text-xs">Tidak ada menu info</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MAP PANEL */}
      <div className="flex-1 relative">
        {/* Logout button - top right corner */}
        <div className="absolute top-4 right-4 z-500">
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 shadow-md font-semibold text-sm"
          >
            Logout
          </button>
        </div>

        {userPos && leafletLoaded ? (
          <MapContainer
            center={userPos}
            zoom={15}
            style={{ height: "100%", width: "100%" }}
            whenCreated={(map) => setMapInstance(map)}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {/* user marker */}
            <Marker position={userPos}>
              <Popup>Lokasi Anda</Popup>
            </Marker>

            {/* shop markers */}
            {filteredShops.map((s) => (
              <Marker
                key={s.id}
                position={[s.lat, s.lng]}
                eventHandlers={{
                  click: () => {
                    openPhotoModal(s);
                  },
                }}
              >
                <Popup>
                  <div className="min-w-[140px]">
                    <div className="font-semibold">{s.name}</div>
                    <div className="text-xs text-gray-500">{s.is_live ? "ONLINE" : "OFFLINE"}</div>
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* route polyline: use pathOptions so color & weight apply reliably */}
            {route && route.length > 0 && (
              <Polyline 
                positions={route} 
                pathOptions={{ color: "blue", weight: 4, opacity: 0.7 }}
              />
            )}
          </MapContainer>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-600">Memuat peta...</div>
        )}

        {/* SIDE MODAL (slide from right) */}
        {modalOpen &&
          createPortal(
            <div className="fixed inset-0" style={{ zIndex: 1000 }}>
              {/* overlay */}
              <div className="absolute inset-0 bg-black/30" onClick={closeSideModal} style={{ zIndex: 1000 }} />
              {/* sliding panel - use inline style for transform and zIndex to avoid tailwind/stacking issues */}
              <div
                role="dialog"
                aria-modal="true"
                className="absolute right-0 top-0 h-full w-[420px] max-w-[92%] bg-white shadow-2xl"
                style={{
                  zIndex: 1010,
                  transform: modalOpen ? "translateX(0)" : "translateX(100%)",
                  transition: "transform 280ms ease-in-out",
                }}
              >
                <div className="p-4 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-3">
                    <button onClick={closeSideModal} className="text-sm text-gray-600">← Kembali</button>
                    <div className="text-xs text-gray-500">Detail Penjual</div>
                  </div>

                  <div className="overflow-auto">
                    {selectedShop ? (
                      <>
                        <div className="w-full h-36 bg-gray-100 rounded-lg mb-3 overflow-hidden">
                          <img
                            src={selectedShop.profile_image || placeholderImage}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              try {
                                if (selectedShop.profile_image) setFailedImages(prev => new Set(prev).add(selectedShop.profile_image));
                                e.currentTarget.src = placeholderImage;
                              } catch (err) {
                                console.warn('Shop detail image onError failed', err);
                              }
                            }}
                          />
                        </div>

                        {/* If shop detail returned non-JSON, show raw response for debugging */}
                        {shopRawResponse && (
                          <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-semibold">Shop detail non-JSON response</div>
                                <div className="text-xs">Response from <code>/api/buyer/shop/{selectedShop?.id}</code>:</div>
                              </div>
                              <button onClick={() => setShopRawResponse(null)} className="text-sm underline">Close</button>
                            </div>
                            <pre className="mt-2 max-h-40 overflow-auto bg-white p-2 rounded text-xs text-gray-800">{shopRawResponse}</pre>
                          </div>
                        )}

                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h2 className="text-lg font-bold text-gray-900">{selectedShop.name}</h2>
                            <div className="text-xs text-gray-600">{selectedShop.description}</div>
                            <div className="mt-2 text-xs">
                              <span className={`px-2 py-1 rounded-md text-xs ${selectedShop.is_live ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                                {selectedShop.is_live ? "ONLINE" : "OFFLINE"}
                              </span>
                              <span className="ml-2 text-gray-500 text-xs">{selectedShop.distance}</span>
                            </div>
                          </div>

                          {selectedShop.whatsapp && (
                            <a
                              href={`https://wa.me/${selectedShop.whatsapp.replace(/\D/g, "")}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-green-600 ml-2"
                            >
                              {/* small WA icon */}
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M20.52 3.48A11.75 11.75 0 0 0 3.48 20.52l-1.3 4.75 4.9-1.28A11.75 11.75 0 1 0 20.52 3.48zM12 20.5a8.5 8.5 0 1 1 8.5-8.5A8.51 8.51 0 0 1 12 20.5z"/>
                                <path d="M16.48 14.97c-.22-.11-1.3-.64-1.5-.71-.2-.07-.35-.11-.5.11s-.57.71-.7.86c-.13.14-.27.16-.5.06-.22-.11-.93-.34-1.77-1.09-.65-.58-1.09-1.3-1.22-1.52-.13-.22-.01-.34.1-.45.1-.1.22-.27.33-.4.11-.14.15-.24.22-.4.07-.17.03-.31-.02-.43-.06-.11-.5-1.2-.68-1.64-.18-.43-.36-.37-.5-.38l-.43-.01c-.14 0-.37.05-.56.27-.19.22-.73.72-.73 1.76s.75 2.05.86 2.19c.11.14 1.5 2.36 3.64 3.31 2.14.95 2.14.64 2.53.6.39-.05 1.3-.53 1.48-1.04.18-.52.18-.96.13-1.05-.05-.09-.19-.15-.41-.26z" />
                              </svg>
                            </a>
                          )}
                        </div>

                        <div className="mt-4">
                          <h4 className="font-semibold mb-2">Menu</h4>
                          <div className="grid grid-cols-2 gap-2">
                            {selectedShop.menus && Array.isArray(selectedShop.menus) && selectedShop.menus.length > 0 ? (
                              selectedShop.menus.map((m) => (
                                <div key={m.id} className="p-3 bg-gray-50 rounded-xl">
                                  <div className="font-medium text-sm">{m.name || 'Menu Item'}</div>
                                  <div className="text-xs text-gray-600">Rp {typeof m.price === 'number' ? m.price.toLocaleString('id-ID') : m.price}</div>
                                </div>
                              ))
                            ) : (
                              <div className="col-span-2 text-xs text-gray-500 text-center py-2">Tidak ada menu</div>
                            )}
                          </div>
                        </div>

                        <div className="mt-5 space-y-2">
                          <button
                            onClick={() => {
                              // stop propagation just in case
                              drawRouteToSelectedShop(selectedShop);
                            }}
                            className="w-full bg-black text-white py-3 rounded-xl"
                          >
                            {routeLoading ? "Menghitung rute..." : "Kejar Sekarang (Navigasi)"}
                          </button>

                          {osrmInfo && (
                            <div className="text-xs text-gray-600">
                              {osrmInfo.distance && <div>Jarak: {osrmInfo.distance}</div>}
                              {osrmInfo.duration && <div>Perkiraan waktu: {osrmInfo.duration}</div>}
                            </div>
                          )}

                          <button
                            onClick={() => window.alert("Buka halaman toko (placeholder)")}
                            className="w-full border border-gray-200 py-2 rounded-xl"
                          >
                            Lihat Toko
                          </button>
                        </div>
                      </>
                    ) : (
                      <div>Loading...</div>
                    )}
                  </div>
                </div>
              </div>
            </div>,
            document.getElementById("modal-root")
          )}

        {/* PHOTO CENTER MODAL (when clicking a marker) */}
        {photoModal &&
          createPortal(
            <div className="fixed inset-0 z-60 flex items-center justify-center">
              <div className="absolute inset-0 bg-black/40" onClick={closePhotoModal} />
              <div className="relative bg-white rounded-xl shadow-xl w-[90%] max-w-md p-4 z-50">
                <button onClick={closePhotoModal} className="absolute top-3 right-3 text-gray-600">✕</button>

                <div className="w-full h-56 bg-gray-100 rounded-lg overflow-hidden mb-3">
                  <img
                    src={photoModal?.profile_image || placeholderImage}
                    alt={photoModal?.name}
                    className="object-cover w-full h-full"
                    onError={(e) => {
                      try {
                        if (photoModal?.profile_image) setFailedImages(prev => new Set(prev).add(photoModal.profile_image));
                        e.currentTarget.src = placeholderImage;
                      } catch (err) {
                        console.warn('Photo modal image onError failed', err);
                      }
                    }}
                  />
                </div>

                <h3 className="text-lg font-bold text-gray-900">{photoModal?.name}</h3>
                <p className="text-xs text-gray-600">{photoModal?.description}</p>

                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => {
                      openSideModal(photoModal);
                      closePhotoModal();
                    }}
                    className="flex-1 py-2 bg-blue-600 text-white rounded-lg"
                  >
                    Detail Toko
                  </button>

                  <button
                    onClick={() => {
                      drawRouteToSelectedShop(photoModal);
                      closePhotoModal();
                    }}
                    className="py-2 px-3 border rounded-lg"
                  >
                    {routeLoading ? "Menghitung..." : "Kejar"}
                  </button>
                </div>
              </div>
            </div>,
            document.getElementById("modal-root")
          )}
      </div>
    </div>
  );
}
