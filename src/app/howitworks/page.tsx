'use client';

import React from 'react';
import { CheckCircle, JournalBookmark, CalendarRange, Trophy, People, EmojiSunglasses } from 'react-bootstrap-icons';

const HowItWorks = () => (
  <main className="container py-5">
    <div
      className="p-5 rounded-4 shadow-sm"
      style={{
        backgroundColor: '#f3e8ff', // light purple
        border: '1px solid black',
      }}
    >
      <h1 className="mb-4 text-center">How Sync&apos;d Study Works</h1>
      <section className="mb-5">
        <h3>
          <CheckCircle className="ms-2" />
          {'\u00A0'}
          Log In to Get Started
        </h3>
        <p>
          To keep things safe and organized, students must log in to join or create a study session,
          and set up a profile that includes a headshot and two course lists: one for courses
          they&apos;ve taken and can help with (Sensei), and one for courses they&apos;re currently
          taking and need help with (Grasshopper). Each student can be both a sensei and a
          grasshopper depending on the course.
        </p>
      </section>
      <section className="mb-5">
        <h3>
          <JournalBookmark className="ms-2" />
          {'\u00A0'}
          Course Directory
        </h3>
        <p>
          All courses are listed on the site and can be accessed under the My Courses section. There, students can
          browse a list of their enrolled courses and view the senseis and grasshoppers associated with each one.
        </p>
      </section>
      <section className="mb-5">
        <h3>
          <CalendarRange className="ms-2" />
          {'\u00A0'}
          Join or Create Study Sessions
        </h3>
        <p>
          Students can choose to join an existing study session or create a new one with just a few clicks by selecting
          a location, subject, and brief description. Grasshoppers can propose face-to-face sessions focused on a
          specific topic (e.g., “Write my essay on configuration management”) and set a meeting time and place
          (like 10:30-11:30 AM at Campus Center), either by planning ahead or requesting help immediately through
          the Right Now option that notifies others in real time.
        </p>
      </section>
      <section className="mb-5">
        <h3>
          <Trophy className="ms-2" />
          {'\u00A0'}
          Study and Score
        </h3>
        <p>
          To encourage active participation, the application uses a point-based system where students can earn points by
          attending or leading study sessions. As they accumulate points, they level up and climb the leaderboard,
          showcasing top-performing senseis and grasshoppers. To further motivate users, rewards such as gift cards
          are offered to high scorers. Anti-cheating measures are also being discussed to ensure that all points
          reflect genuine, meaningful interaction within the platform.
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
