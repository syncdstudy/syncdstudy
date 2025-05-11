// src/app/about/page.tsx

import React from 'react';
import Image from 'next/image';

const AboutPage = () => (
  <main className="container mx-auto py-5 px-4">
    {/* About the App Section */}
    <section className="py-1">
      <div className="info-box-1 text-center">
        <h1
          className="text-4xl font-bold mb-6"
          style={{ color: 'rgb(45, 44, 44)' }}
        >
          About Sync&apos;d Study
        </h1>
        <p className="text-lg" style={{ color: 'rgb(45, 44, 44)' }}>
          Welcome to Sync&apos;d Study, an innovative platform designed to help students collaborate and
          stay on top of their studies. We aim to bring students together by enabling them to create
          study sessions, track their progress, and receive notifications when others are studying
          for the same courses.
        </p>
        <p className="mt-4 text-lg" style={{ color: 'rgb(45, 44, 44)' }}>
          Our mission is to make studying more social and organized, helping students reach their
          academic goals more effectively. We hope this platform will serve as a valuable resource for
          every student at the University of Hawaii and beyond.
        </p>
      </div>
    </section>

    {/* Why Sync&apos;d Study Section */}
    <section className="py-4">
      <div className="info-box-1 text-center">
        <h2 className="text-3xl font-semibold mb-6" style={{ color: 'rgb(45, 44, 44)' }}>Why Sync&apos;d Study?</h2>
        <p className="text-lg" style={{ color: 'rgb(45, 44, 44)' }}>
          Sync&apos;d Study was created to help students study more effectively by connecting with others
          in the same classes. The platform allows students to create and join study sessions, ensuring
          that they can study with peers who share the same academic goals. Whether you&apos;re preparing
          for an exam or tackling a group project, Sync&apos;d Study provides the tools you need to stay
          focused and organized.
        </p>
        <p className="mt-4 text-lg" style={{ color: 'rgb(45, 44, 44)' }}>
          Our app is entirely catered to your personal study needs, with features designed to support your
          learning process in a way that fits your preferences. Study smarter, not harder, with Sync&apos;d Study.
        </p>
      </div>
    </section>

    {/* Meet The Team Section */}
    <section>
      <div className="info-box-1 text-center">
        <h2 className="text-3xl font-semibold mb-6" style={{ color: 'rgb(45, 44, 44)' }}>Meet The Team</h2>
        <div className="team-grid">
          {[
            {
              name: 'Silvia Arjona Garcia',
              image: '/team/member1.png',
              role: 'B.S. Astrophysics & B.A. Computer Science',
              portfolio: 'https://silviaarjonag.github.io/',
            },
            {
              name: 'Angela Joy Almeron',
              image: '/team/member2.png',
              role: 'B.S. Computer Science',
              portfolio: 'https://angelaalmeron.github.io/',
            },
            {
              name: 'Arisa Nakai',
              image: '/team/member3.png',
              role: 'B.S. Computer Science & B.B.A Business Management',
              portfolio: 'https://arisa-1208.github.io/',
            },
            {
              name: 'Jaimee Yokoyama',
              image: '/team/member4.png',
              role: 'B.A. Information and Computer Sciences',
              portfolio: 'https://jamiee-tech.github.io/',
            },
          ].map((member) => (
            <div key={member.name} className="text-center mb-6">
              <a href={member.portfolio} target="_blank" rel="noopener noreferrer">
                <Image
                  src={member.image}
                  alt={member.name}
                  width={200}
                  height={200}
                  className="rounded-full mx-auto mb-4 cursor-pointer"
                />
              </a>
              <h3 className="font-semibold text-xl" style={{ color: 'rgb(45, 44, 44)' }}>{member.name}</h3>
              <p className="text-lg" style={{ color: 'rgb(45, 44, 44)' }}>{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  </main>
);

export default AboutPage;
