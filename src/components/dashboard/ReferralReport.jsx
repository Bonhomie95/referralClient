import { useState, useEffect } from 'react';
import axios from 'axios';

const ReferralReport = () => {
  const [report, setReport] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_URL}/api/user/referral-report`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setReport(res.data);
      })
      .catch((err) => console.error('Error fetching referral report:', err));
  }, [token]);

  if (!report) return <p>Loading referral report...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-800 text-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Referral Report</h2>
      <p className="mb-4">Commission Balance: ₦{report.commissionBalance}</p>
      {report.directReferrals.length === 0 ? (
        <p>No referrals found.</p>
      ) : (
        <ul>
          {report.directReferrals.map((referral) => (
            <li
              key={referral.id}
              className="mb-2 border-b border-gray-600 pb-2"
            >
              <p className="font-semibold">
                {referral.fullname} ({referral.email})
              </p>
              {referral.referrals.length > 0 && (
                <ul className="ml-4 mt-2">
                  {referral.referrals.map((secondLevel) => (
                    <li key={secondLevel._id} className="text-sm">
                      {secondLevel.fullname} ({secondLevel.email})
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ReferralReport;
