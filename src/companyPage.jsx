/** @format */

import CompanyForm from "./companyForm";

export default function CompanyPage() {
  // Example: If editing existing company, pass `companyId`
  // const companyId = "66674a.....";
  const companyId = null; // null for create

  return (
    <div>
      <h1>Company Profile</h1>
      <CompanyForm companyId={companyId} />
    </div>
  );
}
