import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './HomePage.css';
import { Link } from 'react-router-dom';
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
import roverImage from '../images/Rover.jpg';
import asteroidImage from '../images/asteroid.jpg';

const planetData = [
  { name: 'MERCURY', image: mercuryImage, size: 20, radius: 80, angle: 30 },
  { name: 'VENUS', image: venusImage, size: 28, radius: 140, angle: 600 },
  { name: 'EARTH', image: earthImage, size: 30, radius: 200, angle: 45 },
  { name: 'MARS', image: marsImage, size: 25, radius: 260, angle: 700 },
  { name: 'JUPITER', image: jupiterImage, size: 50, radius: 340, angle: 650 },
  { name: 'SATURN', image: saturnImage, size: 46, radius: 420, angle: 150 },
  { name: 'URANUS', image: uranusImage, size: 40, radius: 500, angle: 600 },
  { name: 'NEPTUNE', image: neptuneImage, size: 38, radius: 580, angle: 200 },
  { name: 'PLUTO', image: plutoImage, size: 20, radius: 660, angle: 1070 }
];

const HomePage = () => {
  const [apod, setApod] = useState(null);
  const [isMarsHovered, setIsMarsHovered] = useState(false);
  const [isEarthHovered, setIsEarthHovered] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:5000/apod')
      .then(res => {
        if (res.data.media_type === 'image') {
          setApod(res.data);
        }
      })
      .catch(err => console.error('Failed to load APOD', err));
  }, []);

  const marsData = planetData.find(planet => planet.name === 'MARS');
  const marsAngleRad = (marsData.angle * Math.PI) / 180;
  const marsX = marsData.radius * Math.cos(marsAngleRad);
  const marsY = marsData.radius * Math.sin(marsAngleRad);

  const earthData = planetData.find(planet => planet.name === 'EARTH');
  const earthAngleRad = (earthData.angle * Math.PI) / 180;
  const earthX = earthData.radius * Math.cos(earthAngleRad);
  const earthY = earthData.radius * Math.sin(earthAngleRad);

  return (
    <div className="home-container" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="sun-container">
        {planetData.map((planet, index) => (
          <div
            key={`orbit-${index}`}
            className="orbit"
            style={{
              width: `${planet.radius * 2}px`,
              height: `${planet.radius * 2}px`
            }}
          />
        ))}

        <div
          className="planet"
          style={{
            backgroundImage: `url(${sunImage})`,
            width: `100px`,
            height: `100px`,
            top: '50%',
            left: '50%'
          }}
        >
          <div className="planet-inner" style={{
            backgroundImage: `url(${sunImage})`,
            animationDuration: '80s'
          }} />
          <div className="planet-name">SUN</div>
        </div>

        {planetData.map((planet, index) => {
          const angleRad = (planet.angle * Math.PI) / 180;
          const x = planet.radius * Math.cos(angleRad);
          const y = planet.radius * Math.sin(angleRad);

          return (
            <Link key={index} to={`/planet-details#${planet.name}`}>
              <div
                className="planet"
                style={{
                  width: `${planet.size}px`,
                  height: `${planet.size}px`,
                  top: `calc(50% + ${y}px)`,
                  left: `calc(50% + ${x}px)`
                }}
                onMouseEnter={() => {
                  if (planet.name === 'MARS') {
                    setIsMarsHovered(true);
                  } else if (planet.name === 'EARTH') {
                    setIsEarthHovered(true);
                  }
                }}
                onMouseLeave={() => {
                  if (planet.name === 'MARS') {
                    setIsMarsHovered(false);
                  } else if (planet.name === 'EARTH') {
                    setIsEarthHovered(false);
                  }
                }}
              >
                <div
                  className="planet-inner"
                  style={{
                    backgroundImage: `url(${planet.image})`,
                    animationDuration: planet.spin || '20s'
                  }}
                />
                <div className="planet-name">{planet.name}</div>
              </div>
            </Link>
          );
        })}

        {isMarsHovered && (
          <Link to="/mars-rover">
            <div
              className="rover-container"
              style={{
                top: `calc(50% + ${marsY - 40}px)`,
                left: `calc(50% + ${marsX + 40}px)`
              }}
              onMouseEnter={() => setIsMarsHovered(true)}
              onMouseLeave={() => setIsMarsHovered(false)}
            >
              <img 
                src={roverImage} 
                alt="Mars Rover" 
                className="rover-image"
              />
              <div className="rover-label">Mars Rover</div>
            </div>
          </Link>
        )}

        {isEarthHovered && (
          <Link to="/neo">
            <div
              className="asteroid-container"
              style={{
                top: `calc(50% + ${earthY - 40}px)`,
                left: `calc(50% + ${earthX + 40}px)`
              }}
              onMouseEnter={() => setIsEarthHovered(true)}
              onMouseLeave={() => setIsEarthHovered(false)}
            >
              <img 
                src={asteroidImage} 
                alt="Near Earth Objects" 
                className="asteroid-image"
              />
              <div className="asteroid-label">Near Earth Objects</div>
            </div>
          </Link>
        )}
      </div>
    </div>
  );
};

export default HomePage;