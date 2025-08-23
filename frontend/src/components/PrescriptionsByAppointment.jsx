import { useEffect, useState } from 'react';
import axios from 'axios';
import { FaPrescriptionBottleAlt, FaCalendarAlt, FaEye, FaFileAlt, FaDownload } from 'react-icons/fa';

export default function PrescriptionsByAppointment({ patientId }) {
  const [groupedData, setGroupedData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:5000/api/prescriptions/by-appointment/${patientId}`);
        setGroupedData(res.data);
      } catch (error) {
        console.error('Error fetching prescriptions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrescriptions();
  }, [patientId]);

  const getTotalPrescriptions = () => {
    return groupedData.reduce((total, group) => total + group.prescriptions.length, 0);
  };

  if (loading) {
    return (
      <div className="card bg-base-100 shadow-lg" data-theme="corporate">
        <div className="card-body">
          <div className="flex justify-center items-center py-8">
            <span className="loading loading-spinner loading-lg text-primary"></span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6" data-theme="corporate">
      {/* Header Section */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <FaPrescriptionBottleAlt className="text-primary text-3xl mr-4" />
              <h2 className="card-title text-3xl">Your E-Prescriptions</h2>
            </div>
            {groupedData.length > 0 && (
              <div className="badge badge-primary badge-lg">
                {getTotalPrescriptions()} Total
              </div>
            )}
          </div>

          {groupedData.length === 0 ? (
            <div className="alert alert-info">
              <div className="flex items-center">
                <FaPrescriptionBottleAlt className="w-6 h-6 mr-2" />
                <span>No prescriptions found. Your e-prescriptions will appear here after your appointments.</span>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {groupedData.map(group => (
                <div key={group.appointmentId} className="card bg-base-200 shadow-md">
                  <div className="card-body">
                    {/* Appointment Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <FaCalendarAlt className="text-secondary text-xl mr-3" />
                        <div>
                          <h3 className="font-semibold text-lg">
                            {group.prescriptions.length} prescription{group.prescriptions.length !== 1 ? 's' : ''}
                          </h3>
                        </div>
                      </div>
                    </div>

                    {/* Prescriptions List */}
                    <div className="space-y-3">
                      {group.prescriptions.map(p => (
                        <div key={p._id} className="card bg-base-100 shadow-sm">
                          <div className="card-body compact">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="avatar placeholder">
                                  <div className="bg-accent text-accent-content rounded-full w-10">
                                    <FaFileAlt className="text-sm" />
                                  </div>
                                </div>
                                <div>
                                  <p className="font-medium">E-Prescription</p>
                                  <p className="text-sm text-base-content/70">
                                    Uploaded: {new Date(p.uploadedAt).toLocaleString('en-US', {
                                      year: 'numeric',
                                      month: 'short',
                                      day: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </p>
                                </div>
                              </div>
                              
                              <div className="flex gap-2">
                                <div className="tooltip" data-tip="View Prescription">
                                  <a 
                                    href={p.fileUrl} 
                                    target="_blank" 
                                    rel="noreferrer" 
                                    className="btn btn-primary btn-sm btn-circle"
                                  >
                                    <FaEye className="w-4 h-4" />
                                  </a>
                                </div>
                                <div className="tooltip" data-tip="Download">
                                  <a 
                                    href={p.fileUrl} 
                                    download
                                    className="btn btn-secondary btn-sm btn-circle"
                                  >
                                    <FaDownload className="w-4 h-4" />
                                  </a>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Summary Stats */}
      {groupedData.length > 0 && (
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <div className="stats stats-vertical lg:stats-horizontal shadow bg-base-200">
              <div className="stat">
                <div className="stat-figure text-primary">
                  <FaCalendarAlt className="w-8 h-8" />
                </div>
                <div className="stat-title">Total Appointments</div>
                <div className="stat-value text-primary">{groupedData.length}</div>
              </div>
              
              <div className="stat">
                <div className="stat-figure text-secondary">
                  <FaPrescriptionBottleAlt className="w-8 h-8" />
                </div>
                <div className="stat-title">Total Prescriptions</div>
                <div className="stat-value text-secondary">{getTotalPrescriptions()}</div>
              </div>
              
              <div className="stat">
                <div className="stat-figure text-accent">
                  <FaFileAlt className="w-8 h-8" />
                </div>
                <div className="stat-title">Latest Prescription</div>
                <div className="stat-value text-accent text-sm">
                  {groupedData.length > 0 ? 'Available' : 'N/A'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
