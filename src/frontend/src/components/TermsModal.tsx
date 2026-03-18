import { X } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function TermsModal() {
  const { setShowTerms } = useApp();

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div
        data-ocid="terms.dialog"
        className="animated-border rounded-3xl w-full max-w-lg max-h-[80vh]"
      >
        <div className="bg-[#111] rounded-3xl flex flex-col max-h-[80vh]">
          <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-white/10">
            <h2 className="text-lg font-bold tracking-widest uppercase text-white">
              Terms of Service
            </h2>
            <button
              type="button"
              data-ocid="terms.close_button"
              onClick={() => setShowTerms(false)}
              className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="overflow-y-auto px-6 py-4 text-sm text-white/70 leading-relaxed space-y-4">
            <p>
              <strong className="text-white">Effective Date:</strong> March 2026
            </p>
            <p>
              By accessing and using CAPZINO AI, you accept and agree to be
              bound by the terms and provisions of this agreement.
            </p>
            <h3 className="text-white font-semibold">Use of Service</h3>
            <p>
              CAPZINO AI provides AI-powered video captioning services. You
              agree to use the service only for lawful purposes and in
              accordance with these Terms. You are responsible for all content
              you upload.
            </p>
            <h3 className="text-white font-semibold">Coins and Credits</h3>
            <p>
              New users receive 200 free coins. Each successful caption
              generation deducts 30 coins. Coins are non-transferable and
              non-refundable. Pro users enjoy unlimited generations during their
              active plan period.
            </p>
            <h3 className="text-white font-semibold">Pro Subscription</h3>
            <p>
              Pro plans are billed as one-time payments for a 3-day access
              period. Pro status grants unlimited caption generation, no
              watermarks, and priority processing.
            </p>
            <h3 className="text-white font-semibold">Intellectual Property</h3>
            <p>
              You retain all rights to your uploaded videos and generated
              captions. By using our service, you grant us a limited license to
              process your content solely for delivering the service.
            </p>
            <h3 className="text-white font-semibold">
              Limitation of Liability
            </h3>
            <p>
              CAPZINO AI shall not be liable for any indirect, incidental,
              special, or consequential damages arising from your use of the
              service.
            </p>
            <h3 className="text-white font-semibold">Changes to Terms</h3>
            <p>
              We reserve the right to modify these terms at any time. Continued
              use of the service constitutes acceptance of the modified terms.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
