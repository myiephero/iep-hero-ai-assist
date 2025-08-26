import express from "express";
import { json } from "body-parser";

const app = express();
app.use(json());

// ✅ Health check endpoint
app.get('/health', (_, res) => {
  res.status(200).json({ ok: true, service: "api", buildId: "dev", time: new Date().toISOString() });
});

const port = parseInt(process.env.PORT || "5000", 10);
const host = "0.0.0.0"; // Bind to all interfaces for Cloud Run

app.listen(port, host, () => {
  console.log(`✅ Server started on http://${host}:${port}`);
});
