import React, { useState, useEffect } from 'react';
import './MarsRoverPage.css';
import backgroundImage from '../images/2k_stars_milky_way.jpg';

const MarsRoverPage = () => {
  const [roverInfo, setRoverInfo] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [photoLoading, setPhotoLoading] = useState(false);
  const [selectedRover, setSelectedRover] = useState('curiosity');
  const [selectedSol, setSelectedSol] = useState(1000);
  const [selectedCamera, setSelectedCamera] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [historicalRovers, setHistoricalRovers] = useState([]);
  const [historicalDropdownOpen, setHistoricalDropdownOpen] = useState(false);

  const rovers = [
    { name: 'curiosity', displayName: 'Curiosity' },
    { name: 'perseverance', displayName: 'Perseverance' }
  ];

  const cameraOptions = {
    curiosity: [
      { code: '', name: 'All Cameras' },
      { code: 'FHAZ', name: 'Front Hazard Avoidance Camera' },
      { code: 'RHAZ', name: 'Rear Hazard Avoidance Camera' },
      { code: 'MAST', name: 'Mast Camera' },
      { code: 'CHEMCAM', name: 'Chemistry and Camera Complex' },
      { code: 'MAHLI', name: 'Mars Hand Lens Imager' },
      { code: 'MARDI', name: 'Mars Descent Imager' },
      { code: 'NAVCAM', name: 'Navigation Camera' }
    ],
    perseverance: [
      { code: '', name: 'All Cameras' },
      { code: 'EDL_RUCAM', name: 'Rover Up-Look Camera' },
      { code: 'EDL_RDCAM', name: 'Rover Down-Look Camera' },
      { code: 'EDL_DDCAM', name: 'Descent Stage Down-Look Camera' },
      { code: 'EDL_PUCAM1', name: 'Parachute Up-Look Camera A' },
      { code: 'EDL_PUCAM2', name: 'Parachute Up-Look Camera B' },
      { code: 'NAVCAM_LEFT', name: 'Navigation Camera - Left' },
      { code: 'NAVCAM_RIGHT', name: 'Navigation Camera - Right' },
      { code: 'MCZ_RIGHT', name: 'Mast Camera Zoom - Right' },
      { code: 'MCZ_LEFT', name: 'Mast Camera Zoom - Left' },
      { code: 'FRONT_HAZCAM_LEFT_A', name: 'Front Hazard Camera - Left' },
      { code: 'FRONT_HAZCAM_RIGHT_A', name: 'Front Hazard Camera - Right' },
      { code: 'REAR_HAZCAM_LEFT', name: 'Rear Hazard Camera - Left' },
      { code: 'REAR_HAZCAM_RIGHT', name: 'Rear Hazard Camera - Right' }
    ]
  };

  const allRoverNames = ['curiosity', 'perseverance', 'opportunity', 'spirit'];

  const roverDescriptions = {
    curiosity: 'Curiosity has been exploring Gale Crater since 2012, searching for signs of ancient habitable environments and studying Mars\' climate and geology. It discovered evidence of ancient lakes and organic molecules, and continues to provide key insights into the planet\'s past.',
    perseverance: 'Perseverance landed in Jezero Crater in 2021 to search for signs of ancient life and collect samples for future return to Earth. It is testing new technology, including the Ingenuity helicopter, and is advancing the search for biosignatures on Mars.',
    spirit: 'Spirit landed in Gusev Crater in 2004 and operated for over six years—far beyond its planned 90-day mission. It discovered strong evidence that Mars was once much wetter, including signs of ancient hot springs and volcanic activity. Spirit traveled 7.73 kilometers before becoming stuck in soft soil in 2009, but continued to return valuable data until 2010.',
    opportunity: 'Opportunity landed in Meridiani Planum in 2004 and set the record for the longest distance driven by any off-Earth wheeled vehicle, traveling over 45 kilometers. It found clear evidence that liquid water once existed on Mars, including hematite "blueberries" and ancient clay minerals. Opportunity operated for nearly 15 years, surviving dust storms and harsh conditions until 2018.'
  };

  const getHistoricalDescription = (roverName) => {
    console.log(`getHistoricalDescription called with: "${roverName}"`);
    const descriptions = {
      spirit: 'Spirit landed in Gusev Crater in 2004 and operated for over six years—far beyond its planned 90-day mission. It discovered strong evidence that Mars was once much wetter, including signs of ancient hot springs and volcanic activity. Spirit traveled 7.73 kilometers before becoming stuck in soft soil in 2009, but continued to return valuable data until 2010.',
      opportunity: 'Opportunity landed in Meridiani Planum in 2004 and set the record for the longest distance driven by any off-Earth wheeled vehicle, traveling over 45 kilometers. It found clear evidence that liquid water once existed on Mars, including hematite "blueberries" and ancient clay minerals. Opportunity operated for nearly 15 years, surviving dust storms and harsh conditions until 2018.'
    };
    console.log(`Available keys:`, Object.keys(descriptions));
    const result = descriptions[roverName.toLowerCase()] || 'FALLBACK USED';
    console.log(`Result:`, result);
    return descriptions[roverName.toLowerCase()] || 'This Mars rover contributed valuable scientific data during its mission on the Red Planet.';
  };

  const getHistoricalAchievements = (roverName) => {
    console.log(`getHistoricalAchievements called with: "${roverName}"`);
    const achievements = {
      spirit: [
        'Discovered evidence of ancient hot springs and water-altered minerals',
        'Provided the first close-up images of Martian dust devils',
        'Operated for over 2,200 sols (Martian days), 25 times longer than planned',
        'Analyzed hundreds of rock and soil samples'
      ],
      opportunity: [
        'Discovered hematite "blueberries" indicating past water',
        'Found ancient clay minerals formed in neutral-pH water',
        'Drove a marathon distance (45.16 km) on Mars',
        'Operated for nearly 15 years, far exceeding its 90-day mission'
      ]
    };
    console.log(`Available keys:`, Object.keys(achievements));
    const result = achievements[roverName.toLowerCase()] || 'FALLBACK USED';
    console.log(`Result:`, result);
    return achievements[roverName.toLowerCase()] || ['Contributed to Mars exploration and scientific research'];
  };

  const combinedAchievements = [
    { year: '2004', rover: 'Spirit', event: 'Landed in Gusev Crater' },
    { year: '2004', rover: 'Spirit', event: 'Discovered evidence of ancient hot springs and water-altered minerals' },
    { year: '2004', rover: 'Opportunity', event: 'Landed in Meridiani Planum' },
    { year: '2004', rover: 'Opportunity', event: 'Discovered hematite "blueberries" indicating past water' },
    { year: '2012', rover: 'Curiosity', event: 'Landed in Gale Crater' },
    { year: '2012', rover: 'Curiosity', event: 'Discovered evidence of ancient lakes and streams' },
    { year: '2014', rover: 'Curiosity', event: 'Detected organic molecules in Martian rocks' },
    { year: '2015', rover: 'Curiosity', event: 'Measured radiation levels for future human missions' },
    { year: '2018', rover: 'Curiosity', event: 'Found seasonal methane variations in the atmosphere' },
    { year: '2021', rover: 'Perseverance', event: 'Landed in Jezero Crater' },
    { year: '2021', rover: 'Perseverance', event: 'Deployed and supported the Ingenuity helicopter' },
    { year: '2021', rover: 'Perseverance', event: 'Tested MOXIE for oxygen production on Mars' },
    { year: '2022', rover: 'Perseverance', event: 'Collected the first samples for future return to Earth' },
    { year: '2022', rover: 'Perseverance', event: 'Discovered ancient river delta features' },
    { year: '2004-2010', rover: 'Spirit', event: 'Operated for over 2,200 sols (Martian days), 25x longer than planned' },
    { year: '2004-2018', rover: 'Opportunity', event: 'Operated for nearly 15 years, far exceeding its 90-day mission' },
  ];

  const Timeline = ({ events }) => (
    <div className="timeline-container">
      <div className="timeline-horizontal">
        {events.map((item, idx) => (
          <div className="timeline-event" key={idx}>
            <div className="timeline-dot" />
            <div className="timeline-label">
              <strong>{item.year}</strong> <br />
              <span style={{ color: '#c1440e' }}>{item.rover}</span><br />
              {item.event}
            </div>
            {idx !== events.length - 1 && <div className="timeline-connector" />}
          </div>
        ))}
      </div>
    </div>
  );

  useEffect(() => {
    fetchRoverInfo();
    fetchPhotos();
    fetchAllRovers();
    setCurrentImageIndex(0);
  }, [selectedRover]);

  useEffect(() => {
    fetchPhotos();
    setCurrentImageIndex(0);
  }, [selectedSol, selectedCamera, currentPage]);

  const fetchAllRovers = async () => {
    try {
      console.log('Fetching historical rovers...');
      const historical = [];
      
      for (const roverName of allRoverNames) {
        if (roverName !== 'curiosity' && roverName !== 'perseverance') {
          try {
            console.log(`Fetching info for ${roverName}...`);
            const response = await fetch(`http://localhost:5000/mars-rover-info?rover=${roverName}`);
            
            if (!response.ok) {
              console.warn(`Failed to fetch ${roverName}: ${response.status}`);
              continue;
            }
            
            const data = await response.json();
            console.log(`${roverName} data:`, data);
            
            if (data.rover) {
              console.log(`Processing rover: ${data.rover.name}`);
              
              const roverInfo = {
                name: data.rover.name.charAt(0).toUpperCase() + data.rover.name.slice(1),
                mission: `${data.rover.launch_date} - ${data.rover.max_date}`,
                launch_date: data.rover.launch_date,
                landing_date: data.rover.landing_date,
                status: data.rover.status,
                max_sol: data.rover.max_sol,
                total_photos: data.rover.total_photos,
                description: getHistoricalDescription(data.rover.name),
                achievements: getHistoricalAchievements(data.rover.name)
              };
              historical.push(roverInfo);
              console.log(`Added ${roverName} to historical list`);
            } else {
              console.warn(`No rover data found for ${roverName}`);
            }
          } catch (error) {
            console.error(`Error fetching ${roverName} info:`, error);
          }
        }
      }
      
      console.log('Final historical rovers:', historical);
      setHistoricalRovers(historical);
    } catch (error) {
      console.error('Error fetching historical rovers:', error);
    }
  };

  const fetchRoverInfo = async () => {
    try {
      const response = await fetch(`http://localhost:5000/mars-rover-info?rover=${selectedRover}`);
      const data = await response.json();
      setRoverInfo(data.rover);
    } catch (error) {
      console.error('Error fetching rover info:', error);
    }
  };

  const fetchPhotos = async () => {
    setPhotoLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/mars-rover?rover=${selectedRover}&sol=${selectedSol}&camera=${selectedCamera}&page=${currentPage}`
      );
      const data = await response.json();
      setPhotos(data.photos || []);
    } catch (error) {
      console.error('Error fetching photos:', error);
      setPhotos([]);
    } finally {
      setPhotoLoading(false);
      setLoading(false);
    }
  };

  const handleRoverChange = (rover) => {
    setSelectedRover(rover);
    setSelectedCamera('');
    setCurrentPage(1);
    setLoading(true);
  };

  const handleSolChange = (e) => {
    setSelectedSol(e.target.value);
    setCurrentPage(1);
  };

  const handleCameraChange = (e) => {
    setSelectedCamera(e.target.value);
    setCurrentPage(1);
  };

  const nextImage = () => {
    if (photos.length > 0) {
      setCurrentImageIndex((prev) => (prev + 1) % photos.length);
    }
  };

  const prevImage = () => {
    if (photos.length > 0) {
      setCurrentImageIndex((prev) => (prev - 1 + photos.length) % photos.length);
    }
  };

  const goToImage = (index) => {
    setCurrentImageIndex(index);
  };

  if (loading) {
    return (
      <div className="mars-rover-page">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading Mars Rover data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mars-rover-page" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="page-overlay">
        <div className="rover-controls">
          <div className="rover-selector">
            <h3>Active Rovers:</h3>
            <div className="rover-buttons">
              {rovers.map(rover => (
                <button
                  key={rover.name}
                  className={`rover-btn ${selectedRover === rover.name ? 'active' : ''}`}
                  onClick={() => handleRoverChange(rover.name)}
                >
                  {rover.displayName}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-controls">
            <div className="control-group">
              <label htmlFor="sol-input">Sol (Martian Day):</label>
              <input
                id="sol-input"
                type="number"
                min="0"
                max={roverInfo?.max_sol || 3000}
                value={selectedSol}
                onChange={handleSolChange}
              />
            </div>

            <div className="control-group">
              <label htmlFor="camera-select">Camera:</label>
              <select
                id="camera-select"
                value={selectedCamera}
                onChange={handleCameraChange}
              >
                {cameraOptions[selectedRover]?.map(camera => (
                  <option key={camera.code} value={camera.code}>
                    {camera.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {roverInfo && (
          <div className="rover-info">
            <div className="rover-info-content">
              <h2>{roverInfo.name.charAt(0).toUpperCase() + roverInfo.name.slice(1)} Rover</h2>
              <Timeline events={combinedAchievements} />
              {roverDescriptions[roverInfo.name.toLowerCase()] && (
                <div className="rover-mission-description">
                  <p>{roverDescriptions[roverInfo.name.toLowerCase()]}</p>
                </div>
              )}
              <div className="rover-stats">
                <div className="stat-item">
                  <span className="stat-label">Launch Date:</span>
                  <span className="stat-value">{roverInfo.launch_date}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Landing Date:</span>
                  <span className="stat-value">{roverInfo.landing_date}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Status:</span>
                  <span className={`stat-value status-${roverInfo.status.toLowerCase()}`}>
                    {roverInfo.status}
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Max Sol:</span>
                  <span className="stat-value">{roverInfo.max_sol}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Max Date:</span>
                  <span className="stat-value">{roverInfo.max_date}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Total Photos:</span>
                  <span className="stat-value">{roverInfo.total_photos.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="historical-rovers">
          <div 
            className="historical-rovers-header"
            onClick={() => setHistoricalDropdownOpen(!historicalDropdownOpen)}
          >
            <h2>Historic Mars Rovers</h2>
            <span className={`dropdown-arrow ${historicalDropdownOpen ? 'open' : ''}`}>▼</span>
          </div>
          
          {historicalDropdownOpen && (
            <div className="historical-rovers-content">
              {historicalRovers.length > 0 ? (
                historicalRovers.map((rover, index) => (
                  <div key={index} className="historical-rover-card">
                    <div className="historical-rover-header">
                      <h3>{rover.name}</h3>
                      <span className="mission-dates">{rover.mission}</span>
                    </div>
                    <div className="historical-rover-stats">
                      <div className="historical-stat">
                        <span>Status:</span>
                        <span className={`status-${rover.status.toLowerCase()}`}>{rover.status}</span>
                      </div>
                      <div className="historical-stat">
                        <span>Max Sol:</span>
                        <span>{rover.max_sol}</span>
                      </div>
                      <div className="historical-stat">
                        <span>Total Photos:</span>
                        <span>{rover.total_photos.toLocaleString()}</span>
                      </div>
                    </div>
                    <p className="rover-description">{rover.description}</p>
                    <div className="achievements">
                      <h4>Key Achievements:</h4>
                      <ul>
                        {rover.achievements.map((achievement, i) => (
                          <li key={i}>{achievement}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-historical-data">
                  <p>Loading historical rover information...</p>
                  <p>This section will show information about Spirit and Opportunity rovers.</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="photos-section">
          <div className="photos-header">
            <h3>
              Photos from Sol {selectedSol} 
              {selectedCamera && ` - ${cameraOptions[selectedRover]?.find(c => c.code === selectedCamera)?.name}`}
            </h3>
            {photos.length > 0 && (
              <p className="photo-count">{photos.length} photos found</p>
            )}
          </div>

          {photoLoading ? (
            <div className="loading">
              <div className="loading-spinner"></div>
              <p>Loading photos...</p>
            </div>
          ) : photos.length > 0 ? (
            <div className="modern-photo-gallery">
              <div className="main-viewer">
                <div className="main-image-container">
                  <img 
                    src={photos[currentImageIndex]?.img_src} 
                    alt={`Mars photo ${photos[currentImageIndex]?.id}`}
                    className="main-image"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                    onLoad={(e) => {
                      e.target.style.display = 'block';
                      e.target.nextSibling.style.display = 'none';
                    }}
                  />
                  <div className="main-image-error">
                    <div className="error-icon">📷</div>
                    <p>Image unavailable</p>
                  </div>
                  
                  <button className="nav-arrow nav-left" onClick={prevImage} disabled={photos.length <= 1}>
                    ‹
                  </button>
                  <button className="nav-arrow nav-right" onClick={nextImage} disabled={photos.length <= 1}>
                    ›
                  </button>
                </div>
                
                <div className="image-info">
                  <div className="info-grid">
                    <div className="info-item">
                      <span className="info-label">Camera</span>
                      <span className="info-value">{photos[currentImageIndex]?.camera.full_name}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Date</span>
                      <span className="info-value">{photos[currentImageIndex]?.earth_date}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Photo ID</span>
                      <span className="info-value">{photos[currentImageIndex]?.id}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Position</span>
                      <span className="info-value">{currentImageIndex + 1} of {photos.length}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="thumbnail-strip">
                {photos.slice(0, 12).map((photo, index) => (
                  <div 
                    key={photo.id} 
                    className={`thumbnail-item ${index === currentImageIndex ? 'active' : ''}`}
                    onClick={() => goToImage(index)}
                  >
                    <img 
                      src={photo.img_src} 
                      alt={`Thumbnail ${photo.id}`}
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="thumbnail-error">📷</div>
                  </div>
                ))}
                {photos.length > 12 && (
                  <div className="more-indicator">
                    <span>+{photos.length - 12}</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="no-photos">
              <p>No photos found for this Sol and camera combination.</p>
              <p>Try selecting a different Sol or camera.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarsRoverPage;