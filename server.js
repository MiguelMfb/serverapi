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

app.post('/api/chat', async (req, res) => {
  try {
    const { prompt } = req.body;

    const completion = await poe.chat.completions.create({
      model: "Gemini-1.5-Flash", // Nombre exacto según formato Poe
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      stream: false // Recomendado para evitar errores de conexión inicial
    });

    res.json({ text: completion.choices[0].message.content });
  } catch (error) {
    // Si Poe devuelve un error, lo capturamos según el formato de la documentación (code, type, message)
    const errorData = error.response?.data?.error || {};
    console.error("DETALLE POE:", errorData.message || error.message);
    
    res.status(error.status || 500).json({ 
      error: "Error en la respuesta de Poe",
      details: errorData.message || error.message,
      type: errorData.type || "unknown"
    });
  }
});

app.post('/api/generate-image', async (req, res) => {
  try {
    const { prompt } = req.body;
    const response = await poe.chat.completions.create({
      model: "FLUX-Schnell", 
      messages: [{ role: "user", content: prompt }],
      stream: false // OBLIGATORIO para bots de imagen según la documentación
    });
    res.json({ imageUrl: response.choices[0].message.content });
  } catch (error) {
    res.status(500).json({ error: "Error en imagen", details: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 NovaCraft Backend operativo en puerto ${PORT}`);
});
