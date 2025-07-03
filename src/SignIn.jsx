/** @format */
import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
const SignInSchema = Yup.object().shape({
  email: Yup.string()
    .email("Enter a valid email")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is required"),
});

export default function SignIn() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 w-full">
      <div className="bg-white rounded-2xl shadow-lg max-w-lg w-full p-10">
        <div className="text-center mb-8">
          <span className="text-blue-600 text-5xl">🤝</span>
          <h1 className="text-3xl font-bold mt-2">TenderHub</h1>
          <p className="text-gray-500 text-sm">
            B2B Tender Management Platform
          </p>
        </div>

        <div className="flex bg-gray-200 rounded-full mb-6">
          <Link
            to="/"
            className="flex-1 py-2 text-center font-medium text-gray-800 bg-white rounded-full"
          >
            Sign In
          </Link>
          <Link
            to="/signup"
            className="flex-1 py-2 text-center font-medium text-gray-500 hover:text-gray-800 transition"
          >
            Sign Up
          </Link>
        </div>

        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={SignInSchema}
          onSubmit={async (values, { setSubmitting }) => {
            const email = values.email;
            const password = values.password;
            let result = await fetch("http://localhost:5000/login", {
              method: "post",
              body: JSON.stringify({ email, password }),
              headers: {
                "Content-Type": "application/json",
              },
            });
            result = await result.json();
            console.log(result);
            if (result.auth) {
              //ab token check krenge pahle name kr rhe the//
              navigate("/dashboard");
              localStorage.setItem("token", result.auth); //Token ko local storage mai save kr lenge//
              localStorage.setItem("users", result.users._id);
              localStorage.setItem("name", result.users.name);
              localStorage.setItem("email", result.users.email);
            } else if (!result.name) {
              console.log("Invalide users");
            }

            setTimeout(() => setSubmitting(false), 500);
          }}
        >
          {({ isSubmitting, touched, errors, isValid }) => (
            <Form className="space-y-6">
              <div>
                <label htmlFor="email">Email Address</label>
                <Field
                  name="email"
                  type="email"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    touched.email && errors.email ? "border-red-500" : ""
                  }`}
                  placeholder="Enter your email"
                  required
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-600 text-sm mt-1"
                />
              </div>
              <div>
                <label htmlFor="password">Password</label>
                <Field
                  name="password"
                  type="password"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                    touched.password && errors.password ? "border-red-500" : ""
                  }`}
                  placeholder="Enter your password"
                  required
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-600 text-sm mt-1"
                />
              </div>
              <button
                type="submit"
                disabled={!isValid}
                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
              >
                {isSubmitting ? "Signing In..." : "Sign In"}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
