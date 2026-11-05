import { Link } from "react-router-dom";
import { ArrowUp, Mail, MapPin, Phone } from "lucide-react";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

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

const socials = [
  { label: "Facebook", href: "#", Icon: FaFacebook },
  { label: "Instagram", href: "#", Icon: FaInstagram },
  { label: "YouTube", href: "#", Icon: FaYoutube },
  { label: "X", href: "#", Icon: FaXTwitter },
];

const headingClass = "mb-5 text-xl font-bold text-white";
const linkClass = "underline underline-offset-2 transition-colors hover:text-[#f7931e]";

export default function Footer() {
  return (
    <footer className="bg-black pb-20 text-white lg:pb-0">
      <div className="container-custom grid gap-10 py-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1.1fr_1.4fr]">
        {/* Brand */}
        <div>
          <img src="/images/logo.png" alt="Gadget Globe" className="h-auto w-44" />
          <p className="mt-6 text-sm font-semibold leading-snug">
            Your one-stop destination
            <br />
            for premium electronics and gadgets.
            <br />
            Quality guaranteed, fast delivery.
          </p>

          <h4 className="mb-3 mt-8 text-lg font-bold">Follow Us:</h4>
          <div className="flex items-center gap-3 text-[#f7931e]">
            {socials.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="transition-opacity hover:opacity-80"
              >
                <Icon size={38} />
              </a>
            ))}
          </div>
        </div>

        {/* Useful Links */}
        <div>
          <h4 className={headingClass}>Useful Links</h4>
          <ul className="space-y-4 text-lg">
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
          <ul className="space-y-4 text-lg">
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
        <div>
          <h4 className={headingClass}>Contact Us</h4>
          <ul className="space-y-6 text-sm font-semibold">
            <li className="flex items-start gap-3">
              <MapPin size={28} className="shrink-0 fill-[#f7931e] text-[#f7931e]" />
              <span>
                Shop No. 35, 3rd Floor,
                <br />
                Rajlaxmi Complex, Uttara,
                <br />
                Dhaka-1230
              </span>
            </li>
            <li className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#f7931e] text-[#f7931e]">
                <Phone size={16} />
              </span>
              <span className="text-xl font-bold">+018*********</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={30} className="shrink-0 fill-[#f7931e] text-black" />
              <a href="mailto:support@gadgetglobe.com">support@gadgetglobe.com</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-custom flex flex-col items-center justify-between gap-3 py-3 text-[11px] text-[#f7931e] sm:flex-row">
          <p>© {new Date().getFullYear()} Gadget Globe. All rights reserved.</p>

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
