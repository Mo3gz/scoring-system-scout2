const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const path = require('path');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// In-memory data storage (in production, use a database)
let users = [
  {
    id: '1',
    username: 'ayman',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    role: 'admin',
    teamName: 'Ayman',
    coins: 1000,
    score: 0
  },
  {
    id: '2',
    username: 'team1',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    role: 'user',
    teamName: 'Team Alpha',
    coins: 500,
    score: 0
  },
  {
    id: '3',
    username: 'team2',
    password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
    role: 'user',
    teamName: 'Team Beta',
    coins: 500,
    score: 0
  }
];

let countries = [
  { id: '1', name: 'Egypt', cost: 200, owner: null, score: 150 },
  { id: '2', name: 'Morocco', cost: 180, owner: null, score: 140 },
  { id: '3', name: 'Algeria', cost: 160, owner: null, score: 130 },
  { id: '4', name: 'Tunisia', cost: 140, owner: null, score: 120 },
  { id: '5', name: 'Libya', cost: 120, owner: null, score: 110 },
  { id: '6', name: 'Sudan', cost: 100, owner: null, score: 100 },
  { id: '7', name: 'Ethiopia', cost: 90, owner: null, score: 90 },
  { id: '8', name: 'Kenya', cost: 80, owner: null, score: 80 },
  { id: '9', name: 'Nigeria', cost: 70, owner: null, score: 70 },
  { id: '10', name: 'Ghana', cost: 60, owner: null, score: 60 }
];

let userInventories = {};
let notifications = [];
let promoCodes = [];

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Admin middleware
const requireAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// Routes
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  
  const user = users.find(u => u.username === username);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role, teamName: user.teamName },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.cookie('token', token, {
    httpOnly: true,
    secure: false, // Set to true in production with HTTPS
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  });

  res.json({
    user: {
      id: user.id,
      username: user.username,
      role: user.role,
      teamName: user.teamName,
      coins: user.coins,
      score: user.score
    }
  });
});

app.post('/api/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out successfully' });
});

