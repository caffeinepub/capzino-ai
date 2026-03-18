import { Coins, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useApp } from "../context/AppContext";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import ProfileDropdown from "./ProfileDropdown";

export default function Header() {
  const { coins, userProfile } = useApp();
  const { identity } = useInternetIdentity();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isLoggedIn = !!identity;

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [dropdownOpen]);

  return (
    <header className="fixed top-3 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-4xl relative">
      {/* Ambient yellow glow behind header */}
      <div className="absolute inset-0 rounded-full blur-2xl bg-[#FFD84D]/5 scale-x-110 -z-10 pointer-events-none" />

      <div className="flex items-center justify-between px-4 py-2.5 rounded-full bg-[#111]/95 backdrop-blur-xl border border-[#FFD84D]/20 shadow-[0_4px_24px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,216,77,0.08),inset_0_1px_0_rgba(255,255,255,0.05),0_0_30px_rgba(255,216,77,0.06)]">
        {/* LEFT: Logo */}
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <div className="relative flex-shrink-0">
            {/* Yellow glow blob behind logo */}
            <div className="absolute inset-0 rounded-full blur-md bg-[#FFD84D]/30 scale-150 pointer-events-none" />
            <div className="relative z-10 w-10 h-10 rounded-full overflow-hidden ring-1 ring-[#FFD84D]/60 bg-black/40 backdrop-blur-sm shadow-[0_0_12px_rgba(255,216,77,0.5),0_0_24px_rgba(255,216,77,0.25)]">
              <img
                src="/assets/uploads/IMG_20260314_203102-1-1.jpg"
                alt="CAPZINO AI Logo"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
          <span className="hidden sm:block text-sm font-bold tracking-wider">
            <span className="text-white">CAPZINO</span>
            <span className="text-yellow"> AI</span>
          </span>
        </div>

        {/* RIGHT: Coins + Profile */}
        <div className="flex items-center gap-2" ref={dropdownRef}>
          <div className="flex items-center gap-1.5 bg-[#111] border border-[#FFD84D]/15 rounded-full px-3 py-1.5 shadow-[0_0_10px_rgba(255,216,77,0.12)]">
            <Coins className="w-3.5 h-3.5 text-yellow" />
            <span className="text-xs font-semibold text-yellow">{coins}</span>
            <span className="text-xs text-white/50 hidden sm:block">COINS</span>
          </div>

          <button
            type="button"
            data-ocid="header.profile_button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className={`relative w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
              isLoggedIn
                ? "ring-2 ring-[#FFD84D]/70 shadow-[0_0_10px_rgba(255,216,77,0.35),0_0_20px_rgba(255,216,77,0.15)]"
                : "bg-[#222] border border-white/10"
            }`}
            aria-label="Profile"
          >
            {userProfile?.photoUrl ? (
              <img
                src={userProfile.photoUrl}
                alt={userProfile.name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <User className="w-4 h-4 text-white/60" />
            )}
          </button>

          {dropdownOpen && (
            <ProfileDropdown onClose={() => setDropdownOpen(false)} />
          )}
        </div>
      </div>
    </header>
  );
}
