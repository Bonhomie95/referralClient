import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminLogin = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [status, setStatus] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/admin/login`, form);
      if (res.data.token) {
        localStorage.setItem("adminToken", res.data.token);
        navigate("/admin/users"); // Redirect to admin dashboard home (example)
      }
    } catch (error) {
      const errMsg =
        (error.response && error.response.data && error.response.data.message) ||
        error.message ||
        "Login failed";
      setStatus(errMsg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded shadow-lg w-full max-w-md text-white">
        <h2 className="text-2xl mb-4 text-center">Admin Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full p-2 rounded bg-gray-700"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full p-2 rounded bg-gray-700"
          />
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded">
            Login
          </button>
        </form>
        {status && <p className="mt-4 text-center text-sm text-red-400">{status}</p>}
      </div>
    </div>
  );
};

export default AdminLogin;
