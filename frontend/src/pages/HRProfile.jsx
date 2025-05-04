import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useFetchJobsByEmail } from "../customHooks/useJob";
import { useGetAcceptedApplicantsByJobId } from "../customHooks/useAppliedJob";

const HRProfilePage = () => {
  const [activeSection, setActiveSection] = useState("Profile");
  const userEmail = localStorage.getItem("userEmail") || "";

  const {
    data: jobs = [],
  } = useFetchJobsByEmail(userEmail);
  
  const [selectedJobId, setSelectedJobId] = useState(
    jobs.length > 0 ? jobs[0]?.id : ""
  );
  console.log(selectedJobId);
  const {
    data: applicants = [],
    isLoading: applicantsLoading,
    error: applicantsError,
  } = useGetAcceptedApplicantsByJobId(selectedJobId);

  const sections = [
    {
      name: "Profile",
      icon: "M12 12a4 4 0 100-8 4 4 0 000 8zM12 14c-4.42 0-8 1.79-8 4v2h16v-2c0-2.21-3.58-4-8-4z",
    },
    { name: "Jobs", icon: "M4 6h16v2H4zm0 4h16v2H4zm0 4h16v2H4z" },
    {
      name: "Applicants",
      icon: "M9 13.75c-2.34 0-7 1.17-7 3.5V19h14v-1.75c0-2.33-4.66-3.5-7-3.5zM4.34 17c.84-.58 2.87-1.25 4.66-1.25s3.82.67 4.66 1.25H4.34zM9 12a4 4 0 100-8 4 4 0 000 8z",
    },
    {
      name: "Create Room",
      icon: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3 9h-2v-2h-2v2H9v2h2v2h2v-2h2v-2z",
    },
  ];

  const sectionRef = useRef({
    Profile: () => (
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg max-w-md mx-auto text-center">
        <img
          src="https://via.placeholder.com/100"
          alt="Profile"
          className="w-24 h-24 rounded-full mx-auto mb-4 border-2 border-blue-500"
        />
        <h2 className="text-xl font-semibold text-gray-100 mb-1">HR User</h2>
        <p className="text-sm text-gray-400 mb-1">Email: {userEmail}</p>
        <p className="text-sm text-gray-400">Role: HR</p>
      </div>
    ),
    Jobs: () => (
      <div>
        <Link to="/post-job">
          <button className="mb-6 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            + Create a Job
          </button>
        </Link>
        {jobs.length > 0 ? (
          <ul className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
            {jobs.map((job) => (
              <li
                key={job.id}
                onClick={() => setSelectedJobId(job.id)}
                className={`p-4 bg-gray-800 rounded-lg border hover:border-blue-500 transition cursor-pointer ${
                  selectedJobId === job.id
                    ? "border-blue-600"
                    : "border-gray-700"
                }`}
              >
                <h3 className="text-gray-100 font-medium">{job.title}</h3>
                <p className="text-gray-400 text-sm truncate">
                  {job.description}
                </p>
                <p className="text-gray-500 text-xs mt-2">
                  Posted: {new Date(job.createdAt).toLocaleDateString()}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">No jobs posted yet.</p>
        )}
      </div>
    ),
    Applicants: () => (
      <div>
        {applicantsLoading && (
          <p className="text-gray-400">Loading applicants...</p>
        )}
        {applicantsError && (
          <p className="text-red-500">Error loading applicants</p>
        )}
        {selectedJobId ? (
          applicants.length > 0 ? (
            <ul className="space-y-4">
              {applicants.map((applicant) => (
                <li
                  key={applicant.id}
                  className="p-4 bg-gray-800 rounded-lg border border-gray-700"
                >
                  <p className="text-gray-100">
                    <strong>Email:</strong> {applicant.applicantEmail}
                  </p>
                  <p className="text-gray-400">
                    <strong>Resume:</strong>{" "}
                    <a
                      href={applicant.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline"
                    >
                      View
                    </a>
                  </p>
                  <Link to="/create-room">
                    <button className="mt-3 py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                      Schedule Interview
                    </button>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400">
              No accepted applicants for this job.
            </p>
          )
        ) : (
          <p className="text-gray-400">Select a job to view applicants.</p>
        )}
      </div>
    ),
    "Create Room": () => (
      <div className="text-center text-gray-400 text-sm">
        Create Room functionality coming soon.
      </div>
    ),
  });

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col md:flex-row">
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        sections={sections}
      />
      <main className="flex-1 p-6 md:p-10">
        <h1 className="text-3xl font-semibold text-gray-100 mb-6">
          HR Dashboard
        </h1>
        <div className="animate-fade-in">
          {sectionRef.current[activeSection]()}
        </div>
      </main>
    </div>
  );
};

export default HRProfilePage;
