import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './PlanetDetails.css';
import backgroundImage from '../images/2k_stars_milky_way.jpg';
import sunImage from '../images/Sun.jpg';
import mercuryImage from '../images/Mercury.jpg';
import venusImage from '../images/Venus.jpg';
import earthImage from '../images/Earth.jpg';
import marsImage from '../images/Mars.jpg';
import jupiterImage from '../images/Jupiter.jpg';
import saturnImage from '../images/Saturn.jpg';
import uranusImage from '../images/Uranus.jpg';
import neptuneImage from '../images/Neptune.jpg';
import plutoImage from '../images/Pluto.jpg';

const fetchPlanetImages = async (planetName) => {
  const query = `${planetName} planet`;
  const response = await fetch(`https://images-api.nasa.gov/search?q=${encodeURIComponent(query)}&media_type=image`);
  const data = await response.json();
  const items = data.collection?.items?.slice(0, 4) || [];
  return items.map(item => item.links?.[0]?.href).filter(Boolean);
};

const planetNames = [
  'MERCURY', 'VENUS', 'EARTH', 'MARS', 'JUPITER',
  'SATURN', 'URANUS', 'NEPTUNE', 'PLUTO'
];

const planetEmojis = {
  'MERCURY': '☿',
  'VENUS': '♀',
  'EARTH': '🌍',
  'MARS': '♂',
  'JUPITER': '♃',
  'SATURN': '♄',
  'URANUS': '♅',
  'NEPTUNE': '♆',
  'PLUTO': '♇'
};

const mainMoons = {
  'JUPITER': ['Io', 'Europa', 'Ganymede', 'Callisto'],
  'SATURN': ['Titan', 'Enceladus', 'Rhea', 'Iapetus', 'Dione', 'Tethys'],
  'URANUS': ['Titania', 'Oberon', 'Umbriel', 'Ariel', 'Miranda'],
  'NEPTUNE': ['Triton', 'Proteus', 'Nereid']
};

const getMainMoons = (planetName, allMoons) => {
  if (!allMoons || allMoons.length === 0) return 'None';
  
  const mainMoonList = mainMoons[planetName];
  if (mainMoonList) {
    const filteredMoons = allMoons
      .map(m => m.moon)
      .filter(moon => mainMoonList.includes(moon));
    
    if (filteredMoons.length > 0) {
      return filteredMoons.join(', ');
    }
  }
  
  const moonNames = allMoons.map(m => m.moon);
  return moonNames.length > 5 ? 
    `${moonNames.slice(0, 5).join(', ')} +${moonNames.length - 5} more` : 
    moonNames.join(', ');
};

