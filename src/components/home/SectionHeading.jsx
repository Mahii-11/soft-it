import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function SectionHeading({ title, to, children }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <h2 className="font-sans text-lg font-bold text-neutral-900 md:text-xl">{title}</h2>
        {children}
      </div>
      {to && (
        <Link
          to={to}
          aria-label={`View all ${title}`}
          className="flex h-8 w-8 items-center justify-center rounded-full bg-[#ea5b3a] text-white transition hover:bg-[#d44a2a]"
        >
          <ArrowRight size={16} />
        </Link>
      )}
    </div>
  );
}
