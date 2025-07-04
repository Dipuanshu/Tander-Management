/** @format */

import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Link, useNavigate } from "react-router-dom";
import { FiCamera } from "react-icons/fi"; // ✅ Camera icon

const SignUpSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Name is too short")
    .max(50, "Name is too long")
    .required("Name is required"),
  email: Yup.string()
    .email("Enter a valid email")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export default function SignUp() {
  const [Error, setError] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const navigate = useNavigate();

  const handleSignUp = async (values, { setSubmitting, resetForm }) => {
    try {
      let profilePicUrl = "";

      if (profilePic) {
        const data = new FormData();
        data.append("file", profilePic);

        const uploadRes = await fetch(
          "https://tender-backend-8k7t.onrender.com/upload",
          {
            method: "POST",
            body: data,
          }
        );
        const uploadData = await uploadRes.json();
        profilePicUrl = uploadData.url;
      }

      const payload = { ...values, profilePic: profilePicUrl };

      const res = await fetch(
        "https://tender-backend-8k7t.onrender.com/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const result = await res.json();

      if (res.status === 400 && result.error === "Email already registered") {
        setError("Email is already registered");
        setTimeout(() => setError(""), 5000);
      } else if (res.ok) {
        localStorage.setItem("userName", result.result.name);
        localStorage.setItem("userPic", result.result.profilePic);
        localStorage.setItem("token", result.auth);
        localStorage.setItem("email", result.result.email);
        resetForm();
        navigate("/dashboard");
      } else {
        setError("Something went wrong");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 w-full">
      <div className="bg-white rounded-2xl shadow-lg max-w-lg w-full p-10">
        <div className="text-center mb-8">
          {Error && (
            <div className="text-red-600 bg-red-100 p-2 rounded mb-4">
              {Error}
            </div>
          )}
          <span className="text-blue-600 text-5xl">🤝</span>
          <h1 className="text-3xl font-bold mt-2">TenderHub</h1>
          <p className="text-gray-500 text-sm">
            B2B Tender Management Platform
          </p>
        </div>

        {/* ✅ PROFILE PIC UPLOADER with overlay */}
        <div className="flex flex-col items-center mb-6">
          <label
            htmlFor="profilePicInput"
            className="relative cursor-pointer group"
          >
            <img
              src={
                profilePic
                  ? URL.createObjectURL(profilePic)
                  : "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
              }
              alt="Profile Preview"
              className="w-24 h-24 rounded-full border-4 border-blue-500 object-cover"
            />

            {/* Overlay camera icon */}
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition">
              <FiCamera className="text-white text-2xl" />
            </div>

            <input
              id="profilePicInput"
              type="file"
              accept="image/*"
              onChange={(e) => setProfilePic(e.target.files[0])}
              className="hidden"
            />
          </label>
          <span className="text-sm text-gray-600 mt-2">
            Click image to upload photo
          </span>
        </div>

        <div className="flex bg-gray-200 rounded-full mb-6">
          <Link
            to="/"
            className="flex-1 py-2 text-center font-medium text-gray-500 hover:text-gray-800 transition"
          >
            Sign In
          </Link>
          <Link
            to="/signup"
            className="flex-1 py-2 text-center font-medium text-gray-800 bg-white rounded-full"
          >
            Sign Up
          </Link>
        </div>

        <Formik
          initialValues={{ name: "", email: "", password: "" }}
          validationSchema={SignUpSchema}
          onSubmit={handleSignUp}
        >
          {({ isSubmitting, isValid, dirty }) => (
            <Form className="space-y-6">
              <div>
                <Field
                  name="name"
                  type="text"
                  placeholder="Full Name"
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-red-600 text-sm mt-1"
                />
              </div>

              <div>
                <Field
                  name="email"
                  type="email"
                  placeholder="Email Address"
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-600 text-sm mt-1"
                />
              </div>

              <div>
                <Field
                  name="password"
                  type="password"
                  placeholder="Password"
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-600 text-sm mt-1"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !(isValid && dirty)}
                className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-50"
              >
                {isSubmitting ? "Signing Up..." : "Sign Up"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
