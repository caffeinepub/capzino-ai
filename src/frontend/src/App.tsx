import { Toaster } from "@/components/ui/sonner";
import { useEffect } from "react";
import Editor from "./components/Editor";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import Library from "./components/Library";
import Loader from "./components/Loader";
import PlanPage from "./components/PlanPage";
import PrivacyModal from "./components/PrivacyModal";
import ProUpgradeModal from "./components/ProUpgradeModal";
import TermsModal from "./components/TermsModal";
import DemoVideos from "./components/sections/DemoVideos";
import Features from "./components/sections/Features";
import Footer from "./components/sections/Footer";
import FounderSlider from "./components/sections/FounderSlider";
import HowItWorks from "./components/sections/HowItWorks";
import Reviews from "./components/sections/Reviews";
import TrustBadges from "./components/sections/TrustBadges";
import { AppProvider, useApp } from "./context/AppContext";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { useUserProfile } from "./hooks/useQueries";

function AppInner() {
  const {
    screen,
    isGenerating,
    showProModal,
    showPrivacy,
    showTerms,
    setUserProfile,
  } = useApp();
  const { identity } = useInternetIdentity();
  const { data: backendProfile } = useUserProfile();

  // Sync backend profile to app context
  useEffect(() => {
    if (backendProfile && identity) {
      setUserProfile(backendProfile);
    }
  }, [backendProfile, identity, setUserProfile]);

  if (screen === "editor") {
    return (
      <div className="min-h-screen bg-[#0B0B0B]">
        {isGenerating && <Loader />}
        <Editor />
        {showProModal && <ProUpgradeModal />}
        {showPrivacy && <PrivacyModal />}
        {showTerms && <TermsModal />}
        <Toaster />
      </div>
    );
  }

  if (screen === "library") {
    return (
      <div className="min-h-screen bg-[#0B0B0B]">
        <Header />
        <Library />
        {showProModal && <ProUpgradeModal />}
        {showPrivacy && <PrivacyModal />}
        {showTerms && <TermsModal />}
        <Toaster />
      </div>
    );
  }

  if (screen === "plan") {
    return (
      <div className="min-h-screen bg-[#0B0B0B]">
        <Header />
        <PlanPage />
        {showProModal && <ProUpgradeModal />}
        {showPrivacy && <PrivacyModal />}
        {showTerms && <TermsModal />}
        <Toaster />
      </div>
    );
  }

  // Home screen
  return (
    <div className="min-h-screen bg-[#0B0B0B] overflow-x-hidden">
      {isGenerating && <Loader />}
      <Header />
      <main>
        <HeroSection />
        <DemoVideos />
        <Features />
        <HowItWorks />
        <Reviews />
        <FounderSlider />
        <TrustBadges />
        <Footer />
      </main>
      {showProModal && <ProUpgradeModal />}
      {showPrivacy && <PrivacyModal />}
      {showTerms && <TermsModal />}
      <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppInner />
    </AppProvider>
  );
}
