import { ArrowLeft, Download, Edit3, Film, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { CaptionProject } from "../backend";
import { useApp } from "../context/AppContext";
import { useActor } from "../hooks/useActor";
import { useLibrary } from "../hooks/useQueries";

function formatDate(ts: bigint) {
  const ms = Number(ts) / 1_000_000;
  return new Date(ms).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function Library() {
  const { setScreen, setProject, project } = useApp();
  const { data: projects, isLoading, refetch } = useLibrary();
  const { actor } = useActor();
  const [deletingTitle, setDeletingTitle] = useState<string | null>(null);

  const handleEdit = (p: CaptionProject) => {
    setProject({
      ...project,
      title: p.title,
      videoUrl: p.videoUrl || null,
      videoBlobId: p.videoUrl || null,
      videoFile: null,
      language: (p.language as any) || "HINGLISH",
      captions: p.captions,
      isNew: false,
    });
    setScreen("editor");
  };

  const handleDelete = async (title: string) => {
    if (!actor) {
      toast.error("Not connected");
      return;
    }
    setDeletingTitle(title);
    try {
      await actor.deleteCaptionProject(title);
      toast.success("Project deleted.");
      refetch();
    } catch {
      toast.error("Failed to delete project.");
    } finally {
      setDeletingTitle(null);
    }
  };

  return (
    <main className="pt-20 pb-16 px-4 max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <button
          type="button"
          data-ocid="library.back_button"
          onClick={() => setScreen("home")}
          className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-2xl font-black text-white">
            Your <span className="text-yellow">Library</span>
          </h1>
          <p className="text-sm text-white/40">
            {projects?.length || 0} projects
          </p>
        </div>
      </div>

      {isLoading && (
        <div
          data-ocid="library.loading_state"
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="aspect-[9/16] rounded-2xl bg-[#1A1A1A] animate-pulse"
            />
          ))}
        </div>
      )}

      {!isLoading && (!projects || projects.length === 0) && (
        <div
          data-ocid="library.empty_state"
          className="flex flex-col items-center justify-center py-24 text-center"
        >
          <div className="w-20 h-20 rounded-full bg-[#1A1A1A] flex items-center justify-center mb-4">
            <Film className="w-8 h-8 text-white/20" />
          </div>
          <p className="text-white/50 font-semibold mb-1">No projects yet</p>
          <p className="text-white/30 text-sm mb-6">
            Generate your first caption to get started
          </p>
          <button
            type="button"
            data-ocid="library.create_button"
            onClick={() => setScreen("home")}
            className="px-6 py-3 rounded-full bg-yellow text-black font-bold text-sm hover:bg-yellow/90 transition-all glow-yellow-sm"
          >
            Create First Project
          </button>
        </div>
      )}

      {!isLoading && projects && projects.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {projects.map((p, idx) => (
            <motion.div
              key={p.title}
              data-ocid={`library.item.${idx + 1}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="group relative rounded-2xl overflow-hidden bg-[#151515] border border-white/10 hover:border-yellow/30 transition-all shadow-card"
            >
              {/* Thumbnail */}
              <div className="aspect-[9/16] relative overflow-hidden">
                {p.thumbnailUrl ? (
                  <img
                    src={p.thumbnailUrl}
                    alt={p.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-[#1A1A1A]">
                    <Film className="w-8 h-8 text-white/20" />
                  </div>
                )}
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button
                    type="button"
                    data-ocid={`library.edit_button.${idx + 1}`}
                    onClick={() => handleEdit(p)}
                    className="w-9 h-9 rounded-full bg-yellow flex items-center justify-center hover:scale-110 transition-transform"
                  >
                    <Edit3 className="w-4 h-4 text-black" />
                  </button>
                  <button
                    type="button"
                    data-ocid={`library.download_button.${idx + 1}`}
                    onClick={() => toast.info("Download feature coming soon.")}
                    className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center hover:scale-110 transition-transform"
                  >
                    <Download className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
              {/* Info */}
              <div className="p-3">
                <p className="text-xs font-semibold text-white truncate">
                  {p.title}
                </p>
                <p className="text-[10px] text-white/40 mt-0.5">
                  {formatDate(p.createdAt)}
                </p>
              </div>
              {/* Delete */}
              <button
                type="button"
                data-ocid={`library.delete_button.${idx + 1}`}
                onClick={() => handleDelete(p.title)}
                disabled={deletingTitle === p.title}
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/80 disabled:opacity-50"
              >
                <Trash2 className="w-3.5 h-3.5 text-white" />
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </main>
  );
}
