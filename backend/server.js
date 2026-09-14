const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    const response = await fetch("http://127.0.0.1:11434/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "qwen2.5-coder:7b",
        prompt: message,
        stream: false,
      }),
    });

    const data = await response.json();

    res.json({
      response: data.response,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "Ollama connection failed",
    });
  }
});

app.listen(3000, () => {
  console.log("SignConnect AI backend running on http://localhost:3000");
});
