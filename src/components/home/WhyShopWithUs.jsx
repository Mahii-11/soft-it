import { Headset, Gift, Truck, ShieldCheck, BadgeCheck, RefreshCw } from "lucide-react";

const features = [
  { icon: Headset, title: "24/7 Customer Support", text: "Our team is ready around the clock to help with any questions or issues" },
  { icon: Gift, title: "Authentic Products", text: "We sell original products that come from trusted and verified sources" },
  { icon: Truck, title: "Fast Delivery", text: "We deliver your order quickly and safely anywhere in the country" },
  { icon: ShieldCheck, title: "Secure Payment", text: "We protect every transaction with safe and trusted payment systems" },
  { icon: BadgeCheck, title: "Quality Checked", text: "We check every item carefully to make sure it is exactly as described" },
  { icon: RefreshCw, title: "Easy Exchange", text: "Not the right fit? Exchange it with a simple, hassle-free process" },
];

export default function WhyShopWithUs() {
  return (
    <section className="mt-6 bg-white py-8 md:py-10">
      <div className="container-custom grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3 lg:grid-cols-6">
        {features.map(({ icon: Icon, title, text }) => (
          <div key={title} className="flex flex-col items-center text-center">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-[#3e4045] text-white">
              <Icon size={20} />
            </div>
            <h3 className="font-sans text-xs font-bold text-neutral-900">{title}</h3>
            <p className="mt-1 max-w-[170px] text-[11px] leading-4 text-neutral-500">{text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
