import React from "react";

import ApplicantDetails from "./ApplicantDetails"; 
import { useGetApplicantsByHrEmail } from "../customHooks/useAppliedJob";

const ApplicantList = () => {
  const email = localStorage.getItem("userEmail"); 
  const {
    data: applicants,
    isLoading,
    isError,
    error,
  } = useGetApplicantsByHrEmail(email);

  // Handle loading state
  if (isLoading) {
    return <p>Loading applicants...</p>;
  }

  // Handle error state
  if (isError) {
    return <p>Error: {error.message}</p>;
  }

  // Check if no applicants are present
  if (applicants?.length === 0) {
    return <p>No applicants are present.</p>;
  }

  return (
    <div className="space-y-4">
      {applicants?.map((applicant) => (
        <ApplicantDetails
          key={applicant.id} // Assuming 'id' is unique for each applicant
          applicant={applicant}
          jobId={applicant.jobId} // Assuming you are passing jobId for each applicant
        />
      ))}
    </div>
  );
};

export default ApplicantList;
