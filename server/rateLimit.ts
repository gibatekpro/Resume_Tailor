import {adminFirestore} from "./firebaseAdmin.js";
import {HttpError} from "./http.js";

const HOUR_MS = 60 * 60 * 1000;

export interface RateWindow {
    windowStart: number;   // ms since epoch
    count: number;
}

// Fixed-window counter: up to `limit` requests per `windowMs`, starting from the first request in the window.
export const applyRateLimit = (current: RateWindow | undefined, now: number, limit: number, windowMs: number) => {
    if (!current || now - current.windowStart >= windowMs) {
        return {allowed: true, next: {windowStart: now, count: 1}};
    }
    if (current.count >= limit) {
        return {allowed: false, next: current, retryAfterSeconds: Math.ceil((current.windowStart + windowMs - now) / 1000)};
    }
    return {allowed: true, next: {...current, count: current.count + 1}};
};

// Counts are kept in Firestore (rateLimits/{uid}) so they hold across serverless instances.
// Only the admin SDK writes there; the Firestore security rules should give clients no access to this collection.
export const enforceHourlyLimit = async (uid: string, bucket: string, limit: number) => {
    const db = adminFirestore();
    const ref = db.collection("rateLimits").doc(uid);
    const decision = await db.runTransaction(async (transaction) => {
        const snapshot = await transaction.get(ref);
        const result = applyRateLimit(snapshot.get(bucket) as RateWindow | undefined, Date.now(), limit, HOUR_MS);
        if (result.allowed) {
            transaction.set(ref, {[bucket]: result.next}, {merge: true});
        }
        return result;
    });
    if (!decision.allowed) {
        const minutes = Math.max(1, Math.ceil((decision.retryAfterSeconds || 60) / 60));
        throw new HttpError(
            429,
            `You've reached the limit of ${limit} requests per hour. Try again in about ${minutes} minute${minutes === 1 ? "" : "s"}.`,
            {"Retry-After": String(decision.retryAfterSeconds)},
        );
    }
};
