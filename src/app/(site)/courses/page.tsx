/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-len */

'use client';

import React, { useEffect, useState } from 'react';
import { Button, Card, Form, Row, Col, Alert } from 'react-bootstrap';
import { useUser } from '@/hooks/useUser';
import supabase from '@/lib/supabaseClient';

const allCourses = [
  'ICS 111', 'ICS 211', 'ICS 314', 'MATH 241', 'MATH 307', 'CHEM 161', 'ENG 100',
];

const Courses: React.FC = () => {
  const user = useUser();
  const [selectedCourse, setSelectedCourse] = useState('');
  const [courses, setCourses] = useState<{
    name: string;
    role: 'Sensei' | 'Grasshopper' | 'Both';
    mode: 'Online' | 'In-Person';
  }[]>([]);
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  useEffect(() => {
    const fetchCourses = async () => {
      if (!user?.id) return;
      const { data, error } = await supabase
        .from('user_courses')
        .select('course_name, role, mode')
        .eq('user_id', user.id);

      if (data) {
        const formatted = data.map((c: any) => ({
          name: c.course_name,
          role: c.role,
          mode: c.mode,
        }));
        setCourses(formatted);
      }
    };
    fetchCourses();
  }, [user]);

  const handleAddCourse = () => {
    if (selectedCourse && !courses.find(c => c.name === selectedCourse)) {
      setCourses([...courses, { name: selectedCourse, role: 'Both', mode: 'Online' }]);
      setSelectedCourse('');
    }
  };

  const handleRemove = (name: string) => {
    setCourses(courses.filter(course => course.name !== name));
  };

  const updateCourse = (index: number, field: string, value: string) => {
    const newCourses = [...courses];
    (newCourses[index] as any)[field] = value;
    setCourses(newCourses);
  };

  const handleSave = async () => {
    if (!user?.id) return;
    setStatus('saving');
    const toSave = courses.map((c) => ({
      user_id: user.id,
      course_name: c.name,
      role: c.role,
      mode: c.mode,
    }));

    const { error } = await supabase
      .from('user_courses')
      .delete()
      .eq('user_id', user.id);

    if (error) {
      setStatus('error');
      return;
    }

    const { error: insertError } = await supabase
      .from('user_courses')
      .insert(toSave);

    setStatus(insertError ? 'error' : 'saved');
  };

  return (
    <div className="container py-5">
      <Card className="p-4 shadow" style={{ backgroundColor: '#f3e8ff' }}>
        <h2 className="mb-4 text-center">My Courses</h2>

        <Form className="mb-4">
          <Row className="align-items-end">
            <Col xs={12} md={6}>
              <Form.Label>Select a Course</Form.Label>
              <Form.Select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
              >
                <option value="">-- Choose a course --</option>
                {allCourses.map((course) => (
                  <option key={course} value={course}>{course}</option>
                ))}
              </Form.Select>
            </Col>
            <Col xs={12} md="auto">
              <Button className="mt-3 mt-md-0" onClick={handleAddCourse}>Add Course</Button>
            </Col>
          </Row>
        </Form>

        {courses.length === 0 ? (
          <p className="text-muted text-center">No courses added yet.</p>
        ) : (
          courses.map((course, index) => (
            <Card key={course.name} className="mb-3 shadow-sm">
              <Card.Body>
                <Row className="align-items-center">
                  <Col md={3}><strong>{course.name}</strong></Col>
                  <Col md={3}>
                    <Form.Select
                      value={course.role}
                      onChange={(e) => updateCourse(index, 'role', e.target.value)}
                    >
                      <option value="Sensei">Sensei (Helper)</option>
                      <option value="Grasshopper">Grasshopper (Learner)</option>
                      <option value="Both">Both</option>
                    </Form.Select>
                  </Col>
                  <Col md={3}>
                    <Form.Select
                      value={course.mode}
                      onChange={(e) => updateCourse(index, 'mode', e.target.value)}
                    >
                      <option value="Online">Online</option>
                      <option value="In-Person">In-Person</option>
                    </Form.Select>
                  </Col>
                  <Col md={3} className="text-end">
                    <Button variant="danger" onClick={() => handleRemove(course.name)}>Remove</Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          ))
        )}

        {courses.length > 0 && (
          <div className="text-center mt-4">
            <Button variant="success" onClick={handleSave}>Save Courses</Button>
          </div>
        )}

        {status === 'saved' && <Alert variant="success" className="mt-3 text-center">✅ Courses saved successfully!</Alert>}
        {status === 'error' && <Alert variant="danger" className="mt-3 text-center">⚠️ Error saving courses. Please try again.</Alert>}
      </Card>
    </div>
  );
};

export default Courses;
