import { useState } from "react";
import apiClient from "../../api/apiClient";

export default function StaffingRequirementForm({ onRequirementSaved }) {
  const [formData, setFormData] = useState({
    date: "",
    timePeriod: "",
    requiredAgents: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await apiClient.post("/staffing", {
        date: formData.date,
        timePeriod: formData.timePeriod,
        requiredAgents: parseInt(formData.requiredAgents, 10),
        scheduledAgents: 0, // default if new
      });
      setSuccess("Staffing requirement saved successfully!");
      setFormData({ date: "", timePeriod: "", requiredAgents: "" });
      if (onRequirementSaved) onRequirementSaved();
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to save staffing requirement.",
      );
    }
  };

  return (
    <div
      style={{
        background: "white",
        padding: "24px",
        borderRadius: "10px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        border: "1px solid #e2e8f0",
        marginTop: "24px",
      }}
    >
      <h3
        style={{
          marginTop: 0,
          fontSize: "18px",
          fontWeight: "bold",
          color: "#1e293b",
        }}
      >
        Manage Staffing Requirement
      </h3>
      <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "20px" }}>
        Create or update required agent headcount per time slot
      </p>

      {error && (
        <div
          style={{
            background: "#fef2f2",
            border: "1px solid #fecaca",
            color: "#991b1b",
            padding: "10px",
            borderRadius: "6px",
            fontSize: "12px",
            marginBottom: "16px",
          }}
        >
          {error}
        </div>
      )}
      {success && (
        <div
          style={{
            background: "#ecfdf5",
            border: "1px solid #a7f3d0",
            color: "#065f46",
            padding: "10px",
            borderRadius: "6px",
            fontSize: "12px",
            marginBottom: "16px",
          }}
        >
          {success}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "16px" }}
      >
        <div>
          <label
            style={{
              fontSize: "12px",
              fontWeight: "600",
              color: "#475569",
              textTransform: "uppercase",
            }}
          >
            Date
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label
            style={{
              fontSize: "12px",
              fontWeight: "600",
              color: "#475569",
              textTransform: "uppercase",
            }}
          >
            Time Period (e.g., 09:00)
          </label>
          <input
            type="text"
            name="timePeriod"
            placeholder="09:00"
            value={formData.timePeriod}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label
            style={{
              fontSize: "12px",
              fontWeight: "600",
              color: "#475569",
              textTransform: "uppercase",
            }}
          >
            Required Agents
          </label>
          <input
            type="number"
            name="requiredAgents"
            min="1"
            value={formData.requiredAgents}
            onChange={handleChange}
            required
          />
        </div>

        <button
          type="submit"
          style={{
            background: "#0284c7",
            color: "white",
            border: "none",
            padding: "12px",
            borderRadius: "6px",
            fontWeight: "600",
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          Save Staffing Requirement
        </button>
      </form>
    </div>
  );
}
