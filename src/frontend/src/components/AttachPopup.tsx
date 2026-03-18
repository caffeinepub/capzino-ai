import { Image, Link, Upload, Video, X } from "lucide-react";
import { useRef } from "react";

interface Props {
  onFile: (file: File) => void;
  onPasteLink: () => void;
  onClose: () => void;
}

export default function AttachPopup({ onFile, onPasteLink, onClose }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFile(file);
      onClose();
    }
  };

  const options = [
    { icon: Video, label: "Record Video", action: () => {} },
    {
      icon: Image,
      label: "Gallery",
      action: () => fileInputRef.current?.click(),
    },
    {
      icon: Upload,
      label: "Upload File",
      action: () => fileInputRef.current?.click(),
    },
    { icon: Link, label: "Paste Video Link", action: onPasteLink },
  ];

  return (
    <div
      data-ocid="attach.popover"
      className="absolute top-full left-0 mt-3 w-60 z-50 animated-border rounded-2xl"
    >
      <div className="bg-[#141414] rounded-2xl p-2 shadow-[0_16px_48px_rgba(0,0,0,0.7)]">
        <div className="flex items-center justify-between px-3 py-2 mb-1">
          <span className="text-xs font-semibold text-white/60 uppercase tracking-widest">
            Attach
          </span>
          <button
            type="button"
            onClick={onClose}
            className="text-white/40 hover:text-white/70 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {options.map(({ icon: Icon, label, action }) => (
          <button
            key={label}
            type="button"
            data-ocid={`attach.${label.toLowerCase().replace(/ /g, "_")}_button`}
            onClick={action}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors text-left group"
          >
            <div className="w-8 h-8 rounded-lg bg-yellow/10 border border-yellow/20 flex items-center justify-center group-hover:bg-yellow/20 transition-colors flex-shrink-0">
              <Icon className="w-4 h-4 text-yellow" />
            </div>
            <span className="text-sm text-white/80 group-hover:text-white transition-colors">
              {label}
            </span>
          </button>
        ))}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".mp4,.mov,.webm,video/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
