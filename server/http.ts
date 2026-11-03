// Shared plumbing for the serverless functions in /api.
// Relative imports in /api and /server end in ".js": Vercel runs them as plain ES modules, which need the extension.

// An error whose message is safe to show the user.
export class HttpError extends Error {
    status: number;
    headers?: Record<string, string>;

    constructor(status: number, message: string, headers?: Record<string, string>) {
        super(message);
        this.status = status;
        this.headers = headers;
    }
}

export const json = (status: number, body: unknown, headers: Record<string, string> = {}) =>
    new Response(JSON.stringify(body), {
        status,
        headers: {"Content-Type": "application/json", "Cache-Control": "no-store", ...headers},
    });

// Wraps a handler so every failure becomes a friendly JSON error.
// Only the error's name and code are logged: messages can quote the request, which holds the user's CV.
export const handle = (handler: (request: Request) => Promise<Response>) =>
    async (request: Request): Promise<Response> => {
        try {
            return await handler(request);
        } catch (error) {
            if (error instanceof HttpError) {
                return json(error.status, {error: error.message}, error.headers);
            }
            const code = (error as {code?: unknown})?.code;
            console.error("Unexpected server error:", error instanceof Error ? error.name : typeof error, typeof code === "string" ? code : "");
            return json(500, {error: "Something went wrong on our side. Please try again."});
        }
    };

const TOO_LARGE = "The job advert and CV are too large to send.";

// The request body as JSON, reading at most `maxBytes`. A declared content-length over the cap is rejected
// before reading; a chunked body without one is cut off as soon as it passes the cap.
export const readJsonBody = async (request: Request, maxBytes: number): Promise<unknown> => {
    if (Number(request.headers.get("content-length")) > maxBytes) {
        throw new HttpError(413, TOO_LARGE);
    }
    if (!request.body) {
        return undefined;
    }
    const reader = request.body.getReader();
    const chunks: Uint8Array[] = [];
    let size = 0;
    for (;;) {
        const {done, value} = await reader.read();
        if (done) break;
        size += value.byteLength;
        if (size > maxBytes) {
            await reader.cancel();
            throw new HttpError(413, TOO_LARGE);
        }
        chunks.push(value);
    }
    try {
        return JSON.parse(Buffer.concat(chunks).toString("utf8"));
    } catch {
        return undefined;
    }
};

export const NOT_CONFIGURED = "The server isn't set up correctly yet. Please contact the site owner.";

// Reads a positive whole number from an env var, falling back to a default.
export const numberFromEnv = (name: string, fallback: number) => {
    const value = Number(process.env[name]);
    return Number.isInteger(value) && value > 0 ? value : fallback;
};
