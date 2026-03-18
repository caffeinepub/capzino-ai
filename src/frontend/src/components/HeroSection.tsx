import { Paperclip, Play, Sparkles, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useRef, useState } from "react";
import { toast } from "sonner";
import type { CaptionSegment } from "../backend";
import type { Language } from "../context/AppContext";
import { useApp } from "../context/AppContext";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { uploadVideoFile } from "../utils/uploadVideo";
import AttachPopup from "./AttachPopup";

const LANGUAGES: Language[] = ["HINDI", "ENGLISH", "HINGLISH"];
const COINS_PER_GENERATION = 30;

function formatViralCaption(text: string): string {
  const words = text.trim().split(" ");
  const chunkSize = Math.ceil(
    words.length / Math.max(1, Math.ceil(words.length / 3)),
  );
  const lines: string[] = [];
  for (let i = 0; i < words.length; i += chunkSize) {
    lines.push(
      words
        .slice(i, i + chunkSize)
        .join(" ")
        .toUpperCase(),
    );
  }
  return lines.join("\n");
}

export default function HeroSection() {
  const {
    coins,
    deductCoins,
    setScreen,
    setProject,
    setGenerating,
    setGenerateProgress,
    isProActive,
    setShowProModal,
    project,
  } = useApp();
  const { identity, login } = useInternetIdentity();
  const { actor } = useActor();

  const [attachOpen, setAttachOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [language, setLanguage] = useState<Language>("HINGLISH");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [shakeBar, setShakeBar] = useState(false);
  const [pasteLink, setPasteLink] = useState("");
  const [showLinkInput, setShowLinkInput] = useState(false);
  const attachRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setAttachOpen(false);
  }, []);

  const handleRemoveFile = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  const handleGenerate = async () => {
    if (!selectedFile && !pasteLink) {
      setShakeBar(true);
      setTimeout(() => setShakeBar(false), 600);
      toast.error("Please attach a video first!");
      return;
    }
    if (!identity) {
      login();
      toast.info("Please sign in to generate captions.");
      return;
    }
    if (!isProActive && coins < COINS_PER_GENERATION) {
      setShowProModal(true);
      return;
    }
    if (!actor) {
      toast.error("Not connected. Please try again.");
      return;
    }

    setGenerating(true);
    setGenerateProgress(0);

    try {
      let blobId = "";
      const videoUrl = previewUrl || "";

      if (selectedFile) {
        setIsUploading(true);
        setGenerateProgress(10);
        blobId = await uploadVideoFile(selectedFile, identity, (pct) => {
          setUploadProgress(pct);
          setGenerateProgress(10 + Math.floor(pct * 0.4));
        });
        setIsUploading(false);
        setGenerateProgress(50);
      }

      setGenerateProgress(55);
      const captions: CaptionSegment[] = await actor.generateCaptions({
        videoBlobId: blobId,
        language,
      });
      setGenerateProgress(90);

      if (!isProActive) deductCoins(COINS_PER_GENERATION);

      const viralCaptions = captions.map((c) => ({
        ...c,
        text: formatViralCaption(c.text),
      }));
      const title = selectedFile
        ? selectedFile.name.replace(/\.[^.]+$/, "")
        : "Video Project";

      await actor
        .createCaptionProject(
          title,
          blobId || null,
          viralCaptions,
          null,
          language,
        )
        .catch(() => {});

      setGenerateProgress(100);
      setProject({
        ...project,
        title,
        videoFile: selectedFile,
        videoBlobId: blobId || null,
        videoUrl,
        language,
        captions: viralCaptions,
        isNew: false,
      });

      setTimeout(() => {
        setGenerating(false);
        setScreen("editor");
      }, 400);
    } catch (err) {
      setGenerating(false);
      setGenerateProgress(0);
      toast.error(
        err instanceof Error
          ? err.message
          : "Caption generation failed. Please try again.",
      );
    }
  };

  return (
    <section className="min-h-screen flex flex-col items-center justify-center pt-24 pb-16 px-4 relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-yellow/5 blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center gap-2 bg-[#1A1A1A] border border-white/10 rounded-full px-4 py-2 mb-8"
      >
        <Sparkles className="w-3.5 h-3.5 text-yellow" />
        <span className="text-xs font-semibold text-white/80">
          The #1 AI Tool for Creators
        </span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="text-center mb-6"
      >
        <h1 className="font-black uppercase leading-none tracking-tight">
          <span className="block text-5xl sm:text-7xl lg:text-8xl text-white">
            HINGLISH
          </span>
          <span className="block text-5xl sm:text-7xl lg:text-8xl text-white">
            CAPTION
          </span>
          <span
            className="block text-5xl sm:text-7xl lg:text-8xl text-yellow"
            style={{
              WebkitTextStroke: "1px #F5CF2E",
              textShadow:
                "0 0 30px rgba(245,207,46,0.7), 0 0 60px rgba(245,207,46,0.4)",
            }}
          >
            GENERATOR
          </span>
        </h1>
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-center text-sm sm:text-base text-white/50 max-w-md mb-8 leading-relaxed"
      >
        Transform any video into viral Hinglish captions. Upload, generate, and
        export in minutes.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="w-full max-w-lg relative"
        ref={attachRef}
      >
        <div
          className={`flex items-center gap-2 bg-[#1A1A1A] border border-white/10 rounded-full p-2 shadow-[0_8px_32px_rgba(0,0,0,0.5)] ${shakeBar ? "animate-shake" : ""}`}
        >
          <button
            type="button"
            data-ocid="hero.attach_button"
            onClick={() => setAttachOpen(!attachOpen)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full hover:bg-white/5 transition-colors flex-1 text-left min-w-0"
          >
            {selectedFile ? (
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-7 h-7 rounded-lg bg-yellow/20 border border-yellow/30 flex items-center justify-center flex-shrink-0">
                  <Play className="w-3 h-3 text-yellow fill-yellow" />
                </div>
                <span className="text-sm text-white truncate">
                  {selectedFile.name}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFile();
                  }}
                  className="ml-1 text-white/40 hover:text-white/70 flex-shrink-0"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                  <Paperclip className="w-3.5 h-3.5 text-white/60" />
                </div>
                <span className="text-sm text-white/50">Attach Video</span>
              </div>
            )}
          </button>

          <button
            type="button"
            data-ocid="hero.generate_button"
            onClick={handleGenerate}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-yellow text-black font-bold text-sm hover:bg-yellow/90 transition-all glow-yellow-sm flex-shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            <span className="hidden sm:block">Generate</span>
          </button>
        </div>

        {isUploading && uploadProgress > 0 && (
          <div className="mt-3 w-full h-1 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-yellow rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        )}

        {attachOpen && (
          <AttachPopup
            onFile={handleFile}
            onPasteLink={() => {
              setShowLinkInput(true);
              setAttachOpen(false);
            }}
            onClose={() => setAttachOpen(false)}
          />
        )}
      </motion.div>

      <AnimatePresence>
        {showLinkInput && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="w-full max-w-lg mt-3"
          >
            <div className="flex gap-2">
              <input
                data-ocid="hero.video_link_input"
                type="url"
                placeholder="Paste video URL here..."
                value={pasteLink}
                onChange={(e) => setPasteLink(e.target.value)}
                className="flex-1 bg-[#1A1A1A] border border-white/10 rounded-2xl px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-yellow/50"
              />
              <button
                type="button"
                onClick={() => setShowLinkInput(false)}
                className="px-4 py-2.5 rounded-2xl bg-yellow text-black text-sm font-semibold"
              >
                Done
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="flex gap-2 mt-5"
      >
        {LANGUAGES.map((lang) => (
          <button
            key={lang}
            type="button"
            data-ocid={`hero.${lang.toLowerCase()}_tab`}
            onClick={() => setLanguage(lang)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wider transition-all ${
              language === lang
                ? "bg-yellow text-black glow-yellow-sm"
                : "bg-white/5 text-white/50 border border-white/10 hover:border-yellow/30 hover:text-white/80"
            }`}
          >
            {lang}
          </button>
        ))}
      </motion.div>

      {!isProActive && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-4 text-xs text-white/30"
        >
          {coins < COINS_PER_GENERATION
            ? "⚡ Low on coins — upgrade to Pro for unlimited generations"
            : `30 coins per generation · ${coins} remaining`}
        </motion.p>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept=".mp4,.mov,.webm,video/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
    </section>
  );
}
