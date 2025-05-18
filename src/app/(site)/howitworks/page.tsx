'use client';

import React from 'react';
import { CheckCircle, CalendarRange, People, EmojiSunglasses } from 'react-bootstrap-icons';

const HowItWorks = () => (
  <main className="container py-5">
    <div
      className="p-5 rounded-4 shadow-sm info-box-1"
    >
      <h1 className="mb-4 text-center">How Sync&apos;d Study Works</h1>
      <section className="mb-5">
        <h3>
          <CheckCircle className="ms-2" />
          {'\u00A0'}
          Log In to Get Started
        </h3>
        <p>
          Create a personalized profile with your name, major, minor (if applicable), and interests.
          Once logged in, you&apos;ll have access to your dashboard, which shows your upcoming study sessions,
          to-do lists, and profile settings.
        </p>
      </section>
      <section className="mb-5">
        <h3>
          <CalendarRange className="ms-2" />
          {'\u00A0'}
          Join or Create Study Sessions
        </h3>
        <p>
          Start or join study sessions with just a few clicks. Set the subject, course, time, date, and
          preferred format (in-person or online). You can even choose a location if the session is in person.
          Get notifications when new sessions are created for courses you&apos;re interested in, so you never
          miss an opportunity to study together.
        </p>
      </section>
      <section className="mb-5">
        <h3>
          <People className="ms-2" />
          {'\u00A0'}
          Collaborate and Learn
        </h3>
        <p>
          Sync&apos;d Study creates opportunities for students to connect in real time—
          whether it&apos;s to review material, tackle a tough concept, or prep for an upcoming exam.
          By studying together, students can ask questions, explain things in their own words,
          and help each other understand topics better. It&apos;s not just about getting through
          the material—it&apos;s about learning from each other and building confidence along the way.
        </p>
      </section>
      <section className="mb-5">
        <h3>
          <EmojiSunglasses className="ms-2" />
          {'\u00A0'}
          Why it Works
        </h3>
        <p>
          Studying doesn&apos;t have to be isolating. Sync&apos;d Study turns academic support into a shared
          experience by connecting students through a peer-driven network. Whether you&apos;re offering help
          or asking for it, you&apos;re part of something collaborative, encouraging, and grounded in real
          human connection. It&apos;s simple, structured, and built around the way students actually learn
          best—together.
        </p>
      </section>
    </div>
  </main>
);

export default HowItWorks;
