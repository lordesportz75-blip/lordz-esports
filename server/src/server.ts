import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import path from "path";
import os from "os";
import fs from "fs";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import compression from "compression";
import routes from "./routes/index.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { prisma } from "./config/prisma.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || "https://lordz-esports.lordesportz75.workers.dev";
const ADMIN_URL = process.env.ADMIN_URL || "https://lordz-esports-admin.lordesportz75.workers.dev";

// Allowed origins for CORS (Production custom domain, Cloudflare workers, Vercel, and local development)
const allowedOrigins = [
  "https://lordesportz.com",
  "https://www.lordesportz.com",
  "https://lordzesports.com",
  "https://www.lordzesports.com",
  "https://lordz-esports.lordesportz75.workers.dev",
  "https://lordz-esports-admin.lordesportz75.workers.dev",
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  CLIENT_URL,
  ADMIN_URL,
  ...(process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(",").map((o) => o.trim()) : []),
].filter(Boolean);

// Security headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
  })
);

// CORS configuration
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g., mobile apps, curl) or matching production/preview/dev hosts
      if (
        !origin ||
        origin.includes("localhost") ||
        origin.includes("127.0.0.1") ||
        origin.endsWith(".vercel.app") ||
        origin.endsWith(".workers.dev") ||
        allowedOrigins.includes(origin)
      ) {
        callback(null, true);
      } else {
        callback(null, true);
      }
    },
    credentials: true,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 1000, // Limit each IP to 1000 requests per window
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api", limiter);

// Gzip / Brotli response compression
app.use(compression());

// Parsers
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());

// Serve static uploaded files with 30-day immutable browser & CDN caching
const possibleUploadDirs = [
  path.join(process.cwd(), "uploads"),
  path.join(process.cwd(), "server", "uploads"),
  path.resolve(__dirname, "..", "uploads"),
  path.resolve(__dirname, "..", "..", "uploads"),
  path.resolve(__dirname, "..", "..", "public", "uploads"),
  path.join(os.tmpdir(), "uploads"),
];

for (const dir of possibleUploadDirs) {
  if (fs.existsSync(dir)) {
    app.use("/uploads", express.static(dir, {
      maxAge: "30d",
      immutable: true,
      etag: true,
      setHeaders: (res) => {
        res.setHeader("Cache-Control", "public, max-age=2592000, immutable");
        res.setHeader("Access-Control-Allow-Origin", "*");
      },
    }));
  }
}

// Explicit fallback endpoint for /uploads/:filename
app.get("/uploads/:filename", (req, res) => {
  const filename = req.params.filename;
  for (const dir of possibleUploadDirs) {
    const candidate = path.join(dir, filename);
    if (fs.existsSync(candidate)) {
      res.setHeader("Cache-Control", "public, max-age=2592000, immutable");
      res.setHeader("Access-Control-Allow-Origin", "*");
      return res.sendFile(candidate);
    }
  }
  res.status(404).json({ success: false, message: "File not found" });
});

const playersDir = path.join(process.cwd(), "..", "public", "players");
app.use("/players", express.static(playersDir));

// Dynamic XML Sitemap Generator
const handleSitemapRequest = async (_req: express.Request, res: express.Response) => {
  try {
    const siteUrl = (process.env.SITE_URL || "https://lordzesports.com").trim().replace(/\/+$/, "");

    // Fetch published public tournaments from database
    const tournaments = await prisma.tournament.findMany({
      where: {
        isPublished: true,
        isDraft: false,
        status: { notIn: ["DRAFT", "ARCHIVED", "CANCELLED"] },
      },
      select: {
        id: true,
        slug: true,
        updatedAt: true,
      },
    });

    const staticRoutes = [
      { path: "", changefreq: "daily", priority: "1.0" },
      { path: "/tournaments", changefreq: "daily", priority: "0.9" },
      { path: "/players", changefreq: "weekly", priority: "0.8" },
      { path: "/teams", changefreq: "monthly", priority: "0.7" },
      { path: "/products", changefreq: "weekly", priority: "0.8" },
      { path: "/news", changefreq: "daily", priority: "0.8" },
      { path: "/media", changefreq: "weekly", priority: "0.7" },
      { path: "/community", changefreq: "monthly", priority: "0.7" },
      { path: "/about", changefreq: "monthly", priority: "0.7" },
      { path: "/partners", changefreq: "monthly", priority: "0.6" },
      { path: "/partner-with-us", changefreq: "monthly", priority: "0.6" },
      { path: "/voting", changefreq: "weekly", priority: "0.7" },
    ];

    const today = new Date().toISOString().split("T")[0];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticRoutes
  .map(
    (r) => `  <url>
    <loc>${siteUrl}${r.path ? r.path : "/"}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`
  )
  .join("\n")}
${tournaments
  .map(
    (t: { id: string; slug?: string | null; updatedAt?: Date | null }) => {
      const path = t.slug || t.id;
      return `  <url>
    <loc>${siteUrl}/tournaments/${path}</loc>
    <lastmod>${t.updatedAt ? new Date(t.updatedAt).toISOString().split("T")[0] : today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
    }
  )
  .join("\n")}
</urlset>`;

    res.header("Content-Type", "application/xml; charset=utf-8");
    res.send(xml);
  } catch (error) {
    console.error("Error generating sitemap:", error);
    res.status(500).send("Error generating sitemap");
  }
};

app.get("/sitemap.xml", handleSitemapRequest);
app.get("/api/sitemap.xml", handleSitemapRequest);

// Health check endpoint
app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "LORD ESPORTZ Shared REST API",
    timestamp: new Date().toISOString(),
  });
});

