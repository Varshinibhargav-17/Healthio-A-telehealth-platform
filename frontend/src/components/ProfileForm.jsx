import React from 'react';
import { FaUser, FaSave, FaEdit } from 'react-icons/fa';

const ProfileForm = ({ formInput, onChange, onSubmit, isUpdate }) => {
  return (
    <div className="card bg-base-100 shadow-xl max-w-4xl mx-auto my-8" data-theme="corporate">
      <div className="card-body">
        <div className="flex items-center mb-6">
          <FaUser className="text-primary text-3xl mr-4" />
          <h2 className="card-title text-3xl">
            {isUpdate ? 'Update Your Profile' : 'Complete Your Profile'}
          </h2>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Information Section */}
            <div className="md:col-span-2">
              <h3 className="text-xl font-semibold text-primary mb-4 border-b border-base-300 pb-2">
                Personal Information
              </h3>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">First Name</span>
                <span className="label-text-alt text-error">*</span>
              </label>
              <input
                name="first_name"
                placeholder="Enter your first name"
                value={formInput.first_name}
                onChange={onChange}
                className="input input-bordered w-full focus:input-primary"
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Last Name</span>
                <span className="label-text-alt text-error">*</span>
              </label>
              <input
                name="last_name"
                placeholder="Enter your last name"
                value={formInput.last_name}
                onChange={onChange}
                className="input input-bordered w-full focus:input-primary"
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Date of Birth</span>
                <span className="label-text-alt text-error">*</span>
              </label>
              <input
                type="date"
                name="date_of_birth"
                value={formInput.date_of_birth}
                onChange={onChange}
                className="input input-bordered w-full focus:input-primary"
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Gender</span>
                <span className="label-text-alt text-error">*</span>
              </label>
              <select
                name="gender"
                value={formInput.gender}
                onChange={onChange}
                className="select select-bordered w-full focus:select-primary"
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
                <option value="Prefer not to say">Prefer not to say</option>
              </select>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Age</span>
                <span className="label-text-alt text-error">*</span>
              </label>
              <input
                name="age"
                type="number"
                placeholder="Enter your age"
                value={formInput.age}
                onChange={onChange}
                className="input input-bordered w-full focus:input-primary"
                min="1"
                max="120"
                required
              />
            </div>

            {/* Contact Information Section */}
            <div className="md:col-span-2 mt-6">
              <h3 className="text-xl font-semibold text-primary mb-4 border-b border-base-300 pb-2">
                Contact Information
              </h3>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Email Address</span>
                <span className="label-text-alt text-error">*</span>
              </label>
              <input
                name="email"
                type="email"
                placeholder="Enter your email address"
                value={formInput.email}
                onChange={onChange}
                className="input input-bordered w-full focus:input-primary"
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Phone Number</span>
                <span className="label-text-alt text-error">*</span>
              </label>
              <input
                name="phone_number"
                type="tel"
                placeholder="Enter your phone number"
                value={formInput.phone_number}
                onChange={onChange}
                className="input input-bordered w-full focus:input-primary"
                required
              />
            </div>

            <div className="form-control md:col-span-2">
              <label className="label">
                <span className="label-text font-medium">Address</span>
                <span className="label-text-alt text-error">*</span>
              </label>
              <textarea
                name="address"
                placeholder="Enter your complete address"
                value={formInput.address}
                onChange={onChange}
                className="textarea textarea-bordered w-full h-20 focus:textarea-primary resize-none"
                required
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="card-actions justify-end pt-6 border-t border-base-300">
            <button
              type="submit"
              className="btn btn-primary gap-2 px-8"
            >
              {isUpdate ? (
                <>
                  <FaEdit className="w-4 h-4" />
                  Update Profile
                </>
              ) : (
                <>
                  <FaSave className="w-4 h-4" />
                  Save Profile
                </>
              )}
            </button>
          </div>
        </form>

        {/* Required Fields Note */}
        <div className="alert alert-info mt-6">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span>Fields marked with <span className="text-error font-semibold">*</span> are required.</span>
        </div>
      </div>
    </div>
  );
};

export default ProfileForm;