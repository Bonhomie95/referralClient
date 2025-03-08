// client/src/components/ContactUs.jsx
import { useState } from 'react';
import axios from 'axios';

const ContactUs = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/contact`,
        form
      );
      setStatus(res.data.message);
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      const errMsg =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        'Failed to send message';
      setStatus(errMsg);
    }
  };

  return (
    <section id="contact" className="py-20 bg-gray-900 text-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Contact Us</h2>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Side: Contact Info */}
          <div className="md:w-1/2 flex flex-col items-center justify-center text-center space-y-4">
            <h3 className="text-2xl font-bold text-blue-500">
              We’re Here for You!
            </h3>
            <p className="text-lg font-semibold">
              Our team is available during the hours below to answer your
              questions.
            </p>
            <div className="text-xl font-bold">
              <p className="text-blue-400">Weekdays: 8 AM - 8 PM</p>
              <p className="text-red-400">Weekends: 10 AM - 6 PM</p>
            </div>
            <p className="mt-4 text-lg">
              Please reach out to us with any inquiries or feedback. We’re eager
              to help!
            </p>
          </div>
          {/* Right Side: Contact Form */}
          <div className="md:w-1/2 bg-gray-800 p-6 rounded-lg shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block mb-1 font-medium">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full p-2 rounded bg-gray-700 border border-gray-600"
                />
              </div>
              <div>
                <label htmlFor="email" className="block mb-1 font-medium">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full p-2 rounded bg-gray-700 border border-gray-600"
                />
              </div>
              <div>
                <label htmlFor="subject" className="block mb-1 font-medium">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  required
                  className="w-full p-2 rounded bg-gray-700 border border-gray-600"
                />
              </div>
              <div>
                <label htmlFor="message" className="block mb-1 font-medium">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="w-full p-2 rounded bg-gray-700 border border-gray-600"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
              >
                Send Message
              </button>
              {status && <p className="mt-4 text-center text-sm">{status}</p>}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;
