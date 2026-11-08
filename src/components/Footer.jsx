import { Link } from "react-router-dom";
import { ArrowUp, Mail, MapPin, Phone } from "lucide-react";
import {
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaWhatsapp,
  FaLinkedin,
  FaTiktok,
  FaTelegram,
  FaGlobe,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import useSiteInfo from "../hooks/useSiteInfo";

// API এর icon class ("bi bi-facebook", "fab fa-whatsapp-square") থেকে icon বেছে নেওয়া
const SOCIAL_ICONS = [
  ["facebook", FaFacebook, "Facebook"],
  ["instagram", FaInstagram, "Instagram"],
  ["youtube", FaYoutube, "YouTube"],
  ["whatsapp", FaWhatsapp, "WhatsApp"],
  ["linkedin", FaLinkedin, "LinkedIn"],
  ["tiktok", FaTiktok, "TikTok"],
  ["telegram", FaTelegram, "Telegram"],
  ["twitter", FaXTwitter, "X"],
];

function getSocialIcon(iconClass = "") {
  const hit = SOCIAL_ICONS.find(([key]) => iconClass.toLowerCase().includes(key));
  return hit ? { Icon: hit[1], label: hit[2] } : { Icon: FaGlobe, label: "Website" };
}

const usefulLinks = [
  { label: "About Us", to: "#" },
  { label: "Online Delivery", to: "#" },
];

const customerCare = [
  { label: "EMI Policy", to: "#" },
  { label: "Delivery Policy", to: "#" },
  { label: "Refund Policy", to: "#" },
  { label: "Warranty Policy", to: "#" },
  { label: "Get Point Policy", to: "#" },
  { label: "Terms and Conditions", to: "#" },
];

const iconBadge =
  "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#f7931e]/10 text-[#f7931e] ring-1 ring-[#f7931e]/30";

const headingClass = "mb-3 text-sm font-bold uppercase tracking-wide text-white";
const linkClass = "hover:underline underline-offset-2 transition-colors hover:text-[#f7931e]";

export default function Footer() {
  const { settings, socials, phone, dialPhone } = useSiteInfo();

  // setting-data থেকে যেগুলো এসেছে শুধু সেগুলোই দেখানো হয়
  const contacts = [
    settings.address && { Icon: MapPin, content: settings.address },
    phone && { Icon: Phone, content: phone, href: dialPhone ? `tel:${dialPhone}` : undefined },
    settings.email && { Icon: Mail, content: settings.email, href: `mailto:${settings.email}` },
  ].filter(Boolean);

  return (
    <footer className="bg-black pb-20 text-white lg:pb-0">
      <div className="container-custom grid gap-6 py-6 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.4fr]">
        {/* Brand */}
        <div>
          <img
            src={settings.logo || "/images/logo.png"}
            alt="Gadget Globe"
            className="h-auto w-24"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "/images/logo.png";
            }}
          />
          {settings.site_description && (
            <p className="mt-3 max-w-[16rem] text-xs leading-5 text-white/80">
              {settings.site_description}
            </p>
          )}

          {socials.length > 0 && (
            <>
              <h4 className="mb-3 mt-5 text-sm font-bold uppercase tracking-wide">Follow Us</h4>
              <div className="flex items-center gap-2">
                {socials.map((s) => {
                  const { Icon, label } = getSocialIcon(s.icon);
                  return (
                    <a
                      key={s.id}
                      href={s.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className={iconBadge + " transition-colors hover:bg-[#f7931e] hover:text-black"}
                    >
                      <Icon size={14} />
                    </a>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Useful Links */}
        <div>
          <h4 className={headingClass}>Useful Links</h4>
          <ul className="space-y-2.5 text-xs leading-5 text-white/80">
            {usefulLinks.map((link) => (
              <li key={link.label}>
                <Link to={link.to} className={linkClass}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Customer Care */}
        <div>
          <h4 className={headingClass}>Customer Care</h4>
          <ul className="space-y-2.5 text-xs leading-5 text-white/80">
            {customerCare.map((link) => (
              <li key={link.label}>
                <Link to={link.to} className={linkClass}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Us */}
        <div id="contact-us">
          <h4 className={headingClass}>Contact Us</h4>
          <ul className="space-y-3 text-xs leading-5 text-white/80">
            {contacts.map(({ Icon, content, href }) => (
              <li key={content} className="flex items-start gap-3">
                <span className={iconBadge}>
                  <Icon size={14} strokeWidth={2} />
                </span>
                {href ? (
                  <a href={href} className="pt-1 transition-colors hover:text-[#f7931e]">
                    {content}
                  </a>
                ) : (
                  <span className="pt-1">{content}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-custom flex flex-col items-center justify-between gap-3 py-3 text-[11px] text-[#f7931e] sm:flex-row">
          <p>{settings.copyright || `© ${new Date().getFullYear()} Gadget Globe. All rights reserved.`}</p>

          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="inline-flex items-center gap-1.5 font-bold uppercase"
          >
            Scroll to top
            <span className="flex h-4 w-4 items-center justify-center rounded-full border border-[#f7931e]">
              <ArrowUp size={10} />
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
}
