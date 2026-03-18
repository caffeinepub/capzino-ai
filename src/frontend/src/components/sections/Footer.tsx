import { useEffect, useRef, useState } from "react";
import { SiFacebook, SiInstagram, SiLinkedin } from "react-icons/si";
import { useApp } from "../../context/AppContext";

const BRAND_CHARS = ["C", "A", "P", "Z", "I", "N", "O", "\u00a0", "A", "I"];
const YELLOW_IDX = new Set([8, 9]);

export default function Footer() {
  const footerRef = useRef<HTMLDivElement>(null);
  const { setShowPrivacy, setShowTerms } = useApp();
  const [brandVisible, setBrandVisible] = useState(false);

  useEffect(() => {
    const el = footerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setBrandVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <footer className="py-12 px-4 pb-6" ref={footerRef}>
      <div className="max-w-5xl mx-auto">
        <div className="bg-[#111] border border-white/10 rounded-3xl p-8 sm:p-10">
          {/* Brand animation */}
          <div className="text-center mb-10">
            <div className="inline-flex items-baseline justify-center overflow-hidden">
              {BRAND_CHARS.map((char, i) => (
                <span
                  // biome-ignore lint/suspicious/noArrayIndexKey: static brand letters
                  key={i}
                  className={`text-3xl sm:text-5xl font-black inline-block ${
                    YELLOW_IDX.has(i) ? "text-yellow" : "text-white"
                  }`}
                  style={{
                    opacity: brandVisible ? 1 : 0,
                    transform: brandVisible
                      ? "translateY(0) rotateX(0deg)"
                      : "translateY(60%) rotateX(-90deg)",
                    transition: `opacity 0.5s ease-out ${i * 0.05}s, transform 0.5s cubic-bezier(0.34,1.56,0.64,1) ${i * 0.05}s`,
                    display: "inline-block",
                  }}
                >
                  {char}
                </span>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="grid grid-cols-3 gap-6 mb-8">
            <div>
              <h4 className="text-xs font-black text-yellow uppercase tracking-widest mb-3">
                Product
              </h4>
              <ul className="space-y-2">
                {["Caption Generator", "Editor", "Templates", "Export"].map(
                  (l) => (
                    <li key={l}>
                      <button
                        type="button"
                        className="text-sm text-white/50 hover:text-white transition-colors"
                      >
                        {l}
                      </button>
                    </li>
                  ),
                )}
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-black text-yellow uppercase tracking-widest mb-3">
                Company
              </h4>
              <ul className="space-y-2">
                {["About", "Blog", "Careers", "Contact"].map((l) => (
                  <li key={l}>
                    <button
                      type="button"
                      className="text-sm text-white/50 hover:text-white transition-colors"
                    >
                      {l}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs font-black text-yellow uppercase tracking-widest mb-3">
                Support
              </h4>
              <ul className="space-y-2">
                <li>
                  <button
                    type="button"
                    onClick={() => setShowPrivacy(true)}
                    data-ocid="footer.privacy_link"
                    className="text-sm text-white/50 hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    onClick={() => setShowTerms(true)}
                    data-ocid="footer.terms_link"
                    className="text-sm text-white/50 hover:text-white transition-colors"
                  >
                    Terms of Service
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="text-sm text-white/50 hover:text-white transition-colors"
                  >
                    FAQ
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="text-sm text-white/50 hover:text-white transition-colors"
                  >
                    Help Center
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 pt-6">
            <div className="text-center mb-4">
              <p className="text-xs font-black text-white uppercase tracking-widest mb-3">
                FOLLOW US
              </p>
              <div className="flex items-center justify-center gap-3">
                <a
                  data-ocid="footer.instagram_link"
                  href="https://www.instagram.com/capzino.ai?igsh=MXQ0YjQ1bGhiZjRwbA=="
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-[#1A1A1A] border border-yellow/20 flex items-center justify-center hover:border-yellow transition-all"
                >
                  <SiInstagram className="w-4 h-4 text-yellow" />
                </a>
                <a
                  data-ocid="footer.facebook_link"
                  href="https://www.facebook.com/share/14TsisuE4si/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-[#1A1A1A] border border-yellow/20 flex items-center justify-center hover:border-yellow transition-all"
                >
                  <SiFacebook className="w-4 h-4 text-yellow" />
                </a>
                <a
                  data-ocid="footer.linkedin_link"
                  href="https://www.linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-[#1A1A1A] border border-yellow/20 flex items-center justify-center hover:border-yellow transition-all"
                >
                  <SiLinkedin className="w-4 h-4 text-yellow" />
                </a>
              </div>
            </div>

            <p className="text-center text-xs text-white/30">
              &copy; {new Date().getFullYear()}{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white/60 transition-colors"
              >
                Built with ❤ using caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
