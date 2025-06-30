import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './NeoPage.css';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const ExternalLinkIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4cafef" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{verticalAlign: 'middle', marginLeft: 4}}>
    <path d="M18 13v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
    <polyline points="15 3 21 3 21 9"/>
    <line x1="10" y1="14" x2="21" y2="3"/>
  </svg>
);

const NeoPage = () => {
    const [startDate, setStartDate] = useState(new Date());
    const [neoData, setNeoData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [expanded, setExpanded] = useState({});

    const fetchNeoData = (date) => {
        const isoDate = date.toISOString().split('T')[0];
        setLoading(true);
        axios.get(`http://localhost:5000/neo?start_date=${isoDate}`)
            .then(res => {
                const raw = res.data.near_earth_objects;
                const formatted = Object.entries(raw).flatMap(([date, objects]) =>
                    objects.map(obj => {
                        const ca = obj.close_approach_data?.[0] || {};
                        return {
                            id: obj.id,
                            name: obj.name,
                            date,
                            diameter: obj.estimated_diameter.meters.estimated_diameter_max.toFixed(1),
                            hazardous: obj.is_potentially_hazardous_asteroid,
                            speed: parseFloat(ca.relative_velocity?.kilometers_per_hour).toFixed(2),
                            distance: parseFloat(ca.miss_distance?.kilometers).toFixed(2),
                            absolute_magnitude_h: obj.absolute_magnitude_h,
                            orbiting_body: ca.orbiting_body,
                            close_approach_time: ca.close_approach_date_full || ca.close_approach_date,
                            distance_ld: ca.miss_distance?.lunar,
                            distance_au: ca.miss_distance?.astronomical,
                            speed_kms: ca.relative_velocity?.kilometers_per_second,
                            speed_mph: ca.relative_velocity?.miles_per_hour
                        };
                    })
                );
                setNeoData(formatted);
            })
            .catch(err => console.error('NEO API error:', err))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchNeoData(startDate);
    }, [startDate]);

    const CustomTooltip = ({ active, payload }) => {
        if (active && payload && payload.length) {
            const d = payload[0].payload;
            return (
                <div className="tooltip">
                    <p><strong>{d.name}</strong></p>
                    <p>Diameter: {d.diameter} m</p>
                    <p>Speed: {d.speed} km/h</p>
                    <p>Miss Distance: {d.distance} km</p>
                    <p style={{ color: d.hazardous ? 'red' : 'limegreen' }}>
                        {d.hazardous ? '⚠️ Hazardous' : '✅ Not Hazardous'}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="neo-container">
            <h2>Near Earth Objects (NEOs)</h2>
            <div className="datepicker-wrapper">
                <label>Select Date: </label>
                <DatePicker
                    selected={startDate}
                    onChange={setStartDate}
                    maxDate={new Date()}
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                />
            </div>

            {loading ? (
                <p>Loading NEO data...</p>
            ) : (
                <>
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={neoData} margin={{ top: 20, bottom: 60 }}>
                            <XAxis dataKey="name" angle={-45} textAnchor="end" interval={0} height={80} />
                            <YAxis label={{ value: 'Diameter (m)', angle: -90, position: 'insideLeft' }} />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="diameter">
                                {neoData.map((entry, index) => (
                                    <Cell
                                        key={`bar-${index}`}
                                        fill={entry.hazardous ? '#ff4d4d' : '#4caf50'}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>

                    <div className="neo-list">
                        {neoData.map((obj) => {
                            const isOpen = expanded[obj.id];
                            const jplUrl = `https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html#/?sstr=${obj.id}`;
                            return (
                                <div key={obj.id} className={`neo-item ${obj.hazardous ? 'hazard' : ''}`}
                                    style={{ transition: 'box-shadow 0.2s, background 0.2s' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <h4 style={{ margin: 0 }}>{obj.name}
                                            <a href={jplUrl} target="_blank" rel="noopener noreferrer" title="View in JPL Database">
                                                <ExternalLinkIcon />
                                            </a>
                                        </h4>
                                        <button
                                            className="neo-expand-btn"
                                            onClick={() => setExpanded(e => ({ ...e, [obj.id]: !e[obj.id] }))}
                                            aria-label={isOpen ? 'Hide details' : 'Show more details'}
                                            style={{ marginLeft: 8 }}
                                        >
                                            {isOpen ? '▲' : '▼'}
                                        </button>
                                    </div>
                                    <p>Diameter: {obj.diameter} m</p>
                                    <p>Speed: {obj.speed} km/h</p>
                                    <p>Miss Distance: {obj.distance} km</p>
                                    <p>Status: <strong>{obj.hazardous ? 'Hazardous' : 'Safe'}</strong></p>
                                    <div
                                        className="neo-details"
                                        style={{
                                            maxHeight: isOpen ? 300 : 0,
                                            overflow: 'hidden',
                                            transition: 'max-height 0.4s cubic-bezier(.4,2,.6,1)',
                                            opacity: isOpen ? 1 : 0,
                                            pointerEvents: isOpen ? 'auto' : 'none',
                                        }}
                                    >
                                        <p>Absolute Magnitude: {obj.absolute_magnitude_h || 'N/A'}</p>
                                        <p>Orbiting Body: {obj.orbiting_body || 'Earth'}</p>
                                        <p>Close Approach: {obj.close_approach_time || 'N/A'}</p>
                                        <p>Miss Distance: {obj.distance_ld || 'N/A'} LD ({obj.distance_au || 'N/A'} AU)</p>
                                        <p>Speed: {obj.speed_kms || 'N/A'} km/s ({obj.speed_mph || 'N/A'} mph)</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </>
            )}
        </div>
    );
};

export default NeoPage;
