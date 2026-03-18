import { Star } from "lucide-react";
import { useRef } from "react";
import { useScrollReveal } from "../../hooks/useScrollReveal";

const reviews = [
  {
    name: "Priya Sharma",
    handle: "@priya_creates",
    stars: 5,
    text: "CAPZINO AI is a game changer! My Reels get 3x more views since I started adding Hinglish captions. The style options are 🔥",
    avatar: "P",
  },
  {
    name: "Rahul Verma",
    handle: "@rahulvlogs",
    stars: 5,
    text: "Finally an AI caption tool that understands Hinglish! The viral caption format is perfect for short video content.",
    avatar: "R",
  },
  {
    name: "Anjali Singh",
    handle: "@anjali.reels",
    stars: 5,
    text: "Super easy to use. Upload, generate, done. The yellow highlight template is my fav ✨ Pro plan is totally worth it!",
    avatar: "A",
  },
  {
    name: "Karan Mehta",
    handle: "@karanmehta_official",
    stars: 5,
    text: "Used multiple caption tools but CAPZINO AI is the best for Indian creators. Real AI, real captions, real results!",
    avatar: "K",
  },
];

export default function Reviews() {
  const sectionRef = useRef<HTMLDivElement>(null);
  useScrollReveal(sectionRef);

  return (
    <section className="py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10 reveal" ref={sectionRef}>
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">
            Loved by <span className="text-yellow">Creators</span>
          </h2>
          <p className="text-sm text-white/50">
            Join thousands of Indian creators using CAPZINO AI.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {reviews.map(({ name, handle, stars, text, avatar }, i) => (
            <div
              key={name}
              className={`reveal reveal-delay-${i + 1} card-premium rounded-3xl p-5 hover:border-yellow/20 hover:border transition-all`}
            >
              <div className="flex gap-0.5 mb-3">
                {[1, 2, 3, 4, 5].slice(0, stars).map((n) => (
                  <Star
                    key={n}
                    className="w-3.5 h-3.5 text-yellow fill-yellow"
                  />
                ))}
              </div>
              <p className="text-sm text-white/70 leading-relaxed mb-4">
                &ldquo;{text}&rdquo;
              </p>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-yellow/20 border border-yellow/30 flex items-center justify-center text-xs font-bold text-yellow flex-shrink-0">
                  {avatar}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-white truncate">
                    {name}
                  </p>
                  <p className="text-[10px] text-white/40 truncate">{handle}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
