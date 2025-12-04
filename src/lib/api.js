// src/lib/api.js

export const API_BASE = "http://localhost:8000"; // sesuaikan dengan backendmu

export async function postData(url, data, token = null) {
  try {
    const response = await fetch(`${API_BASE}${url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      credentials: "include", // jika pakai sanctum (opsional)
      body: JSON.stringify(data),
    });

    const res = await response.json();

    return {
      ok: response.ok,
      status: response.status,
      data: res,
    };
  } catch (err) {
    return {
      ok: false,
      status: 500,
      data: { message: "Network error", error: err.message },
    };
  }
}

// GET request (ambil user, seller dashboard, dll)
export async function getData(url, token) {
  try {
    const response = await fetch(`${API_BASE}${url}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const res = await response.json();

    return {
      ok: response.ok,
      status: response.status,
      data: res,
    };
  } catch (err) {
    return {
      ok: false,
      status: 500,
      data: { message: "Network error", error: err.message },
    };
  }
}