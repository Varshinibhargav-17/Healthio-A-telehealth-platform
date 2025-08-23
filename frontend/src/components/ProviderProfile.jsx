import React from 'react';

const ProviderProfile = ({
  provider,
  onBookAppointment,
  onBack,
  showAppointmentForm,
  appointmentForm
}) => {
  const getProviderInitials = (firstName, lastName) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
  };

  return (
    <div className="bg-base-100 shadow-lg rounded-lg p-8 max-w-4xl mx-auto my-8" data-theme="corporate">
      {/* Header Section */}
      <div className="flex items-center gap-6 mb-8">
        <div className="avatar placeholder">
          <div className="bg-primary text-primary-content rounded-full w-20">
            <span className="text-2xl font-bold">
              {getProviderInitials(provider.first_name, provider.last_name)}
            </span>
          </div>
        </div>
        <div>
          <h3 className="text-3xl font-bold text-base-content mb-2">
            Dr. {provider.first_name} {provider.last_name}
          </h3>
          <div className="badge badge-primary badge-lg">
            {provider.specialization}
          </div>
        </div>
      </div>

      {/* Provider Information Cards */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Contact Information */}
        <div className="card bg-base-200 shadow-sm">
          <div className="card-body">
            <h4 className="card-title text-lg mb-4 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Contact Information
            </h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="badge badge-outline">Phone</div>
                <span className="text-base-content">{provider.phone_number}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Professional Details */}
        <div className="card bg-base-200 shadow-sm">
          <div className="card-body">
            <h4 className="card-title text-lg mb-4 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Professional Details
            </h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="badge badge-outline">License</div>
                <span className="text-base-content">{provider.license_no}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Clinic Address */}
      <div className="card bg-base-200 shadow-sm mb-8">
        <div className="card-body">
          <h4 className="card-title text-lg mb-4 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Clinic Address
          </h4>
          <div className="flex items-start gap-3">
            <div className="badge badge-outline">Location</div>
            <p className="text-base-content leading-relaxed">{provider.clinic_address}</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 justify-center md:justify-start">
        <button
          className="btn btn-primary btn-lg gap-2"
          onClick={onBookAppointment}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Make Appointment
        </button>
        
        <button
          className="btn btn-outline btn-lg gap-2"
          onClick={onBack}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Search
        </button>
      </div>

      {/* Appointment Form Section */}
      {showAppointmentForm && (
        <div className="mt-8">
          <div className="divider">
            <span className="text-lg font-semibold">Book Appointment</span>
          </div>
          <div className="bg-base-200 rounded-lg p-6">
            {appointmentForm}
          </div>
        </div>
      )}

      {/* Additional Info Section */}
      <div className="mt-8 p-4 bg-info/10 rounded-lg border border-info/20">
        <div className="flex items-center gap-2 mb-2">
          <svg className="w-5 h-5 text-info" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-semibold text-info">Please Note</span>
        </div>
        <p className="text-sm text-base-content/80">
          Please ensure you arrive 15 minutes before your scheduled appointment time. 
          Bring your insurance card and any relevant medical documents.
        </p>
      </div>
    </div>
  );
};

export default ProviderProfile;
