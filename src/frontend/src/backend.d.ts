import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface CaptionSegment {
    end: bigint;
    text: string;
    start: bigint;
}
export type Time = bigint;
export interface CaptionProject {
    title: string;
    thumbnailUrl?: string;
    createdAt: Time;
    language: string;
    captions: Array<CaptionSegment>;
    videoUrl?: string;
}
export interface CaptionRequest {
    videoBlobId: string;
    language: string;
}
export interface TemporalCaptionProject {
    deletionTime: Time;
    project: CaptionProject;
}
export interface RazorpayPaymentVerification {
    signature: string;
    orderId: string;
    paymentId: string;
}
export interface UserProfile {
    name: string;
    coins: bigint;
    photoUrl?: string;
    email: string;
    isPro: boolean;
    proExpiry?: Time;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createCaptionProject(title: string, videoUrl: string | null, captions: Array<CaptionSegment>, thumbnailUrl: string | null, language: string): Promise<void>;
    createRazorpayOrder(amount: bigint, currency: string): Promise<string | null>;
    deleteCaptionProject(title: string): Promise<void>;
    deleteCaptionProjectWithCooldown(title: string): Promise<void>;
    generateCaptions(request: CaptionRequest): Promise<Array<CaptionSegment>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getLibrary(): Promise<Array<CaptionProject>>;
    getProject(title: string): Promise<CaptionProject | null>;
    getTemporaryProjects(): Promise<Array<TemporalCaptionProject>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    verifyRazorpayPayment(verification: RazorpayPaymentVerification): Promise<boolean>;
}
