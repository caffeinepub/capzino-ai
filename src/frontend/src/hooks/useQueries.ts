import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CaptionProject, CaptionSegment } from "../backend";
import type { LocalUserProfile } from "../context/AppContext";
import { useActor } from "./useActor";

export function useUserProfile() {
  const { actor, isFetching } = useActor();
  return useQuery<LocalUserProfile | null>({
    queryKey: ["userProfile"],
    queryFn: async () => {
      if (!actor) return null;
      const profile = await actor.getCallerUserProfile();
      if (!profile) return null;
      return {
        name: profile.name,
        email: profile.email,
        photoUrl: profile.photoUrl ?? "",
        isPro: profile.isPro,
        proExpiry: profile.proExpiry
          ? Number(profile.proExpiry) / 1_000_000
          : undefined,
        coins: Number(profile.coins),
      };
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

export function useLibrary() {
  const { actor, isFetching } = useActor();
  return useQuery<CaptionProject[]>({
    queryKey: ["library"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getLibrary();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGenerateCaptions() {
  const { actor } = useActor();
  return useMutation<
    CaptionSegment[],
    Error,
    { videoBlobId: string; language: string }
  >({
    mutationFn: async ({ videoBlobId, language }) => {
      if (!actor) throw new Error("Not connected");
      return actor.generateCaptions({ videoBlobId, language });
    },
  });
}

export function useSaveProject() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation<
    void,
    Error,
    {
      title: string;
      videoUrl: string | null;
      captions: CaptionSegment[];
      thumbnailUrl: string | null;
      language: string;
    }
  >({
    mutationFn: async ({
      title,
      videoUrl,
      captions,
      thumbnailUrl,
      language,
    }) => {
      if (!actor) throw new Error("Not connected");
      await actor.createCaptionProject(
        title,
        videoUrl,
        captions,
        thumbnailUrl,
        language,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["library"] });
    },
  });
}

export function useSaveProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation<void, Error, LocalUserProfile>({
    mutationFn: async (profile) => {
      if (!actor) throw new Error("Not connected");
      await actor.saveCallerUserProfile({
        name: profile.name,
        email: profile.email,
        photoUrl: profile.photoUrl || undefined,
        isPro: profile.isPro,
        proExpiry: profile.proExpiry
          ? BigInt(Math.floor(profile.proExpiry * 1_000_000))
          : undefined,
        coins: BigInt(profile.coins),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userProfile"] });
    },
  });
}

export function useCreateRazorpayOrder() {
  const { actor } = useActor();
  return useMutation<
    string | null,
    Error,
    { amount: number; currency: string }
  >({
    mutationFn: async ({ amount, currency }) => {
      if (!actor) throw new Error("Not connected");
      return actor.createRazorpayOrder(BigInt(amount), currency);
    },
  });
}

export function useVerifyPayment() {
  const { actor } = useActor();
  return useMutation<
    boolean,
    Error,
    { orderId: string; paymentId: string; signature: string }
  >({
    mutationFn: async ({ orderId, paymentId, signature }) => {
      if (!actor) throw new Error("Not connected");
      return actor.verifyRazorpayPayment({ orderId, paymentId, signature });
    },
  });
}
