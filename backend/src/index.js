const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const prisma = require('./prisma');
const { analyzeSeverity } = require('./lib/ai');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PATCH'],
  },
});

app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('PROMETEO 2026 Backend API is running.');
});

// Create User (Simplification for hackathon)
app.post('/api/users', async (req, res) => {
  const { name, email, role } = req.body;
  try {
    const user = await prisma.user.create({
      data: { name, email, role: role || 'CITIZEN' },
    });
    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Incidents
app.get('/api/incidents', async (req, res) => {
  const incidents = await prisma.incident.findMany({
    include: { user: true, verifications: true, notes: true },
    orderBy: { createdAt: 'desc' },
  });
  res.json(incidents);
});

app.post('/api/incidents', async (req, res) => {
  const { type, description, latitude, longitude, userId } = req.body; // Remove severity from body, let AI decide
  try {
    const aiSeverity = await analyzeSeverity(description, type);

    const incident = await prisma.incident.create({
      data: {
        type,
        description,
        latitude,
        longitude,
        userId,
        severity: aiSeverity,
        mediaUrls: JSON.stringify([]),
      },
      include: { user: true },
    });

    // Broadcast to all clients
    io.emit('new-incident', incident);

    res.status(201).json(incident);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Verify
app.post('/api/incidents/:id/verify', async (req, res) => {
  const { userId, isPositive } = req.body;
  const incidentId = req.params.id;
  try {
    const verification = await prisma.verification.create({
      data: { incidentId, userId, isPositive },
    });

    // Check if we should update incident status based on verifications count
    // (Actual logic would be more complex)

    res.status(201).json(verification);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// WebSocket Connection
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
