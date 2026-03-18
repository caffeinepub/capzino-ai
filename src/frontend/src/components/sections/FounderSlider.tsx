import { useRef } from "react";
import { useScrollReveal } from "../../hooks/useScrollReveal";

export default function FounderSlider() {
  const sectionRef = useRef<HTMLDivElement>(null);
  useScrollReveal(sectionRef);

  return (
    <section className="py-10 px-4">
      <div className="max-w-3xl mx-auto reveal" ref={sectionRef}>
        {/* Outer strip */}
        <div className="bg-[#111] border border-white/10 rounded-full py-3 overflow-hidden relative">
          <div className="relative overflow-hidden">
            <div
              className="flex whitespace-nowrap"
              style={{
                animation: "scrollLeft 15s linear infinite",
              }}
            >
              {/* Inner pill (repeated for seamless loop) */}
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="inline-flex items-center gap-3 mx-8 px-6 py-1.5 rounded-full border border-yellow/40 bg-[#0B0B0B]"
                  style={{ boxShadow: "0 0 12px rgba(245,207,46,0.2)" }}
                >
                  <span className="text-xs sm:text-sm font-black tracking-widest">
                    <span className="text-white">CAPZINO AI</span>{" "}
                    <span className="text-yellow">FOUNDED BY SHIVAM</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
