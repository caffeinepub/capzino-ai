import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
  useEffect,
} from "react";
import type { CaptionSegment } from "../backend";

export type Screen = "home" | "editor" | "library" | "plan";
export type Language = "HINDI" | "ENGLISH" | "HINGLISH";
export type SubtitleFont =
  | "Montserrat"
  | "Poppins"
  | "Impact"
  | "Anton"
  | "Oswald"
  | "Roboto"
  | "League Spartan"
  | "Bebas Neue"
  | "Archivo Black";
export type SubtitleSize = "small" | "medium" | "large";
export type SubtitlePosition = "top" | "middle" | "bottom";
export type SubtitleTemplate =
  | "white-minimal"
  | "yellow-highlight"
  | "red-yellow"
  | "neon-blue"
  | "neon-green"
  | "purple-highlight"
  | "black-bar"
  | "white-shadow"
  | "pink-glow"
  | "bold-viral";

export interface SubtitleStyle {
  font: SubtitleFont;
  size: SubtitleSize;
  position: SubtitlePosition;
  template: SubtitleTemplate;
  uppercase: boolean;
  highlight: boolean;
}

export interface LocalUserProfile {
  name: string;
  email: string;
  photoUrl: string;
  isPro: boolean;
  proExpiry?: number; // ms timestamp
  coins: number;
}

export interface AppProject {
  title: string;
  videoFile: File | null;
  videoBlobId: string | null;
  videoUrl: string | null;
  language: Language;
  captions: CaptionSegment[];
  subtitleStyle: SubtitleStyle;
  isNew: boolean;
  thumbnailUrl?: string;
  createdAt?: number;
}

const DEFAULT_SUBTITLE_STYLE: SubtitleStyle = {
  font: "Montserrat",
  size: "medium",
  position: "bottom",
  template: "yellow-highlight",
  uppercase: true,
  highlight: true,
};

export const DEFAULT_PROJECT: AppProject = {
  title: "My Project",
  videoFile: null,
  videoBlobId: null,
  videoUrl: null,
  language: "HINGLISH",
  captions: [],
  subtitleStyle: DEFAULT_SUBTITLE_STYLE,
  isNew: true,
};

interface AppContextValue {
  coins: number;
  setCoins: (n: number) => void;
  deductCoins: (n: number) => void;
  userProfile: LocalUserProfile | null;
  setUserProfile: (p: LocalUserProfile | null) => void;
  screen: Screen;
  setScreen: (s: Screen) => void;
  project: AppProject;
  setProject: (p: AppProject) => void;
  updateSubtitleStyle: (style: Partial<SubtitleStyle>) => void;
  isGenerating: boolean;
  setGenerating: (b: boolean) => void;
  generateProgress: number;
  setGenerateProgress: (n: number) => void;
  showProModal: boolean;
  setShowProModal: (b: boolean) => void;
  showPrivacy: boolean;
  setShowPrivacy: (b: boolean) => void;
  showTerms: boolean;
  setShowTerms: (b: boolean) => void;
  activatePro: (expiryMs: number) => void;
  isProActive: boolean;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [coins, setCoinsState] = useState(200);
  const [userProfile, setUserProfileState] = useState<LocalUserProfile | null>(
    null,
  );
  const [screen, setScreen] = useState<Screen>("home");
  const [project, setProjectState] = useState<AppProject>(DEFAULT_PROJECT);
  const [isGenerating, setGenerating] = useState(false);
  const [generateProgress, setGenerateProgress] = useState(0);
  const [showProModal, setShowProModal] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  // Check if Pro is active
  const isProActive =
    !!userProfile?.isPro &&
    (!userProfile?.proExpiry || userProfile.proExpiry > Date.now());

  const setCoins = useCallback((n: number) => {
    setCoinsState(n);
    setUserProfileState((prev) => (prev ? { ...prev, coins: n } : prev));
  }, []);

  const deductCoins = useCallback((n: number) => {
    setCoinsState((prev) => Math.max(0, prev - n));
    setUserProfileState((prev) =>
      prev ? { ...prev, coins: Math.max(0, prev.coins - n) } : prev,
    );
  }, []);

  const setUserProfile = useCallback((p: LocalUserProfile | null) => {
    setUserProfileState(p);
    if (p) setCoinsState(p.coins);
  }, []);

  const setProject = useCallback((p: AppProject) => {
    setProjectState(p);
  }, []);

  const updateSubtitleStyle = useCallback((style: Partial<SubtitleStyle>) => {
    setProjectState((prev) => ({
      ...prev,
      subtitleStyle: { ...prev.subtitleStyle, ...style },
    }));
  }, []);

  const activatePro = useCallback((expiryMs: number) => {
    setUserProfileState((prev) =>
      prev
        ? { ...prev, isPro: true, proExpiry: expiryMs }
        : {
            name: "User",
            email: "",
            photoUrl: "",
            isPro: true,
            proExpiry: expiryMs,
            coins: 200,
          },
    );
  }, []);

  // Revoke video object URLs on project change to prevent memory leaks
  useEffect(() => {
    return () => {
      if (project.videoUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(project.videoUrl);
      }
    };
  }, [project.videoUrl]);

  return (
    <AppContext.Provider
      value={{
        coins,
        setCoins,
        deductCoins,
        userProfile,
        setUserProfile,
        screen,
        setScreen,
        project,
        setProject,
        updateSubtitleStyle,
        isGenerating,
        setGenerating,
        generateProgress,
        setGenerateProgress,
        showProModal,
        setShowProModal,
        showPrivacy,
        setShowPrivacy,
        showTerms,
        setShowTerms,
        activatePro,
        isProActive,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
