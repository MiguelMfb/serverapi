const express = require('express');
const cors = require('cors');
const OpenAI = require('openai');
require('dotenv').config(); // Carga las variables desde el archivo .env

const app = express();

// Configuración de Seguridad
app.use(cors()); // Permite que tu Frontend en React se conecte sin errores de CORS
app.use(express.json()); // Permite que el servidor entienda formato JSON

// Configuración del cliente de Poe (usando el SDK de OpenAI)
const poe = new OpenAI({
  apiKey: process.env.POE_API_KEY, // Se saca de las variables de entorno de Render
  baseURL: "https://api.poe.com/v1"
});

// --- RUTA 1: PARA EL CHAT DE TEXTO ---
app.post('/api/chat', async (req, res) => {
  try {
    const { prompt } = req.body;

    const completion = await poe.chat.completions.create({
      model: "gemini-3.1-flash-lite", // El modelo más barato y rápido
      messages: [{ role: "user", content: prompt }],
    });

    res.json({ text: completion.choices[0].message.content });
  } catch (error) {
    console.error("Error en Chat:", error);
    res.status(500).json({ error: "No se pudo conectar con la IA de texto" });
  }
});

// --- RUTA 2: PARA GENERAR IMÁGENES ---
app.post('/api/generate-image', async (req, res) => {
  try {
    const { prompt } = req.body;

    const response = await poe.chat.completions.create({
      model: "flux-schnell", // El modelo de imagen más rentable
      messages: [{ role: "user", content: prompt }],
    });

    // Poe suele devolver la URL de la imagen dentro del texto o como un campo específico
    res.json({ imageUrl: response.choices[0].message.content });
  } catch (error) {
    console.error("Error en Imagen:", error);
    res.status(500).json({ error: "No se pudo generar la imagen" });
  }
});

// Iniciar el servidor
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 NovaCraft Backend corriendo en puerto ${PORT}`);
});