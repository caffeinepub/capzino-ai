import { useApp } from "../context/AppContext";

export default function Loader() {
  const { generateProgress } = useApp();

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm">
      <div className="relative flex items-center justify-center">
        {/* Outer rotating ring */}
        <div
          className="absolute w-24 h-24 rounded-full"
          style={{
            border: "2px solid transparent",
            borderTopColor: "#F5CF2E",
            borderRightColor: "rgba(245,207,46,0.3)",
            animation: "spin 1.2s linear infinite",
            boxShadow: "0 0 20px rgba(245,207,46,0.4)",
          }}
        />
        {/* Inner ring */}
        <div
          className="absolute w-16 h-16 rounded-full"
          style={{
            border: "1.5px solid transparent",
            borderBottomColor: "#F5CF2E",
            borderLeftColor: "rgba(245,207,46,0.2)",
            animation: "spinReverse 2s linear infinite",
          }}
        />
        {/* Logo */}
        <img
          src="/assets/uploads/IMG_20260314_203102-1-1.jpg"
          alt="CAPZINO AI"
          className="w-12 h-12 rounded-full object-contain z-10"
        />
      </div>

      <div className="mt-8 text-center">
        <p className="text-sm font-semibold tracking-widest text-yellow mb-1">
          CAPZINO AI
        </p>
        <p className="text-xs text-white/50">
          {generateProgress > 0
            ? `Processing... ${generateProgress}%`
            : "Generating captions..."}
        </p>
      </div>

      {generateProgress > 0 && (
        <div className="mt-4 w-48 h-1 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-yellow rounded-full transition-all duration-300"
            style={{ width: `${generateProgress}%` }}
          />
        </div>
      )}
    </div>
  );
}
