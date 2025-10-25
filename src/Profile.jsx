/** @format */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "./api";
import { Pencil, UploadCloud, Save, Loader2 } from "lucide-react";

export default function Profile() {
  const navigate = useNavigate();

  const [name, setName] = useState(localStorage.getItem("userName"));
  const [email, setEmail] = useState(localStorage.getItem("email"));
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(
    localStorage.getItem("userPic") ||
      "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
  );

  const [editName, setEditName] = useState(false);
  const [editEmail, setEditEmail] = useState(false);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const uploadImage = async () => {
    if (!file) return preview;

    try {
      setUploading(true);
      const data = new FormData();
      data.append("file", file);
      const res = await API.post("/upload", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const imageUrl = res.data.url;

      // Save uploaded image
      localStorage.setItem("userPic", imageUrl);
      setPreview(imageUrl);
      setFile(null);
      setUploading(false);
      setStatus("Profile picture updated successfully!");
      setTimeout(() => setStatus(""), 1500);
    } catch (err) {
      console.error(err);
      setUploading(false);
      setStatus("Image upload failed!");
      setTimeout(() => setStatus(""), 1500);
    }
  };

  const handleSave = async () => {
    setStatus("Saving...");
    localStorage.setItem("userName", name);
    localStorage.setItem("email", email);

    setStatus("Updated!");
    setEditName(false);
    setEditEmail(false);

    setTimeout(() => {
      setStatus("");
      navigate("/dashboard");
    }, 800);
  };

  return (
    <div className="max-w-md mx-auto mt-12 bg-white shadow-xl rounded-xl p-8 relative overflow-hidden">
      <h2 className="text-3xl font-extrabold mb-6 text-center text-blue-700">
        My Profile
      </h2>

      {/* Profile Pic */}
      <div className="flex flex-col items-center mb-6">
        <div className="relative group">
          <img
            src={preview}
            className="w-32 h-32 rounded-full border-4 border-blue-600 object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <label className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full cursor-pointer hover:bg-blue-700 shadow-lg transition-all duration-300">
            <UploadCloud className="text-white" size={20} />
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>

        {/* ✅ Upload button appears dynamically when file is selected */}
        {file && (
          <button
            onClick={uploadImage}
            disabled={uploading}
            className={`mt-4 flex items-center gap-2 bg-green-600 text-white px-5 py-2 rounded-full font-semibold shadow-md transition-all duration-300 hover:bg-green-700 ${
              uploading ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            {uploading ? (
              <>
                <Loader2 size={18} className="animate-spin" /> Uploading...
              </>
            ) : (
              <>
                <UploadCloud size={18} /> Upload
              </>
            )}
          </button>
        )}
      </div>

      {/* User Details */}
      <div className="space-y-4">
        {/* Name */}
        <div className="flex items-center justify-between border-b pb-2">
          {editName ? (
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border px-3 py-1 rounded w-full mr-2"
            />
          ) : (
            <div>
              <span className="font-medium text-gray-600">Name:</span>{" "}
              <span className="text-gray-800 font-bold">{name || "—"}</span>
            </div>
          )}
          {editName ? (
            <button
              onClick={handleSave}
              className="bg-green-600 text-white px-3 py-1 rounded"
            >
              <Save size={16} />
            </button>
          ) : (
            <button
              onClick={() => setEditName(true)}
              className="text-blue-600 hover:text-blue-800"
            >
              <Pencil size={18} />
            </button>
          )}
        </div>

        {/* Email */}
        <div className="flex items-center justify-between border-b pb-2">
          {editEmail ? (
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border px-3 py-1 rounded w-full mr-2"
            />
          ) : (
            <div>
              <span className="font-medium text-gray-600">Email:</span>{" "}
              <span className="text-gray-800 font-bold">{email || "—"}</span>
            </div>
          )}
          {editEmail ? (
            <button
              onClick={handleSave}
              className="bg-green-600 text-white px-3 py-1 rounded"
            >
              <Save size={16} />
            </button>
          ) : (
            <button
              onClick={() => setEditEmail(true)}
              className="text-blue-600 hover:text-blue-800"
            >
              <Pencil size={18} />
            </button>
          )}
        </div>
      </div>

      {status && (
        <p
          className={`text-center mt-4 font-medium ${
            status.includes("failed") ? "text-red-600" : "text-green-600"
          }`}
        >
          {status}
        </p>
      )}
    </div>
  );
}
