import React, { useEffect, useState } from "react";
import axios from "axios";
import { 
  FaFileInvoiceDollar, 
  FaUser, 
  FaPlus, 
  FaCheckCircle, 
  FaClock, 
  FaRupeeSign,
  FaUsers,
  FaChartLine
} from "react-icons/fa";

const ProviderBilling = ({ providerId, patients, appointments, selectedPatientId }) => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [billAmount, setBillAmount] = useState(1000);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    await Promise.all([fetchBills()]);
    setLoading(false);
  };

  const fetchBills = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/billing/provider-bills", {
        withCredentials: true,
      });
      setBills(res.data);
    } catch (err) {
      console.error("Error fetching bills:", err);
    }
  };

  const generateBill = async () => {
    if (!selectedPatientId) {
      alert("Please select a patient first using the global selector above");
      return;
    }
    
    if (!billAmount || billAmount <= 0) {
      alert("Please enter a valid bill amount");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/billing/create",
        { patientId: selectedPatientId, amount: billAmount },
        { withCredentials: true }
      );
      alert("Bill generated successfully");
      setBillAmount(1000);
      fetchBills();
    } catch (err) {
      console.error("Error generating bill:", err);
      alert("Failed to generate bill. Please try again.");
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending":
        return (
          <div className="badge badge-warning gap-2">
            <FaClock className="w-3 h-3" />
            Pending
          </div>
        );
      case "Paid":
        return (
          <div className="badge badge-success gap-2">
            <FaCheckCircle className="w-3 h-3" />
            Paid
          </div>
        );
      default:
        return <div className="badge badge-neutral">{status}</div>;
    }
  };

  const getTotalRevenue = () => {
    return bills
      .filter(bill => bill.status === "Paid")
      .reduce((total, bill) => total + bill.amount, 0);
  };

  const getPendingRevenue = () => {
    return bills
      .filter(bill => bill.status === "Pending")
      .reduce((total, bill) => total + bill.amount, 0);
  };

  const getSelectedPatientName = () => {
    const patient = patients.find(p => p._id === selectedPatientId);
    return patient ? (patient.name || `${patient.first_name || ''} ${patient.last_name || ''}`.trim()) : '';
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
      {/* Header and Statistics */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <div className="flex items-center mb-6">
            <FaFileInvoiceDollar className="text-primary text-3xl mr-4" />
            <h2 className="card-title text-3xl">Provider Billing Management</h2>
          </div>

          {/* Statistics */}
          <div className="stats stats-vertical lg:stats-horizontal shadow bg-base-200 mb-6">
            <div className="stat">
              <div className="stat-figure text-primary">
                <FaUsers className="w-8 h-8" />
              </div>
              <div className="stat-title">Total Patients</div>
              <div className="stat-value text-primary">{patients.length}</div>
            </div>
            
            <div className="stat">
              <div className="stat-figure text-secondary">
                <FaFileInvoiceDollar className="w-8 h-8" />
              </div>
              <div className="stat-title">Total Bills</div>
              <div className="stat-value text-secondary">{bills.length}</div>
            </div>
            
            <div className="stat">
              <div className="stat-figure text-success">
                <FaChartLine className="w-8 h-8" />
              </div>
              <div className="stat-title">Revenue (Paid)</div>
              <div className="stat-value text-success">₹{getTotalRevenue().toFixed(2)}</div>
            </div>
            
            <div className="stat">
              <div className="stat-figure text-warning">
                <FaClock className="w-8 h-8" />
              </div>
              <div className="stat-title">Pending Revenue</div>
              <div className="stat-value text-warning">₹{getPendingRevenue().toFixed(2)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Bill Generation Section */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h3 className="card-title text-xl mb-4">Generate New Bill</h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            <div className="form-control">
              <label className="label">
                <span className="label-text font-medium">Bill Amount</span>
                <span className="label-text-alt text-error">*</span>
              </label>
              <label className="input-group">
                <span className="bg-primary text-primary-content">
                  <FaRupeeSign />
                </span>
                <input
                  type="number"
                  placeholder="1000"
                  className="input input-bordered w-full focus:input-primary"
                  value={billAmount}
                  onChange={(e) => setBillAmount(Number(e.target.value))}
                  min="1"
                />
              </label>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">&nbsp;</span>
              </label>
              <button
                className="btn btn-primary gap-2"
                onClick={generateBill}
                disabled={!selectedPatientId || !billAmount}
              >
                <FaPlus className="w-4 h-4" />
                Generate Bill
              </button>
            </div>
          </div>

          {selectedPatientId && (
            <div className="alert alert-info">
              <div className="flex items-center">
                <FaUser className="w-5 h-5 mr-2" />
                <span>
                  Generating bill for: <strong>{getSelectedPatientName()}</strong> - 
                  Amount: <strong>₹{billAmount}</strong>
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bills Table Section */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <h3 className="card-title text-xl mb-4">Generated Bills</h3>
          
          {bills.length === 0 ? (
            <div className="alert alert-info">
              <div className="flex items-center">
                <FaFileInvoiceDollar className="w-6 h-6 mr-2" />
                <span>No bills generated yet. Create your first bill above.</span>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th className="text-base font-semibold">Patient</th>
                    <th className="text-base font-semibold">Amount</th>
                    <th className="text-base font-semibold">Status</th>
                    <th className="text-base font-semibold">Date Created</th>
                  </tr>
                </thead>
                <tbody>
                  {bills.map((bill) => (
                    <tr key={bill._id} className="hover">
                      <td className="font-medium">
                        <div className="flex items-center gap-3">
                          <div className="avatar placeholder">
                            <div className="bg-neutral text-neutral-content rounded-full w-8">
                              <span className="text-xs">
                                <FaUser />
                              </span>
                            </div>
                          </div>
                          {bill.patient?.name || 
                           `${bill.patient?.first_name || ''} ${bill.patient?.last_name || ''}`.trim() || 
                           bill.patient?._id || 'Unknown Patient'}
                        </div>
                      </td>
                      <td className="font-semibold text-lg">₹{bill.amount.toFixed(2)}</td>
                      <td>{getStatusBadge(bill.status)}</td>
                      <td className="text-sm">
                        {bill.createdAt ? 
                          new Date(bill.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          }) : 
                          'N/A'
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProviderBilling;