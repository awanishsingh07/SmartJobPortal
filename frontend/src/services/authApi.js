import axios from "axios";
import BASEURL from "../constants/BaseURL";

// Create axios instance
const axiosInstance = axios.create({
  baseURL: `${BASEURL}/api/v1`,
  withCredentials: false, // Change this to true if you need credentials (cookies)
});

// Function to get JWT token from localStorage
const getAuthToken = () => {
  return localStorage.getItem("accessToken");
};

// Function to get the refresh token
const getRefreshToken = () => {
  return localStorage.getItem("refreshToken");
};

// Function to set the new access token in localStorage
const setAccessToken = (token) => {
  localStorage.setItem("accessToken", token);
};

// Function to refresh the access token
export const refreshJwtToken = async () => {
  const refreshToken = getRefreshToken();
  try {
    const response = await axiosInstance.post("/auth/refresh-jwt", {
      token: refreshToken,
    });
    const newAccessToken = response.data.token;
    setAccessToken(newAccessToken); // Store the new access token
    return newAccessToken;
  } catch (error) {
    console.error("Token refresh failed:", error);
    throw new Error("Unable to refresh token");
  }
};

// Add an axios interceptor to automatically refresh the token
axiosInstance.interceptors.request.use(
  async (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add an axios response interceptor to handle 401 errors and refresh the token
axiosInstance.interceptors.response.use(
  (response) => response, // If the response is successful, return the response
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newAccessToken = await refreshJwtToken(); // Try to refresh the token
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`; // Set the new token
        return axiosInstance(originalRequest); // Retry the original request with the new token
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        // Redirect to login or logout the user
        // Optional: window.location.href = '/login'; or logOutUser();
      }
    }

    return Promise.reject(error); // Reject the error if refresh fails
  }
);

// 1. Signup
export const signUpUser = async (userData) => {
  const res = await axiosInstance.post("/auth/signup", userData);
  return res.data;
};

// 2. Signin
export const signInUser = async (loginData) => {
  const res = await axiosInstance.post("/auth/signin", loginData);
  if (res.data.token) {
    localStorage.setItem("accessToken", res.data.jwtToken);
    localStorage.setItem("refreshToken", res.data.refreshToken); // Save refresh token
  }
  return res.data;
};

// 4. Get User
export const fetchUser = async (email) => {
  const token = getAuthToken();
  const res = await axiosInstance.get(`/users/${email}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// 5. Update User
export const updateUser = async ({ email, updatedData }) => {
  const token = getAuthToken();
  const res = await axiosInstance.put(`/users/${email}`, updatedData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

// 6. Delete User
export const deleteUser = async (email) => {
  const token = getAuthToken();
  const res = await axiosInstance.delete(`/users/${email}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  logOutUser(); // <- good here
  return res.data;
};

export const logOutUser = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("userEmail");
};
