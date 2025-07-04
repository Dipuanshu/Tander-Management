/** @format */

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "./api";

export default function TenderList() {
  const [tenders, setTenders] = useState([]);

  useEffect(() => {
    API.get("/tenders")
      .then((res) => setTenders(res.data))
      .catch((err) => console.error(err));
  }, []);
  const userId = localStorage.getItem("userId");

  return (
    <div className="max-w-4xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">All Tenders</h2>
      <Link
        to="/tender/new"
        className="inline-block mb-4 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Create New Tender
      </Link>

      {tenders.map((tender) => (
        <div key={tender._id} className="border p-4 mb-4 rounded">
          <h3 className="text-xl font-bold">{tender.title}</h3>
          <p className="text-gray-700 mb-2">{tender.description}</p>
          <p className="text-sm text-gray-600">Budget: ₹{tender.budget}</p>
          <p className="text-sm text-gray-600">
            Deadline: {tender.deadline?.slice(0, 10)}
          </p>

          <div className="mt-2">
            <Link
              to={`/tender/${tender._id}`}
              className="text-blue-600 underline mr-4"
            >
              View
            </Link>
            {tender.isPublic != true && (
              <Link
                to={`/tender/${tender._id}/edit`}
                className="text-green-600 underline"
              >
                Edit
              </Link>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
