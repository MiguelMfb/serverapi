const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Configuración del cliente
const poe = new OpenAI({
  apiKey: process.env.POE_API_KEY,
  baseURL: "https://api.poe.com/v1"
});

app.post('/api/chat', async (req, res) => {
  try {
    const { prompt } = req.body;
    console.log("Recibido prompt para Poe:", prompt);

    const completion = await poe.chat.completions.create({
      // Si "deepseek-v3.2" falla, Poe recomienda usar el nombre del bot directamente
      model: "DeepSeek-V3", 
      messages: [{ role: "user", content: prompt }],
    });

    if (!completion.choices) {
      throw new Error("Respuesta de Poe malformada");
    }

    res.json({ text: completion.choices[0].message.content });
  } catch (error) {
    // ESTO ES LO QUE VEREMOS EN LOS LOGS DE RENDER
    console.error("DETALLE DEL ERROR EN POE:", error.message);
    res.status(500).json({ 
      error: "Error interno en el servidor", 
      message: error.message 
    });
  }
});

app.post('/api/generate-image', async (req, res) => {
  try {
    const { prompt } = req.body;
    const response = await poe.chat.completions.create({
      model: "FLUX-Schnell",
      messages: [{ role: "user", content: prompt }],
    });
    res.json({ imageUrl: response.choices[0].message.content });
  } catch (error) {
    console.error("ERROR EN IMAGEN:", error.message);
    res.status(500).json({ error: "Error en imagen", message: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 NovaCraft Backend operativo en puerto ${PORT}`);
});
