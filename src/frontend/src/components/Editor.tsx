import {
  Download,
  Film,
  Grid3X3,
  Maximize2,
  Menu,
  Pause,
  Play,
  Scissors,
  Type,
  Upload,
  Volume2,
  VolumeX,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { CaptionSegment } from "../backend";
import { useApp } from "../context/AppContext";
import SubtitlesPanel from "./SubtitlesPanel";

type Tool = "trim" | "reframe" | "subtitles" | "upload" | "elements" | "b-roll";

const TOOLS: { id: Tool; icon: React.ElementType; label: string }[] = [
  { id: "trim", icon: Scissors, label: "Trim" },
  { id: "reframe", icon: Maximize2, label: "Reframe" },
  { id: "subtitles", icon: Type, label: "Subtitles" },
  { id: "upload", icon: Upload, label: "Upload" },
  { id: "elements", icon: Grid3X3, label: "Elements" },
  { id: "b-roll", icon: Film, label: "B-roll" },
];

function getActiveCaptions(
  captions: CaptionSegment[],
  currentTime: number,
): CaptionSegment[] {
  return captions.filter((c) => {
    const start = Number(c.start) / 1_000_000_000;
    const end = Number(c.end) / 1_000_000_000;
    return currentTime >= start && currentTime <= end;
  });
}

interface SubtitleOverlayStyle {
  fontFamily: string;
  fontSize: string;
  textTransform: "uppercase" | "none";
  color: string;
  backgroundColor?: string;
  textShadow?: string;
  padding?: string;
  borderRadius?: string;
  WebkitTextStroke?: string;
}

type SubtitleStyleArg = {
  font: string;
  size: "small" | "medium" | "large";
  position: string;
  template: string;
  uppercase: boolean;
  highlight: boolean;
};

function getSubtitleStyle(style: SubtitleStyleArg): SubtitleOverlayStyle {
  const sizeMap = { small: "14px", medium: "20px", large: "28px" };
  const base: SubtitleOverlayStyle = {
    fontFamily: style.font,
    fontSize: sizeMap[style.size],
    textTransform: style.uppercase ? "uppercase" : "none",
    color: "#FFFFFF",
    padding: "4px 10px",
    borderRadius: "6px",
  };

  switch (style.template) {
    case "yellow-highlight":
      return { ...base, color: "#000", backgroundColor: "#F5CF2E" };
    case "red-yellow":
      return {
        ...base,
        color: "#F5CF2E",
        backgroundColor: "#CC0000",
        textShadow: "0 2px 4px rgba(0,0,0,0.5)",
      };
    case "neon-blue":
      return {
        ...base,
        color: "#00CFFF",
        textShadow: "0 0 10px rgba(0,207,255,0.8)",
      };
    case "neon-green":
      return {
        ...base,
        color: "#00FF7F",
        textShadow: "0 0 10px rgba(0,255,127,0.8)",
      };
    case "purple-highlight":
      return { ...base, color: "#FFF", backgroundColor: "#7C3AED" };
    case "black-bar":
      return { ...base, color: "#FFF", backgroundColor: "rgba(0,0,0,0.85)" };
    case "white-shadow":
      return {
        ...base,
        color: "#FFF",
        textShadow: "2px 2px 4px rgba(0,0,0,0.9), 0 0 8px rgba(0,0,0,0.8)",
      };
    case "pink-glow":
      return {
        ...base,
        color: "#FF6BC1",
        textShadow: "0 0 12px rgba(255,107,193,0.8)",
      };
    case "bold-viral":
      return {
        ...base,
        fontFamily: "Anton",
        color: "#F5CF2E",
        WebkitTextStroke: "1px #000",
        textShadow: "2px 2px 0 #000",
      };
    default:
      return {
        ...base,
        color: "#FFF",
        textShadow: "1px 1px 3px rgba(0,0,0,0.8)",
      };
  }
}

export default function Editor() {
  const { project, setProject, setScreen, isProActive } = useApp();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [activeTool, setActiveTool] = useState<Tool>("subtitles");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState(project.title);

  const activeCaptions = getActiveCaptions(project.captions, currentTime);
  const subtitleStyle = getSubtitleStyle(project.subtitleStyle);

  const positionClass =
    project.subtitleStyle.position === "top"
      ? "top-4"
      : project.subtitleStyle.position === "middle"
        ? "top-1/2 -translate-y-1/2"
        : "bottom-10";

  const handlePlayPause = useCallback(() => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const handleTimeUpdate = () => {
    if (videoRef.current) setCurrentTime(videoRef.current.currentTime);
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) setDuration(videoRef.current.duration);
  };

  const handleTimelineSeek = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!videoRef.current || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = (e.clientX - rect.left) / rect.width;
    videoRef.current.currentTime = pct * duration;
  };

  const handleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const commitTitle = () => {
    setEditingTitle(false);
    setProject({ ...project, title: titleValue });
  };

  const handleExport = async () => {
    setIsExporting(true);
    setExportProgress(0);
    for (let i = 0; i <= 100; i += 10) {
      await new Promise((r) => setTimeout(r, 200));
      setExportProgress(i);
    }
    if (project.videoUrl) {
      const a = document.createElement("a");
      a.href = project.videoUrl;
      a.download = `${project.title}_captioned.mp4`;
      a.click();
    } else {
      toast.info(
        "Export ready! In production, your captioned video will download here.",
      );
    }
    setIsExporting(false);
    toast.success(
      isProActive
        ? "Exported without watermark!"
        : "Exported with CAPZINO AI watermark.",
    );
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onEnded = () => setIsPlaying(false);
    video.addEventListener("ended", onEnded);
    return () => video.removeEventListener("ended", onEnded);
  }, []);

  return (
    <div
      className="fixed inset-0 z-40 bg-[#0B0B0B] flex flex-col"
      data-ocid="editor.panel"
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#111] border-b border-white/10 flex-shrink-0">
        <div className="flex items-center gap-3">
          <button
            type="button"
            data-ocid="editor.menu_button"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
          >
            <Menu className="w-4 h-4" />
          </button>
          <span className="text-xs text-white/40 font-semibold uppercase tracking-widest">
            Tools
          </span>
        </div>

        {editingTitle ? (
          <input
            value={titleValue}
            onChange={(e) => setTitleValue(e.target.value)}
            onBlur={commitTitle}
            onKeyDown={(e) => {
              if (e.key === "Enter") commitTitle();
            }}
            className="bg-transparent text-sm font-semibold text-white text-center border-b border-yellow/50 outline-none w-40"
          />
        ) : (
          <button
            type="button"
            onClick={() => setEditingTitle(true)}
            className="text-sm font-semibold text-white/80 hover:text-white transition-colors max-w-[160px] truncate"
          >
            {project.title}
          </button>
        )}

        <button
          type="button"
          data-ocid="editor.export_button"
          onClick={handleExport}
          disabled={isExporting}
          className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow text-black font-bold text-sm hover:bg-yellow/90 transition-all disabled:opacity-60"
        >
          <Download className="w-3.5 h-3.5" />
          {isExporting ? `${exportProgress}%` : "Export"}
        </button>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute top-14 left-4 z-50 bg-[#1C1C1C] border border-white/10 rounded-2xl shadow-card min-w-[160px] py-1.5"
          >
            <button
              type="button"
              className="w-full px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-white/5 text-left"
              onClick={() => {
                setScreen("home");
                setIsMenuOpen(false);
              }}
            >
              ← Back to Home
            </button>
            <button
              type="button"
              className="w-full px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-white/5 text-left"
              onClick={() => {
                setScreen("library");
                setIsMenuOpen(false);
              }}
            >
              Library
            </button>
            <button
              type="button"
              className="w-full px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-white/5 text-left"
              onClick={() => {
                setScreen("plan");
                setIsMenuOpen(false);
              }}
            >
              Plan
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex flex-col items-center justify-center p-4 min-w-0">
          <div className="relative max-h-full aspect-[9/16] w-auto max-w-[280px] sm:max-w-sm rounded-2xl overflow-hidden bg-black border border-white/10 shadow-card">
            {project.videoUrl ? (
              // biome-ignore lint/a11y/useMediaCaption: captions rendered as overlay
              <video
                ref={videoRef}
                src={project.videoUrl}
                className="w-full h-full object-cover"
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                playsInline
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-[#111]">
                <div className="text-center">
                  <Film className="w-12 h-12 text-white/20 mx-auto mb-2" />
                  <p className="text-xs text-white/30">No video loaded</p>
                </div>
              </div>
            )}

            {activeCaptions.length > 0 && (
              <div
                className={`absolute left-2 right-2 ${positionClass} flex flex-col items-center gap-1`}
              >
                {activeCaptions.map((cap) => (
                  <div
                    key={String(cap.start)}
                    style={subtitleStyle as React.CSSProperties}
                    className="text-center max-w-full"
                  >
                    {cap.text.split("\n").map((line, j) => (
                      // biome-ignore lint/suspicious/noArrayIndexKey: line fragments
                      <div key={j}>{line}</div>
                    ))}
                  </div>
                ))}
              </div>
            )}

            {!isProActive && (
              <div className="absolute top-2 right-2 bg-black/60 rounded-lg px-2 py-1">
                <span className="text-[10px] font-bold text-yellow/80">
                  CAPZINO AI
                </span>
              </div>
            )}

            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-3 pt-6 pb-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  data-ocid="editor.play_button"
                  onClick={handlePlayPause}
                  className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors flex-shrink-0"
                >
                  {isPlaying ? (
                    <Pause className="w-3 h-3" />
                  ) : (
                    <Play className="w-3 h-3 fill-white" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleMute}
                  className="flex-shrink-0"
                >
                  {isMuted ? (
                    <VolumeX className="w-3.5 h-3.5 text-white/60" />
                  ) : (
                    <Volume2 className="w-3.5 h-3.5 text-white/60" />
                  )}
                </button>
                <span className="text-[10px] text-white/60 ml-auto">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>
            </div>
          </div>

          <div className="w-full max-w-sm mt-4 px-2">
            <button
              type="button"
              data-ocid="editor.timeline"
              aria-label="Timeline scrubber"
              className="w-full h-2 bg-white/10 rounded-full cursor-pointer relative overflow-hidden block"
              onClick={handleTimelineSeek}
            >
              <div
                className="h-full bg-yellow rounded-full transition-none"
                style={{
                  width: duration ? `${(currentTime / duration) * 100}%` : "0%",
                }}
              />
            </button>
          </div>
        </div>

        {activeTool === "subtitles" && (
          <div className="hidden md:block w-72 border-l border-white/10 overflow-y-auto flex-shrink-0">
            <SubtitlesPanel />
          </div>
        )}
      </div>

      <AnimatePresence>
        {activeTool === "subtitles" && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="md:hidden fixed bottom-16 left-0 right-0 z-30 bg-[#111] border-t border-white/10 max-h-[50vh] overflow-y-auto"
          >
            <SubtitlesPanel />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-around px-2 py-3 bg-[#111] border-t border-white/10 flex-shrink-0">
        {TOOLS.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            type="button"
            data-ocid={`editor.${id}_tab`}
            onClick={() => setActiveTool(id === activeTool ? "trim" : id)}
            className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-all ${
              activeTool === id
                ? "text-yellow"
                : "text-white/40 hover:text-white/70"
            }`}
          >
            <Icon className="w-4 h-4" />
            <span className="text-[10px] font-semibold">{label}</span>
            {activeTool === id && (
              <div className="w-4 h-0.5 bg-yellow rounded-full" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
