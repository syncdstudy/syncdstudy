// src/app/about/page.tsx

import React from 'react';
import Image from 'next/image';

const AboutPage = () => (
  <main className="container mx-auto py-10 px-4">
    {/* About the App Section */}
    <section className="mb-16">
      <div className="section-wrapper">
        <h1 className="text-3xl font-bold mb-6 text-center">About the App</h1>
        <p className="text-lg text-gray-700">
          Welcome to SyncdStudy, an
          innovative platform designed to help
          students collaborate and stay on top of
          their studies. We aim to bring students
          together by enabling them to create study
          sessions, track their progress, and receive
          notifications when others are studying for the
          same courses.
        </p>
        <p className="mt-4 text-lg text-gray-700">
          Our mission is to make studying more social and
          organized, helping students reach their academic
          goals more effectively. We hope this platform will
          serve as a valuable resource for every student at
          the University of Hawaii and beyond.
        </p>
      </div>
    </section>

    {/* Why SyncdStudy Section */}
    <section className="mb-16 bg-purple-100 py-10 px-4 rounded-lg shadow-md">
      <div className="section-wrapper">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Why SyncdStudy?</h2>
        <p className="text-lg text-gray-700">
          SyncdStudy was created to help students
          study more effectively by connecting with others
          in the same classes. The platform allows students
          to create and join study sessions, ensuring that
          they can study with peers who share the same academic
          goals. Whether you&apos;re preparing for an exam or tackling
          a group project, SyncdStudy provides the tools you need
          to stay focused and organized.
        </p>
        <p className="mt-4 text-lg text-gray-700">
          Our app is entirely catered to your personal study
          needs, with features designed to support your learning
          process in a way that fits your preferences. Study
          smarter, not harder, with SyncdStudy.
        </p>
      </div>
    </section>

    {/* Meet The Team Section */}
    <section className="mb-16">
      <div className="section-wrapper">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">Meet The Team</h2>
        <div className="team-grid">
          <div className="team-member text-center">
            <Image
              src="/team/member1.png"
              alt="Team Member 1"
              width={200}
              height={200}
              className="rounded-full mx-auto mb-4"
            />
            <h3 className="font-semibold text-lg">Silvia Arjona Garcia</h3>
            <p
              className="text-gray-600"
            >
              Description!
            </p>
          </div>
          <div className="team-member text-center">
            <Image
              src="/team/member2.png"
              alt="Team Member 2"
              width={200}
              height={200}
              className="rounded-full mx-auto mb-4"
            />
            <h3 className="font-semibold text-lg">Angela Joy Almeron</h3>
            <p
              className="text-gray-600"
            >
              Description!
            </p>
          </div>
          <div className="team-member text-center">
            <Image
              src="/team/member3.png"
              alt="Team Member 3"
              width={200}
              height={200}
              className="rounded-full mx-auto mb-4"
            />
            <h3 className="font-semibold text-lg">Arisa Nakai</h3>
            <p
              className="text-gray-600"
            >
              Description!
            </p>
          </div>
          <div className="team-member text-center">
            <Image
              src="/team/member4.png"
              alt="Team Member 4"
              width={200}
              height={200}
              className="rounded-full mx-auto mb-4"
            />
            <h3 className="font-semibold text-lg">Jaimee Yokoyama</h3>
            <p
              className="text-gray-600"
            >
              Description!
            </p>
          </div>
        </div>
      </div>
    </section>
  </main>
);

export default AboutPage;
