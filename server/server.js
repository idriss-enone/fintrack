import express from 'express'

import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

import cors from 'cors';
import corsOptions from './src/config/cors.js';



const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors(corsOptions));
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Serveur opérationnel' })
})

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
})