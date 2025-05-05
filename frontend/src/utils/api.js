import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000", // your backend server
});

export const getToken = (roomName, userName) =>
  API.post("/get-token", { roomName, userName });
