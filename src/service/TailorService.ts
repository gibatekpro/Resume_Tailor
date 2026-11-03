import axios from "axios";
import {auth} from "../Firebase";
import type {StepCaller, StepRequest} from "../utils/tailoringPipeline";

// The browser never talks to OpenAI: it calls our serverless functions in /api, which hold the key.
// Each call carries the user's Firebase ID token so the server knows who is asking.
const authHeaders = async () => {
    await auth.authStateReady();
    if (!auth.currentUser) {
        throw new Error("Please sign in again to continue.");
    }
    return {Authorization: `Bearer ${await auth.currentUser.getIdToken()}`};
};

// The server sends back a friendly { error } message; fall back to a generic one if it didn't.
const toReadableError = (error: unknown) => {
    if (axios.isAxiosError(error)) {
        const message = error.response?.data?.error;
        if (typeof message === "string" && message) {
            return new Error(message);
        }
        return new Error(error.response
            ? "The server couldn't complete the request. Please try again."
            : "Couldn't reach the server. Check your connection and try again.");
    }
    return error instanceof Error ? error : new Error(String(error));
};

// One step of the tailoring pipeline (see utils/tailoringPipeline.ts).
export const callTailorStep = (async (request: StepRequest) => {
    try {
        const response = await axios.post("/api/tailor", request, {headers: await authHeaders()});
        return response.data;
    } catch (error) {
        throw toReadableError(error);
    }
}) as StepCaller;

// Chat models available to the server's API key, newest first.
export const fetchAvailableModels = async (): Promise<string[]> => {
    try {
        const response = await axios.get("/api/models", {headers: await authHeaders()});
        return response.data?.models || [];
    } catch (error) {
        throw toReadableError(error);
    }
};
