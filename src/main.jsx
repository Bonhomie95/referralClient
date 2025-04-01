import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

// ✅ Extract referral code before App mounts
const queryParams = new URLSearchParams(window.location.search);
const refCode = queryParams.get('ref');

if (refCode) {
  localStorage.setItem('referralCode', refCode);
  // Prevent ref param from disappearing on full reload
  const urlWithoutRef = window.location.origin + window.location.pathname;
  window.history.replaceState(null, '', urlWithoutRef);
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
