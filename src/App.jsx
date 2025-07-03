/** @format */

import { Routes, Route } from "react-router-dom";
import SignIn from "./SignIn";
import SignUp from "./SingUp";
import Dashboard from "./Dashbord";
import CompanyForm from "./companyForm";

import TenderForm from "./TenderForm";
import TenderList from "./TenderList";
import TenderDetails from "./TenderDetails";
import Profile from "./Profile";
import MyCompanies from "./MyCompanies";
import SearchCompanies from "./SearchCompanies";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        {/* ✅ Auth */}
        <Route path="/" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        {/* ✅ Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* ✅ Company */}
        <Route path="/company/new" element={<CompanyForm />} />

        {/* ✅ Tender */}
        <Route path="/tenders" element={<TenderList />} />
        <Route path="/tender/new" element={<TenderForm />} />
        <Route path="/tender/:id/edit" element={<TenderForm />} />
        <Route path="/tender/:id" element={<TenderDetails />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/my-companies" element={<MyCompanies />} />
        <Route path="/companies" element={<SearchCompanies />} />
      </Routes>
    </div>
  );
}
