/** @format */

import React, { useState, useEffect } from "react";
import API from "./api";

export default function SearchCompanies() {
  const [query, setQuery] = useState("");
  const [allCompanies, setAllCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔹 Load all companies once
  useEffect(() => {
    fetchAllCompanies();
  }, []);

  const fetchAllCompanies = async () => {
    try {
      setLoading(true);
      const res = await API.get("/companies");
      setAllCompanies(res.data);
      setFilteredCompanies(res.data); // show all initially
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Run filter automatically when query changes
  useEffect(() => {
    const keyword = query.toLowerCase().trim();
    if (keyword === "") {
      setFilteredCompanies(allCompanies);
    } else {
      const filtered = allCompanies.filter(
        (c) =>
          c.name.toLowerCase().includes(keyword) ||
          c.industry.toLowerCase().includes(keyword) ||
          c.description.toLowerCase().includes(keyword)
      );
      setFilteredCompanies(filtered);
    }
  }, [query, allCompanies]);

  return (
    <div className="max-w-6xl mx-auto py-12 px-6">
      <h2 className="text-2xl font-bold mb-4">Search Companies</h2>

      <div className="flex items-center space-x-2 mb-6">
        <input
          type="text"
          placeholder="Search by name, industry or services..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full border border-gray-300 rounded px-4 py-2"
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => {
            // Not needed because live search, but we keep it for UX
          }}
        >
          Search
        </button>
      </div>

      {loading && <p className="text-gray-500">Loading companies...</p>}

      {filteredCompanies.length === 0 && !loading && (
        <p className="text-gray-600">
          No companies found. Try a different keyword.
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredCompanies.map((company) => (
          <div key={company._id} className="bg-white shadow rounded-lg p-4">
            <img
              src={
                company.logoUrl ||
                "https://via.placeholder.com/300x150.png?text=No+Logo"
              }
              alt={company.name}
              className="h-40 w-full object-cover rounded mb-3"
            />
            <h3 className="text-lg font-bold">{company.name}</h3>
            <p className="text-gray-600">{company.industry}</p>
            <p className="text-sm text-gray-500 mt-1">
              {company.description?.slice(0, 60)}...
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
