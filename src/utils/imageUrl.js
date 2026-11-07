const BACKEND_URL = "https://gadget-backend.gadgetglobe.com.bd/";

// public folder এ default avatar file নেই, তাই inline SVG
export const DEFAULT_AVATAR =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96"><rect width="96" height="96" fill="#e2e8f0"/><circle cx="48" cy="36" r="16" fill="#94a3b8"/><path d="M16 88c0-18 14-30 32-30s32 12 32 30z" fill="#94a3b8"/></svg>`
  );

// API এখন পুরো URL (https://...) পাঠায়; আগে শুধু relative path আসত। দুটোই কাজ করবে।
export function resolveImageUrl(image) {
  if (!image) return DEFAULT_AVATAR;
  if (/^(https?:|blob:|data:)/i.test(image)) return image;
  return BACKEND_URL + image.replace(/^\//, "");
}
