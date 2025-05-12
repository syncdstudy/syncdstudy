/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/comma-dangle */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-underscore-dangle */

'use client';

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Removed unnecessary line as _getIconUrl is not a valid property on L.Icon.Default
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x.src,
  iconUrl: markerIcon.src,
  shadowUrl: markerShadow.src,
});

const studySpots = [
  {
    name: 'Hamilton Library',
    lat: 21.301022727522536,
    lng: -157.81636808806311,
    desc: 'Quiet multi-level library with plenty of study space.',
    category: 'indoor',
    icon: '📚',
  },
  {
    name: 'ICSpace (POST 318B)',
    lat: 21.29772,
    lng: -157.81617,
    desc: 'Collaborative ICS workspace with whiteboards and snackbars.',
    category: 'indoor',
    icon: '💻',
  },
  {
    name: 'Bilger Courtyard',
    lat: 21.2995,
    lng: -157.8165,
    desc: 'Shady outdoor area near Bilger Hall, great for group sessions.',
    category: 'outdoor',
    icon: '🌳',
  },
  {
    name: 'Physics Lounge (WAT 421)',
    lat: 21.298414649102,
    lng: -157.81575695261614,
    desc: 'Quiet lounge on the 4th floor of Watanabe Hall.',
    category: 'indoor',
    icon: '🔬',
  },
  {
    name: 'Life Science Study Area',
    lat: 21.300488722772776,
    lng: -157.8152453067771,
    desc: 'Open ground floor zone in Life Sciences building.',
    category: 'indoor',
    icon: '🔎',
  },
  {
    name: 'Campus Center',
    lat: 21.29867964971893,
    lng: -157.81895124486715,
    desc: 'Indoor seating, and casual vibe.',
    category: 'food',
    icon: '🥪',
  },
  {
    name: 'Sakamaki Courtyard',
    lat: 21.29769514186463,
    lng: -157.8170125625889,
    desc: 'Peaceful courtyard surrounded by classrooms.',
    category: 'outdoor',
    icon: '🌸',
  },
  {
    name: 'The Bean Counter at Shidler',
    lat: 21.301101663998537,
    lng: -157.82034191539262,
    desc: 'Coffee and seating — casual indoor/outdoor.',
    category: 'food',
    icon: '⛱️',
  },
  {
    name: 'Art Building Tables',
    lat: 21.299373557596333,
    lng: -157.81750741813104,
    desc: ' Outdoor tables near art studios, peaceful and green.',
    category: 'outdoor',
    icon: '🎨',
  },
  {
    name: 'Paradise Palms',
    lat: 21.301032856168927,
    lng: -157.81572033888682,
    desc: 'Cafeteria space with shaded outdoor seating.',
    category: 'food',
    icon: '🍙',
  },
];

const CampusMap = ({ selectedName }: { selectedName: string | null }) => {
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<Record<string, L.Marker>>({});
  const [userMarker, setUserMarker] = useState<L.Marker | null>(null);

  useEffect(() => {
    const map = L.map('uhm-map').setView([21.2969, -157.817], 16);
    mapRef.current = map;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    // Add study spot markers
    studySpots.forEach((spot) => {
      const marker = L.marker([spot.lat, spot.lng])
        .addTo(map)
        .bindPopup(`<b>${spot.icon} ${spot.name}</b><br>${spot.desc}`);
      markersRef.current[spot.name] = marker;
    });

    // Geolocation
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          if (mapRef.current) {
            const user = L.marker([latitude, longitude], {
              title: 'You are here!',
            }).addTo(mapRef.current);

            user.bindPopup('📍 You are here');
            setUserMarker(user);
          }
        },
        () => {
          console.warn('Geolocation failed or denied');
        }
      );
    }

    return () => {
      map.remove();
    };
  }, []);

  useEffect(() => {
    if (selectedName && mapRef.current && markersRef.current[selectedName]) {
      const marker = markersRef.current[selectedName];
      mapRef.current.flyTo(marker.getLatLng(), 17);
      marker.openPopup();
    }
  }, [selectedName]);

  return <div id="uhm-map" style={{ height: '600px', width: '100%', borderRadius: '12px', boxShadow: '0 0 10px rgba(0,0,0,0.2)' }} />;
};

export { studySpots };
export default CampusMap;
