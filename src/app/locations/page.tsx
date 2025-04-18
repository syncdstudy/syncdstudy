'use client';

import Image from 'next/image';
import React from 'react';
import '@/app/globals.css';

const LocationsPage = () => (
  <main className="container py-5">
    <h1 className="text-center mb-5">Campus Study Locations</h1>
    <div className="d-flex flex-column flex-lg-row align-items-center justify-content-between gap-4">

      {/* Map Image */}
      <div style={{ flex: '1', maxWidth: '500px' }}>
        <Image
          src="/map.png"
          alt="Campus Map"
          width={500}
          height={500}
          className="img-fluid rounded shadow"
          style={{ width: '100%', height: 'auto' }}
        />
      </div>

      {/* Location Descriptions */}
      <div className="info-box text-start" style={{ flex: '1', maxWidth: '600px' }}>
        <h4 className="text-center mb-4">Top 10 Study Spots</h4>
        <ul className="list-unstyled">
          <li className="mb-3">
            <strong>
              <a
                href="https://maps.app.goo.gl/zcGd7nPMKZW7MQyx7"
                target="_blank"
                rel="noopener noreferrer"
                className="oklch-link"
              >
                Hamilton Library
              </a>
            </strong>
            : Quiet multi-level library with plenty of study space.
          </li>
          <li className="mb-3">
            <strong>
              <a
                href="https://maps.app.goo.gl/qd6wfamtVH5cgZHx6"
                target="_blank"
                rel="noopener noreferrer"
                className="oklch-link"
              >
                ICSpace (POST 318B)
              </a>
            </strong>
            : Reserved for ICS students — collaborative workspace with whiteboards and computers.
          </li>
          <li className="mb-3">
            <strong>
              <a
                href="https://maps.app.goo.gl/3SZhfFsK3Nosssq37"
                target="_blank"
                rel="noopener noreferrer"
                className="oklch-link"
              >
                Bilger Courtyard
              </a>
            </strong>
            : Shady outdoor area near Bilger Hall, great for group sessions.
          </li>
          <li className="mb-3">
            <strong>
              <a
                href="https://maps.app.goo.gl/QZci25U79rfizXbTA"
                target="_blank"
                rel="noopener noreferrer"
                className="oklch-link"
              >
                Physics Lounge (WAT 421)
              </a>
            </strong>
            : A quiet lounge on the 4th floor of Watanabe Hall used by physics students.
          </li>
          <li className="mb-3">
            <strong>
              <a
                href="https://maps.app.goo.gl/PpZCgcbKcD4PQpNaA"
                target="_blank"
                rel="noopener noreferrer"
                className="oklch-link"
              >
                Life Science Study Area
              </a>
            </strong>
            : Ground floor study zone right as you enter the Life Sciences building — open and quiet.
          </li>
          <li className="mb-3">
            <strong>
              <a
                href="https://maps.app.goo.gl/nKmdV9rsMHDsSY828"
                target="_blank"
                rel="noopener noreferrer"
                className="oklch-link"
              >
                Campus Center
              </a>
            </strong>
            : Central hub of student activity — indoor seating, air conditioning, and a casual vibe.
          </li>
          <li className="mb-3">
            <strong>
              <a
                href="https://maps.app.goo.gl/bvCkL3c4HX9kkZFa7"
                target="_blank"
                rel="noopener noreferrer"
                className="oklch-link"
              >
                Sakamaki Courtyard
              </a>
            </strong>
            : Peaceful courtyard surrounded by classroom buildings, perfect for a quiet outdoor session.
          </li>
          <li className="mb-3">
            <strong>
              <a
                href="https://maps.app.goo.gl/7qVA5Ko1eX2twqWy7"
                target="_blank"
                rel="noopener noreferrer"
                className="oklch-link"
              >
                The Bean Counter at Shidler
              </a>
            </strong>
            : Coffee and seating at the Shidler College of Business — casual indoor/outdoor spot.
          </li>
          <li className="mb-3">
            <strong>
              <a
                href="https://maps.app.goo.gl/VLAyq2GWx6ZMgV7s9"
                target="_blank"
                rel="noopener noreferrer"
                className="oklch-link"
              >
                Art Building Tables
              </a>
            </strong>
            : Outdoor tables near the art studios, often quiet and surrounded by greenery.
          </li>
          <li className="mb-3">
            <strong>
              <a
                href="https://maps.app.goo.gl/HLKoaYjdPSSKDgEF7"
                target="_blank"
                rel="noopener noreferrer"
                className="oklch-link"
              >
                Paradise Palms
              </a>
            </strong>
            : Cafeteria space with shaded outdoor seating and close to Hamilton Library.
          </li>
        </ul>
      </div>
    </div>
  </main>
);

export default LocationsPage;
