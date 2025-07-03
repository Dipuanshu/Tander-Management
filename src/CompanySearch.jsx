/** @format */

import { useState } from "react";
import API from "./api";

export default function CompanySearch() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    const res = await API.get(`/companies?search=${search}`);
    setResults(res.data);
  };

  return (
    <div className="max-w-4xl mx-auto py-10">
      <h2 className="text-2xl font-bold mb-4">Search Companies</h2>

      <form onSubmit={handleSearch} className="mb-6 flex">
        <input
          type="text"
          placeholder="Search by name, industry, or description"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-grow border border-gray-300 rounded-l px-4 py-2"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-r"
        >
          Search
        </button>
      </form>

      {results.map((company) => (
        <div
          key={company._id}
          className="border p-4 mb-4 rounded shadow hover:shadow-lg transition"
        >
          <h3 className="text-lg font-bold">{company.name}</h3>
          <p className="text-gray-600">{company.industry}</p>
          <p className="text-gray-500">{company.description}</p>
        </div>
      ))}
    </div>
  );
}