const stripMarkdown = (text) => {
  if (!text) return '';
  
  let cleanedText = text
    .replace(/\*\*(.*?)\*\*/g, '$1') 
    .replace(/\*(.*?)\*/g, '$1')     
    .replace(/`(.*?)`/g, '$1')       
    .replace(/#{1,6}\s/g, '')        
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') 
    .replace(/\n\*/g, '\n• ')        
    .replace(/\n-/g, '\n• ')         
    .trim();

  const introPhrases = [
    /Here's a short,? educational description of .*?:/gi,
    /Here's a brief description of .*?:/gi,
    /Here's an overview of .*?:/gi,
    /Here's what you need to know about .*?:/gi,
    /Here's a description of .*?:/gi,
    /Here's .*?:/gi,
    /This is .*?:/gi,
    /Let me tell you about .*?:/gi,
    /Here's some information about .*?:/gi
  ];

  introPhrases.forEach(phrase => {
    cleanedText = cleanedText.replace(phrase, '');
  });

  cleanedText = cleanedText
    .replace(/Facts & Trivia:?\s*/gi, ' ')
    .replace(/Facts:?\s*/gi, ' ')
    .replace(/Trivia:?\s*/gi, ' ')
    .replace(/Quick Facts:?\s*/gi, ' ')
    .replace(/Interesting Facts:?\s*/gi, ' ')
    .replace(/Fun Facts:?\s*/gi, ' ')
    .replace(/Notable Features:?\s*/gi, ' ')
    .replace(/Characteristics:?\s*/gi, ' ')
    .replace(/Key Points:?\s*/gi, ' ')
    .replace(/Key Facts:?\s*/gi, ' ')
    .replace(/Features:?\s*/gi, ' ')
    .replace(/Highlights:?\s*/gi, ' ')
    .replace(/Details:?\s*/gi, ' ');

  cleanedText = cleanedText
    .replace(/•\s*([^:]+):\s*([^•]+)/g, (match, topic, description) => {
      const cleanTopic = topic.trim();
      const cleanDesc = description.trim();
      return ` ${cleanTopic} ${cleanDesc}`;
    })
    .replace(/•\s*([^•]+)\s*•\s*([^•]+)/g, (match, topic, description) => {
      const cleanTopic = topic.trim();
      const cleanDesc = description.trim();
      return ` ${cleanTopic} ${cleanDesc}`;
    })
    .replace(/•\s*([^-]+)\s*-\s*([^•]+)/g, (match, topic, description) => {
      const cleanTopic = topic.trim();
      const cleanDesc = description.trim();
      return ` ${cleanTopic} ${cleanDesc}`;
    })
    .replace(/•\s*([^•]+)/g, (match, content) => {
      const cleanContent = content.trim();
      return ` ${cleanContent}`;
    });

  cleanedText = cleanedText
    .replace(/\s+/g, ' ')           
    .replace(/\n\s*\n/g, '\n\n')    
    .replace(/\n{3,}/g, '\n\n')    
    .replace(/\s+\./g, '.')         
    .replace(/\s+,/g, ',')          
    .replace(/\s+:/g, ':')          
    .trim();

  return cleanedText;
};

const planetBackgrounds = {
  'MERCURY': mercuryImage,
  'VENUS': venusImage,
  'EARTH': earthImage,
  'MARS': marsImage,
  'JUPITER': jupiterImage,
  'SATURN': saturnImage,
  'URANUS': uranusImage,
  'NEPTUNE': neptuneImage,
  'PLUTO': plutoImage
};

const PlanetDetails = () => {
  const location = useLocation();
  const [planetData, setPlanetData] = useState({});
  const [descriptions, setDescriptions] = useState({});
  const [loadingDesc, setLoadingDesc] = useState({});
  const [selectedPlanet, setSelectedPlanet] = useState(null);
  const [expandedPlanet, setExpandedPlanet] = useState(null);
  const hasScrolledRef = useRef(false);
  const sectionRefs = useRef({});

  useEffect(() => {
    const fetchAllPlanetData = async () => {
      for (const name of planetNames) {
        try {
          const res = await fetch(`https://api.le-systeme-solaire.net/rest/bodies/${name.toLowerCase()}`);
          const json = await res.json();

          const images = await fetchPlanetImages(name);

          setPlanetData(prev => ({
            ...prev,
            [name]: {
              data: json,
              images
            }
          }));
        } catch (err) {
          console.error(`Error fetching data for ${name}:`, err);
        }
      }
    };
    fetchAllPlanetData();
  }, []);

  useEffect(() => {
    if (!hasScrolledRef.current) {
      const hash = location.hash.replace('#', '');
      if (hash) {
        setSelectedPlanet(hash);
        setExpandedPlanet(hash);
          hasScrolledRef.current = true; 
      }
    }
  }, [location, planetData]);

  const tellMeMore = async (planetName) => {
    setLoadingDesc(prev => ({ ...prev, [planetName]: true }));
    try {
      const res = await fetch('http://localhost:5000/api/planet-description', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ planet: planetName }),
      });

      const data = await res.json();
      setDescriptions(prev => ({ ...prev, [planetName]: stripMarkdown(data.description) }));
    } catch (err) {
      console.error(err);
      setDescriptions(prev => ({ ...prev, [planetName]: 'Error fetching description.' }));
    } finally {
      setLoadingDesc(prev => ({ ...prev, [planetName]: false }));
    }
  };

  const handlePlanetClick = (planetName) => {
    if (expandedPlanet === planetName) {
      setExpandedPlanet(null);
    } else {
      setExpandedPlanet(planetName);
      if (!descriptions[planetName]) {
        tellMeMore(planetName);
      }
    }
  };

  return (
    <div className="planet-details-container" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="planet-header">
        <h1>🌌 Solar System Explorer</h1>
        <p>Click on any planet to explore its details</p>
      </div>
      
      <div className="bento-grid">
        {planetNames.map((name, index) => {
        const planet = planetData[name];
        const data = planet?.data;
        const images = planet?.images || [];
          const isExpanded = expandedPlanet === name;
          const isSelected = selectedPlanet === name;
          const planetBg = planetBackgrounds[name];

        return (
          <div
            key={name}
            ref={el => (sectionRefs.current[name] = el)}
            id={name}
              className={`planet-card ${isExpanded ? 'expanded' : ''} ${isSelected ? 'selected' : ''}`}
              style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.8)), url(${planetBg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
              onClick={() => handlePlanetClick(name)}
            >
              <div className="planet-card-header">
                <div className="planet-emoji">{planetEmojis[name]}</div>
                <h3>{data?.englishName || name}</h3>
                <div className="planet-status">
                  {isExpanded ? '−' : '+'}
                </div>
              </div>

              {isExpanded && (
                <div className="planet-card-content">
                  <div className="planet-images-grid">
              {images.length > 0 ? (
                images.map((src, idx) => (
                        <img 
                          key={idx} 
                          src={src} 
                          alt={`${name} ${idx}`} 
                          className="planet-image" 
                          loading="lazy"
                        />
                ))
              ) : (
                      <div className="loading-images">Loading images...</div>
              )}
            </div>

            {data ? (
                    <div className="planet-stats">
                      <div className="stat-grid">
                        <div className="stat-item">
                          <span className="stat-label">Mass</span>
                          <span className="stat-value">
                            {data.mass?.massValue}e{data.mass?.massExponent} kg
                          </span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-label">Gravity</span>
                          <span className="stat-value">{data.gravity} m/s²</span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-label">Radius</span>
                          <span className="stat-value">{data.meanRadius} km</span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-label">Orbital Period</span>
                          <span className="stat-value">{data.sideralOrbit} days</span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-label">Moons</span>
                          <span className="stat-value">
                            {getMainMoons(name, data.moons)}
                          </span>
                        </div>
                      </div>
                    </div>
            ) : (
                    <div className="loading-data">Loading {name} data...</div>
            )}

                  <div className="planet-description">
                    {loadingDesc[name] ? (
                      <div className="loading-description">
                        <div className="loading-spinner"></div>
                        Generating description...
                      </div>
                    ) : descriptions[name] ? (
                      <p>{descriptions[name]}</p>
                    ) : (
                      <button 
                        className="tell-me-more-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          tellMeMore(name);
                        }}
                      >
                        Tell me more about {name}
            </button>
                    )}
                  </div>
                </div>
            )}
          </div>
        );
      })}
      </div>
    </div>
  );
};

export default PlanetDetails;