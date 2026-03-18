import { Crown, Library, LogOut, User } from "lucide-react";
import { useApp } from "../context/AppContext";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

interface Props {
  onClose: () => void;
}

export default function ProfileDropdown({ onClose }: Props) {
  const { setScreen, userProfile } = useApp();
  const { identity, clear, login } = useInternetIdentity();
  const isLoggedIn = !!identity;

  const handleLogout = () => {
    clear();
    onClose();
  };

  const handleLogin = () => {
    login();
    onClose();
  };

  return (
    <div
      data-ocid="profile.dropdown_menu"
      className="absolute top-full right-0 mt-2 w-56 rounded-2xl bg-[#1C1C1C] border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.6)] animate-scale-in overflow-hidden z-50"
    >
      {/* User info */}
      <div className="px-4 py-3 border-b border-white/10">
        {isLoggedIn ? (
          <>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-yellow/20 flex items-center justify-center flex-shrink-0">
                {userProfile?.photoUrl ? (
                  <img
                    src={userProfile.photoUrl}
                    alt=""
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User className="w-4 h-4 text-yellow" />
                )}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  {userProfile?.name || "User"}
                </p>
                {userProfile?.email && (
                  <p className="text-xs text-white/40 truncate">
                    {userProfile.email}
                  </p>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
              <User className="w-4 h-4 text-white/40" />
            </div>
            <p className="text-sm text-white/60">Guest</p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="py-1.5">
        <button
          type="button"
          data-ocid="profile.library_link"
          onClick={() => {
            setScreen("library");
            onClose();
          }}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-white/80 hover:text-white hover:bg-white/5 transition-colors"
        >
          <Library className="w-4 h-4" />
          Library
        </button>
        <button
          type="button"
          data-ocid="profile.plan_link"
          onClick={() => {
            setScreen("plan");
            onClose();
          }}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-white/80 hover:text-white hover:bg-white/5 transition-colors"
        >
          <Crown className="w-4 h-4 text-yellow" />
          <span>
            Plan /{" "}
            <span className="text-yellow font-semibold">Upgrade to Pro</span>
          </span>
        </button>

        <div className="border-t border-white/10 my-1.5" />

        {isLoggedIn ? (
          <button
            type="button"
            data-ocid="profile.logout_button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-white/5 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Log Out
          </button>
        ) : (
          <button
            type="button"
            data-ocid="profile.login_button"
            onClick={handleLogin}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-yellow hover:text-yellow/80 hover:bg-white/5 transition-colors"
          >
            Sign In
          </button>
        )}
      </div>
    </div>
  );
}
