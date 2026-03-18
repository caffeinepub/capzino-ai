import { Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useScrollReveal } from "../../hooks/useScrollReveal";

// Update these paths when uploading your 3 portrait reel videos
const REEL_VIDEOS = [
  {
    src: "/assets/Find_The_Real_Celebrity,_Win_$10,000.mp4",
    label: "Viral Reel #1",
  },
  {
    src: "/assets/Find_The_Real_Celebrity,_Win_$10,000-1.mp4",
    label: "Viral Reel #2",
  },
  { src: "", label: "Viral Reel #3" }, // Upload reel3.mp4 to /assets/ to activate
];

interface ReelCardProps {
  src: string;
  label: string;
  delay: number;
}

function ReelCard({ src, label, delay }: ReelCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showPlayBtn, setShowPlayBtn] = useState(false);
  const isPlayingRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // Intersection observer: autoplay 3s muted preview when card enters viewport
  useEffect(() => {
    if (!src) return;
    const el = cardRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isPlayingRef.current) {
          const video = videoRef.current;
          if (!video) return;
          video.muted = true;
          video.currentTime = 0;
          video.play().catch(() => {});
          setShowPlayBtn(false);

          timerRef.current = setTimeout(() => {
            video.pause();
            setShowPlayBtn(true);
          }, 3000);

          observer.unobserve(el);
        }
      },
      { threshold: 0.5 },
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [src]);

  const handlePlayClick = () => {
    const video = videoRef.current;
    if (!video) return;
    isPlayingRef.current = true;
    video.muted = false;
    video.currentTime = 0;
    video.controls = true;
    setShowPlayBtn(false);
    video.play().catch(() => {});
  };

  const handleEnded = () => {
    isPlayingRef.current = false;
    setShowPlayBtn(true);
  };

  return (
    <div
      ref={cardRef}
      className={`reveal reveal-delay-${delay} relative rounded-2xl sm:rounded-3xl overflow-hidden bg-[#111] ring-1 ring-white/10 hover:ring-yellow/30 transition-all duration-300`}
      style={{
        aspectRatio: "9/16",
        boxShadow: "0 0 24px rgba(245,207,46,0.08)",
      }}
    >
      {src ? (
        <>
          {/* biome-ignore lint/a11y/useMediaCaption: demo reels have no captions */}
          <video
            ref={videoRef}
            src={src}
            className="w-full h-full object-cover"
            playsInline
            preload="metadata"
            onEnded={handleEnded}
          />

          {/* Play overlay */}
          {showPlayBtn && (
            <button
              type="button"
              onClick={handlePlayClick}
              className="absolute inset-0 flex items-center justify-center bg-black/20 transition-all"
              aria-label={`Play ${label}`}
            >
              <div className="w-16 h-16 rounded-full bg-black/60 border-2 border-yellow/70 flex items-center justify-center backdrop-blur-sm shadow-[0_0_20px_rgba(245,207,46,0.4)] hover:scale-105 transition-transform">
                <Play className="w-7 h-7 text-yellow fill-yellow ml-1" />
              </div>
            </button>
          )}
        </>
      ) : (
        /* Placeholder for not-yet-uploaded reel */
        <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-[#1C1C1C] to-[#111]">
          <div className="w-14 h-14 rounded-full bg-yellow/10 border border-yellow/20 flex items-center justify-center mb-3">
            <Play className="w-6 h-6 text-yellow/50 fill-yellow/50" />
          </div>
          <p className="text-xs font-semibold text-white/40 text-center px-4">
            {label}
          </p>
          <p className="text-[10px] text-white/20 mt-1 text-center px-4">
            Coming Soon
          </p>
        </div>
      )}

      {/* Premium frame accent */}
      <div className="absolute inset-0 rounded-2xl sm:rounded-3xl pointer-events-none ring-1 ring-yellow/5" />
    </div>
  );
}

export default function DemoVideos() {
  const sectionRef = useRef<HTMLDivElement>(null);
  useScrollReveal(sectionRef);

  return (
    <section className="py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10 reveal" ref={sectionRef}>
          <h2 className="text-2xl sm:text-3xl font-black text-white mb-2">
            See It In <span className="text-yellow">Action</span>
          </h2>
          <p className="text-sm text-white/50">
            Real captions. Real results. Real creators.
          </p>
        </div>

        {/* 3-column portrait reel grid */}
        <div className="grid grid-cols-3 gap-3 sm:gap-5">
          {REEL_VIDEOS.map(({ src, label }, i) => (
            <ReelCard key={label} src={src} label={label} delay={i + 1} />
          ))}
        </div>
      </div>
    </section>
  );
}
