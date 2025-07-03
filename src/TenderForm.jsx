/** @format */

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "./api";

export default function TenderForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    deadline: "",
    budget: "",
  });
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (id) {
      API.get(`/tenders/${id}`)
        .then((res) => setForm(res.data))
        .catch((err) => console.error(err));
    }
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Saving...");

    try {
      const config = {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      };

      if (id) {
        await API.put(`/tenders/${id}`, form, config);
        setStatus("Updated successfully!");
      } else {
        await API.post("/tenders", form, config);
        setStatus("Created successfully!");
        setForm({ title: "", description: "", deadline: "", budget: "" });
      }

      setTimeout(() => navigate("/tenders"), 800);
    } catch (err) {
      console.error(err);
      setStatus("Error occurred!");
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white shadow-lg rounded-lg p-8 mt-10">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        {id ? "Edit Tender" : "Create Tender"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block mb-1 text-gray-700 font-medium">Title</label>
          <input
            type="text"
            name="title"
            placeholder="Tender Title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block mb-1 text-gray-700 font-medium">
            Description
          </label>
          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block mb-1 text-gray-700 font-medium">
            Deadline
          </label>
          <input
            type="date"
            name="deadline"
            value={form.deadline?.slice(0, 10)}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block mb-1 text-gray-700 font-medium">Budget</label>
          <input
            type="number"
            name="budget"
            placeholder="Budget"
            value={form.budget}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          {status === "Saving..."
            ? "Saving..."
            : id
            ? "Update Tender"
            : "Create Tender"}
        </button>
      </form>

      {status && (
        <p
          className={`mt-4 text-sm ${
            status.includes("success") ? "text-green-600" : "text-red-600"
          }`}
        >
          {status}
        </p>
      )}
    </div>
  );
}
