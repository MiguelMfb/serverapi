const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();

// Configuración de Seguridad
app.use(cors()); 
app.use(express.json());

// Configuración del cliente de Poe
// Asegúrate de que POE_API_KEY esté en el panel 'Environment' de Render
const poe = new OpenAI({
  apiKey: process.env.POE_API_KEY, 
  baseURL: "https://api.poe.com/v1"
});

// --- RUTA 1: CHAT DE TEXTO ---
app.post('/api/chat', async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "El prompt es obligatorio" });
    }

    const completion = await poe.chat.completions.create({
      model: "gemini-3.1-flash-lite",
      messages: [{ role: "user", content: prompt }],
    });

    res.json({ text: completion.choices[0].message.content });
  } catch (error) {
    console.error("DETALLE TÉCNICO:", error.message);
    res.status(500).json({ 
      error: "Error en la comunicación con la IA",
      details: error.message 
    });
  }
});

// --- RUTA 2: GENERACIÓN DE IMÁGENES ---
app.post('/api/generate-image', async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "La descripción es obligatoria" });
    }

    const response = await poe.chat.completions.create({
      model: "flux-schnell",
      messages: [{ role: "user", content: prompt }],
    });

    res.json({ imageUrl: response.choices[0].message.content });
  } catch (error) {
    console.error("ERROR IMAGEN:", error.message);
    res.status(500).json({ 
      error: "Error al generar imagen",
      details: error.message 
    });
  }
});

// Puerto dinámico para Render
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor listo en puerto ${PORT}`);
});
