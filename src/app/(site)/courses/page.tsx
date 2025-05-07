/* eslint-disable import/no-extraneous-dependencies */

'use client';

import { useEffect, useState } from 'react';
import { Form } from 'react-bootstrap';
import axios from 'axios';

type Course = {
  id: string;
  name: string;
  notificationPreferences?: {
    notify: boolean;
  };
};

const CoursesPage = () => {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch('/api/my-courses');
        const data = await res.json();
        console.log('Fetched courses:', data);
        setCourses(data);
      } catch (err) {
        console.error('Failed to fetch courses', err);
      }
    };

    fetchCourses();
  }, []);

  const toggleNotification = async (courseId: string, currentState: boolean) => {
    try {
      await axios.post('/api/toggle-notification', {
        courseId,
        notify: !currentState,
      });

      setCourses(prev => prev.map(course => (course.id === courseId
        ? {
          ...course,
          notificationPreferences: {
            notify: !currentState,
          },
        }
        : course
      )));
    } catch (err) {
      console.error('Failed to toggle notification', err);
    }
  };

  return (
    <main>
      <h1 className="text-3xl font-bold mb-6 text-center">My Courses</h1>
      {courses.length === 0 ? (
        <p className="text-center text-gray-500">No courses enrolled.</p>
      ) : (
        <ul className="courses-list">
          {courses.map(course => (
            <li key={course.id} className="course-item">
              <div className="course-name">
                <h2>{course.name}</h2>
              </div>
              <div className="toggle-container">
                <span>Notifications: </span>
                <Form.Check
                  type="switch"
                  id={`notify-toggle-${course.id}`}
                  checked={!!course.notificationPreferences?.notify}
                  onChange={() => toggleNotification(course.id, !!course.notificationPreferences?.notify)}
                  className="switch"
                />
              </div>
            </li>
          ))}
        </ul>

      )}
    </main>
  );
};

export default CoursesPage;
