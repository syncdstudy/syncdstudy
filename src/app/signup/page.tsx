'use client';

import React from 'react';

export default function SignUpPage() {
  return (
    <main className="min-h-screen bg-purple-100 text-black font-sans">
      <div className="min-h-screen p-8">
        <div className="grid grid-cols-3 gap-6 text-sm">

          {/* Column 1: Profile Info */}
          <div className="bg-purple-200 bg-opacity-60 p-4 rounded-xl border border-black space-y-4">
            <div className="text-center">
              <button
                type="button"
                className="bg-purple-300 px-4 py-1 rounded border border-black font-semibold"
              >
                Add Headshot
              </button>
            </div>
            <div className="w-36 h-36 bg-gray-300 rounded-full border border-black mx-auto" />
            <input className="w-full px-3 py-2 rounded bg-purple-100 border border-black" placeholder="First Name:" />
            <input className="w-full px-3 py-2 rounded bg-purple-100 border border-black" placeholder="Last Name:" />
            <select className="w-full px-3 py-2 rounded bg-purple-100 border border-black">
              <option>Year:</option>
              <option>Freshman</option>
              <option>Sophomore</option>
              <option>Junior</option>
              <option>Senior</option>
            </select>
            <input className="w-full px-3 py-2 rounded bg-purple-100 border border-black" placeholder="E-Mail:" />
            <input
              className="w-full px-3 py-2 rounded bg-purple-100 border border-black"
              placeholder="Phone Number (optional):"
            />
          </div>

          {/* Column 2: Subject Search */}
          <div className="bg-purple-200 bg-opacity-60 p-4 rounded-xl border border-black space-y-4 text-center">
            <button
              type="button"
              className="bg-purple-300 px-4 py-1 rounded border border-black font-semibold"
            >
              Add Courses
            </button>
            <p className="italic underline font-medium">Search…</p>
            <div className="grid grid-cols-2 gap-2 pl-4 text-left">
              {['ASTR', 'BIO', 'CHEM', 'ENG', 'ICS', 'LANG', 'MATH', 'PHYS', 'PSYCH', 'SUS'].map((subject) => (
                <button
                  key={subject}
                  type="button"
                  className="underline text-left bg-transparent border-none p-0"
                >
                  {subject}
                </button>
              ))}
            </div>
          </div>

          {/* Column 3: Courses + Preferences */}
          <div className="bg-purple-200 bg-opacity-60 p-4 rounded-xl border border-black space-y-4">
            <button
              type="button"
              className="bg-purple-300 px-4 py-1 rounded border border-black font-semibold w-full"
            >
              Courses Added
            </button>
            <div className="bg-white/60 border border-black p-3 rounded space-y-1">
              <p>ICS 314 - Software Engineering I - Section 003</p>
              <p>MATH 307 - Linear Algebra - Section 001</p>
              <p>ENG 101 - Intro to Writing - Section 002</p>
            </div>
            <button
              type="button"
              className="bg-purple-300 px-4 py-1 rounded border border-black font-semibold w-full underline"
            >
              Study Preferences
            </button>
            <div className="space-y-2">
              {['In-person group', 'Online group', 'Silent co-working', 'Discussion based work'].map((pref, index) => (
                <label
                  key={pref}
                  htmlFor={`preference-${index}`}
                  className="flex items-center bg-purple-100 px-4 py-2 rounded border border-black"
                >
                  <input
                    id={`preference-${index}`}
                    type="checkbox"
                    className="mr-3 h-5 w-5"
                  />
                  {pref}
                </label>
              ))}
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
