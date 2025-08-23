import React, { useState, useEffect } from 'react';
import { FaUserMd } from 'react-icons/fa';
import ProviderMessagingSection from "../components/ProviderMessagingSection";
import UploadPrescription from "../components/UploadPrescription";
import ViewPatientPrescriptions from "../components/ViewPatientPrescriptions";
import socket from '../socket';
import VideoChat from '../components/VideoChat';
import ProviderBilling from "../components/ProviderBilling";

const ProviderDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [activeSection, setActiveSection] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formInput, setFormInput] = useState({
    first_name: '',
    last_name: '',
    specialization: '',
    email: '',
    phone_number: '',
    clinic_address: '',
  });
  const [appointments, setAppointments] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [patients, setPatients] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [billingPatients, setBillingPatients] = useState([]);
  const [loadingBillingPatients, setLoadingBillingPatients] = useState(false);
  const [showPatientSelector, setShowPatientSelector] = useState(false);
  

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/provider/auth/appointments`, { credentials: 'include' })
      .then(res => res.json())
      .then(setAppointments)
      .catch(console.error);
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/provider/auth/profile`, {
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Network response was not ok');
        const data = await res.json();
        setProfile(data);
        setFormInput(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    // Extract unique patients from appointments
    const uniquePatients = [];
    const patientIds = new Set();
    appointments.forEach(app => {
      if (app.patient && !patientIds.has(app.patient._id)) {
        uniquePatients.push(app.patient);
        patientIds.add(app.patient._id);
      }
    });
    setPatients(uniquePatients);
  }, [appointments]);

  useEffect(() => {
    if (activeSection === 'billing') {
      setLoadingBillingPatients(true);
      fetch(`${import.meta.env.VITE_API_BASE_URL}/api/billing/patients`, { credentials: 'include' })
        .then(res => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then(data => {
          console.log('Billing patients data:', data);
          setBillingPatients(data);
          setLoadingBillingPatients(false);
        })
        .catch(err => {
          console.error('Error fetching billing patients:', err);
          // Fallback: use the patients extracted from appointments
          console.log('Using fallback patients data from appointments');
          setBillingPatients(patients);
          setLoadingBillingPatients(false);
        });
    } else {
      setBillingPatients([]);
    }
  }, [activeSection, patients]);

  const handleChange = (e) => {
    setFormInput({ ...formInput, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/provider/auth/profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formInput),
      });
      if (!res.ok) throw new Error('Network response was not ok');
      const data = await res.json();
      setProfile(data);
      setIsEditing(false);
      alert('Profile saved successfully!');
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'profile':
        return (
          <div className="card bg-base-100 shadow-xl max-w-4xl mx-auto">
            <div className="card-body">
              <h2 className="card-title text-3xl mb-6">
                {!profile ? 'Complete Your Profile' : isEditing ? 'Update Your Profile' : 'Your Profile'}
              </h2>
              {!profile || isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">Provider No / License No</span>
                      </label>
                      <input 
                        name="license_no" 
                        placeholder="Provider No / License No" 
                        value={formInput.license_no || ''} 
                        onChange={handleChange} 
                        className="input input-bordered w-full" 
                        required
                      />
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">First Name</span>
                      </label>
                      <input 
                        name="first_name" 
                        placeholder="First Name" 
                        value={formInput.first_name} 
                        onChange={handleChange} 
                        className="input input-bordered w-full" 
                        required 
                      />
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">Last Name</span>
                      </label>
                      <input 
                        name="last_name" 
                        placeholder="Last Name" 
                        value={formInput.last_name} 
                        onChange={handleChange} 
                        className="input input-bordered w-full" 
                        required 
                      />
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">Specialty</span>
                      </label>
                      <input 
                        name="specialization" 
                        placeholder="Specialty" 
                        value={formInput.specialization} 
                        onChange={handleChange} 
                        className="input input-bordered w-full" 
                        required 
                      />
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">Email</span>
                      </label>
                      <input 
                        type="email" 
                        name="email" 
                        placeholder="Email" 
                        value={formInput.email} 
                        onChange={handleChange} 
                        className="input input-bordered w-full" 
                        required 
                      />
                    </div>
                    <div className="form-control">
                      <label className="label">
                        <span className="label-text font-medium">Phone Number</span>
                      </label>
                      <input 
                        name="phone_number" 
                        placeholder="Phone Number" 
                        value={formInput.phone_number} 
                        onChange={handleChange} 
                        className="input input-bordered w-full" 
                        required 
                      />
                    </div>
                    <div className="form-control md:col-span-2">
                      <label className="label">
                        <span className="label-text font-medium">Clinic Address</span>
                      </label>
                      <input 
                        name="clinic_address" 
                        placeholder="Clinic Address" 
                        value={formInput.clinic_address} 
                        onChange={handleChange} 
                        className="input input-bordered w-full" 
                        required 
                      />
                    </div>
                  </div>
                  <div className="card-actions justify-end">
                    <button type="submit" className="btn btn-primary">
                      {profile ? 'Update Profile' : 'Save Profile'}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="stat">
                      <div className="stat-title">Provider No / License No</div>
                      <div className="stat-value text-lg">{profile.license_no}</div>
                    </div>
                    <div className="stat">
                      <div className="stat-title">Full Name</div>
                      <div className="stat-value text-lg">{profile.first_name} {profile.last_name}</div>
                    </div>
                    <div className="stat">
                      <div className="stat-title">Specialty</div>
                      <div className="stat-value text-lg">{profile.specialization}</div>
                    </div>
                    <div className="stat">
                      <div className="stat-title">Email</div>
                      <div className="stat-value text-lg">{profile.email}</div>
                    </div>
                    <div className="stat">
                      <div className="stat-title">Phone Number</div>
                      <div className="stat-value text-lg">{profile.phone_number}</div>
                    </div>
                    <div className="stat md:col-span-2">
                      <div className="stat-title">Clinic Address</div>
                      <div className="stat-value text-lg">{profile.clinic_address}</div>
                    </div>
                  </div>
                  <div className="card-actions justify-end">
                    <button onClick={() => setIsEditing(true)} className="btn btn-primary">
                      Update Profile
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 'appointments':
        return (
          <div className="card bg-base-100 shadow-xl max-w-4xl mx-auto">
            <div className="card-body">
              <h3 className="card-title text-2xl mb-4">Appointments</h3>
              <div className="space-y-4">
                {appointments.length === 0 && (
                  <div className="alert alert-info">
                    <span>No appointments scheduled.</span>
                  </div>
                )}
                {appointments.map(app => (
                  <div key={app._id} className="card bg-base-200 shadow-sm">
                    <div className="card-body">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="font-semibold">Patient: {app.patientName}</p>
                          <p>Date: {app.date} | Time: {app.time}</p>
                          <div className="badge badge-primary badge-outline">{app.status}</div>
                        </div>
                        <div className="card-actions justify-end">
                          <button 
                            className="btn btn-error btn-sm"
                            onClick={async () => {
                              if (window.confirm('Are you sure you want to cancel this appointment?')) {
                                const res = await fetch(
                                  `${import.meta.env.VITE_API_BASE_URL}/api/provider/auth/appointments/${app._id}/cancel`,
                                  { method: 'PATCH', credentials: 'include' }
                                );
                                if (res.ok) {
                                  const data = await res.json();
                                  setAppointments(appointments =>
                                    appointments.map(a =>
                                      a._id === app._id ? { ...a, status: 'canceled' } : a
                                    )
                                  );
                                } else {
                                  const error = await res.json();
                                  alert('Failed to cancel: ' + (error.message || 'Unknown error'));
                                }
                              }
                            }}
                            disabled={app.status === 'canceled'}
                          >
                            Cancel
                          </button>
                          <button 
                            className="btn btn-info btn-sm" 
                            onClick={() => setSelectedPatient(app.patient)} 
                            disabled={!app.patient}
                          >
                            View Profile
                          </button>
                        </div>
                      </div>
                      {selectedPatient && selectedPatient._id === app.patient._id && (
                        <div className="collapse collapse-open bg-base-100 mt-4">
                          <div className="collapse-content">
                            <div className="stats stats-vertical lg:stats-horizontal shadow">
                              <div className="stat">
                                <div className="stat-title">Name</div>
                                <div className="stat-value text-sm">{selectedPatient.first_name} {selectedPatient.last_name}</div>
                              </div>
                              <div className="stat">
                                <div className="stat-title">Email</div>
                                <div className="stat-value text-sm">{selectedPatient.email}</div>
                              </div>
                              <div className="stat">
                                <div className="stat-title">Phone</div>
                                <div className="stat-value text-sm">{selectedPatient.phone_number}</div>
                              </div>
                              <div className="stat">
                                <div className="stat-title">Gender</div>
                                <div className="stat-value text-sm">{selectedPatient.gender}</div>
                              </div>
                              <div className="stat">
                                <div className="stat-title">DOB</div>
                                <div className="stat-value text-sm">{selectedPatient.date_of_birth}</div>
                              </div>
                              <div className="stat">
                                <div className="stat-title">Age</div>
                                <div className="stat-value text-sm">{selectedPatient.age}</div>
                              </div>
                            </div>
                            <div className="mt-4">
                              <p><strong>Address:</strong> {selectedPatient.address}</p>
                            </div>
                            <button className="btn btn-ghost btn-sm mt-2" onClick={() => setSelectedPatient(null)}>
                              Close
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'records':
        return (
          <div className="card bg-base-100 shadow-xl max-w-5xl mx-auto">
            <div className="card-body">
              <h3 className="card-title text-2xl mb-6">Patient Prescriptions</h3>
              
              {selectedPatientId ? (
                <div className="space-y-8">
                  <div className="card bg-base-200">
                    <div className="card-body">
                      <h4 className="card-title">Upload New Prescription</h4>
                      <UploadPrescription
                        providerId={profile?._id}
                        patientId={selectedPatientId}
                        appointmentId={null}
                      />
                    </div>
                  </div>
                  
                  <div className="divider"></div>
                  
                  <div className="card bg-base-200">
                    <div className="card-body">
                      <h4 className="card-title">Patient Prescription History</h4>
                      <ViewPatientPrescriptions providerId={profile?._id} patientId={selectedPatientId} />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="alert alert-warning">
                  <span>Please select a patient using the global selector above to upload a prescription or view prescription history.</span>
                </div>
              )}
            </div>
          </div>
        );

      case 'billing':
        return (
          <div className="card bg-base-100 shadow-xl max-w-4xl mx-auto">
            <div className="card-body">
              <h3 className="card-title text-2xl mb-6">Patient Billing</h3>
              
              {loadingBillingPatients ? (
                <div className="flex justify-center items-center py-8">
                  <span className="loading loading-spinner loading-lg text-primary"></span>
                  <span className="ml-4">Loading patients...</span>
                </div>
              ) : billingPatients.length === 0 ? (
                <div className="text-center py-8">
                  <div className="alert alert-info mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span>No patients found for billing</span>
                  </div>
                  <p className="text-base-content/70 mb-4">
                    You need to have appointments with patients before you can create bills.
                  </p>
                  <p className="text-base-content/70">
                    Once you have appointments, patients will appear here automatically.
                  </p>
                </div>
              ) : (
                <ProviderBilling 
                  providerId={profile?._id} 
                  patients={billingPatients} 
                  appointments={appointments} 
                  selectedPatientId={selectedPatientId}
                />
              )}
            </div>
          </div>
        );

      case 'messaging':
        return (
          <div className="card bg-base-100 shadow-xl max-w-4xl mx-auto">
            <div className="card-body">
              <h3 className="card-title text-2xl mb-6">Patient Messaging</h3>
              <ProviderMessagingSection providerId={profile?._id} />
            </div>
          </div>
        );

      case 'video':
        return (
          <div className="card bg-base-100 shadow-xl max-w-4xl mx-auto">
            <div className="card-body">
              <h3 className="card-title text-2xl mb-4">📹 Video Consultations</h3>
              <p className="text-base-content/70 mb-6">Select an appointment to start your video consultation.</p>
              
              <div className="form-control max-w-xs mb-6">
                <label className="label">
                  <span className="label-text font-medium">Select Appointment</span>
                </label>
                <select
                  value={selectedAppointment?._id || ''}
                  onChange={e => setSelectedAppointment(appointments.find(a => a._id === e.target.value))}
                  className="select select-bordered w-full"
                  disabled={!selectedPatientId}
                >
                  <option value="">Choose Appointment</option>
                  {appointments
                    .filter(a => a.patient && a.patient._id === selectedPatientId)
                    .map(a => (
                      <option key={a._id} value={a._id}>
                        {a.date} at {a.time} ({a.status})
                      </option>
                    ))}
                </select>
              </div>

              {selectedPatientId && selectedAppointment && (
                <div className="card bg-base-200">
                  <div className="card-body">
                    <VideoChat
                      patientId={selectedPatientId}
                      providerId={profile?._id}
                      appointmentId={selectedAppointment._id}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return (
          <div className="hero min-h-96">
            <div className="hero-content text-center">
              <div className="max-w-2xl">
                <div className="card bg-base-100 shadow-xl">
                  <div className="card-body">
                    <h1 className="text-4xl font-bold mb-6">Welcome to your Provider Dashboard</h1>
                    <p className="text-lg mb-4">
                      Your centralized hub for managing patient care and telehealth services effectively and efficiently.
                    </p>
                    <p className="text-base mb-4">
                      Your Provider Dashboard is built to empower you to deliver high-quality, patient-centered care through our telehealth platform.
                    </p>
                    <p className="text-base">
                      Thank you for being a vital part of our telehealth community!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-base-200" data-theme="corporate">
      <div className="navbar bg-base-100 shadow-lg">
        <div className="navbar-start">
          <button onClick={() => setActiveSection(null)} className="btn btn-ghost text-4xl text-primary">
            <FaUserMd />
          </button>
          <span className="ml-2 text-xl font-bold">Provider Dashboard</span>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 gap-1">
            <li><button onClick={() => setActiveSection('profile')} className="btn btn-ghost btn-sm">Profile</button></li>
            <li><button onClick={() => setActiveSection('appointments')} className="btn btn-ghost btn-sm">Appointments</button></li>
            <li><button onClick={() => setActiveSection('records')} className="btn btn-ghost btn-sm">Prescriptions</button></li>
            <li><button onClick={() => setActiveSection('billing')} className="btn btn-ghost btn-sm">Billing</button></li>
            <li><button onClick={() => setActiveSection('messaging')} className="btn btn-ghost btn-sm">Messaging</button></li>
            <li><button onClick={() => setActiveSection('video')} className="btn btn-ghost btn-sm">Video Consultations</button></li>
          </ul>
        </div>
        <div className="navbar-end lg:hidden">
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-ghost">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
              </svg>
            </div>
            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
              <li><button onClick={() => setActiveSection('profile')}>Profile</button></li>
              <li><button onClick={() => setActiveSection('appointments')}>Appointments</button></li>
              <li><button onClick={() => setActiveSection('records')}>Prescriptions</button></li>
              <li><button onClick={() => setActiveSection('billing')}>Billing</button></li>
              <li><button onClick={() => setActiveSection('messaging')}>Messaging</button></li>
              <li><button onClick={() => setActiveSection('video')}>Video Consultations</button></li>
            </ul>
          </div>
        </div>
      </div>
      
      <main className="container mx-auto p-6">
        {/* Global Patient Selector */}
        {(activeSection === 'records' || activeSection === 'billing' || activeSection === 'video') && (
          <div className="card bg-base-100 shadow-lg mb-6">
            <div className="card-body">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">Selected Patient</h3>
                <button 
                  onClick={() => setShowPatientSelector(!showPatientSelector)}
                  className="btn btn-primary btn-sm"
                >
                  {showPatientSelector ? 'Hide Selector' : 'Change Patient'}
                </button>
              </div>
              
              {showPatientSelector && (
                <div className="form-control mt-4">
                  <label className="label">
                    <span className="label-text font-medium">Select Patient:</span>
                  </label>
                  <select
                    value={selectedPatientId || ''}
                    onChange={e => setSelectedPatientId(e.target.value)}
                    className="select select-bordered w-full max-w-xs"
                  >
                    <option value="">-- Select Patient --</option>
                    {patients.map(patient => (
                      <option key={patient._id} value={patient._id}>
                        {patient.first_name} {patient.last_name} ({patient.email})
                      </option>
                    ))}
                  </select>
                </div>
              )}
              
              {selectedPatientId && (
                <div className="mt-4 p-4 bg-base-200 rounded-lg">
                  <p className="font-medium">
                    Currently selected: {patients.find(p => p._id === selectedPatientId)?.first_name} {patients.find(p => p._id === selectedPatientId)?.last_name}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
        
        {renderSection()}
      </main>
    </div>
  );
};

export default ProviderDashboard;