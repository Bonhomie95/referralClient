import { useState, useEffect } from 'react';
import axios from 'axios';

const AdminInvestments = () => {
  const [investments, setInvestments] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({});
  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/admin/investments`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setInvestments(res.data.investments))
      .catch((err) => console.error('Error fetching investments:', err));
  }, [token]);

  const handleDelete = async (investmentId) => {
    if (window.confirm('Are you sure you want to delete this investment?')) {
      try {
        await axios.delete(
          `${
            import.meta.env.VITE_API_URL
          }/api/admin/investments/${investmentId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setInvestments(investments.filter((inv) => inv._id !== investmentId));
      } catch (error) {
        alert('Failed to delete investment: ' + error.message);
      }
    }
  };

  const handleEditClick = (inv) => {
    setEditingId(inv._id);
    setFormData({
      planAmount: inv.planAmount,
      paymentStatus: inv.paymentStatus,
      isActive: inv.isActive,
    });
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleUpdate = async (investmentId) => {
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_URL}/api/admin/investments/${investmentId}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setInvestments(
        investments.map((inv) =>
          inv._id === investmentId ? res.data.investment : inv
        )
      );
      setEditingId(null);
    } catch (error) {
      alert('Failed to update investment: ' + error.message);
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Investments Management</h2>
      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-gray-200">
            <th className="py-2 px-4 border">User</th>
            <th className="py-2 px-4 border">Plan</th>
            <th className="py-2 px-4 border">Amount (NGN)</th>
            <th className="py-2 px-4 border">Status</th>
            <th className="py-2 px-4 border">Active</th>
            <th className="py-2 px-4 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {investments.map((inv) => (
            <tr key={inv._id} className="text-center">
              <td className="py-2 px-4 border">{inv.userId.fullname}</td>
              <td className="py-2 px-4 border">{inv.planId}</td>
              <td className="py-2 px-4 border">
                {editingId === inv._id ? (
                  <input
                    type="number"
                    name="planAmount"
                    value={formData.planAmount}
                    onChange={handleFormChange}
                    className="p-1 rounded"
                  />
                ) : (
                  inv.planAmount
                )}
              </td>
              <td className="py-2 px-4 border">
                {editingId === inv._id ? (
                  <input
                    type="text"
                    name="paymentStatus"
                    value={formData.paymentStatus}
                    onChange={handleFormChange}
                    className="p-1 rounded"
                  />
                ) : (
                  inv.paymentStatus
                )}
              </td>
              <td className="py-2 px-4 border">
                {editingId === inv._id ? (
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleFormChange}
                  />
                ) : inv.isActive ? (
                  'Yes'
                ) : (
                  'No'
                )}
              </td>
              <td className="py-2 px-4 border">
                {editingId === inv._id ? (
                  <>
                    <button
                      onClick={() => handleUpdate(inv._id)}
                      className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded mr-2"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-2 py-1 rounded"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleEditClick(inv)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded mr-2"
                    >
                      View/Edit
                    </button>
                    <button
                      onClick={() => handleDelete(inv._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
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

export default AdminInvestments;
