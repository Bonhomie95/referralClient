import { useState, useEffect } from "react";
import axios from "axios";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [formData, setFormData] = useState({});
  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUsers(res.data.users))
      .catch((err) => console.error("Error fetching users:", err));
  }, [token]);

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_URL}/api/admin/users/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(users.filter((user) => user._id !== userId));
      } catch (error) {
        alert("Failed to delete user: " + error.message);
      }
    }
  };

  const handleEditClick = (user) => {
    setEditingUserId(user._id);
    setFormData({ fullname: user.fullname, email: user.email, phone: user.phone || "" });
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (userId) => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/admin/users/${userId}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Update local state
      setUsers(users.map((user) => (user._id === userId ? res.data.user : user)));
      setEditingUserId(null);
    } catch (error) {
      alert("Failed to update user: " + error.message);
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Users Management</h2>
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-2 px-4 border">Name</th>
            <th className="py-2 px-4 border">Email</th>
            <th className="py-2 px-4 border">Phone</th>
            <th className="py-2 px-4 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id} className="text-center">
              <td className="py-2 px-4 border">
                {editingUserId === user._id ? (
                  <input
                    type="text"
                    name="fullname"
                    value={formData.fullname}
                    onChange={handleFormChange}
                    className="p-1 rounded"
                  />
                ) : (
                  user.fullname
                )}
              </td>
              <td className="py-2 px-4 border">
                {editingUserId === user._id ? (
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    className="p-1 rounded"
                  />
                ) : (
                  user.email
                )}
              </td>
              <td className="py-2 px-4 border">
                {editingUserId === user._id ? (
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleFormChange}
                    className="p-1 rounded"
                  />
                ) : (
                  user.phone || "N/A"
                )}
              </td>
              <td className="py-2 px-4 border">
                {editingUserId === user._id ? (
                  <>
                    <button onClick={() => handleUpdate(user._id)} className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded mr-2">
                      Save
                    </button>
                    <button onClick={() => setEditingUserId(null)} className="bg-gray-500 hover:bg-gray-600 text-white px-2 py-1 rounded">
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEditClick(user)} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded mr-2">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(user._id)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded">
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUsers;
