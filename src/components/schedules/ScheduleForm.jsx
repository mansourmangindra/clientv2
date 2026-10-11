import { useState, useEffect } from "react";
import apiClient from "../../api/apiClient";

export default function ScheduleForm({ onScheduleSaved }) {
  const [agents, setAgents] = useState([]);
  const [formData, setFormData] = useState({
    agentId: "",
    date: "",
    startTime: "",
    endTime: "",
    status: "Scheduled",
  });
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchAgents = async () => {
      try {
        const response = await apiClient.get("/users/agents");
        if (isMounted) {
          setAgents(response.data);
        }
      } catch (err) {
        console.error("Failed to fetch agents", err);
      }
    };

    fetchAgents();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
    setSuccessMsg("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.startTime >= formData.endTime) {
      setError("Start time must be strictly before end time.");
      return;
    }

    try {
      const payload = {
        ...formData,
        agentId: parseInt(formData.agentId, 10),
      };

      await apiClient.post("/schedules", payload);
      onScheduleSaved();
      setSuccessMsg("Schedule created successfully!");
      setFormData({
        agentId: "",
        date: "",
        startTime: "",
        endTime: "",
        status: "Scheduled",
      });
      setError("");
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.title ||
        "Failed to create schedule. Possible overlap detected.";
      setError(errorMessage);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <h3 className="text-lg font-bold text-slate-800 mb-1">
        Create Agent Schedule
      </h3>
      <p className="text-xs text-slate-500 mb-6">
        Assign shifts and validate coverage gaps
      </p>

      {error && (
        <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg font-medium">
          {error}
        </div>
      )}

      {successMsg && (
        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-lg font-medium">
          {successMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
            Agent
          </label>
          <select
            name="agentId"
            value={formData.agentId}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-slate-300 bg-slate-50/50 p-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
          >
            <option value="">Select an Agent...</option>
            {agents.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name} ({a.role})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
            Date
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-slate-300 bg-slate-50/50 p-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
              Start Time
            </label>
            <input
              type="time"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-slate-300 bg-slate-50/50 p-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
              End Time
            </label>
            <input
              type="time"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              required
              className="w-full rounded-lg border border-slate-300 bg-slate-50/50 p-2.5 text-sm focus:bg-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-4 rounded-lg shadow-sm transition-colors text-sm"
        >
          Save & Publish Schedule
        </button>
      </form>
    </div>
  );
}
