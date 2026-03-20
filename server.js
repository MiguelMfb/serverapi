app.post('/api/chat', async (req, res) => {
  try {
    const { prompt } = req.body;
    console.log("Recibido prompt:", prompt); // Esto saldrá en tus logs de Render

    const completion = await poe.chat.completions.create({
      model: "gemini-1.5-flash", // Nombre corregido
      messages: [{ role: "user", content: prompt }],
    });

    if (!completion.choices || completion.choices.length === 0) {
      throw new Error("Poe no devolvió opciones de respuesta");
    }

    res.json({ text: completion.choices[0].message.content });
  } catch (error) {
    console.error("DETALLE TÉCNICO EN LOGS:", error.message);
    // Devolvemos el error detallado para que lo veas en el chat de la app
    res.status(500).json({ 
      error: "Error en el servidor", 
      message: error.message 
    });
  }
});
