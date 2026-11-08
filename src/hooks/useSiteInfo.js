import { getSiteSettings, getSocialLinks } from "../services/api";
import useApiData from "./useApiData";

// Footer / Header / WhatsApp এক জায়গা থেকে setting-data ও social-data নেয় (request share হয়)
export default function useSiteInfo() {
  const { data: settings } = useApiData("setting-data", getSiteSettings);
  const { data: socialData } = useApiData("social-data", getSocialLinks);

  // "#" বা খালি link = এখনো সেট করা হয়নি, সেগুলো বাদ
  const socials = (Array.isArray(socialData) ? socialData : []).filter(
    (s) => s?.link && s.link !== "#"
  );

  // wa.me/8801757424191 থেকে শুধু digits (country code সহ)
  const whatsapp = socials.find((s) => /wa\.me|whatsapp/i.test(s.link));
  const whatsappNumber = whatsapp?.link.match(/wa\.me\/(\d+)/i)?.[1] || "";

  // backend phone এখন masked ("018*****") - masked হলে tel: link বানানো যাবে না
  const phone = settings?.phone || "";
  const dialPhone = phone && !phone.includes("*") ? phone.replace(/[^\d+]/g, "") : "";

  return { settings: settings || {}, socials, whatsapp, whatsappNumber, phone, dialPhone };
}
