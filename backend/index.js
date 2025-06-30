require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.get('/neo', async (req, res) => {
  try {
    const nasaApiKey = process.env.NASA_API_KEY;
    const startDate = req.query.start_date;
    const endDate = req.query.end_date || startDate;

    if (!startDate) return res.status(400).json({ error: 'Start date is required.' });

    const url = `https://api.nasa.gov/neo/rest/v1/feed?start_date=${startDate}&end_date=${endDate}&api_key=${nasaApiKey}`;
    const response = await axios.get(url);

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching NEO data:', error.message || error);
    res.status(500).json({ error: 'Failed to fetch NEO data' });
  }
});

app.get('/apod', async (req, res) => {
  try {
    const nasaApiKey = process.env.NASA_API_KEY;
    const date = req.query.date;
    
    let url = `https://api.nasa.gov/planetary/apod?api_key=${nasaApiKey}`;
    if (date) {
      url += `&date=${date}`;
    }
    
    console.log('NASA APOD API call:', url);
    const response = await axios.get(url);
    console.log('NASA API response status:', response.status);
    console.log('NASA API response data:', {
      title: response.data.title,
      date: response.data.date,
      media_type: response.data.media_type
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching APOD:', error?.response?.data || error.message);
    console.error('Full error:', error);
    res.status(500).json({ error: 'Failed to fetch APOD' });
  }
});

app.get('/mars-rover', async (req, res) => {
  try {
    const nasaApiKey = process.env.NASA_API_KEY;
    const rover = req.query.rover || 'curiosity';
    const sol = req.query.sol || 1000;
    const camera = req.query.camera || '';
    const page = req.query.page || 1;

    let url = `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}/photos?sol=${sol}&page=${page}&api_key=${nasaApiKey}`;
    
    if (camera) {
      url += `&camera=${camera}`;
    }

    const response = await axios.get(url);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching Mars Rover data:', error?.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch Mars Rover data' });
  }
});

app.get('/mars-rover-info', async (req, res) => {
  try {
    const nasaApiKey = process.env.NASA_API_KEY;
    const rover = req.query.rover || 'curiosity';

    const url = `https://api.nasa.gov/mars-photos/api/v1/rovers/${rover}?api_key=${nasaApiKey}`;
    const response = await axios.get(url);
    
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching Mars Rover info:', error?.response?.data || error.message);
    res.status(500).json({ error: 'Failed to fetch Mars Rover info' });
  }
});

app.post('/api/planet-description', async (req, res) => {
  const { planet } = req.body;

  if (!planet) return res.status(400).json({ error: 'Planet name is required.' });

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const prompt = `Give a short, educational description of the planet ${planet}. Focus on facts and trivia.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const description = response.text();

    res.json({ description });
  } catch (error) {
    console.error('Gemini error:', error?.response?.data || error.message || error);
    res.status(500).json({ error: 'Failed to fetch Gemini description' });
  }
});

app.get('/epic', async (req, res) => {
  try {
    const nasaApiKey = process.env.NASA_API_KEY;
    const type = req.query.type || 'natural';
    const date = req.query.date;
    let url;
    if (date) {
      url = `https://api.nasa.gov/EPIC/api/${type}/date/${date}?api_key=${nasaApiKey}`;
    } else {
      url = `https://api.nasa.gov/EPIC/api/${type}?api_key=${nasaApiKey}`;
    }
    const epicRes = await axios.get(url);
    const enhancedData = epicRes.data.map(item => {
      const [year, month, day] = item.date.split(" ")[0].split("-");
      return {
        ...item,
        imageUrl: `https://epic.gsfc.nasa.gov/archive/${type}/${year}/${month}/${day}/png/${item.image}.png`
      };
    });
    res.json(enhancedData);
  } catch (err) {
    console.error("EPIC error:", err);
    res.status(500).json({ error: 'Failed to fetch EPIC images' });
  }
});

app.get('/epic/available', async (req, res) => {
  try {
    const nasaApiKey = process.env.NASA_API_KEY;
    const type = req.query.type || 'natural';
    const url = `https://api.nasa.gov/EPIC/api/${type}/all?api_key=${nasaApiKey}`;
    const response = await axios.get(url);
    const dates = response.data.map(item => item.date);
    res.json(dates);
  } catch (err) {
    console.error('EPIC available dates error:', err);
    res.status(500).json({ error: 'Failed to fetch available EPIC dates' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));