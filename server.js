import express from "express";
import { readFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 8080;
const REGISTRY_PATH = process.env.REGISTRY_PATH || "/data/registry/apps.json";

// serve the live registry as JSON
app.get("/apps.json", async (req, res) => {
  try {
    const json = await readFile(REGISTRY_PATH, "utf8");
    res.set("Content-Type", "application/json").send(json);
  } catch (e) {
    res.status(500).json({ error: "registry_unavailable", message: e.message });
  }
});

// static assets
app.use(
  express.static(path.join(__dirname, "public"), { extensions: ["html"] })
);

// SPA-ish fallback to index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Hub running on :${PORT}`);
});
