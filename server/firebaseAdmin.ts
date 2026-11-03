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
