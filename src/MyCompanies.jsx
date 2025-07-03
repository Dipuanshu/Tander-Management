/** @format */
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "./api";

export default function MyCompanies() {
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    API.get("/my-companies", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((res) => setCompanies(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="max-w-6xl mx-auto py-12 px-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">My Companies</h2>
        <Link
          to="/company/new"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          + Create New Company
        </Link>
      </div>

      {companies.length === 0 ? (
        <p className="text-gray-600">You have not created any companies yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {companies.map((company) => (
            <div
              key={company._id}
              className="bg-white shadow rounded-lg p-4 flex flex-col"
            >
              <img
                src={
                  company.logoUrl ||
                  "https://via.placeholder.com/150?text=No+Logo"
                }
                alt={company.name}
                className="h-40 w-full object-cover rounded mb-4"
              />
              <h3 className="text-lg font-bold">{company.name}</h3>
              <p className="text-gray-600">{company.industry}</p>
              <p className="text-sm text-gray-500 mt-1">
                {company.description.slice(0, 60)}...
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
