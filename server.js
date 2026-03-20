const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();

// Estas líneas son las que faltan y causan el error
app.use(cors());
app.use(express.json());

const poe = new OpenAI({
  apiKey: process.env.POE_API_KEY, 
  baseURL: "https://api.poe.com/v1"
});

// --- RUTA 1: CHAT DE TEXTO ---
app.post('/api/chat', async (req, res) => {
  try {
    const { prompt } = req.body;

    const completion = await poe.chat.completions.create({
      model: "gemini-1.5-flash", 
      messages: [{ role: "user", content: prompt }],
    });

    res.json({ text: completion.choices[0].message.content });
  } catch (error) {
    console.error("DETALLE TÉCNICO:", error.message);
    res.status(500).json({ error: "Error en el servidor", details: error.message });
  }
});

// --- RUTA 2: IMÁGENES ---
app.post('/api/generate-image', async (req, res) => {
  try {
    const { prompt } = req.body;
    const response = await poe.chat.completions.create({
      model: "flux-schnell",
      messages: [{ role: "user", content: prompt }],
    });
    res.json({ imageUrl: response.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: "Error al generar imagen", details: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor listo en puerto ${PORT}`);
});
