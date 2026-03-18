import { Download, Palette, Zap } from "lucide-react";
import { useRef } from "react";
import { useScrollReveal } from "../../hooks/useScrollReveal";

const features = [
  {
    icon: Zap,
    title: "AI-Powered Accuracy",
    description:
      "Cutting-edge speech recognition powered by OpenAI Whisper delivers near-perfect Hindi, English and Hinglish transcriptions.",
  },
  {
    icon: Palette,
    title: "Custom Styles",
    description:
      "Choose from 10+ premium subtitle templates, 9 fonts, multiple sizes and positions. Make your captions truly yours.",
  },
  {
    icon: Download,
    title: "Export Options",
    description:
      "Export in 1080x1920 vertical format perfect for Instagram Reels, YouTube Shorts and TikTok. Pro users get no watermark.",
  },
];

export default function Features() {
  const sectionRef = useRef<HTMLDivElement>(null);
  useScrollReveal(sectionRef);

  return (
    <section className="py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10 reveal" ref={sectionRef}>
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">
            Why <span className="text-yellow">CAPZINO AI?</span>
          </h2>
          <p className="text-sm text-white/50">
            Built for creators who want results, not complexity.
          </p>
        </div>
        <div className="grid sm:grid-cols-3 gap-4 sm:gap-6">
          {features.map(({ icon: Icon, title, description }, i) => (
            <div
              key={title}
              className={`reveal reveal-delay-${i + 1} card-yellow-border rounded-3xl p-6 hover:shadow-yellow transition-all duration-300`}
            >
              <div className="w-12 h-12 rounded-2xl bg-yellow/15 border border-yellow/30 flex items-center justify-center mb-4">
                <Icon className="w-6 h-6 text-yellow" />
              </div>
              <h3 className="font-bold text-white text-lg mb-2">{title}</h3>
              <p className="text-sm text-white/50 leading-relaxed">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
