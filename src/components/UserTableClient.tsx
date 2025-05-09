'use client';

import { useState } from 'react';
import { Table, Button } from 'react-bootstrap';

interface User {
  id: number;
  email: string;
  role: string;
}

export default function UserTableClient({ initialUsers }: { initialUsers: User[] }) {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [search, setSearch] = useState('');

  const handleDelete = async (id: number) => {
    // eslint-disable-next-line no-alert
    const confirmed = window.confirm('Are you sure you want to delete this user?');
    if (!confirmed) return;

    const res = await fetch(`/api/users/${id}/delete`, {
      method: 'DELETE',
    });

    if (res.ok) {
      setUsers(users.filter((u) => u.id !== id));
    } else {
      // eslint-disable-next-line no-alert
      alert('Failed to delete user');
    }
  };

  const filteredUsers = users.filter((user) => user.email.toLowerCase().includes(search.toLowerCase())
    || user.role.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <div className="mb-3 d-flex">
        <input
          type="text"
          className="form-control"
          placeholder="Search by email or role..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <div className="d-flex gap-2">
                  <Button
                    type="button"
                    variant="outline-primary"
                    size="sm"
                    onClick={() => console.log('View', user.email)}
                  >
                    View
                  </Button>
                  <Button
                    type="button"
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleDelete(user.id)}
                  >
                    Delete
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
}
