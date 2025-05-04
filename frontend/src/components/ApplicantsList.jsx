import React from "react";
import { Link } from "react-router-dom";
import AuthButton from "./AuthButton";

const ApplicantsList = ({ applicants }) => {
  return (
    <div className="space-y-4">
      {applicants.length > 0 ? (
        applicants.map((applicant) => (
          <div key={applicant.id} className="p-4 bg-gray-800 rounded-lg">
            <p className="text-gray-100">
              <strong>Email:</strong> {applicant.applicantEmail}
            </p>
            <p className="text-gray-400">
              <strong>Job ID:</strong> {applicant.jobId}
            </p>
            <p className="text-gray-400">
              <strong>Resume:</strong>{" "}
              <a
                href={applicant.resumeUrl}
                target="_blank"
                className="text-blue-400 hover:underline"
              >
                View
              </a>
            </p>
            <p className="text-gray-400">
              <strong>Status:</strong> {applicant.status}
            </p>
            <Link to="/create-room">
              <AuthButton label="Request Interview" isLoading={false} />
            </Link>
          </div>
        ))
      ) : (
        <p className="text-gray-400 text-center">
          No accepted applicants found.
        </p>
      )}
    </div>
  );
};

export default ApplicantsList;
