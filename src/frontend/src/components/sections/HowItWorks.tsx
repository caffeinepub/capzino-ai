import { useRef } from "react";
import { useScrollReveal } from "../../hooks/useScrollReveal";

const steps = [
  {
    num: "01",
    title: "Upload Video",
    desc: "Upload any MP4, MOV or WEBM video from your device or paste a link.",
  },
  {
    num: "02",
    title: "Choose Language",
    desc: "Select Hindi, English or Hinglish — our AI handles the rest.",
  },
  {
    num: "03",
    title: "Generate",
    desc: "Our AI transcribes the audio and creates viral-style timed captions.",
  },
  {
    num: "04",
    title: "Download",
    desc: "Edit styles, choose templates, and export your captioned video.",
  },
];

export default function HowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null);
  useScrollReveal(sectionRef);

  return (
    <section className="py-16 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12 reveal" ref={sectionRef}>
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">
            How It <span className="text-yellow">Works</span>
          </h2>
          <p className="text-sm text-white/50">
            Four simple steps to viral captions.
          </p>
        </div>
        <div className="space-y-6">
          {steps.map(({ num, title, desc }, i) => (
            <div
              key={num}
              className={`reveal reveal-delay-${i + 1} flex items-start gap-5`}
            >
              <div className="w-12 h-12 rounded-full bg-yellow flex items-center justify-center flex-shrink-0 glow-yellow-sm">
                <span className="text-sm font-black text-black">{num}</span>
              </div>
              <div className="pt-1">
                <h3 className="font-bold text-white text-lg mb-1">{title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
