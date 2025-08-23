// frontend/src/components/PatientBilling.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaCreditCard, FaFileInvoiceDollar, FaCheckCircle, FaClock } from "react-icons/fa";

const PatientBilling = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/billing/my-bills", {
        withCredentials: true,
      });
      setBills(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const payBill = async (billId) => {
    try {
      await axios.post(
        `http://localhost:5000/api/billing/pay/${billId}`,
        {},
        { withCredentials: true }
      );
      alert("Payment successful (mock)");
      fetchBills();
    } catch (err) {
      console.error(err);
      alert("Failed to pay bill");
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending":
        return <div className="badge badge-warning gap-2"><FaClock className="w-3 h-3" />Pending</div>;
      case "Paid":
        return <div className="badge badge-success gap-2"><FaCheckCircle className="w-3 h-3" />Paid</div>;
      default:
        return <div className="badge badge-neutral">{status}</div>;
    }
  };

  const calculateTotalAmount = () => {
    return bills.reduce((total, bill) => total + bill.amount, 0);
  };

  const getPendingAmount = () => {
    return bills
      .filter(bill => bill.status === "Pending")
      .reduce((total, bill) => total + bill.amount, 0);
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
      {/* Header with Statistics */}
      <div className="card bg-base-100 shadow-lg">
        <div className="card-body">
          <div className="flex items-center mb-6">
            <FaFileInvoiceDollar className="text-primary text-3xl mr-4" />
            <h2 className="card-title text-3xl">My Medical Bills</h2>
          </div>
          
          {bills.length > 0 && (
            <div className="stats stats-vertical lg:stats-horizontal shadow bg-base-200 mb-6">
              <div className="stat">
                <div className="stat-figure text-primary">
                  <FaFileInvoiceDollar className="w-8 h-8" />
                </div>
                <div className="stat-title">Total Bills</div>
                <div className="stat-value text-primary">{bills.length}</div>
              </div>
              
              <div className="stat">
                <div className="stat-figure text-secondary">
                  <FaCreditCard className="w-8 h-8" />
                </div>
                <div className="stat-title">Total Amount</div>
                <div className="stat-value text-secondary">₹{calculateTotalAmount().toFixed(2)}</div>
              </div>
              
              <div className="stat">
                <div className="stat-figure text-warning">
                  <FaClock className="w-8 h-8" />
                </div>
                <div className="stat-title">Pending Amount</div>
                <div className="stat-value text-warning">₹{getPendingAmount().toFixed(2)}</div>
              </div>
            </div>
          )}

          {bills.length === 0 ? (
            <div className="alert alert-info">
              <div className="flex items-center">
                <FaFileInvoiceDollar className="w-6 h-6 mr-2" />
                <span>No bills found. You're all caught up!</span>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full">
                <thead>
                  <tr>
                    <th className="text-base font-semibold">Bill Date</th>
                    <th className="text-base font-semibold">Amount</th>
                    <th className="text-base font-semibold">Status</th>
                    <th className="text-base font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {bills.map((bill) => (
                    <tr key={bill._id} className="hover">
<td className="font-medium">
    {bill.appointment && bill.appointment.date 
        ? new Date(bill.appointment.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          }) 
        : 'Date not available'}
</td>
                      <td className="font-semibold text-lg">₹{bill.amount.toFixed(2)}</td>
                      <td>{getStatusBadge(bill.status)}</td>
                      <td>
                        {bill.status === "Pending" ? (
                          <button
                            className="btn btn-success btn-sm gap-2"
                            onClick={() => payBill(bill._id)}
                          >
                            <FaCreditCard className="w-4 h-4" />
                            Pay Now
                          </button>
                        ) : (
                          <div className="flex items-center gap-2 text-success font-medium">
                            <FaCheckCircle className="w-4 h-4" />
                            Paid
                          </div>
                        )}
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

export default PatientBilling;