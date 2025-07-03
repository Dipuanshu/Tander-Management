/** @format */

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "./api";

export default function TenderDetails() {
  const { id } = useParams();
  const [tender, setTender] = useState(null);
  const [proposal, setProposal] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    console.log("Tender ID:", id);
    API.get(`/tenders/${id}`)
      .then((res) => {
        console.log("Tender Data:", res.data);
        setTender(res.data);
      })
      .catch((err) => console.error(err));
  }, [id]);

  const handleApply = async (e) => {
    e.preventDefault();
    setStatus("Submitting...");
    try {
      await API.post(
        `/applications`,
        {
          tenderId: id,
          proposal,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setStatus("Proposal submitted successfully!");
      setProposal("");
    } catch (err) {
      console.error(err);
      setStatus("Error submitting proposal!");
    }
  };

  if (!tender) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-8 border rounded shadow bg-white">
      <h2 className="text-3xl font-bold mb-4">{tender.title}</h2>
      <p className="mb-4 text-gray-700">{tender.description}</p>
      <p className="text-sm text-gray-600 mb-1">Budget: ₹{tender.budget}</p>
      <p className="text-sm text-gray-600 mb-6">
        Deadline: {tender.deadline?.slice(0, 10)}
      </p>

      <div className="border-t pt-6 mt-6">
        <h3 className="text-xl font-bold mb-3">Apply for this Tender</h3>
        <form onSubmit={handleApply} className="space-y-4">
          <textarea
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
            rows={4}
            placeholder="Write your proposal..."
            value={proposal}
            onChange={(e) => setProposal(e.target.value)}
            required
          ></textarea>

          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            {status === "Submitting..." ? "Submitting..." : "Submit Proposal"}
          </button>
        </form>

        {status && (
          <p
            className={`mt-3 text-sm ${
              status.includes("success") ? "text-green-600" : "text-red-600"
            }`}
          >
            {status}
          </p>
        )}
      </div>
    </div>
  );
}
