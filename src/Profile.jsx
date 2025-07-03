/** @format */

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "./api";
import { Pencil, UploadCloud, Save } from "lucide-react";

export default function Profile() {
  const navigate = useNavigate();

  // Get from localStorage (ya API se future me)
  const [name, setName] = useState(localStorage.getItem("name"));
  const [email, setEmail] = useState(localStorage.getItem("email"));
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");
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
    const data = new FormData();
    data.append("file", file);
    const res = await API.post("/upload", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data.url;
  };

  const handleSave = async () => {
    setStatus("Saving...");
    let imageUrl = preview;

    if (file) {
      imageUrl = await uploadImage();
    }

    // LocalStorage update (real app me backend call)
    localStorage.setItem("user", name);
    localStorage.setItem("userEmail", email);
    localStorage.setItem("userPic", imageUrl);

    setStatus("Updated!");
    setEditName(false);
    setEditEmail(false);

    setTimeout(() => {
      setStatus("");
      navigate("/dashboard");
    }, 800);
  };

  return (
    <div className="max-w-md mx-auto mt-12 bg-white shadow-xl rounded-xl p-8">
      <h2 className="text-3xl font-extrabold mb-6 text-center text-blue-700">
        My Profile
      </h2>

      {/* Profile Pic */}
      <div className="flex flex-col items-center mb-6">
        <div className="relative">
          <img
            src={preview}
            alt="Profile"
            className="w-32 h-32 rounded-full border-4 border-blue-600 object-cover"
          />
          <label className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full cursor-pointer hover:bg-blue-700">
            <UploadCloud className="text-white" size={20} />
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>
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
        <p className="text-center text-green-600 mt-4 font-medium">{status}</p>
      )}
    </div>
  );
}
