import { useState, useEffect } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [modalUser, setModalUser] = useState(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchUsers();
  }, [page, limit]);

  useEffect(() => {
    if (search.trim() === '') {
      setFiltered(users);
    } else {
      const lower = search.toLowerCase();
      setFiltered(
        users.filter(
          (u) =>
            u.fullname.toLowerCase().includes(lower) ||
            u.email.toLowerCase().includes(lower) ||
            u.username.toLowerCase().includes(lower)
        )
      );
    }
  }, [search, users]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(
        `${
          import.meta.env.VITE_API_URL
        }/api/admin/users?page=${page}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
          },
        }
      );
      setUsers(res.data.users);
      setTotal(res.data.total);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const handleDelete = async (userId) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    try {
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/admin/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
          },
        }
      );
      fetchUsers();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleEdit = async () => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/admin/users/${editingUser._id}`,
        editingUser,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('adminToken')}`,
          },
        }
      );
      fetchUsers();
      setEditingUser(null);
    } catch (err) {
      console.error('Edit error:', err);
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Manage Users</h2>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <input
          type="text"
          placeholder="Search by name, email or username"
          className="w-full md:w-1/2 p-2 rounded bg-gray-200"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          value={limit}
          onChange={(e) => {
            setPage(1);
            setLimit(Number(e.target.value));
          }}
          className="p-2 rounded bg-gray-200"
        >
          {[10, 25, 50, 100].map((num) => (
            <option key={num} value={num}>
              Show {num} per page
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full bg-white text-left rounded shadow-md">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="p-3">Full Name</th>
              <th className="p-3">Username</th>
              <th className="p-3">Email</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((user) => (
              <tr key={user._id} className="border-t">
                <td className="p-3">{user.fullname}</td>
                <td className="p-3">{user.username}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3 space-x-2">
                  <button
                    onClick={() => setModalUser(user)}
                    className="px-2 py-1 text-sm bg-blue-600 text-white rounded"
                  >
                    View
                  </button>
                  <button
                    onClick={() => setEditingUser({ ...user })}
                    className="px-2 py-1 text-sm bg-yellow-500 text-white rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="px-2 py-1 text-sm bg-red-600 text-white rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <p className="text-sm text-white">
          Page {page} of {totalPages} | Total users: {total}
        </p>
        <div className="flex gap-3">
          <button
            className="px-4 py-1 bg-gray-700 text-white rounded disabled:opacity-50"
            onClick={() => setPage((p) => p - 1)}
            disabled={page === 1}
          >
            Prev
          </button>
          <button
            className="px-4 py-1 bg-gray-700 text-white rounded disabled:opacity-50"
            onClick={() => setPage((p) => p + 1)}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      </div>

      {/* View Modal */}
      {modalUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white text-black p-6 rounded shadow-md w-full max-w-md">
            <h3 className="text-lg font-bold mb-3">User Details</h3>
            <p>
              <strong>Full Name:</strong> {modalUser.fullname}
            </p>
            <p>
              <strong>Username:</strong> {modalUser.username}
            </p>
            <p>
              <strong>Email:</strong> {modalUser.email}
            </p>
            <button
              onClick={() => setModalUser(null)}
              className="mt-4 px-4 py-2 bg-gray-700 text-white rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white text-black p-6 rounded shadow-md w-full max-w-md">
            <h3 className="text-lg font-bold mb-3">Edit User</h3>
            <input
              type="text"
              className="w-full p-2 mb-3 border rounded"
              value={editingUser.fullname}
              onChange={(e) =>
                setEditingUser({ ...editingUser, fullname: e.target.value })
              }
            />
            <input
              type="text"
              className="w-full p-2 mb-3 border rounded"
              value={editingUser.username}
              onChange={(e) =>
                setEditingUser({ ...editingUser, username: e.target.value })
              }
            />
            <input
              type="email"
              className="w-full p-2 mb-3 border rounded"
              value={editingUser.email}
              onChange={(e) =>
                setEditingUser({ ...editingUser, email: e.target.value })
              }
            />
            <div className="flex justify-between gap-4">
              <button
                onClick={handleEdit}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded"
              >
                Save
              </button>
              <button
                onClick={() => setEditingUser(null)}
                className="flex-1 px-4 py-2 bg-gray-600 text-white rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

AdminUsers.propTypes = {
  users: PropTypes.array,
};

export default AdminUsers;
