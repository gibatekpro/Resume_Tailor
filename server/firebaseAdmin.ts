import {cert, getApps, initializeApp, type App} from "firebase-admin/app";
import {getAuth} from "firebase-admin/auth";
import {getFirestore} from "firebase-admin/firestore";
import {HttpError, NOT_CONFIGURED} from "./http.js";

// One admin app per server instance, created on first use from the service account JSON in FIREBASE_SERVICE_ACCOUNT.
const adminApp = (): App => {
    const existing = getApps()[0];
    if (existing) {
        return existing;
    }
    const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
    if (!raw) {
        console.error("FIREBASE_SERVICE_ACCOUNT is not set.");
        throw new HttpError(500, NOT_CONFIGURED);
    }
    try {
        return initializeApp({credential: cert(JSON.parse(raw))});
    } catch {
        console.error("FIREBASE_SERVICE_ACCOUNT is not a valid service account JSON.");
        throw new HttpError(500, NOT_CONFIGURED);
    }
};

export const adminFirestore = () => getFirestore(adminApp());

// The uid of the signed-in caller, from the Firebase ID token in the Authorization header.
export const requireUser = async (request: Request): Promise<string> => {
    const token = request.headers.get("authorization")?.match(/^Bearer\s+(.+)$/i)?.[1];
    if (!token) {
        throw new HttpError(401, "Please sign in to use this feature.");
    }
    const app = adminApp();
    try {
        return (await getAuth(app).verifyIdToken(token)).uid;
    } catch {
        throw new HttpError(401, "Your session has expired. Please sign in again.");
    }
};

// Admins always have AI access; anyone else needs aiAccess: true on their profile, which only an admin can set.
export const canUseAi = (profile?: {permission?: unknown, aiAccess?: unknown}) =>
    profile?.permission === "Admin" || profile?.aiAccess === true;

export const requireAiAccess = async (uid: string) => {
    const profile = await adminFirestore().collection("users").doc(uid).get();
    if (!canUseAi(profile.data())) {
        throw new HttpError(403, "Your account doesn't have access to AI tailoring yet.");
    }
};
