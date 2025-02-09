const express = require("express");
const axios = require("axios");
const app = express();

app.use(express.json());

// Agregar una ruta GET para la raíz
app.get("/", (req, res) => {
  res.send("¡El servidor está funcionando correctamente!");
});

// Ruta POST para enviar el webhook
app.post("/sendWebhook", async (req, res) => {
  const { url, content, username, avatar_url, embeds } = req.body;
  
  // Log para verificar qué recibe el servidor en el body
  console.log("Recibida solicitud /sendWebhook con body:", req.body);

  if (!url) {
    return res.status(400).json({ error: "Falta el webhook URL" });
  }

  try {
    // Log para confirmar que se llama a la URL del webhook y con qué datos
    console.log("Reenviando a Discord:", url, { content, username, avatar_url, embeds });

    const response = await axios.post(
      url,
      { content, username, avatar_url, embeds },
      { headers: { "Content-Type": "application/json" } }
    );

    res
      .status(response.status)
      .json({ message: "Mensaje enviado correctamente" });
  } catch (error) {
    // Log de error para verlo en los Logs de Glitch
    console.error("ERROR EN /sendWebhook:", error);

    res
      .status(500)
      .json({ error: "Error al enviar mensaje", details: error.message });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
