import React from 'react';

const AppointmentForm = ({
  provider,
  appointmentDate,
  appointmentTime,
  onDateChange,
  onTimeChange,
  onSubmit,
  appointmentStatus
}) => {
  return (
    <div className="card bg-base-100 shadow-lg mt-6" data-theme="corporate">
      <div className="card-body">
        <h4 className="card-title text-lg mb-4">
          Book Appointment with {provider.first_name} {provider.last_name}
        </h4>
        
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Select Date</span>
              </label>
              <input
                type="date"
                value={appointmentDate}
                onChange={onDateChange}
                className="input input-bordered w-full"
                required
                min={new Date().toISOString().split('T')[0]}
                onInput={(e) => {
                  const day = new Date(e.target.value).getDay();
                  if (day === 0) {
                    alert('Sundays are not available for appointments.');
                    e.target.value = '';
                  }
                }}
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Select Time</span>
              </label>
              <select
                value={appointmentTime}
                onChange={onTimeChange}
                className="select select-bordered w-full"
                required
              >
                <option value="">Choose Time Slot</option>
                <optgroup label="Morning Slots">
                  <option value="09:00">09:00 AM</option>
                  <option value="09:30">09:30 AM</option>
                  <option value="10:00">10:00 AM</option>
                  <option value="10:30">10:30 AM</option>
                  <option value="11:00">11:00 AM</option>
                  <option value="11:30">11:30 AM</option>
                </optgroup>
                <optgroup label="Evening Slots">
                  <option value="16:00">04:00 PM</option>
                  <option value="16:30">04:30 PM</option>
                  <option value="17:00">05:00 PM</option>
                  <option value="17:30">05:30 PM</option>
                  <option value="18:00">06:00 PM</option>
                  <option value="18:30">06:30 PM</option>
                  <option value="19:00">07:00 PM</option>
                </optgroup>
              </select>
            </div>
          </div>

          <div className="card-actions justify-between items-center pt-4">
            <div>
              {appointmentStatus && (
                <div className="badge badge-info badge-outline">
                  Status: {appointmentStatus}
                </div>
              )}
            </div>
            <button
              type="submit"
              className="btn btn-primary"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Confirm Appointment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AppointmentForm;