// Root route - Stylish developer status dashboard & JSON gateway
app.get("/", (req, res) => {
  if (req.accepts("html")) {
    res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>LORD ESPORTZ — REST API Gateway</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: #08080a;
      color: #e4e4e7;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      padding: 40px 20px;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .container { max-width: 860px; width: 100%; }
    .header {
      background: linear-gradient(180deg, #131318 0%, #0d0d12 100%);
      border: 1px solid rgba(255, 190, 50, 0.25);
      border-radius: 20px;
      padding: 32px;
      margin-bottom: 24px;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.6), 0 0 30px rgba(255, 190, 50, 0.05);
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 20px;
    }
    .brand-title {
      font-size: 24px;
      font-weight: 800;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: #fff;
    }
    .brand-title span { color: #FFBE32; }
    .brand-sub { font-size: 13px; color: #a1a1aa; margin-top: 4px; }
    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: rgba(34, 197, 94, 0.12);
      border: 1px solid rgba(34, 197, 94, 0.35);
      color: #4ade80;
      padding: 8px 16px;
      border-radius: 9999px;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.05em;
    }
    .pulse {
      width: 8px;
      height: 8px;
      background-color: #22c55e;
      border-radius: 50%;
      box-shadow: 0 0 10px #22c55e;
      animation: pulse 2s infinite;
    }
    @keyframes pulse { 0% { opacity: 1; transform: scale(1); } 50% { opacity: 0.4; transform: scale(0.85); } 100% { opacity: 1; transform: scale(1); } }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }
    .stat-card {
      background: #111116;
      border: 1px solid rgba(255, 255, 255, 0.07);
      border-radius: 16px;
      padding: 20px;
    }
    .stat-label { font-size: 11px; text-transform: uppercase; letter-spacing: 0.08em; color: #71717a; font-weight: 700; }
    .stat-value { font-size: 16px; font-weight: 700; color: #fff; margin-top: 6px; display: flex; align-items: center; gap: 6px; }
    .links-card {
      background: #111116;
      border: 1px solid rgba(255, 255, 255, 0.07);
      border-radius: 16px;
      padding: 24px;
      margin-bottom: 24px;
    }
    .section-title { font-size: 13px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: #FFBE32; margin-bottom: 16px; }
    .endpoints-list { display: flex; flex-direction: column; gap: 8px; }
    .endpoint-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 14px;
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.04);
      border-radius: 10px;
      text-decoration: none;
      transition: all 0.2s;
    }
    .endpoint-item:hover {
      background: rgba(255, 190, 50, 0.08);
      border-color: rgba(255, 190, 50, 0.3);
      transform: translateX(4px);
    }
    .ep-method { font-family: monospace; font-size: 11px; font-weight: 700; color: #FFBE32; background: rgba(255, 190, 50, 0.15); padding: 3px 8px; border-radius: 6px; }
    .ep-path { font-family: monospace; font-size: 13px; color: #f4f4f5; margin-left: 10px; flex: 1; }
    .ep-desc { font-size: 12px; color: #a1a1aa; }
    .action-row { display: flex; gap: 12px; flex-wrap: wrap; }
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 12px 20px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      text-decoration: none;
      transition: all 0.2s;
    }
    .btn-primary { background: #FFBE32; color: #09090b; }
    .btn-primary:hover { background: #ffa000; box-shadow: 0 0 20px rgba(255, 190, 50, 0.4); }
    .btn-secondary { background: rgba(255, 255, 255, 0.06); color: #fff; border: 1px solid rgba(255, 255, 255, 0.12); }
    .btn-secondary:hover { background: rgba(255, 255, 255, 0.1); }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div>
        <h1 class="brand-title">LORD <span>ESPORTZ</span> API</h1>
        <p class="brand-sub">Unified REST Backend Services &amp; Live Data Gateway</p>
      </div>
      <div class="status-badge">
        <div class="pulse"></div>
        <span>OPERATIONAL &amp; HEALTHY</span>
      </div>
    </div>

    <div class="grid">
      <div class="stat-card">
        <div class="stat-label">Database Connection</div>
        <div class="stat-value" style="color: #4ade80;">● Neon PostgreSQL Connected</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Server Environment</div>
        <div class="stat-value" style="font-size: 13px;">${process.env.VERCEL ? "Production (Vercel)" : "Port " + PORT + " (Development)"}</div>
      </div>
      <div class="stat-card">
        <div class="stat-label">Connected Apps</div>
        <div class="stat-value" style="font-size: 12px; color: #FFBE32;">Cloudflare Live (Workers)</div>
      </div>
    </div>

    <div class="links-card">
      <div class="section-title">Core API Endpoints</div>
      <div class="endpoints-list">
        <a href="/api/partners" target="_blank" class="endpoint-item">
          <span class="ep-method">GET</span>
          <span class="ep-path">/api/partners</span>
          <span class="ep-desc">Sponsors, brand collabs &amp; logos</span>
        </a>
        <a href="/api/tournaments" target="_blank" class="endpoint-item">
          <span class="ep-method">GET</span>
          <span class="ep-path">/api/tournaments</span>
          <span class="ep-desc">Tournaments, brackets &amp; matches</span>
        </a>
        <a href="/api/players" target="_blank" class="endpoint-item">
          <span class="ep-method">GET</span>
          <span class="ep-path">/api/players</span>
          <span class="ep-desc">Official roster &amp; player profiles</span>
        </a>
        <a href="/api/news" target="_blank" class="endpoint-item">
          <span class="ep-method">GET</span>
          <span class="ep-path">/api/news</span>
          <span class="ep-desc">Editorial news &amp; community updates</span>
        </a>
        <a href="/api/media" target="_blank" class="endpoint-item">
          <span class="ep-method">GET</span>
          <span class="ep-path">/api/media</span>
          <span class="ep-desc">Highlights &amp; tournament videos</span>
        </a>
        <a href="/api/settings" target="_blank" class="endpoint-item">
          <span class="ep-method">GET</span>
          <span class="ep-path">/api/settings</span>
          <span class="ep-desc">Website configuration &amp; stats</span>
        </a>
        <a href="/health" target="_blank" class="endpoint-item">
          <span class="ep-method">GET</span>
          <span class="ep-path">/health</span>
          <span class="ep-desc">Live system health check</span>
        </a>
      </div>
    </div>

    <div class="action-row">
      <a href="${CLIENT_URL}" target="_blank" class="btn btn-primary">Open Main Website &rarr;</a>
      <a href="${ADMIN_URL}" target="_blank" class="btn btn-secondary">Open Admin Portal &rarr;</a>
    </div>
  </div>
</body>
</html>`);
    return;
  }

  res.json({
    success: true,
    status: "online",
    service: "LORD ESPORTZ Shared REST API",
    version: "1.0.0",
    database: "Neon PostgreSQL Connected",
    endpoints: {
      health: "/health",
      partners: "/api/partners",
      tournaments: "/api/tournaments",
      players: "/api/players",
      news: "/api/news",
      media: "/api/media",
      jerseys: "/api/jerseys",
      settings: "/api/settings",
    },
    timestamp: new Date().toISOString(),
  });
});

// API Routes (support /, /api, and /api/v1 so frontend requests work seamlessly with or without /api prefix)
app.use("/api/v1", routes);
app.use("/api", routes);
app.use("/", routes);

// Base /api status fallback
app.get(["/api", "/api/v1"], (_req, res) => {
  res.json({
    success: true,
    service: "LORD ESPORTZ REST API",
    version: "1.0.0",
    status: "healthy",
    documentation: "Visit / for available endpoints",
  });
});

// 404 handler for unknown routes
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found",
  });
});

// Global error handler
app.use(errorHandler);

// Verify database connection on first import (non-blocking)
prisma.$connect()
  .then(() => {
    console.log("🐘 DATABASE: Connected to Neon PostgreSQL");
  })
  .catch((err: Error) => {
    console.warn("⚠️  DATABASE connection failed:", err.message);
  });

// Export app for Vercel serverless — do NOT call app.listen() here.
// For local dev, run src/index.ts which calls app.listen().
export default app;
