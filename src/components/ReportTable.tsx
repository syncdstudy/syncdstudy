'use client';

import { useEffect, useState } from 'react';
import { Card, Table } from 'react-bootstrap';

type Report = {
  id: number;
  user: {
    email: string;
  } | null;
  message: string;
  createdAt: string;
  resolved: boolean;
};

export default function ReportTable() {
  const [reports, setReports] = useState<Report[]>([]);

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

  return (
    <Card className="p-3" style={{ backgroundColor: '#fff9f9', borderRadius: '1rem' }}>
      <h5 className="mb-3 text-center">📬 User Reports</h5>
      <Table bordered responsive>
        <thead>
          <tr>
            <th>User Email</th>
            <th>Message</th>
            <th>Submitted</th>
            <th>Resolved</th>
          </tr>
        </thead>
        <tbody>
          {reports.length === 0 ? (
            <tr><td colSpan={4} className="text-center text-muted">No reports submitted.</td></tr>
          ) : (
            reports.map((r) => (
              <tr key={r.id}>
                <td>{r.user?.email || 'Unknown'}</td>
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
    </Card>
  );
}
