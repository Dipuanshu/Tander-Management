/** @format */

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PlusCircle, Building, FileText, LogOut, Search } from "lucide-react";
import API from "./api";

export default function Dashboard() {
  const navigate = useNavigate();
  const [tenders, setTenders] = useState([]);

  const profilePic =
    localStorage.getItem("userPic") &&
    localStorage.getItem("userPic") !== "undefined"
      ? localStorage.getItem("userPic")
      : "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y";

  const userName = localStorage.getItem("userName");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  useEffect(() => {
    API.get("/tenders")
      .then((res) => setTenders(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <div className="text-2xl font-extrabold text-blue-700">
          Tender<span className="text-gray-800">Connect</span>
        </div>

        <div className="flex items-center space-x-6">
          <Link
            to="/dashboard"
            className="text-gray-700 hover:text-blue-700 font-medium"
          >
            Dashboard
          </Link>

          <div
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => navigate("/profile")}
          >
            <img
              src={profilePic}
              alt="Profile"
              className="rounded-full w-10 h-10 object-cover border"
            />
            <span className="text-gray-700 font-medium">{userName}</span>
          </div>

          <button onClick={handleLogout} title="Logout">
            <LogOut size={20} className="text-red-600 hover:text-red-800" />
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16 px-6 text-center">
        <h1 className="text-4xl font-extrabold mb-4">
          Welcome Back, {userName}!
        </h1>
        <p className="text-lg text-blue-100">
          Manage your companies, browse tenders, and connect with partners
          easily.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="max-w-6xl mx-auto py-12 px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        <Link
          to="/tender/new"
          className="bg-white hover:shadow-xl transition shadow-md rounded-lg p-8 flex flex-col items-center text-center"
        >
          <PlusCircle className="text-blue-600 mb-4" size={48} />
          <h2 className="text-xl font-bold mb-2">Create Tender</h2>
          <p className="text-gray-600 mb-4">
            Post new tenders for others to apply.
          </p>
          <span className="bg-blue-600 text-white px-4 py-2 rounded font-medium">
            Create
          </span>
        </Link>

        <Link
          to="/my-companies"
          className="bg-white hover:shadow-xl transition shadow-md rounded-lg p-8 flex flex-col items-center text-center"
        >
          <Building className="text-green-600 mb-4" size={48} />
          <h2 className="text-xl font-bold mb-2">My Companies</h2>
          <p className="text-gray-600 mb-4">View & manage your companies.</p>
          <span className="bg-green-600 text-white px-4 py-2 rounded font-medium">
            Manage
          </span>
        </Link>

        <Link
          to="/tenders"
          className="bg-white hover:shadow-xl transition shadow-md rounded-lg p-8 flex flex-col items-center text-center"
        >
          <FileText className="text-gray-700 mb-4" size={48} />
          <h2 className="text-xl font-bold mb-2">Browse Tenders</h2>
          <p className="text-gray-600 mb-4">
            View & apply to all open tenders.
          </p>
          <span className="bg-gray-700 text-white px-4 py-2 rounded font-medium">
            View
          </span>
        </Link>

        <Link
          to="/companies"
          className="bg-white hover:shadow-xl transition shadow-md rounded-lg p-8 flex flex-col items-center text-center"
        >
          <Search className="text-purple-600 mb-4" size={48} />
          <h2 className="text-xl font-bold mb-2">Search Companies</h2>
          <p className="text-gray-600 mb-4">
            Find companies by name or industry.
          </p>
          <span className="bg-purple-600 text-white px-4 py-2 rounded font-medium">
            Search
          </span>
        </Link>
      </div>

      {/* Open Tenders */}
      <div className="max-w-6xl mx-auto py-12 px-6">
        <h2 className="text-2xl font-bold mb-6">Open Tenders</h2>

        {tenders.length === 0 && (
          <p className="text-gray-600">No open tenders available.</p>
        )}

        {tenders.slice(0, 3).map((tender) => (
          <div
            key={tender._id}
            className="bg-white p-6 rounded-lg shadow mb-4 flex flex-col md:flex-row justify-between items-start md:items-center"
          >
            <div>
              <h3 className="text-xl font-bold mb-1">{tender.title}</h3>
              <p className="text-gray-700 mb-2">
                {tender.description.slice(0, 100)}...
              </p>
              <div className="flex space-x-4 text-sm text-gray-600 mb-2">
                <span>💰 ₹{tender.budget}</span>
                <span>📅 Deadline: {tender.deadline?.slice(0, 10)}</span>
              </div>
            </div>
            <div className="flex space-x-2 mt-4 md:mt-0">
              <Link
                to={`/tender/${tender._id}`}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                View
              </Link>
              <Link
                to={`/tender/${tender._id}`}
                className="bg-green-600 text-white px-4 py-2 rounded"
              >
                Apply
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
