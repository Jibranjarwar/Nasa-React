import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ApodPage.css';
import backgroundImage from '../images/2k_stars_milky_way.jpg';

function ApodPage() {
  const [apod, setApod] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recentApods, setRecentApods] = useState([]);
  const [recentApodsLoading, setRecentApodsLoading] = useState(false);
  const [showRecentApods, setShowRecentApods] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedDay, setSelectedDay] = useState(new Date().getDate());

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    fetchApod();
    fetchRecentApods();
  }, []);

  const fetchApod = async (date = '') => {
    setLoading(true);
    setError(null);
    try {
      const url = date ? `http://localhost:5000/apod?date=${date}` : 'http://localhost:5000/apod';
      console.log('Fetching APOD from:', url);
      const response = await axios.get(url);
      console.log('APOD response:', response.data);
      setApod(response.data);
    } catch (err) {
      console.error('Error fetching APOD:', err);
      setError('Failed to fetch APOD. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentApods = async () => {
    setRecentApodsLoading(true);
    try {
      const recentDates = [];
      for (let i = 1; i <= 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateString = date.toISOString().split('T')[0];
        recentDates.push(dateString);
      }

      console.log('Fetching recent APODs for dates:', recentDates);

      const recentApodsData = await Promise.all(
        recentDates.map(async (date, index) => {
          try {
            await new Promise(resolve => setTimeout(resolve, index * 200));
            const response = await axios.get(`http://localhost:5000/apod?date=${date}`);
            console.log(`APOD for ${date}:`, response.data.title);
            return response.data;
          } catch (err) {
            console.error(`Error fetching APOD for ${date}:`, err);
            return null;
          }
        })
      );

      const validApods = recentApodsData.filter(apod => apod !== null);
      console.log('Valid recent APODs:', validApods.length);
      setRecentApods(validApods);
    } catch (err) {
      console.error('Error fetching recent APODs:', err);
    } finally {
      setRecentApodsLoading(false);
    }
  };

  const handleDateChange = (e) => {
    const date = e.target.value;
    setSelectedDate(date);
    if (date) {
      fetchApod(date);
    }
  };

  const handleCustomDateSelect = () => {
    const year = selectedYear;
    const month = String(selectedMonth + 1).padStart(2, '0');
    const day = String(selectedDay).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;
    
    if (dateString <= today) {
      setSelectedDate(dateString);
      fetchApod(dateString);
      setShowDatePicker(false);
    }
  };

  const handleRecentApodClick = (apodData) => {
    setSelectedDate(apodData.date);
    setApod(apodData);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetToToday = () => {
    setSelectedDate('');
    fetchApod();
  };

  const years = Array.from({ length: new Date().getFullYear() - 1994 }, (_, i) => 1995 + i).reverse();
  
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="apod-container" style={{ backgroundImage: `url(${backgroundImage})` }}>
      <div className="apod-title-small">
        📸 Astronomy Picture of the Day
      </div>

      {apod && !loading && (
        <div className="apod-content">
          <div className="apod-main">
            <h2>{apod.title}</h2>
            {selectedDate && (
              <div className="current-apod-indicator">
                📅 Viewing APOD from {selectedDate}
              </div>
            )}
            <div className="apod-image-container">
              {apod.media_type === 'image' ? (
          <img src={apod.url} alt={apod.title} className="apod-image" />
              ) : (
                <iframe
                  src={apod.url}
                  title={apod.title}
                  className="apod-video"
                  allowFullScreen
                />
              )}
            </div>
            <div className="apod-info">
              <p className="apod-explanation">{apod.explanation}</p>
              <div className="apod-meta">
                <span className="apod-date">📅 {apod.date}</span>
                {apod.copyright && (
                  <span className="apod-copyright">📷 {apod.copyright}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="apod-bottom-section">
        <div className="recent-apods">
          <h3>🌌 Recent Cosmic Wonders</h3>
          {recentApodsLoading ? (
            <div className="recent-apods-loading">
              <div className="loading-spinner"></div>
              <p>Loading recent cosmic wonders...</p>
            </div>
          ) : recentApods.length > 0 ? (
            <div className="recent-apods-dropdown">
              <div
                className={`recent-apod-card ${selectedDate === recentApods[0].date ? 'selected' : ''}`}
                onClick={() => handleRecentApodClick(recentApods[0])}
              >
                <div className="recent-apod-image">
                  {recentApods[0].media_type === 'image' ? (
                    <img src={recentApods[0].url} alt={recentApods[0].title} />
                  ) : (
                    <div className="video-placeholder">🎥 Video</div>
                  )}
                </div>
                <div className="recent-apod-title">{recentApods[0].title}</div>
                <div className="recent-apod-date">{recentApods[0].date}</div>
              </div>
              
              <button 
                className="view-more-btn"
                onClick={() => setShowRecentApods(!showRecentApods)}
              >
                {showRecentApods ? '👆 Show Less' : '👇 View More'} ({recentApods.length - 1} more)
              </button>
              
              {showRecentApods && (
                <div className="additional-apods">
                  {recentApods.slice(1).map((recentApod, index) => (
                    <div
                      key={index + 1}
                      className={`recent-apod-card ${selectedDate === recentApod.date ? 'selected' : ''}`}
                      onClick={() => handleRecentApodClick(recentApod)}
                    >
                      <div className="recent-apod-image">
                        {recentApod.media_type === 'image' ? (
                          <img src={recentApod.url} alt={recentApod.title} />
                        ) : (
                          <div className="video-placeholder">🎥 Video</div>
                        )}
                      </div>
                      <div className="recent-apod-title">{recentApod.title}</div>
                      <div className="recent-apod-date">{recentApod.date}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
      ) : (
            <div className="no-recent-apods">
              <p>No recent APODs available</p>
            </div>
          )}
        </div>
        <div className="apod-controls">
          <div className="date-selector">
            <label>Select Date:</label>
            <div className="date-selector-buttons">
              <button 
                onClick={() => setShowDatePicker(!showDatePicker)} 
                className="custom-date-btn"
              >
                📅 {selectedDate || 'Choose Date'}
              </button>
              <button onClick={resetToToday} className="today-btn">
                Today
              </button>
            </div>

            {showDatePicker && (
              <div className="custom-date-picker">
                <div className="date-picker-header">
                  <h3>Select Date</h3>
                  <button onClick={() => setShowDatePicker(false)} className="close-btn">×</button>
                </div>
                <div className="date-picker-content">
                  <div className="date-picker-row">
                    <label>Year:</label>
                    <select 
                      value={selectedYear} 
                      onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                    >
                      {years.map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                  <div className="date-picker-row">
                    <label>Month:</label>
                    <select 
                      value={selectedMonth} 
                      onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                    >
                      {months.map((month, index) => (
                        <option key={index} value={index}>{month}</option>
                      ))}
                    </select>
                  </div>
                  <div className="date-picker-row">
                    <label>Day:</label>
                    <select 
                      value={selectedDay} 
                      onChange={(e) => setSelectedDay(parseInt(e.target.value))}
                    >
                      {days.map(day => (
                        <option key={day} value={day}>{day}</option>
                      ))}
                    </select>
                  </div>
                  <button onClick={handleCustomDateSelect} className="select-date-btn">
                    Select Date
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {loading && (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading cosmic wonders...</p>
        </div>
      )}

      {error && (
        <div className="error-container">
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}

export default ApodPage;