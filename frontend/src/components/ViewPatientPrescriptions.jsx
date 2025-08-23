import { useEffect, useState } from 'react';
import axios from 'axios';

export default function ViewPatientPrescriptions({ patientId }) {
  const [prescriptions, setPrescriptions] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/prescriptions/${patientId}`)
      .then(res => setPrescriptions(res.data));
  }, [patientId]);

  return (
    <div className="p-6 bg-base-200 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-primary mb-4">Prescriptions for Patient: {patientId}</h2>
      {prescriptions.length === 0 ? (
        <p className="text-lg text-gray-600">No prescriptions uploaded yet.</p>
      ) : (
        <ul className="space-y-2">
          {prescriptions.map(p => (
            <li key={p._id} className="p-4 border border-base-300 rounded-lg flex justify-between items-center bg-base-100 shadow">
              <span className="text-lg">
                Uploaded on {new Date(p.uploadedAt).toLocaleString()}
              </span>
              <a
                href={p.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="text-blue-500 underline hover:text-blue-700"
              >
                View
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
