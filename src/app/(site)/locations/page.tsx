'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import '@/app/globals.css';
import { studySpots } from '@/components/data/studySpots'; // ✅ new safe import

const CampusMap = dynamic(() => import('@/components/CampusMap'), { ssr: false });

const LocationsPage = () => {
  const [selected, setSelected] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'indoor' | 'outdoor' | 'food'>('all');

  const filteredSpots = filter === 'all'
    ? studySpots
    : studySpots.filter((spot) => spot.category === filter);

  return (
    <main className="container py-5">
      <div
        className="text-center px-4 py-4 mb-5"
        style={{
          backgroundColor: 'rgba(228, 215, 247, 0.8)',
          border: '3px solid rgb(235, 227, 227)',
          borderRadius: '20px',
          maxWidth: '900px',
          margin: '0 auto',
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
          color: 'rgb(45, 44, 44)',
          animation: 'popUp 1.2s ease-out',
        }}
      >
        <h1 className="mb-3" style={{ fontWeight: '600' }}>Campus Study Locations</h1>
        <p style={{ fontStyle: 'italic', fontSize: '1rem' }}>
          For the best experience, allow this application to access your location to see where you are on the map.
          You can also click on any popular study spot to quickly find it, or filter by Indoor, Outdoor, or Food Hub
          based on your preferences.
        </p>
      </div>

      <div className="text-center mb-3">
        <button type="button" className="btn btn-outline-dark mx-2" onClick={() => setFilter('all')}>All</button>
        <button
          type="button"
          className="btn btn-outline-primary mx-2"
          onClick={() => setFilter('indoor')}
        >
          Indoor 📚
        </button>
        <button
          type="button"
          className="btn btn-outline-success mx-2"
          onClick={() => setFilter('outdoor')}
        >
          Outdoor 🌳
        </button>
        <button type="button" className="btn btn-outline-danger mx-2" onClick={() => setFilter('food')}>Food ☕</button>
      </div>

      <div className="d-flex flex-column flex-lg-row align-items-center justify-content-between gap-4">
        {/* Map */}
        <div style={{ flex: '1', maxWidth: '600px' }}>
          <CampusMap selectedName={selected} />
        </div>

        {/* List */}
        <div
          className="info-box text-start"
          style={{
            flex: '1',
            maxWidth: '600px',
            height: '600px', // match map height
            overflowY: 'auto',
          }}
        >

          <h4 className="text-center mb-4">Top 10 Study Spots</h4>
          <ul className="list-unstyled">
            {filteredSpots.map((spot) => (
              // eslint-disable-next-line jsx-a11y/click-events-have-key-events
              <li
                key={spot.name}
                className="mb-3"
                // eslint-disable-next-line jsx-a11y/no-noninteractive-element-to-interactive-role
                role="button"
                onClick={() => setSelected(spot.name)}
              >
                <strong>
                  {spot.icon}
                  {' '}
                  {spot.name}
                </strong>
                :
                {' '}
                {spot.desc}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
};

export default LocationsPage;
