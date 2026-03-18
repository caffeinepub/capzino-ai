import { X } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function PrivacyModal() {
  const { setShowPrivacy } = useApp();

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div
        data-ocid="privacy.dialog"
        className="animated-border rounded-3xl w-full max-w-lg max-h-[80vh]"
      >
        <div className="bg-[#111] rounded-3xl flex flex-col max-h-[80vh]">
          <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-white/10">
            <h2 className="text-lg font-bold tracking-widest uppercase text-white">
              Privacy Policy
            </h2>
            <button
              type="button"
              data-ocid="privacy.close_button"
              onClick={() => setShowPrivacy(false)}
              className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="overflow-y-auto px-6 py-4 text-sm text-white/70 leading-relaxed space-y-4">
            <p>
              <strong className="text-white">Last Updated:</strong> March 2026
            </p>
            <p>
              CAPZINO AI (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is
              committed to protecting your privacy. This Privacy Policy explains
              how we collect, use, and safeguard your information when you use
              our platform.
            </p>
            <h3 className="text-white font-semibold">Information We Collect</h3>
            <p>
              We collect information you provide directly to us, such as your
              name, email address, and payment information. We also collect
              information automatically when you use our service, including
              usage data and uploaded video files.
            </p>
            <h3 className="text-white font-semibold">
              How We Use Your Information
            </h3>
            <p>
              We use the information we collect to provide, maintain, and
              improve our services, process transactions, send you technical
              notices, and respond to your comments and questions.
            </p>
            <h3 className="text-white font-semibold">Video Data</h3>
            <p>
              Videos uploaded to CAPZINO AI are processed solely for the purpose
              of generating captions. We do not share, sell, or distribute your
              video content to third parties.
            </p>
            <h3 className="text-white font-semibold">Data Security</h3>
            <p>
              We implement appropriate technical and organizational measures to
              protect your personal information against unauthorized access,
              alteration, disclosure, or destruction.
            </p>
            <h3 className="text-white font-semibold">Contact Us</h3>
            <p>
              If you have any questions about this Privacy Policy, please
              contact us through our social media channels or website.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
