import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './EpicPage.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const EPIC_TYPES = [
  { key: 'natural', label: 'Natural Color' },
  { key: 'enhanced', label: 'Enhanced Color' }
];

const EpicPage = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('natural');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availableDates, setAvailableDates] = useState([]);

  const fetchAvailableDates = (type) => {
    axios.get(`http://localhost:5000/epic/available?type=${type}`)
      .then((res) => {
        setAvailableDates(res.data);
        const isoSelected = selectedDate.toISOString().split('T')[0];
        if (!res.data.includes(isoSelected)) {
          const mostRecent = res.data[res.data.length - 1];
          setSelectedDate(new Date(mostRecent));
        }
      })
      .catch(() => setAvailableDates([]));
  };

  const fetchImages = (type, date) => {
    setLoading(true);
    const isoDate = date.toISOString().split('T')[0];
    axios.get(`http://localhost:5000/epic?type=${type}&date=${isoDate}`)
      .then((res) => {
        setImages(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to fetch EPIC images:', err);
        setImages([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchAvailableDates(selectedType);
  }, [selectedType]);

  useEffect(() => {
    if (availableDates.length > 0) {
      fetchImages(selectedType, selectedDate);
    }
  }, [selectedType, selectedDate, availableDates]);

  const isDateAvailable = (date) => {
    const iso = date.toISOString().split('T')[0];
    return availableDates.includes(iso);
  };

  return (
    <div className="epic-container">
      <h2>EPIC Earth Images (DSCOVR Satellite)</h2>
      <div className="epic-controls">
        <div className="epic-type-toggle">
          {EPIC_TYPES.map((type) => (
            <button
              key={type.key}
              className={selectedType === type.key ? 'active' : ''}
              onClick={() => setSelectedType(type.key)}
            >
              {type.label}
            </button>
          ))}
        </div>
        <div className="epic-datepicker">
          <DatePicker
            selected={selectedDate}
            onChange={setSelectedDate}
            maxDate={new Date()}
            dateFormat="yyyy-MM-dd"
            filterDate={isDateAvailable}
            placeholderText="Select a date with images"
            highlightDates={availableDates.map(d => new Date(d))}
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
          />
        </div>
      </div>
      {loading ? (
        <p>Loading...</p>
      ) : images.length === 0 ? (
        <p>No images found for this date and type.</p>
      ) : (
        <div className="epic-grid">
          {images.map((item) => (
            <div key={item.identifier} className="epic-card">
              <img src={item.imageUrl} alt={item.caption} className="epic-image" />
              <div className="epic-info">
                <p><strong>Caption:</strong> {item.caption}</p>
                <p><strong>Date:</strong> {item.date.split(' ')[0]}</p>
                <p><strong>Time:</strong> {item.date.split(' ')[1]}</p>
                <p><strong>Centroid:</strong> Lat {item.centroid_coordinates.lat}, Lon {item.centroid_coordinates.lon}</p>
                <a
                  href={item.imageUrl}
                  download
                  className="epic-download-btn"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Download Full Image
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EpicPage;