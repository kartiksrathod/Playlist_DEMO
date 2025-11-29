# 🎵 Music Playlist Manager

A modern, full-stack music playlist management application built with the MERN stack. Create, organize, and manage your music playlists with ease. Features include track management, audio file uploads, playlist sharing, listen history, and customizable themes.

## ✨ Features

### 🎼 Playlist Management
- Create, edit, and delete playlists
- Upload custom cover images for playlists
- Share playlists with others via unique links
- Public/private playlist visibility
- Collaborative playlists support

### 🎵 Track Management
- Add tracks via URL or file upload
- Support for multiple audio formats (MP3, WAV, OGG, M4A, AAC, FLAC)
- Track metadata (song name, artist, album, duration)
- Built-in audio player
- Edit and delete tracks

### 📚 Content Library
- Browse all tracks across playlists
- Advanced search and filtering
- Sort by various criteria
- Grid and list view modes
- Track details with related songs

### ❤️ Favorites & History
- Favorite playlists and tracks
- Listen history tracking
- Statistics dashboard
- Recently played tracks

### 🎨 Customization
- 8 theme options (Dark, Light, Glass, Vibrant, Neon, Retro, Mesh, Premium)
- Customizable playback settings
- Audio quality preferences
- Notification controls

### 🔐 User Authentication
- Secure user registration and login
- JWT-based authentication
- Password hashing with bcrypt
- Email verification support

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud instance)
- Yarn package manager

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd music-playlist-manager
```

2. **Install Backend Dependencies**
```bash
cd backend
yarn install
```

3. **Install Frontend Dependencies**
```bash
cd frontend
yarn install
```

4. **Configure Environment Variables**

Create a `.env` file in the `backend` directory:
```env
MONGO_URL=mongodb://localhost:27017
DB_NAME=music_streaming_app
PORT=8001
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key
CORS_ORIGINS=http://localhost:3000
FRONTEND_URL=http://localhost:3000
```

Create a `.env` file in the `frontend` directory:
```env
REACT_APP_BACKEND_URL=http://localhost:8001
```

### Running the Application

1. **Start the Backend Server**
```bash
cd backend
yarn start
```
The backend will run on `http://localhost:8001`

2. **Start the Frontend Development Server**
```bash
cd frontend
yarn start
```
The frontend will run on `http://localhost:3000`

## 📁 Project Structure

```
music-playlist-manager/
├── backend/
│   ├── config/           # Database configuration
│   ├── controllers/      # Business logic & request handlers
│   ├── middleware/       # Authentication & file upload middleware
│   ├── models/           # Mongoose schemas
│   ├── routes/           # API route definitions
│   ├── utils/            # Helper functions
│   └── server.js         # Express server entry point
│
├── frontend/
│   ├── public/           # Static assets
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── context/      # React context providers
│   │   ├── hooks/        # Custom React hooks
│   │   ├── pages/        # Page components
│   │   ├── lib/          # Utility functions
│   │   └── App.js        # Root component
│   └── package.json
│
└── README.md
```

## 🛠️ Tech Stack

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT & bcryptjs
- **File Upload:** Multer
- **Validation:** express-validator

### Frontend
- **Framework:** React 19
- **Routing:** React Router v7
- **HTTP Client:** Axios
- **Styling:** Tailwind CSS
- **UI Components:** Radix UI
- **Icons:** Lucide React
- **Animations:** Framer Motion

## 📡 API Overview

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Playlists
- `GET /api/playlists` - Get all playlists
- `POST /api/playlists` - Create playlist
- `GET /api/playlists/:id` - Get single playlist
- `PUT /api/playlists/:id` - Update playlist
- `DELETE /api/playlists/:id` - Delete playlist
- `POST /api/playlists/:id/share` - Generate share link
- `GET /api/playlists/shared/:token` - View shared playlist

### Tracks
- `GET /api/playlists/:playlistId/tracks` - Get tracks in playlist
- `POST /api/playlists/:playlistId/tracks` - Add track
- `PUT /api/playlists/:playlistId/tracks/:trackId` - Update track
- `DELETE /api/playlists/:playlistId/tracks/:trackId` - Delete track

### Library
- `GET /api/library/tracks` - Browse all tracks
- `GET /api/library/artists` - Get all artists
- `GET /api/library/albums` - Get all albums
- `GET /api/library/stats` - Get library statistics

### History & Favorites
- `POST /api/history` - Record play
- `GET /api/history` - Get listen history
- `GET /api/favorites` - Get favorites
- `POST /api/favorites` - Add to favorites

## 🎨 Themes

Choose from 8 beautiful themes:
- **Dark** - Classic dark mode
- **Light** - Clean light mode
- **Glass** - Glassmorphism design
- **Vibrant** - Colorful gradients
- **Neon** - Cyberpunk aesthetic
- **Retro** - Vintage computing vibes
- **Mesh** - Modern gradient meshes
- **Premium** - Elegant gold accents

## 📝 Development

### Backend Development
```bash
cd backend
yarn dev  # Runs with nodemon for auto-reload
```

### Frontend Development
```bash
cd frontend
yarn start  # React development server with hot reload
```

## 🔒 Security Notes

- All passwords are hashed using bcrypt
- JWT tokens for secure authentication
- Environment variables for sensitive data
- Input validation on all endpoints
- CORS configuration for API security

## 📄 License

This project is licensed under the ISC License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Built with ❤️ using the MERN stack
