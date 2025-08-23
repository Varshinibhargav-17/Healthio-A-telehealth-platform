import React from 'react';
import { FaUser, FaEdit, FaBirthdayCake, FaEnvelope, FaPhone, FaMapMarkerAlt, FaVenusMars, FaCalendarAlt } from 'react-icons/fa';

const ProfileView = ({ profile, onEdit }) => {
  const formatDate = (dateString) => {
    if (!dateString) return 'Not provided';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return profile.age || 'Not provided';
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  return (
    <div className="card bg-base-100 shadow-xl max-w-4xl mx-auto my-8" data-theme="corporate">
      <div className="card-body">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <div className="avatar placeholder mr-4">
              <div className="bg-primary text-primary-content rounded-full w-16">
                <span className="text-2xl">
                  <FaUser />
                </span>
              </div>
            </div>
            <div>
              <h2 className="card-title text-3xl">
                {profile.first_name} {profile.last_name}
              </h2>
              <p className="text-base-content/70 text-lg">Patient Profile</p>
            </div>
          </div>
          <button
            onClick={onEdit}
            className="btn btn-primary gap-2"
          >
            <FaEdit className="w-4 h-4" />
            Update Profile
          </button>
        </div>

        {/* Profile Information */}
        <div className="space-y-8">
          {/* Personal Information Section */}
          <div>
            <h3 className="text-xl font-semibold text-primary mb-4 border-b border-base-300 pb-2">
              Personal Information
            </h3>
            <div className="stats stats-vertical lg:stats-horizontal shadow bg-base-200 w-full">
              <div className="stat">
                <div className="stat-figure text-primary">
                  <FaUser className="w-8 h-8" />
                </div>
                <div className="stat-title">Full Name</div>
                <div className="stat-value text-lg">{profile.first_name} {profile.last_name}</div>
              </div>
              
              <div className="stat">
                <div className="stat-figure text-secondary">
                  <FaBirthdayCake className="w-8 h-8" />
                </div>
                <div className="stat-title">Date of Birth</div>
                <div className="stat-value text-lg">{formatDate(profile.date_of_birth)}</div>
              </div>
              
              <div className="stat">
                <div className="stat-figure text-accent">
                  <FaCalendarAlt className="w-8 h-8" />
                </div>
                <div className="stat-title">Age</div>
                <div className="stat-value text-primary">{calculateAge(profile.date_of_birth)} years</div>
              </div>
            </div>
          </div>

          {/* Gender Information */}
          <div>
            <div className="card bg-base-200 shadow-sm">
              <div className="card-body compact">
                <div className="flex items-center gap-4">
                  <div className="avatar placeholder">
                    <div className="bg-info text-info-content rounded-full w-12">
                      <FaVenusMars className="text-lg" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">Gender</h4>
                    <p className="text-base-content/70">{profile.gender || 'Not specified'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Information Section */}
          <div>
            <h3 className="text-xl font-semibold text-primary mb-4 border-b border-base-300 pb-2">
              Contact Information
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="card bg-base-200 shadow-sm">
                <div className="card-body compact">
                  <div className="flex items-center gap-4">
                    <div className="avatar placeholder">
                      <div className="bg-secondary text-secondary-content rounded-full w-12">
                        <FaEnvelope className="text-lg" />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">Email Address</h4>
                      <p className="text-base-content/70 break-all">{profile.email || 'Not provided'}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="card bg-base-200 shadow-sm">
                <div className="card-body compact">
                  <div className="flex items-center gap-4">
                    <div className="avatar placeholder">
                      <div className="bg-accent text-accent-content rounded-full w-12">
                        <FaPhone className="text-lg" />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg">Phone Number</h4>
                      <p className="text-base-content/70">{profile.phone_number || 'Not provided'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Address Section */}
          <div>
            <h3 className="text-xl font-semibold text-primary mb-4 border-b border-base-300 pb-2">
              Address Information
            </h3>
            <div className="card bg-base-200 shadow-sm">
              <div className="card-body">
                <div className="flex items-start gap-4">
                  <div className="avatar placeholder">
                    <div className="bg-warning text-warning-content rounded-full w-12">
                      <FaMapMarkerAlt className="text-lg" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg mb-2">Home Address</h4>
                    <p className="text-base-content/70 leading-relaxed">
                      {profile.address || 'Address not provided'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Completeness */}
        <div className="mt-8">
          <div className="alert alert-success">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Your profile is complete! Keep your information updated for the best healthcare experience.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;