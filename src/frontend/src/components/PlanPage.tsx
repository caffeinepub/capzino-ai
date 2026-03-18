import { ArrowLeft, Calendar, Coins, Crown, Zap } from "lucide-react";
import { useApp } from "../context/AppContext";

function formatExpiry(ms?: number): string {
  if (!ms) return "—";
  return new Date(ms).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default function PlanPage() {
  const { setScreen, userProfile, coins, isProActive, setShowProModal } =
    useApp();

  return (
    <main className="pt-20 pb-16 px-4 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <button
          type="button"
          data-ocid="plan.back_button"
          onClick={() => setScreen("home")}
          className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <h1 className="text-2xl font-black text-white">
          Your <span className="text-yellow">Plan</span>
        </h1>
      </div>

      {/* Profile card */}
      {userProfile && (
        <div className="card-premium rounded-3xl p-6 mb-4">
          <div className="flex items-center gap-4">
            {userProfile.photoUrl ? (
              <img
                src={userProfile.photoUrl}
                alt={userProfile.name}
                className="w-14 h-14 rounded-full object-cover"
              />
            ) : (
              <div className="w-14 h-14 rounded-full bg-yellow/20 flex items-center justify-center text-2xl font-black text-yellow">
                {userProfile.name.charAt(0)}
              </div>
            )}
            <div>
              <p className="font-bold text-white text-lg">{userProfile.name}</p>
              {userProfile.email && (
                <p className="text-sm text-white/40">{userProfile.email}</p>
              )}
            </div>
            <div
              className={`ml-auto px-3 py-1 rounded-full text-xs font-black uppercase ${
                isProActive
                  ? "bg-yellow text-black"
                  : "bg-white/10 text-white/60"
              }`}
            >
              {isProActive ? "PRO" : "FREE"}
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="card-premium rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Coins className="w-4 h-4 text-yellow" />
            <span className="text-xs text-white/50 font-semibold uppercase">
              Coins
            </span>
          </div>
          <p className="text-3xl font-black text-yellow">{coins}</p>
        </div>
        <div className="card-premium rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <Crown className="w-4 h-4 text-yellow" />
            <span className="text-xs text-white/50 font-semibold uppercase">
              Plan
            </span>
          </div>
          <p className="text-3xl font-black text-white">
            {isProActive ? "PRO" : "FREE"}
          </p>
        </div>
      </div>

      {isProActive && userProfile?.proExpiry && (
        <div className="card-yellow-border rounded-2xl p-4 mb-4 flex items-center gap-3">
          <Calendar className="w-5 h-5 text-yellow flex-shrink-0" />
          <div>
            <p className="text-xs text-white/50 font-semibold uppercase">
              Pro Expires
            </p>
            <p className="text-sm font-bold text-white">
              {formatExpiry(userProfile.proExpiry)}
            </p>
          </div>
        </div>
      )}

      {/* Upgrade CTA */}
      {!isProActive && (
        <div className="card-premium rounded-3xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-yellow/15 border border-yellow/30 flex items-center justify-center">
              <Zap className="w-5 h-5 text-yellow" />
            </div>
            <div>
              <p className="font-bold text-white">Upgrade to Pro</p>
              <p className="text-xs text-white/50">
                Unlimited generations for 3 days
              </p>
            </div>
          </div>
          <button
            type="button"
            data-ocid="plan.upgrade_button"
            onClick={() => setShowProModal(true)}
            className="w-full py-3 rounded-2xl bg-yellow text-black font-bold hover:bg-yellow/90 transition-all glow-yellow"
          >
            Upgrade for ₹9
          </button>
        </div>
      )}
    </main>
  );
}
