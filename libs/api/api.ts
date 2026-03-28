import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from "axios";
import { ApiError, ApiErrorPayload } from "@/types/api";

// 1. The Base Config
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3001";
const LOCALE_COOKIE_NAME = "NEXT_LOCALE"; // Standard for next-intl

// 2. Client-Side Singletons per plugin (Reuse to keep interceptors alive)
const clientInstances: Record<string, AxiosInstance> = {};

function toApiErrorPayload(
  input: unknown,
  statusCode?: number,
): ApiErrorPayload {
  // Preferred backend format: { error: string, hint: string[] }
  if (input && typeof input === "object") {
    const obj: any = input;

    if (typeof obj.error === "string" && Array.isArray(obj.hint)) {
      const payload = {
        error: obj.error,
        hint: obj.hint.map((x: any) => String(x)),
        statusCode: obj.statusCode ?? statusCode,
      };
      return payload;
    }

    // NestJS common shapes:
    // { statusCode: number, message: string | string[], error: string }
    if (Array.isArray(obj.message)) {
      return {
        error: typeof obj.error === "string" ? obj.error : "Validation error",
        hint: obj.message.map((x: any) => String(x)),
        statusCode: obj.statusCode ?? statusCode,
      };
    }
    if (typeof obj.message === "string") {
      return {
        error: obj.message,
        hint: Array.isArray(obj.hint)
          ? obj.hint.map((x: any) => String(x))
          : [],
        statusCode: obj.statusCode ?? statusCode,
      };
    }

    // Fallback to { error } if present
    if (typeof obj.error === "string") {
      return {
        error: obj.error,
        hint: Array.isArray(obj.hint)
          ? obj.hint.map((x: any) => String(x))
          : [],
        statusCode: obj.statusCode ?? statusCode,
      };
    }
  }

  if (typeof input === "string") {
    return { error: input, hint: [], statusCode };
  }

  return { error: "Something went wrong!", hint: [], statusCode };
}

// --- Helper for Client-Side Cookies ---
function getClientCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift();
  return undefined;
}

export async function api<T = any>(
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
  url: string,
  data?: any,
  config: AxiosRequestConfig & {
    plugin?: "plugin" | "core" | "storage" | "master" | "master-data-rp" | "rp";
  } = {},
): Promise<T> {
  const isServer = typeof window === "undefined";

  const headers: any = {
    "x-api-key": String(process.env.NEXT_PUBLIC_X_API_KEY),
    "x-internal-secret": String(process.env.NEXT_PUBLIC_INTERNAL_SECRET),
    // ในอนาคตควรดึงจาก Session แต่ตอนนี้ใส่เป็นค่าคงที่
    "x-user-id": "da7a08f9-fe75-4ada-b84a-93ca1c92cf8d",
    "x-organization-id": "5ede57b4-034e-4af0-82e9-d865b32dd544",
    ...(config.headers || {}),
  };
  const configWithPlugin = { ...config, plugin: config.plugin || "plugin" };
  const pluginKey = configWithPlugin.plugin;
  let instance: AxiosInstance;

  let baseUrl = BASE_URL;
  switch (pluginKey) {
    case "plugin":
      baseUrl = `${BASE_URL}/api/plugins`;
      break;
    case "core":
      baseUrl = `${BASE_URL}/api`;
      break;
    case "storage":
      baseUrl = `${BASE_URL}/api/storage`;
      break;
    case "master":
      baseUrl = `${BASE_URL}/api/master`;
      break;
    case "master-data-rp":
      baseUrl = `${BASE_URL}/api/rp/master-data`;
      break;
    case "rp":
      baseUrl = `${BASE_URL}/api/rp`;
      break;
    default:
      baseUrl = `${BASE_URL}/api`;
      break;
  }

  // ---------------------------------------------------------------------------
  // STRATEGY A: SERVER SIDE (RSC / Server Actions)
  // ---------------------------------------------------------------------------
  if (isServer) {
    // Dynamic import to prevent "Module not found" errors in the browser bundle
    const { cookies, headers: nextHeaders } = await import("next/headers");
    const cookieStore = await cookies();
    const headersList = await nextHeaders();

    // 1. Grab cookies (Session Token)
    const allCookies = cookieStore
      .getAll()
      .map((c) => `${c.name}=${c.value}`)
      .join("; ");
    // 2. Attach Cookies
    headers.Cookie = allCookies;

    const locale =
      cookieStore.get(LOCALE_COOKIE_NAME)?.value ||
      headersList.get("accept-language") ||
      "th";

    headers["Accept-Language"] = locale;
    // Create a fresh instance for every server request (Stateless)
    instance = axios.create({
      baseURL: baseUrl,
      headers,
      withCredentials: true,
    });
  }

  // ---------------------------------------------------------------------------
  // STRATEGY B: CLIENT SIDE (Browser)
  // ---------------------------------------------------------------------------
  else {
    // Get or create instance for this specific plugin
    if (!clientInstances[pluginKey]) {
      clientInstances[pluginKey] = axios.create({
        baseURL: baseUrl,
        headers,
        withCredentials: true, // Browser handles cookies automatically
      });

      // Add Interceptors only once per plugin instance
      clientInstances[pluginKey].interceptors.request.use((cfg) => {
        // 2. Attach Language
        // Helper to read cookie on client side
        const locale =
          getClientCookie(LOCALE_COOKIE_NAME) || navigator.language || "th";
        cfg.headers["Accept-Language"] = locale;
        return cfg;
      });
    }
    instance = clientInstances[pluginKey];
  }

  // ---------------------------------------------------------------------------
  // EXECUTE REQUEST
  // ---------------------------------------------------------------------------
  try {
    const response = await instance!.request({
      method,
      url,
      data,
      ...configWithPlugin,
    });
    return response.data;
  } catch (error: unknown) {
    const axiosError = error as AxiosError;
    const status = axiosError.response?.status;
    const payload = toApiErrorPayload(
      axiosError.response?.data ??
        axiosError.message ??
        "Unknown error occurred",
      status,
    );
    throw new ApiError(payload);
  }
}
