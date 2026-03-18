import { useState } from "react";
import { useApp } from "../context/AppContext";
import type { SubtitleFont, SubtitleTemplate } from "../context/AppContext";

const FONTS: SubtitleFont[] = [
  "Montserrat",
  "Poppins",
  "Impact",
  "Anton",
  "Oswald",
  "Roboto",
  "League Spartan",
  "Bebas Neue",
  "Archivo Black",
];

const TEMPLATES: {
  id: SubtitleTemplate;
  label: string;
  preview: { color: string; bg?: string; shadow?: string; border?: string };
}[] = [
  {
    id: "white-minimal",
    label: "White Minimal",
    preview: { color: "#fff", shadow: "0 1px 3px #000" },
  },
  {
    id: "yellow-highlight",
    label: "Yellow Highlight",
    preview: { color: "#000", bg: "#F5CF2E" },
  },
  {
    id: "red-yellow",
    label: "Red + Yellow",
    preview: { color: "#F5CF2E", bg: "#CC0000" },
  },
  {
    id: "neon-blue",
    label: "Neon Blue",
    preview: { color: "#00CFFF", shadow: "0 0 8px rgba(0,207,255,0.9)" },
  },
  {
    id: "neon-green",
    label: "Neon Green",
    preview: { color: "#00FF7F", shadow: "0 0 8px rgba(0,255,127,0.9)" },
  },
  {
    id: "purple-highlight",
    label: "Purple",
    preview: { color: "#fff", bg: "#7C3AED" },
  },
  {
    id: "black-bar",
    label: "Black Bar",
    preview: { color: "#fff", bg: "rgba(0,0,0,0.85)" },
  },
  {
    id: "white-shadow",
    label: "White Shadow",
    preview: { color: "#fff", shadow: "2px 2px 6px rgba(0,0,0,1)" },
  },
  {
    id: "pink-glow",
    label: "Pink Glow",
    preview: { color: "#FF6BC1", shadow: "0 0 10px rgba(255,107,193,0.9)" },
  },
  {
    id: "bold-viral",
    label: "Bold Viral",
    preview: { color: "#F5CF2E", shadow: "2px 2px 0 #000" },
  },
];

type TabType = "style" | "template";

export default function SubtitlesPanel() {
  const { project, updateSubtitleStyle } = useApp();
  const [tab, setTab] = useState<TabType>("style");
  const s = project.subtitleStyle;

  return (
    <div data-ocid="subtitles.panel" className="p-4">
      {/* Tabs */}
      <div className="flex gap-2 mb-5">
        {(["style", "template"] as TabType[]).map((t) => (
          <button
            type="button"
            key={t}
            data-ocid={`subtitles.${t}_tab`}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
              tab === t
                ? "bg-yellow text-black"
                : "bg-white/5 text-white/50 hover:bg-white/10"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "style" && (
        <div className="space-y-5">
          {/* Font */}
          <div>
            <label
              htmlFor="subtitles-font"
              className="text-xs font-semibold text-white/50 uppercase tracking-wider block mb-2"
            >
              Font
            </label>
            <select
              id="subtitles-font"
              data-ocid="subtitles.font_select"
              value={s.font}
              onChange={(e) =>
                updateSubtitleStyle({ font: e.target.value as SubtitleFont })
              }
              className="w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-yellow/50 appearance-none"
              style={{ fontFamily: s.font }}
            >
              {FONTS.map((f) => (
                <option key={f} value={f} style={{ fontFamily: f }}>
                  {f}
                </option>
              ))}
            </select>
          </div>

          {/* Size */}
          <div>
            <p className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
              Size
            </p>
            <div className="flex gap-2">
              {(["small", "medium", "large"] as const).map((sz) => (
                <button
                  type="button"
                  key={sz}
                  data-ocid={`subtitles.${sz}_size_button`}
                  onClick={() => updateSubtitleStyle({ size: sz })}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold transition-all ${
                    s.size === sz
                      ? "bg-yellow text-black"
                      : "bg-white/5 text-white/50 hover:bg-white/10"
                  }`}
                >
                  {sz.charAt(0).toUpperCase() + sz.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Position */}
          <div>
            <p className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-2">
              Position
            </p>
            <div className="flex gap-2">
              {(["top", "middle", "bottom"] as const).map((pos) => (
                <button
                  type="button"
                  key={pos}
                  data-ocid={`subtitles.${pos}_position_button`}
                  onClick={() => updateSubtitleStyle({ position: pos })}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${
                    s.position === pos
                      ? "bg-yellow text-black"
                      : "bg-white/5 text-white/50 hover:bg-white/10"
                  }`}
                >
                  {pos}
                </button>
              ))}
            </div>
          </div>

          {/* Uppercase toggle */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">
              Uppercase
            </span>
            <button
              type="button"
              data-ocid="subtitles.uppercase_toggle"
              onClick={() => updateSubtitleStyle({ uppercase: !s.uppercase })}
              className={`w-10 h-5 rounded-full transition-all relative ${
                s.uppercase ? "bg-yellow" : "bg-white/10"
              }`}
            >
              <span
                className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${
                  s.uppercase ? "left-5.5" : "left-0.5"
                }`}
                style={{ left: s.uppercase ? "22px" : "2px" }}
              />
            </button>
          </div>

          {/* Highlight toggle */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-white/50 uppercase tracking-wider">
              Highlight
            </span>
            <button
              type="button"
              data-ocid="subtitles.highlight_toggle"
              onClick={() => updateSubtitleStyle({ highlight: !s.highlight })}
              className={`w-10 h-5 rounded-full transition-all relative ${
                s.highlight ? "bg-yellow" : "bg-white/10"
              }`}
            >
              <span
                className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all"
                style={{ left: s.highlight ? "22px" : "2px" }}
              />
            </button>
          </div>
        </div>
      )}

      {tab === "template" && (
        <div className="grid grid-cols-2 gap-3">
          {TEMPLATES.map(({ id, label, preview }) => (
            <button
              type="button"
              key={id}
              data-ocid={`subtitles.${id.replace("-", "_")}_template_button`}
              onClick={() => updateSubtitleStyle({ template: id })}
              className={`p-3 rounded-2xl border transition-all text-left ${
                s.template === id
                  ? "border-yellow bg-yellow/10"
                  : "border-white/10 bg-[#1A1A1A] hover:border-white/20"
              }`}
            >
              {/* Preview */}
              <div
                className="h-8 rounded-lg mb-2 flex items-center justify-center text-xs font-bold overflow-hidden"
                style={{
                  backgroundColor: preview.bg || "transparent",
                  color: preview.color,
                  textShadow: preview.shadow,
                  fontFamily: "Montserrat",
                }}
              >
                SAMPLE
              </div>
              <p className="text-[10px] text-white/50 font-semibold">{label}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
