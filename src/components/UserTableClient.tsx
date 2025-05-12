'use client';

import { useEffect, useState } from 'react';
import { Table, Spinner } from 'react-bootstrap';

interface SupabaseUser {
  id: string;
  email: string;
  created_at: string;
}

export default function UserTableClient() {
  const [users, setUsers] = useState<SupabaseUser[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch('/api/supabase-users');
      const data = await res.json();
      if (Array.isArray(data)) {
        setUsers(data);
      } else {
        console.error('Unexpected response from /api/supabase-users:', data);
        setUsers([]);
      }
      setLoading(false);
    };

    fetchUsers();
  }, []);

  const filteredUsers = users
    .filter((user) => user.email.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return (
    <>
      <div className="mb-3 d-flex">
        <input
          type="text"
          className="form-control"
          placeholder="Search by email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      ) : (
        <div style={{ maxHeight: '550px', overflowY: 'auto' }}>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>Email</th>
                <th>Created</th>
                <th>Actions</th>
                {' '}
                {/* ✅ Add column header */}
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.email}</td>
                  <td>{new Date(user.created_at).toLocaleString()}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-danger btn-sm"
                      onClick={async () => {
                        console.log('Deleting user ID:', user.id);

                        // eslint-disable-next-line no-restricted-globals, no-alert
                        const confirmed = confirm(`Delete user ${user.email}?`);
                        if (!confirmed) return;

                        const res = await fetch('/api/delete-user', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ id: user.id }),
                        });

                        if (res.ok) {
                          setUsers((prev) => prev.filter((u) => u.id !== user.id));
                        } else {
                          const data = await res.json();
                          // eslint-disable-next-line no-alert
                          alert(`Error: ${data.error}`);
                        }
                      }}
                    >
                      Delete
                    </button>

                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </>
  );
}
