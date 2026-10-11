import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://localhost:7294/api", // adjust to your .NET port
  headers: {
    "Content-Type": "application/json",
  },
});

export default apiClient;
