// src/utils/api.js - Centralized API utilities - FIXED

export const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api").replace(/\/$/, "");

/**
 * Lấy token từ localStorage - IMPROVED VERSION
 * Tự động xử lý các format khác nhau và validate JWT
 */
export function getAuthToken() {
  if (typeof window === "undefined") return null;
  
  // Thử các key phổ biến theo thứ tự ưu tiên
  const keys = ["token", "access_token", "jwt", "authToken"];
  
  for (const key of keys) {
    let token = localStorage.getItem(key);
    if (!token) continue;
    
    // Xóa quotes nếu có
    token = token.replace(/^["'](.*)["']$/, "$1").trim();
    
    // Xóa "Bearer " prefix nếu có
    if (token.startsWith("Bearer ")) {
      token = token.slice(7).trim();
    }
    
    // Kiểm tra xem có phải JWT không (3 phần ngăn cách bởi dấu chấm)
    if (token && token.split(".").length === 3) {
      console.log("✅ Found valid token from key:", key);
      return token;
    }
  }
  
  console.warn("⚠️ No valid token found in localStorage");
  return null;
}

/**
 * Tạo headers với Authorization
 */
export function getAuthHeaders() {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * Kiểm tra xem user đã đăng nhập chưa
 */
export function isAuthenticated() {
  return !!getAuthToken();
}

/**
 * Lấy thông tin user từ localStorage
 */
export function getCurrentUser() {
  if (typeof window === "undefined") return null;
  
  try {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
}

/**
 * Cập nhật user và dispatch event
 */
export function updateUserInfo(userData) {
  if (typeof window === "undefined") return;
  
  localStorage.setItem("user", JSON.stringify(userData));
  
  // Dispatch custom event để Header biết cần refresh
  window.dispatchEvent(new Event("userUpdated"));
}

/**
 * Logout - xóa toàn bộ thông tin auth
 */
export function clearAuth() {
  if (typeof window === "undefined") return;
  
  localStorage.removeItem("token");
  localStorage.removeItem("access_token");
  localStorage.removeItem("jwt");
  localStorage.removeItem("user");
  
  // Dispatch event
  window.dispatchEvent(new Event("userUpdated"));
}

/**
 * Fetch helper với auth tự động - IMPROVED VERSION
 */
export async function fetchAPI(endpoint, options = {}) {
  const url = endpoint.startsWith("http") ? endpoint : `${API_URL}${endpoint}`;
  
  const token = getAuthToken();
  
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };
  
  const config = {
    credentials: "include", // ✅ QUAN TRỌNG: Gửi cookies
    ...options,
    headers,
  };
  
  console.log("🔹 Fetching:", url);
  console.log("🔹 Token:", token ? token.substring(0, 20) + "..." : "(none)");
  
  try {
    const response = await fetch(url, config);
    
    // Handle 401 Unauthorized
    if (response.status === 401) {
      console.error("❌ 401 Unauthorized - Token hết hạn hoặc không hợp lệ");
      clearAuth();
      if (typeof window !== "undefined") {
        window.location.href = "/account/login";
      }
      throw new Error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
    }
    
    const data = await response.json().catch(() => ({}));
    
    if (!response.ok) {
      console.error("❌ API Error:", response.status, data);
      throw new Error(data?.message || `HTTP Error: ${response.status}`);
    }
    
    console.log("✅ API Success:", url);
    return data;
  } catch (error) {
    if (error.message.includes("Failed to fetch") || error.message.includes("ERR_CONNECTION_REFUSED")) {
      console.error("❌ Không thể kết nối đến server. Hãy đảm bảo backend đang chạy ở", API_URL);
      throw new Error("Không thể kết nối đến server. Vui lòng kiểm tra lại!");
    }
    console.error("❌ API Error:", error);
    throw error;
  }
}

/**
 * Upload file helper - IMPROVED VERSION
 */
export async function uploadFile(endpoint, file, fieldName = "file") {
  const token = getAuthToken();
  if (!token) {
    throw new Error("Vui lòng đăng nhập!");
  }
  
  const formData = new FormData();
  formData.append(fieldName, file);
  
  const url = endpoint.startsWith("http") ? endpoint : `${API_URL}${endpoint}`;
  
  console.log("📤 Uploading file to:", url);
  
  const response = await fetch(url, {
    method: "POST",
    credentials: "include", // ✅ QUAN TRỌNG
    headers: {
      Authorization: `Bearer ${token}`,
      // Không set Content-Type, để browser tự set với boundary
    },
    body: formData,
  });
  
  const data = await response.json().catch(() => ({}));
  
  if (response.status === 401) {
    console.error("❌ Upload failed: 401 Unauthorized");
    clearAuth();
    if (typeof window !== "undefined") {
      window.location.href = "/account/login";
    }
    throw new Error("Phiên đăng nhập đã hết hạn!");
  }
  
  if (!response.ok) {
    console.error("❌ Upload failed:", response.status, data);
    throw new Error(data?.message || `Upload failed: ${response.status}`);
  }
  
  console.log("✅ Upload successful");
  return data;
}
