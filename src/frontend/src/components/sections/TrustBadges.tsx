import { Cloud, Lock, Server, ShieldCheck } from "lucide-react";
import { useRef } from "react";
import { useScrollReveal } from "../../hooks/useScrollReveal";

const badges = [
  { icon: ShieldCheck, title: "Google Verified", sub: "Identity protection" },
  { icon: Lock, title: "Razorpay Secure", sub: "Encrypted payments" },
  { icon: Cloud, title: "Cloudflare Security", sub: "DDoS protection" },
  { icon: Server, title: "AWS Infrastructure", sub: "99.9% uptime" },
];

export default function TrustBadges() {
  const sectionRef = useRef<HTMLDivElement>(null);
  useScrollReveal(sectionRef);

  return (
    <section className="py-12 px-4">
      <div className="max-w-xl mx-auto">
        <div className="grid grid-cols-2 gap-3">
          {badges.map(({ icon: Icon, title, sub }, i) => (
            <div
              key={title}
              className={`reveal reveal-delay-${i + 1} card-premium rounded-2xl p-4 flex items-center gap-3 hover:border-yellow/20 hover:border transition-all`}
              ref={i === 0 ? sectionRef : undefined}
            >
              <div className="w-10 h-10 rounded-xl bg-yellow/10 border border-yellow/20 flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-yellow" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate">{title}</p>
                <p className="text-[10px] text-white/40 truncate">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
