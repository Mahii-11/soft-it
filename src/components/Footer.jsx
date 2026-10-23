import { Link } from "react-router-dom";
import { ArrowUp, MapPin } from "lucide-react";

const columns = [
  {
    title: "About Us",
    links: [
      { label: "Regarding Us", to: "#" },
      { label: "Terms and Conditions", to: "#" },
      { label: "Track My Order", to: "/dashboard" },
      { label: "Career", to: "#" },
    ],
  },
  {
    title: "Policy",
    links: [
      { label: "Delivery Policy", to: "#" },
      { label: "Return Policy", to: "#" },
      { label: "Refund Policy", to: "#" },
      { label: "Cancellation Policy", to: "#" },
      { label: "Privacy Policy", to: "#" },
      { label: "Warranty Policy", to: "#" },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "Contact Us", to: "/our-location" },
      { label: "Exchange", to: "#" },
      { label: "Announcement", to: "#" },
      { label: "Bank Transfer", to: "#" },
      { label: "FAQ", to: "#" },
    ],
  },
];

const payments = ["VISA", "MC", "AMEX", "bKash", "Nagad"];

export default function Footer() {
  return (
    <footer className="bg-[#26282d] text-white">
      <div className="container-custom grid gap-8 py-8 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1.4fr]">
        {columns.map((column) => (
          <div key={column.title}>
            <h4 className="mb-3 font-sans text-sm font-bold uppercase text-[#ea5b3a]">{column.title}</h4>
            <ul className="space-y-2 text-xs">
              {column.links.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="transition-colors hover:text-[#ea5b3a]">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className="lg:text-right">
          <h4 className="mb-3 font-sans text-sm font-bold uppercase text-[#ea5b3a]">Stay Connected</h4>
          <p className="text-xs font-bold">GadgetGlobe Ltd.</p>
          <p className="mt-2 text-xs">support@gadgetglobe.com</p>
          <p className="mt-1 text-xs">+1 (555) 123-4567</p>
          <Link
            to="/our-location"
            className="mt-4 inline-flex items-center gap-1.5 rounded bg-[#ea5b3a] px-3 py-1.5 text-xs font-semibold transition hover:bg-[#d44a2a]"
          >
            <MapPin size={13} /> Store Location
          </Link>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-custom flex flex-col items-center justify-between gap-3 py-3 text-[11px] text-[#ea5b3a] sm:flex-row">
          <p>© {new Date().getFullYear()} GadgetGlobe All rights reserved</p>

          <div className="flex gap-1.5">
            {payments.map((name) => (
              <span
                key={name}
                className="rounded bg-white px-1.5 py-0.5 text-[9px] font-bold text-neutral-700"
              >
                {name}
              </span>
            ))}
          </div>

          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="inline-flex items-center gap-1.5 font-bold uppercase"
          >
            Scroll to top
            <span className="flex h-4 w-4 items-center justify-center rounded-full border border-[#ea5b3a]">
              <ArrowUp size={10} />
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
}
