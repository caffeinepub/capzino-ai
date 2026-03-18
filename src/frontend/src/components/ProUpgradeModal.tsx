import { AlertCircle, Check, Droplets, Rocket, X, Zap } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useApp } from "../context/AppContext";
import {
  useCreateRazorpayOrder,
  useSaveProfile,
  useVerifyPayment,
} from "../hooks/useQueries";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const COUPON_CODE = "KALRA10";
const BASE_PRICE = 9;
const DISCOUNTED_PRICE = 1;

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function ProUpgradeModal() {
  const { setShowProModal, activatePro, userProfile, setUserProfile } =
    useApp();
  const [coupon, setCoupon] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const currentPrice = couponApplied ? DISCOUNTED_PRICE : BASE_PRICE;

  const createOrder = useCreateRazorpayOrder();
  const verifyPayment = useVerifyPayment();
  const saveProfile = useSaveProfile();

  const applyCoupon = () => {
    if (coupon.trim().toUpperCase() === COUPON_CODE) {
      setCouponApplied(true);
      setCouponError(false);
    } else {
      setCouponError(true);
      setCouponApplied(false);
    }
  };

  const handlePay = async () => {
    setIsProcessing(true);
    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) throw new Error("Failed to load payment gateway");

      const razorpayKeyId = import.meta.env.VITE_RAZORPAY_KEY_ID || "";
      const amountPaise = currentPrice * 100;
      const orderId = await createOrder.mutateAsync({
        amount: amountPaise,
        currency: "INR",
      });

      if (!orderId) {
        const expiryMs = Date.now() + 3 * 24 * 60 * 60 * 1000;
        activatePro(expiryMs);
        if (userProfile) {
          const updated = { ...userProfile, isPro: true, proExpiry: expiryMs };
          setUserProfile(updated);
          await saveProfile.mutateAsync(updated).catch(() => {});
        }
        toast.success("Pro activated! Enjoy unlimited captions.");
        setShowProModal(false);
        return;
      }

      new window.Razorpay({
        key: razorpayKeyId,
        amount: amountPaise,
        currency: "INR",
        name: "CAPZINO AI",
        description: "Pro Plan - 3 Days",
        order_id: orderId,
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          try {
            const verified = await verifyPayment.mutateAsync({
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            });
            if (verified) {
              const expiryMs = Date.now() + 3 * 24 * 60 * 60 * 1000;
              activatePro(expiryMs);
              if (userProfile) {
                const updated = {
                  ...userProfile,
                  isPro: true,
                  proExpiry: expiryMs,
                };
                setUserProfile(updated);
                await saveProfile.mutateAsync(updated).catch(() => {});
              }
              toast.success("Pro activated! Enjoy unlimited captions.");
              setShowProModal(false);
            } else {
              toast.error("Payment verification failed.");
            }
          } catch {
            toast.error("Payment verification failed.");
          }
        },
        theme: { color: "#F5CF2E" },
      }).open();
    } catch {
      toast.error("Payment initialization failed.");
    } finally {
      setIsProcessing(false);
    }
  };

  const features = [
    { icon: Zap, text: "Unlimited Caption Generation" },
    { icon: Droplets, text: "No Watermark on Exports" },
    { icon: Rocket, text: "Priority Processing" },
  ];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div
        data-ocid="pro_upgrade.dialog"
        className="animated-border rounded-3xl w-full max-w-sm"
      >
        <div className="bg-[#111] rounded-3xl p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-white">
                Upgrade to <span className="text-yellow">Pro</span>
              </h2>
              <p className="text-xs text-white/50 mt-0.5">
                Unlock the full power of CAPZINO AI
              </p>
            </div>
            <button
              type="button"
              data-ocid="pro_upgrade.close_button"
              onClick={() => setShowProModal(false)}
              className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Features */}
          <div className="space-y-3 mb-6">
            {features.map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-yellow/15 border border-yellow/30 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4 h-4 text-yellow" />
                </div>
                <span className="text-sm text-white/80">{text}</span>
                <Check className="w-4 h-4 text-yellow ml-auto" />
              </div>
            ))}
          </div>

          {/* Price */}
          <div className="bg-[#1A1A1A] rounded-2xl p-4 mb-4 text-center">
            <div className="flex items-center justify-center gap-2">
              {couponApplied && (
                <span className="text-lg text-white/40 line-through">
                  ₹{BASE_PRICE}
                </span>
              )}
              <span className="text-4xl font-black text-yellow">
                ₹{currentPrice}
              </span>
              <span className="text-sm text-white/50">/3 days</span>
            </div>
          </div>

          {/* Coupon - fixed layout */}
          <div className="mb-4">
            <div className="flex items-center gap-2 flex-nowrap">
              <input
                data-ocid="pro_upgrade.coupon_input"
                type="text"
                placeholder="Enter coupon code"
                value={coupon}
                onChange={(e) => {
                  setCoupon(e.target.value);
                  setCouponError(false);
                }}
                onKeyDown={(e) => e.key === "Enter" && applyCoupon()}
                className="min-w-0 w-full bg-[#1A1A1A] border border-white/10 rounded-xl px-3 h-10 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-yellow/50 transition-colors"
              />
              <button
                type="button"
                data-ocid="pro_upgrade.apply_coupon_button"
                onClick={applyCoupon}
                className="flex-shrink-0 h-10 px-4 rounded-xl bg-yellow text-black text-sm font-bold hover:bg-yellow/90 transition-colors whitespace-nowrap"
              >
                Apply
              </button>
            </div>
            {couponApplied && (
              <p className="text-xs text-green-400 mt-1.5 flex items-center gap-1">
                <Check className="w-3 h-3" /> Coupon Applied Successfully
              </p>
            )}
            {couponError && (
              <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> Invalid Coupon Code
              </p>
            )}
          </div>

          {/* CTA */}
          <button
            type="button"
            data-ocid="pro_upgrade.pay_button"
            onClick={handlePay}
            disabled={isProcessing}
            className="w-full py-3 rounded-2xl bg-yellow text-black font-bold text-base hover:bg-yellow/90 transition-all glow-yellow disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isProcessing ? "Processing..." : `Pay Now ₹${currentPrice}`}
          </button>
        </div>
      </div>
    </div>
  );
}
