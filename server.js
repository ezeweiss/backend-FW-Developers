const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

// Configurar el transporte de correo
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  },
  logger: true,
  debug: true,
});

// Ruta para enviar el correo
app.post('/api/send-email', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    const mailOptions = {
      from: email,
      to: process.env.GMAIL_USER,
      subject: 'Nuevo mensaje de contacto',
      text: `Nombre: ${name}\nCorreo: ${email}\nMensaje: ${message}`
    };

    const info = await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: 'Correo enviado', info });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Exportar la función para Vercel
module.exports = app;
