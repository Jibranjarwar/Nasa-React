# NASA Space Explorer

A React web application that explores NASA's space data, images, and information using NASA APIs.

## Features

- **Home Page**: Interactive solar system with daily APOD
- **APOD**: Astronomy Picture of the Day with date browsing
- **Planet Details**: Comprehensive planet information with AI descriptions
- **NEO**: Near Earth Objects tracking and data
- **Mars Rover**: Photos from Curiosity, Opportunity, Spirit, and Perseverance
- **EPIC**: Earth images from NASA's DSCOVR satellite

## Usage

### Navigation
- Use the sidebar to navigate between different sections
- Click on planets in the solar system to view details

### APOD Page
- View today's astronomy picture/video
- Use date picker to browse historical images
- Click "Recent APODs" to see last 7 days

### Planet Details
- Select a planet to view comprehensive information
- View NASA images and AI-generated descriptions
- See physical properties and statistics

### NEO Page
- Select a date to view near-Earth asteroids
- Click on asteroids for detailed information
- View hazard assessments and close approach data

### Mars Rover
- Explore rovers (Curiosity, Opportunity, Spirit, Perseverance)
- Select camera and sol (Martian day)
- Browse high-resolution Mars surface photos

### EPIC Page
- Choose natural or enhanced color images
- Select dates to view Earth from space
- Browse available dates for Earth imagery

## Development

For developers who want to run the application locally:

### Prerequisites
- Node.js (version 16.0.0 or higher)
- NASA API Key: [https://api.nasa.gov/](https://api.nasa.gov/)
- Google Gemini API Key: [https://makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)

### Setup
```bash
git clone https://github.com/Jibranjarwar/Nasa-React.git
cd Nasa-React

# Backend
cd backend
npm install
# Create .env file with API keys
node index.js

# Frontend (new terminal)
cd frontend/nasa-frontend
npm install
npm start
```

## Project Structure

```
nasa-space-explorer/
├── backend/
│   ├── index.js              # Express server and API routes
│   └── package.json          # Backend dependencies
├── frontend/nasa-frontend/
│   ├── src/pages/            # React components
│   ├── src/images/           # Planet and space images
│   └── package.json          # Frontend dependencies
└── README.md
```

## API Endpoints

- `GET /apod` - Astronomy Picture of the Day
- `GET /neo` - Near Earth Objects data
- `GET /mars-rover` - Mars rover photos
- `GET /mars-rover-info` - Rover information
- `GET /epic` - EPIC Earth images
- `GET /epic/available` - Available EPIC dates
- `POST /api/planet-description` - AI planet descriptions