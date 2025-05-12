'use client';

import { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';

type Report = {
  id: number;
  user: {
    email: string;
  } | null;
  contactEmail?: string | null;
  topic?: string | null;
  message: string;
  createdAt: string;
  resolved: boolean;
};

export default function ReportTable() {
  const [reports, setReports] = useState<Report[]>([]);
  const [selectedTopic, setSelectedTopic] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch('/api/reports/all');
        const data = await res.json();
        setReports(data.reports || []);
      } catch (err) {
        console.error('Failed to load reports', err);
      }
    };
    fetchReports();
  }, []);

  const toggleResolved = async (id: number, current: boolean) => {
    try {
      const res = await fetch(`/api/reports/${id}/resolve`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resolved: !current }),
      });

      if (res.ok) {
        setReports((prev) => prev.map((r) => (r.id === id ? { ...r, resolved: !current } : r)));
      } else {
        // eslint-disable-next-line no-alert
        alert('Failed to update');
      }
    } catch (err) {
      console.error('Error updating resolved status', err);
      // eslint-disable-next-line no-alert
      alert('Error updating resolved status');
    }
  };

  const filteredReports = reports.filter((r) => {
    const matchTopic = selectedTopic === 'All' || r.topic === selectedTopic;
    const matchStatus = selectedStatus === 'All'
      || (selectedStatus === 'Resolved' && r.resolved)
      || (selectedStatus === 'Unresolved' && !r.resolved);
    return matchTopic && matchStatus;
  });

  const uniqueTopics = Array.from(new Set(reports.map((r) => r.topic).filter(Boolean)));

  return (
    <>
      <h3 className="text-center mb-4">User Reports</h3>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex flex-wrap gap-3 mb-4">
          <select
            aria-label="Filter by Topic"
            value={selectedTopic}
            onChange={(e) => setSelectedTopic(e.target.value)}
            className="form-select w-auto"
          >
            <option value="All">All Topics</option>
            {uniqueTopics.map((topic) => (
              <option key={topic} value={topic!}>{topic}</option>
            ))}
          </select>

          <select
            aria-label="Filter by Status"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="form-select w-auto"
          >
            <option value="All">All Statuses</option>
            <option value="Resolved">Resolved</option>
            <option value="Unresolved">Unresolved</option>
          </select>
        </div>
      </div>

      <div style={{ maxHeight: '550px', overflowY: 'auto' }}>
        <Table bordered responsive>
          <thead>
            <tr>
              <th>User Email</th>
              <th>Topic</th>
              <th>Message</th>
              <th>Submitted</th>
              <th>Resolved Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredReports.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center text-muted">
                  No reports submitted.
                </td>
              </tr>
            ) : (
              filteredReports.map((r) => (
                <tr key={r.id}>
                  <td>{r.user?.email || r.contactEmail || 'Unknown'}</td>
                  <td>{r.topic || '—'}</td>
                  <td>{r.message}</td>
                  <td>{new Date(r.createdAt).toLocaleString()}</td>
                  <td className="text-center">
                    <input
                      type="checkbox"
                      checked={r.resolved}
                      onChange={() => toggleResolved(r.id, r.resolved)}
                      aria-label={`Mark report ${r.id} as ${r.resolved ? 'unresolved' : 'resolved'}`}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </div>
    </>
  );
}
