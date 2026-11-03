import { fileURLToPath, URL } from 'node:url';
import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import fs from 'fs';
import path from 'path';
import child_process from 'child_process';
import { env } from 'process';

const getHttpsForLocalDev = () => {
    const baseFolder =
        env.APPDATA !== undefined && env.APPDATA !== ''
            ? `${env.APPDATA}/ASP.NET/https`
            : `${env.HOME}/.aspnet/https`;

    const certificateName = 'appdock.client';
    const certFilePath = path.join(baseFolder, `${certificateName}.pem`);
    const keyFilePath = path.join(baseFolder, `${certificateName}.key`);

    if (!fs.existsSync(baseFolder)) {
        fs.mkdirSync(baseFolder, { recursive: true });
    }

    if (!fs.existsSync(certFilePath) || !fs.existsSync(keyFilePath)) {
        if (0 !== child_process.spawnSync('dotnet', [
            'dev-certs', 'https',
            '--export-path', certFilePath,
            '--format', 'Pem',
            '--no-password',
        ], { stdio: 'inherit' }).status) {
            throw new Error('Could not create certificate.');
        }
    }

    return {
        key: fs.readFileSync(keyFilePath),
        cert: fs.readFileSync(certFilePath),
    };
};

// Serves the Vercel functions in /api during `npm run dev`, so local development doesn't need the Vercel CLI.
// Each file exports handlers named after HTTP methods that take a Request and return a Response, as on Vercel.
const devApi = (): Plugin => ({
    name: 'dev-api',
    configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
            const url = new URL(req.url ?? '/', 'http://localhost');
            const name = url.pathname.match(/^\/api\/([\w-]+)$/)?.[1];
            if (!name || !fs.existsSync(path.resolve('api', `${name}.ts`))) {
                return next();
            }
            try {
                const handler = (await server.ssrLoadModule(`/api/${name}.ts`))[req.method ?? 'GET'];
                if (typeof handler !== 'function') {
                    res.statusCode = 405;
                    return res.end();
                }
                const chunks: Buffer[] = [];
                for await (const chunk of req) {
                    chunks.push(chunk as Buffer);
                }
                const headers = new Headers();
                for (const [key, value] of Object.entries(req.headers)) {
                    // HTTP/2 pseudo-headers (":method", ":path") aren't valid in a Request.
                    if (value !== undefined && !key.startsWith(':')) {
                        headers.set(key, Array.isArray(value) ? value.join(', ') : value);
                    }
                }
                const response: Response = await handler(new Request(url, {
                    method: req.method,
                    headers,
                    body: chunks.length > 0 ? Buffer.concat(chunks) : undefined,
                }));
                res.statusCode = response.status;
                response.headers.forEach((value, key) => res.setHeader(key, value));
                res.end(Buffer.from(await response.arrayBuffer()));
            } catch (error) {
                next(error);
            }
        });
    },
});

export default defineConfig(({ command, mode }) => {
    const isLocalServe = command === 'serve' && !env.VERCEL;
    // Server-only vars (OPENAI_API_KEY, FIREBASE_SERVICE_ACCOUNT) for the dev API. Only VITE_* vars reach the browser.
    for (const [key, value] of Object.entries(loadEnv(mode, process.cwd(), ''))) {
        env[key] ??= value;
    }

    return {
        plugins: [tailwindcss(), react(), devApi()],
        resolve: {
            alias: {
                '@': fileURLToPath(new URL('./src', import.meta.url)),
            },
        },
        base: '/',
        server: {
            port: parseInt(env.DEV_SERVER_PORT || '62656'),
            https: isLocalServe ? getHttpsForLocalDev() : undefined,
        },
    };
});
