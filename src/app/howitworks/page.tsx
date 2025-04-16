'use client';

import React from 'react';

const HowItWorks = () => (
  <main className="container py-5">
    <div
      className="p-5 rounded-4 shadow-sm"
      style={{
        backgroundColor: '#f3e8ff', // light purple
        border: '1px solid #e0cfff',
      }}
    >
      <h1 className="mb-4 text-center">How Sync&apos;d Study Works</h1>

      <section className="mb-5">
        <h3>1. 📍 Explore Study Locations</h3>
        <p>
          Browse active study sessions happening across campus. Each session lists the subject, time, and location so
          you can join what works for you.
        </p>
      </section>

      <section className="mb-5">
        <h3>2. 👥 Join or Create Sessions</h3>
        <p>
          You can join an existing session or create a new one with just a few clicks. Choose a location, subject, and
          brief description to help others know what it&apos;s about.
        </p>
      </section>

      <section className="mb-5">
        <h3>3. 🔐 Log In to Participate</h3>
        <p>
          To keep things safe and organized, you need to log in to join or create a study session. Don’t worry — it’s
          quick and secure.
        </p>
      </section>

      <section className="mb-5">
        <h3>4. 📚 Collaborate & Learn</h3>
        <p>
          Study with others who are learning the same material, ask questions, explain concepts, and boost your academic
          success together!
        </p>
      </section>

      <section className="mb-5">
        <h3>5. 🧠 Why It Works</h3>
        <p>
          Sync&apos;d Study builds a campus-wide network of collaboration. Instead of studying alone, you’re part of a
          dynamic, peer-supported academic community.
        </p>
      </section>
    </div>
  </main>
);

export default HowItWorks;
