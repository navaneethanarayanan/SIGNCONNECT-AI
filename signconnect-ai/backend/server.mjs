import { createServer } from "node:http";
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const directory = dirname(fileURLToPath(import.meta.url));

function loadEnvironmentFile(filePath) {
  if (!existsSync(filePath)) return;

  for (const line of readFileSync(filePath, "utf8").split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (!match || process.env[match[1]]) continue;

    const [, name, rawValue] = match;
    process.env[name] = rawValue.replace(/^(?:"|')|(?:"|')$/g, "");
  }
}

loadEnvironmentFile(join(directory, ".env"));

const port = Number(process.env.PORT || 3001);
const clientOrigin = process.env.CLIENT_ORIGIN || "http://localhost:5173";
const requestCounts = new Map();

function sendJson(response, statusCode, payload) {
  response.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  response.end(JSON.stringify(payload));
}

function allowRequest(request, response) {
  const origin = request.headers.origin;
  if (origin && origin !== clientOrigin) {
    sendJson(response, 403, { error: "This origin is not allowed to use the API." });
    return false;
  }

  if (origin) response.setHeader("Access-Control-Allow-Origin", origin);
  response.setHeader("Vary", "Origin");
  return true;
}

function isRateLimited(request) {
  const address = request.socket.remoteAddress || "unknown";
  const now = Date.now();
  const current = requestCounts.get(address);
  const windowMs = 60_000;

  if (!current || now - current.startedAt > windowMs) {
    requestCounts.set(address, { startedAt: now, count: 1 });
    return false;
  }

  current.count += 1;
  return current.count > 20;
}

async function readJsonBody(request) {
  let body = "";
  for await (const chunk of request) {
    body += chunk;
    if (body.length > 30_000) throw new Error("Request body is too large.");
  }

  try {
    return JSON.parse(body);
  } catch {
    throw new Error("Request body must be valid JSON.");
  }
}

function validMessages(messages) {
  return Array.isArray(messages) &&
    messages.length > 0 &&
    messages.length <= 12 &&
    messages.every((message) =>
      message &&
      (message.role === "user" || message.role === "assistant") &&
      typeof message.content === "string" &&
      message.content.trim().length > 0 &&
      message.content.length <= 2_000
    );
}

async function handleChat(request, response) {
  if (!process.env.OPENAI_API_KEY) {
    sendJson(response, 503, {
      error: "Jarvis AI is not configured. Add OPENAI_API_KEY to backend/.env and restart the backend.",
    });
    return;
  }

  if (isRateLimited(request)) {
    sendJson(response, 429, { error: "Too many messages. Please wait a minute and try again." });
    return;
  }

  let body;
  try {
    body = await readJsonBody(request);
  } catch (error) {
    sendJson(response, 400, { error: error.message });
    return;
  }

  const { language, messages } = body;
  const languages = new Set(["English", "Tamil", "Telugu", "Hindi"]);
  if (!languages.has(language) || !validMessages(messages)) {
    sendJson(response, 400, { error: "Invalid chat request." });
    return;
  }

  try {
    const openAiResponse = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-5",
        store: false,
        instructions: `You are Jarvis, a friendly accessibility assistant for SignConnect AI. Reply only in ${language}. Keep replies concise, helpful, and respectful. Do not claim to recognise signs unless the user supplied a recognition result.`,
        input: messages,
      }),
    });
    const result = await openAiResponse.json();

    if (!openAiResponse.ok || !result.output_text) {
      console.error("OpenAI request failed:", result.error?.message || openAiResponse.status);
      sendJson(response, 502, { error: "Jarvis could not generate a reply. Check the backend API key and billing." });
      return;
    }

    sendJson(response, 200, { reply: result.output_text });
  } catch (error) {
    console.error("Jarvis backend error:", error);
    sendJson(response, 502, { error: "Jarvis could not reach the AI service." });
  }
}

const server = createServer(async (request, response) => {
  if (!allowRequest(request, response)) return;

  if (request.method === "OPTIONS") {
    response.writeHead(204, {
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    });
    response.end();
    return;
  }

  if (request.method === "GET" && request.url === "/api/health") {
    sendJson(response, 200, { status: "ok", aiConfigured: Boolean(process.env.OPENAI_API_KEY) });
    return;
  }

  if (request.method === "POST" && request.url === "/api/chat") {
    await handleChat(request, response);
    return;
  }

  sendJson(response, 404, { error: "Route not found." });
});

server.listen(port, () => {
  console.log(`SignConnect backend listening on http://localhost:${port}`);
});
