import fs from "fs";
import path from "path";

const env = {};
const envPath = path.resolve(process.cwd(), "../local.env");
if (fs.existsSync(envPath)) {
    const envFile = fs.readFileSync(envPath, "utf8");
    envFile.split("\n").forEach((line) => {
        const trimmedLine = line.trim();
        if (trimmedLine && !trimmedLine.startsWith("#")) {
            const [key, ...valueParts] = trimmedLine.split("=");
            if (key) {
                const k = key.trim();
                const v = valueParts.join("=").trim();
                process.env[k] = v;
                if (k.startsWith("NEXT_PUBLIC_")) {
                    env[k] = v;
                }
            }
        }
    });
}

const nextConfig = {
    env,
    turbopack: {},
    webpack: (config, { isServer }) => {
        config.optimization.splitChunks = {
            chunks: "all",
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "vendors",
                    chunks: "all",
                },
                interactive: {
                    test: /InteractiveView|3D/,
                    name: "interactive-chunk",
                    priority: 10,
                },
            },
        };
        return config;
    },
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "images.unsplash.com",
            },
            {
                protocol: "https",
                hostname: "picsum.photos",
            },
            {
                protocol: "https",
                hostname: "i.pravatar.cc",
            },
            {
                protocol: "https",
                hostname: "www.transparenttextures.com",
            },
        ],
    },
    reactStrictMode: true,
    reactCompiler: true,
};

export default nextConfig;
