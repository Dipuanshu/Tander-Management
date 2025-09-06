/** @format */

// src/components/CompanyForm.jsx
import { useState, useEffect } from "react";
import API from "./api";

export default function CompanyForm({ companyId }) {
  const [form, setForm] = useState({
    name: "",
    industry: "",
    description: "",
    logoUrl: "",
  });
  const [logoFile, setLogoFile] = useState(null);
  const [status, setStatus] = useState("");

  // 🔹 Load data if editing
  useEffect(() => {
    if (companyId) {
      API.get(`/read/${companyId}`)
        .then((res) => setForm(res.data))
        .catch((err) => console.error(err));
    }
  }, [companyId]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    console.log("Selected file:", e.target.files);
    setLogoFile(e.target.files[0]);
  };

  const uploadLogo = async () => {
    if (!logoFile) return "";

    const data = new FormData();
    data.append("file", logoFile);

    const res = await API.post("/upload", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    console.log("Uploaded Cloudinary URL:", res.data.url);
    return res.data.url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Saving...");

    try {
      let logoUrl = form.logoUrl;
      if (logoFile) {
        logoUrl = await uploadLogo();
      }

      const payload = { ...form, logoUrl };

      if (companyId) {
        await API.put(`/updated/${companyId}`, payload, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setStatus("Updated successfully!");
      } else {
        await API.post("/create", payload, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setStatus("Created successfully!");
        setForm({
          name: "",
          industry: "",
          description: "",
          logoUrl: "",
        });
        setLogoFile(null);
      }
    } catch (err) {
      console.error(err);
      setStatus("Error occurred!");
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white shadow-lg rounded-lg p-8 mt-10">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        {companyId ? "Edit Company" : "Create Company"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block mb-1 text-gray-700 font-medium">
            Company Name
          </label>
          <input
            type="text"
            name="name"
            placeholder="Company Name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block mb-1 text-gray-700 font-medium">
            Industry
          </label>
          <input
            type="text"
            name="industry"
            placeholder="Industry"
            value={form.industry}
            onChange={handleChange}
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
          <label className="block mb-1 text-gray-700 font-medium">Logo</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full"
          />

          {logoFile && (
            <img
              src={URL.createObjectURL(logoFile)}
              alt="Logo Preview"
              className="w-32 mt-3 rounded border"
            />
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          {status === "Saving..."
            ? "Saving..."
            : companyId
            ? "Update Company"
            : "Create Company"}
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
