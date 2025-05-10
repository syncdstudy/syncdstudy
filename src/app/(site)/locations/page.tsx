'use client';

import React, { useState, useEffect } from 'react';
import '@/app/globals.css';
import CampusMap, { studySpots } from '@/components/CampusMap';

const LocationsPage = () => {
  const [selected, setSelected] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'indoor' | 'outdoor' | 'food'>('all');
  const [containerHeight, setContainerHeight] = useState('600px');

  const filteredSpots = filter === 'all'
    ? studySpots
    : studySpots.filter((spot) => spot.category === filter);

  // Adjust height on window resize to keep it even
  useEffect(() => {
    const updateHeight = () => {
      const mapElement = document.querySelector('.leaflet-container');
      if (mapElement) {
        setContainerHeight(`${mapElement.clientHeight}px`);
      }
    };

    // Set the initial height
    updateHeight();

    // Adjust on resize
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  return (
    <main className="container py-5">
      <div className="info-box-1 text-center mb-4" style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
        <h1 className="mb-3">Campus Study Locations</h1>
        <p>
          <em>
          For the best experience, allow this application to access your location to see where you are on the map.
          You can also click on any popular study spot to quickly find it, or filter by Indoor, Outdoor, or Food Hub based on your preferences.
          </em>
        </p>
      </div>


      <div className="text-center mb-3">
        <button className="custom-button-3 mx-3 p-2" onClick={() => setFilter('all')}><em>All Spots</em></button>
        <button className="custom-button-1 mx-3 p-2" onClick={() => setFilter('indoor')}><em>Indoor</em></button>
        <button className="custom-button-4 mx-3 p-2" onClick={() => setFilter('outdoor')}><em>Outdoor</em></button>
        <button className="custom-button-2 mx-3 p-2" onClick={() => setFilter('food')}><em>Food Hub</em></button>
      </div>

      <div className="d-flex flex-column flex-lg-row align-items-stretch justify-content-between gap-4">
        {/* Map */}
        <div style={{ flex: '1', maxWidth: '600px' }}>
          <CampusMap selectedName={selected} />
        </div>

        {/* List */}
        <div className="info-box text-start" style={{ flex: '1', maxWidth: '600px', height: containerHeight, overflowY: 'auto' }}>
          <h4 className="text-center mb-4">Popular Study Spots</h4>
          <ul className="list-unstyled">
            {filteredSpots.map((spot) => (
              <li
                key={spot.name}
                className="mb-3"
                role="button"
                onClick={() => setSelected(spot.name)}
              >
                <strong>
                  {spot.icon} {spot.name}
                </strong>
                : {spot.desc}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
};

export default LocationsPage;
