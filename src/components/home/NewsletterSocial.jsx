import { useState } from "react";
import { Mail, Facebook, Instagram, Linkedin, Youtube, Twitter } from "lucide-react";

const socials = [
  { icon: Facebook, label: "Facebook", color: "bg-[#1877f2]" },
  { icon: Instagram, label: "Instagram", color: "bg-[#e1306c]" },
  { icon: Linkedin, label: "LinkedIn", color: "bg-[#0a66c2]" },
  { icon: Youtube, label: "YouTube", color: "bg-[#ff0000]" },
  { icon: Twitter, label: "X", color: "bg-black" },
];

export default function NewsletterSocial() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  // No newsletter endpoint exists yet, so this only confirms on the client.
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setDone(true);
    setEmail("");
  };

  return (
    <section className="mt-6 bg-white">
      <div className="container-custom grid gap-8 py-8 md:grid-cols-2 md:gap-0 md:py-10">
        <div className="md:pr-10">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[#ea5b3a] text-[#ea5b3a]">
              <Mail size={18} />
            </span>
            <h2 className="font-sans text-lg font-bold uppercase text-neutral-900">
              Stay <span className="text-[#ea5b3a]">Updated</span>
            </h2>
          </div>
          <p className="mt-3 text-xs text-neutral-600">
            Get the latest offers, new products and exclusive discounts
          </p>

          <form onSubmit={handleSubmit} className="mt-4 flex overflow-hidden rounded border border-neutral-200">
            <div className="flex flex-1 items-center gap-2 px-3">
              <Mail size={14} className="text-neutral-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setDone(false);
                }}
                placeholder="Enter your email"
                className="w-full bg-transparent py-2.5 text-xs outline-none placeholder:text-neutral-400"
              />
            </div>
            <button
              type="submit"
              className="bg-[#ea5b3a] px-5 text-[11px] font-bold uppercase text-white transition hover:bg-[#d44a2a]"
            >
              Subscribe
            </button>
          </form>
          <p className="mt-2 text-[10px] text-neutral-400">
            {done ? "Thanks for subscribing!" : "We respect your privacy. Unsubscribe at any time."}
          </p>
        </div>

        <div className="md:border-l md:border-neutral-100 md:pl-10">
          <h2 className="font-sans text-lg font-bold uppercase leading-tight text-neutral-900">
            Follow us
            <span className="block text-[#ea5b3a]">on social</span>
          </h2>
          <p className="mt-3 text-xs text-neutral-600">
            Follow us on social media and stay connected with the latest updates
          </p>
          <div className="mt-4 flex gap-3">
            {socials.map(({ icon: Icon, label, color }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className={`flex h-8 w-8 items-center justify-center rounded-full text-white transition hover:scale-110 ${color}`}
              >
                <Icon size={14} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