app.get('/api/user', authenticateToken, (req, res) => {
  const user = users.find(u => u.id === req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  res.json({
    id: user.id,
    username: user.username,
    role: user.role,
    teamName: user.teamName,
    coins: user.coins,
    score: user.score
  });
});

app.get('/api/scoreboard', (req, res) => {
  const scoreboard = users
    .filter(user => user.role === 'user')
    .map(user => ({
      id: user.id,
      teamName: user.teamName,
      score: user.score,
      coins: user.coins
    }))
    .sort((a, b) => b.score - a.score);
  
  res.json(scoreboard);
});

app.get('/api/countries', (req, res) => {
  res.json(countries);
});

app.post('/api/countries/buy', authenticateToken, (req, res) => {
  const { countryId } = req.body;
  const user = users.find(u => u.id === req.user.id);
  const country = countries.find(c => c.id === countryId);

  if (!country) {
    return res.status(404).json({ error: 'Country not found' });
  }

  if (country.owner) {
    return res.status(400).json({ error: 'Country already owned' });
  }

  if (user.coins < country.cost) {
    return res.status(400).json({ error: 'Insufficient coins' });
  }

  user.coins -= country.cost;
  user.score += country.score;
  country.owner = user.id;

  // Notify all clients about the update
  io.emit('scoreboard-update', users.filter(u => u.role === 'user'));
  io.emit('countries-update', countries);

  res.json({ 
    message: `Successfully bought ${country.name}`,
    user: {
      coins: user.coins,
      score: user.score
    }
  });
});

app.get('/api/inventory', authenticateToken, (req, res) => {
  const inventory = userInventories[req.user.id] || [];
  res.json(inventory);
});

app.post('/api/cards/use', authenticateToken, (req, res) => {
  const { cardId, selectedTeam, description } = req.body;
  const user = users.find(u => u.id === req.user.id);
  const inventory = userInventories[req.user.id] || [];
  
  const cardIndex = inventory.findIndex(card => card.id === cardId);
  if (cardIndex === -1) {
    return res.status(404).json({ error: 'Card not found in inventory' });
  }

  const card = inventory[cardIndex];
  inventory.splice(cardIndex, 1);

  // Create notification for admin
  const notification = {
    id: Date.now().toString(),
    type: 'card-used',
    teamId: req.user.id,
    teamName: user.teamName,
    cardName: card.name,
    cardType: card.type,
    selectedTeam,
    description,
    timestamp: new Date().toISOString(),
    read: false
  };

  notifications.push(notification);
  io.emit('admin-notification', notification);

  res.json({ message: 'Card used successfully' });
});

app.post('/api/spin', authenticateToken, (req, res) => {
  const { spinType, promoCode } = req.body;
  const user = users.find(u => u.id === req.user.id);
  
  let cost = 50;
  if (spinType === 'random') cost = 25;

  // Check promo code
  if (promoCode) {
    const promo = promoCodes.find(p => p.code === promoCode && p.teamId === req.user.id && !p.used);
    if (promo) {
      cost = Math.floor(cost * (1 - promo.discount / 100));
      promo.used = true;
    }
  }

  if (user.coins < cost) {
    return res.status(400).json({ error: 'Insufficient coins' });
  }

  user.coins -= cost;

  // Generate random card based on spin type
  const cards = getCardsByType(spinType);
  const randomCard = cards[Math.floor(Math.random() * cards.length)];
  
  if (!userInventories[req.user.id]) {
    userInventories[req.user.id] = [];
  }
  
  userInventories[req.user.id].push({
    ...randomCard,
    id: Date.now().toString(),
    obtainedAt: new Date().toISOString()
  });

  io.emit('user-update', {
    id: user.id,
    coins: user.coins,
    score: user.score
  });

  res.json({ 
    card: randomCard,
    cost,
    remainingCoins: user.coins
  });
});

// Admin routes
app.get('/api/admin/notifications', authenticateToken, requireAdmin, (req, res) => {
  res.json(notifications);
});

app.post('/api/admin/promocodes', authenticateToken, requireAdmin, (req, res) => {
  const { code, teamId, discount } = req.body;
  
  const promoCode = {
    id: Date.now().toString(),
    code,
    teamId,
    discount,
    used: false,
    createdAt: new Date().toISOString()
  };
  
  promoCodes.push(promoCode);
  
  // Notify the specific team
  const user = users.find(u => u.id === teamId);
  if (user) {
    const notification = {
      id: Date.now().toString(),
      type: 'promo-code',
      message: `You received a promo code: ${code} with ${discount}% discount!`,
      timestamp: new Date().toISOString()
    };
    
    io.to(teamId).emit('notification', notification);
  }
  
  res.json(promoCode);
});

app.post('/api/admin/cards', authenticateToken, requireAdmin, (req, res) => {
  const { teamId, cardName, cardType } = req.body;
  const user = users.find(u => u.id === teamId);
  
  if (!user) {
    return res.status(404).json({ error: 'Team not found' });
  }

  if (!userInventories[teamId]) {
    userInventories[teamId] = [];
  }

  const card = {
    id: Date.now().toString(),
    name: cardName,
    type: cardType,
    obtainedAt: new Date().toISOString()
  };

  userInventories[teamId].push(card);

  // Notify the team
  const notification = {
    id: Date.now().toString(),
    type: 'card-received',
    message: `You received a new card: ${cardName}`,
    timestamp: new Date().toISOString()
  };

  io.to(teamId).emit('notification', notification);

  res.json(card);
});

app.post('/api/admin/coins', authenticateToken, requireAdmin, (req, res) => {
  const { teamId, amount, reason } = req.body;
  const user = users.find(u => u.id === teamId);
  
  if (!user) {
    return res.status(404).json({ error: 'Team not found' });
  }

  user.coins += amount;

  // Notify the team
  const notification = {
    id: Date.now().toString(),
    type: 'coins-updated',
    message: `${amount > 0 ? '+' : ''}${amount} coins: ${reason}`,
    timestamp: new Date().toISOString()
  };

  io.to(teamId).emit('notification', notification);
  io.emit('scoreboard-update', users.filter(u => u.role === 'user'));

  res.json({ 
    message: 'Coins updated successfully',
    user: {
      coins: user.coins,
      score: user.score
    }
  });
});

app.post('/api/admin/score', authenticateToken, requireAdmin, (req, res) => {
  const { teamId, amount, reason } = req.body;
  const user = users.find(u => u.id === teamId);
  
  if (!user) {
    return res.status(404).json({ error: 'Team not found' });
  }

  user.score += amount;

  // Notify the team
  const notification = {
    id: Date.now().toString(),
    type: 'score-updated',
    message: `${amount > 0 ? '+' : ''}${amount} points: ${reason}`,
    timestamp: new Date().toISOString()
  };

  io.to(teamId).emit('notification', notification);
  io.emit('scoreboard-update', users.filter(u => u.role === 'user'));

  res.json({ 
    message: 'Score updated successfully',
    user: {
      coins: user.coins,
      score: user.score
    }
  });
});

// Helper function to get cards by type
function getCardsByType(spinType) {
  const cards = {
    luck: [
      { name: 'Hidden Treasure', type: 'luck', effect: '+400 Points instantly' },
      { name: 'Camp Tax', type: 'luck', effect: '-300 Points go to the Bank' },
      { name: 'Golden Ticket', type: 'luck', effect: 'Pay 200 Points → If you win the next challenge, take +500 Points!' },
      { name: 'Mysterious Trader', type: 'luck', effect: 'Pay 150 Points → Get a random Attack Card' },
      { name: 'Everything Against Me', type: 'luck', effect: 'Instantly lose 250 Points' },
      { name: 'Double Up', type: 'luck', effect: 'Double your current points if you win any challenge in the next 30 minutes' },
      { name: 'Shady Deal', type: 'luck', effect: 'Steal 100 Points from any tent' }
    ],
    attack: [
      { name: 'Raid', type: 'attack', effect: 'Choose one team to raid. If you win the challenge, steal 300 Points from them.' },
      { name: 'Control Battle', type: 'attack', effect: 'Select one team to challenge in a one-on-one tent battle. Winner gets +500 Points.' },
      { name: 'Double Strike', type: 'attack', effect: 'Select one team to ally with and attack another tent together.' },
      { name: 'Break Alliances', type: 'attack', effect: 'Force 2 allied tents to break their alliance' },
      { name: 'Broad Day Robbery', type: 'attack', effect: 'Take 100 Points instantly from any tent' }
    ],
    alliance: [
      { name: 'Strategic Alliance', type: 'alliance', effect: 'Select one team to form an alliance with for 1 full day.' },
      { name: 'Betrayal Alliance', type: 'alliance', effect: 'Form an alliance, then betray them at the end to steal their points.' },
      { name: 'Golden Partnership', type: 'alliance', effect: 'Choose a team to team up with in the next challenge.' },
      { name: 'Temporary Truce', type: 'alliance', effect: 'Select 2 teams to pause all attacks between them for 1 full day.' },
      { name: 'Hidden Leader', type: 'alliance', effect: 'You become the challenge leader. Ally with another team.' }
    ]
  };

  if (spinType === 'random') {
    const allCards = [...cards.luck, ...cards.attack, ...cards.alliance];
    return [allCards[Math.floor(Math.random() * allCards.length)]];
  }

  return cards[spinType] || [];
}

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join-team', (teamId) => {
    socket.join(teamId);
    console.log(`User joined team: ${teamId}`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 