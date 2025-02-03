const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 5000; // Puedes usar otro puerto si lo deseas

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Configurar el transporte de correo (usando Gmail como ejemplo)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  },
  logger: true,
  debug: true,
});

// Ruta para recibir datos del formulario y enviar el correo
app.post('/send-email', (req, res) => {
  const { name, email, message } = req.body;

  const mailOptions = {
    from: email, // Remitente
    to: process.env.GMAIL_USER, // Destinatario
    subject: 'Nuevo mensaje de contacto', // Asunto
    text: `Nombre: ${name}\nCorreo: ${email}\nMensaje: ${message}` // Contenido del mensaje
  };

  // Enviar el correo
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send('Error al enviar el correo: ' + error);
    }
    res.status(200).send('Correo enviado: ' + info.response);
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
