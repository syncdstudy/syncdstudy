/* eslint-disable jsx-a11y/label-has-associated-control */

'use client';

import React from 'react';
import '@/app/globals.css';

const ProfileSignupPage = () => (
  <main className="container py-5">
    <h1 className="text-center mb-5">Complete Your Profile</h1>

    <div className="d-flex flex-column flex-lg-row align-items-start justify-content-center gap-5">

      {/* Profile Info Section */}
      <div className="info-box text-start" style={{ flex: '1', maxWidth: '500px' }}>
        <h4 className="text-center mb-3">Profile Info</h4>

        <div className="text-center mb-3">
          <button type="button" className="custom-button px-3 py-2">Add Headshot</button>
        </div>

        {/* Circular image placeholder */}
        <div
          className="mx-auto mb-4 bg-secondary rounded-circle"
          style={{ width: '150px', height: '150px' }}
        />

        <form>
          <input type="text" className="form-control mb-3" placeholder="First Name:" />
          <input type="text" className="form-control mb-3" placeholder="Last Name:" />
          <select className="form-control mb-3">
            <option>Year:</option>
            <option>Freshman</option>
            <option>Sophomore</option>
            <option>Junior</option>
            <option>Senior</option>
            <option>Graduate</option>
          </select>
          <input type="email" className="form-control mb-3" placeholder="E-Mail:" />
          <input type="tel" className="form-control mb-3" placeholder="Phone Number (optional):" />
        </form>
      </div>

      {/* Subject + Preferences Section */}
      <div className="info-box text-start" style={{ flex: '1', maxWidth: '500px' }}>
        <h4 className="text-center mb-3">Subjects + Preferences</h4>

        <div className="text-center mb-3">
          <button type="button" className="custom-button px-3 py-2">Add Courses</button>
        </div>

        <p className="text-center italic">Search...</p>
        <div className="d-flex flex-wrap justify-content-center gap-2 mb-4">
          {['ASTR', 'BIO', 'CHEM', 'ENG', 'ICS', 'LANG', 'MATH', 'PHYS', 'PSYCH', 'SUS'].map(subject => (
            <button key={subject} type="button" className="btn btn-link p-0 m-1">
              <u>{subject}</u>
            </button>
          ))}
        </div>

        <h6>Courses Added</h6>
        <ul className="mb-4">
          <li>ICS 314 - Software Engineering I - Section 003</li>
          <li>MATH 307 - Linear Algebra - Section 001</li>
          <li>ENG 101 - Intro to Writing - Section 002</li>
        </ul>

        <h6 className="text-center underline mb-2">Study Preferences</h6>

        <div className="form-check mb-2">
          <input className="form-check-input" type="checkbox" id="inPersonGroup" />
          <label className="form-check-label" htmlFor="inPersonGroup">In-person group</label>
        </div>

        <div className="form-check mb-2">
          <input className="form-check-input" type="checkbox" id="online" />
          <label className="form-check-label" htmlFor="online">Online group</label>
        </div>

        <div className="form-check mb-2">
          <input className="form-check-input" type="checkbox" id="silent" />
          <label className="form-check-label" htmlFor="silent">Silent co-working</label>
        </div>

        <div className="form-check mb-2">
          <input className="form-check-input" type="checkbox" id="discussion" />
          <label className="form-check-label" htmlFor="discussion">Discussion based work</label>
        </div>

      </div>
    </div>
  </main>
);

export default ProfileSignupPage;
