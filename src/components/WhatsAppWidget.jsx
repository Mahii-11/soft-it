import { useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { X } from "lucide-react";

// Replace the placeholder number with the real WhatsApp number (digits only, with country code).
const PHONE = "15551234567";
const DEFAULT_MESSAGE = "Hello! I need help with a product.";

export default function WhatsAppWidget() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState(DEFAULT_MESSAGE);

  const send = (e) => {
    e.preventDefault();
    const text = encodeURIComponent(message.trim() || DEFAULT_MESSAGE);
    window.open(`https://wa.me/${PHONE}?text=${text}`, "_blank", "noopener,noreferrer");
    setOpen(false);
  };

  return (
    <div className="fixed bottom-24 right-4 z-40 flex flex-col items-end gap-3 lg:bottom-6 lg:right-6">
      {open && (
        <form
          onSubmit={send}
          className="w-72 overflow-hidden rounded-2xl bg-white shadow-[0_8px_30px_rgba(0,0,0,0.25)]"
        >
          <div className="flex items-center justify-between bg-[#25D366] px-4 py-3 text-white">
            <div className="flex items-center gap-2">
              <FaWhatsapp className="h-6 w-6" />
              <div className="leading-tight">
                <p className="text-sm font-bold">Chat with us</p>
                <p className="text-[11px] opacity-90">We usually reply within minutes</p>
              </div>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close chat">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="bg-[#efeae2] p-4">
            <div className="max-w-[85%] rounded-lg rounded-tl-none bg-white px-3 py-2 text-xs text-neutral-800 shadow-sm">
              Hi there! How can we help you today?
            </div>
          </div>

          <div className="flex items-center gap-2 border-t border-neutral-100 p-3">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              className="min-w-0 flex-1 rounded-full border border-neutral-200 px-3 py-2 text-xs outline-none focus:border-[#25D366]"
            />
            <button
              type="submit"
              className="rounded-full bg-[#25D366] px-4 py-2 text-xs font-semibold text-white transition hover:bg-[#1ebe5a]"
            >
              Send
            </button>
          </div>
        </form>
      )}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Chat on WhatsApp"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition hover:scale-105 active:scale-95"
      >
        {open ? <X className="h-6 w-6" /> : <FaWhatsapp className="h-7 w-7" />}
      </button>
    </div>
  );
}
