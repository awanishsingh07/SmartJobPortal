import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useFetchUser } from "../customHooks/useAuth";

const Header = () => {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState(
    localStorage.getItem("userEmail") || ""
  );
  const { data, isLoading } = useFetchUser(userEmail);

  const [isLoggedIn, setIsLoggedIn] = useState(Boolean(userEmail));
  const isHR = data?.role === "HR";
  const userName = isHR ? "HR User" : "Applicant User";
  const profilePath = isHR ? "/profile/hr" : "/profile/applicant";

  useEffect(() => {
    setUserEmail(localStorage.getItem("userEmail") || "");
  }, [userEmail]);

  useEffect(() => {
    if (data) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [data]);

  const handleProfileClick = () => {
    navigate(profilePath);
  };

  if (isLoading) return null;

  return (
    <header className="bg-gray-900 text-gray-100 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center flex-wrap">
        <Link to="/">
          <img
            src="https://via.placeholder.com/150x50?text=Logo"
            alt="Logo"
            className="h-10"
          />
        </Link>
        <nav className="flex space-x-6 my-2 md:my-0">
          <Link to="/" className="hover:text-blue-400 transition-colors">
            Home
          </Link>
          <Link to="/jobs" className="hover:text-blue-400 transition-colors">
            Jobs
          </Link>
          <Link to="/contact" className="hover:text-blue-400 transition-colors">
            Contact
          </Link>
        </nav>
        <div>
          {isLoggedIn ? (
            <span
              onClick={handleProfileClick}
              className="cursor-pointer hover:text-blue-400 transition-colors"
            >
              {userName}
            </span>
          ) : (
            <Link to="/login">
              <button className="py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Login
              </button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
