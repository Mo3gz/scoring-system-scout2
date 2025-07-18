# Scout Game - Team Competition Platform

A mobile-first web application for team competitions with real-time updates, card-based gameplay, and admin management features.

## 🚀 Features

### For Users (Teams)
- **Scoreboard**: Live team rankings based on country scores
- **Inventory**: View and use collected cards with team selection
- **Spin System**: 4 different spin types with visual animations
  - Lucky Spin (50 coins) - Random luck cards
  - Attack Spin (50 coins) - Powerful attack cards
  - Alliance Spin (50 coins) - Strategic alliance cards
  - Random Spin (25 coins) - Any type of card
- **World Map**: Buy countries to boost your score
- **Promo Codes**: Use discount codes for spins
- **Real-time Updates**: Live notifications and score updates

### For Admins
- **Promo Code Management**: Create discount codes for specific teams
- **Card Management**: Give cards to teams
- **Team Management**: Update team coins and scores
- **Live Scoreboard**: Monitor team rankings in real-time
- **Notifications**: View card usage notifications

## 🎮 Card Types

### 🎲 Luck Cards
- Hidden Treasure – +400 Points instantly
- Camp Tax – -300 Points go to the Bank
- Golden Ticket – Pay 200 Points → If you win the next challenge, take +500 Points!
- Mysterious Trader – Pay 150 Points → Get a random Attack Card
- Everything Against Me – Instantly lose 250 Points
- Double Up – Double your current points if you win any challenge in the next 30 minutes
- Shady Deal – Steal 100 Points from any tent

### ⚔️ Attack Cards
- Raid – Choose one team to raid. If you win the challenge, steal 300 Points from them.
- Control Battle – Select one team to challenge in a one-on-one tent battle. Winner gets +500 Points.
- Double Strike – Select one team to ally with and attack another tent together.
- Break Alliances – Force 2 allied tents to break their alliance
- Broad Day Robbery – Take 100 Points instantly from any tent

### 🤝 Alliance Cards
- Strategic Alliance – Select one team to form an alliance with for 1 full day.
- Betrayal Alliance – Form an alliance, then betray them at the end to steal their points.
- Golden Partnership – Choose a team to team up with in the next challenge.
- Temporary Truce – Select 2 teams to pause all attacks between them for 1 full day.
- Hidden Leader – You become the challenge leader. Ally with another team.

## 🛠️ Technology Stack

- **Frontend**: React 18, React Router, Socket.IO Client
- **Backend**: Node.js, Express, Socket.IO
- **Authentication**: JWT with cookies
- **Styling**: CSS3 with mobile-first design
- **Animations**: Framer Motion, React Confetti
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## 📱 Mobile-First Design

The application is designed specifically for mobile devices with:
- Responsive layout that works on all screen sizes
- Touch-friendly interface
- Bottom navigation for easy access
- Optimized for mobile browsers
- Fast loading and smooth animations

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone or download the project**
   ```bash
   # If you have the zip file, extract it to a folder
   ```

2. **Run the startup script (Windows)**
   ```bash
   # Double-click start.bat or run in command prompt:
   start.bat
   ```

3. **Manual installation (if needed)**
   ```bash
   # Install server dependencies
   npm install
   
   # Install client dependencies
   cd client
   npm install
   cd ..
   
   # Start development servers
   npm run dev
   ```

### Access the Application

- **Client**: http://localhost:3000
- **Server**: http://localhost:5000

## 👤 Demo Credentials

### Admin Account
- **Username**: admin
- **Password**: password

### Team Accounts
- **Team 1**: username: team1, password: password
- **Team 2**: username: team2, password: password

## 🎯 How to Play

### For Teams
1. **Login** with your team credentials
2. **View Scoreboard** to see current rankings
3. **Spin for Cards** using your coins
4. **Use Cards** from your inventory strategically
5. **Buy Countries** on the map to boost your score
6. **Monitor** real-time updates and notifications

### For Admins
1. **Login** with admin credentials
2. **Create Promo Codes** for specific teams
3. **Give Cards** to teams as rewards
4. **Monitor** card usage notifications
5. **Manage** team coins and scores
6. **Track** live scoreboard updates

## 🔧 Available Scripts

- `npm run dev` - Start both server and client in development mode
- `npm run server` - Start only the server
- `npm run client` - Start only the client
- `npm run build` - Build the client for production
- `npm run install-all` - Install all dependencies
- `npm run clean` - Clean all node_modules and build files
- `npm start` - Start production server

## 🌍 Countries Available

The game includes 10 African countries with different costs and score values:
- Egypt (200 coins, 150 points)
- Morocco (180 coins, 140 points)
- Algeria (160 coins, 130 points)
- Tunisia (140 coins, 120 points)
- Libya (120 coins, 110 points)
- Sudan (100 coins, 100 points)
- Ethiopia (90 coins, 90 points)
- Kenya (80 coins, 80 points)
- Nigeria (70 coins, 70 points)
- Ghana (60 coins, 60 points)

## 🔒 Security Features

- JWT authentication with 24-hour expiration
- HTTP-only cookies for secure token storage
- CORS protection
- Input validation and sanitization
- Admin-only routes protection

## 📱 Mobile Optimization

- Responsive design for all screen sizes
- Touch-friendly buttons and interactions
- Optimized loading times
- Smooth animations and transitions
- Mobile-first navigation

## 🎨 Design Features

- Modern gradient backgrounds
- Glassmorphism effects
- Smooth animations
- Intuitive user interface
- Color-coded card types
- Visual feedback for all actions

## 🔄 Real-time Features

- Live scoreboard updates
- Instant notifications
- Real-time card usage tracking
- Live team status updates
- WebSocket connections for instant communication

## 📊 Game Mechanics

- **Scoring**: Based on owned countries, not just coins
- **Strategy**: Choose between buying countries or spinning for cards
- **Alliances**: Form temporary partnerships with other teams
- **Attacks**: Challenge other teams for points
- **Luck**: Random events that can help or hurt

## 🚀 Deployment

For production deployment:

1. Set environment variables:
   ```bash
   NODE_ENV=production
   JWT_SECRET=your-secret-key
   PORT=5000
   ```

2. Build the client:
   ```bash
   npm run build
   ```

3. Start the production server:
   ```bash
   npm start
   ```

## 🤝 Contributing

This is a complete application ready for use. The code follows clean code principles and SOLID design patterns.

## 📄 License

This project is created for educational and entertainment purposes.

---

**Enjoy the Scout Game! 🎮** 