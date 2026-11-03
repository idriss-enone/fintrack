import "dotenv/config";
import express from 'express'
import cors from 'cors';
import authRoutes from "./routes/authRoutes.js";


const app = express();
const PORT = process.env.PORT || 8000;

// L'authentification passe par le header Authorization (Bearer), pas par des cookies :
// pas besoin de "credentials: true".
app.use(cors({
  origin: process.env.CLIENT_URL || '*',
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
}));
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Serveur opérationnel' })
})

app.use('/api/auth', authRoutes);

// Route inconnue
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Gestionnaire d'erreurs global (JSON invalide, erreurs inattendues)
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ message: 'Invalid JSON body' });
  }
  console.error('Unhandled error', err);
  res.status(500).json({ message: 'server error' });
});


app.listen(PORT, '0.0.0.0', () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
})