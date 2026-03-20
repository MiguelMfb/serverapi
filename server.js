const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const poe = new OpenAI({
  apiKey: process.env.POE_API_KEY, 
  baseURL: "https://api.poe.com/v1"
});

// --- RUTA 1: CHAT DE TEXTO (DeepSeek-V3.2) ---
app.post('/api/chat', async (req, res) => {
  try {
    const { prompt } = req.body;

    const completion = await poe.chat.completions.create({
      model: "deepseek-v3.2", // Este es el nombre exacto de la documentación
      messages: [{ role: "user", content: prompt }],
    });

    res.json({ text: completion.choices[0].message.content });
  } catch (error) {
    console.error("DETALLE TÉCNICO:", error.message);
    res.status(500).json({ error: "Error en el servidor", details: error.message });
  }
});

// --- RUTA 2: GENERACIÓN DE IMÁGENES ---
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
