import { useState, useEffect } from "react";
import apiClient from "../../api/apiClient";

export default function ScheduleQueue({ refreshKey, onScheduleChanged }) {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchSchedules = async () => {
      try {
        const response = await apiClient.get("/schedules");
        if (isMounted) {
          setSchedules(response.data);
        }
      } catch (err) {
        console.error("Failed to fetch schedules queue", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchSchedules();

    return () => {
      isMounted = false;
    };
  }, [refreshKey]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this schedule?"))
      return;
    try {
      await apiClient.delete(`/schedules/${id}`);
      if (onScheduleChanged) onScheduleChanged();
    } catch (err) {
      alert("Failed to delete schedule." + (err.response?.data?.message || ""));
    }
  };

  if (loading) {
    return (
      <div
        style={{ background: "white", padding: "24px", borderRadius: "10px" }}
      >
        Loading schedule queue...
      </div>
    );
  }

  return (
    <div
      style={{
        background: "white",
        borderRadius: "10px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        border: "1px solid #e2e8f0",
        overflow: "hidden",
        marginTop: "24px",
      }}
    >
      <div style={{ padding: "20px 24px", borderBottom: "1px solid #e2e8f0" }}>
        <h2
          style={{
            margin: 0,
            fontSize: "18px",
            fontWeight: "bold",
            color: "#1e293b",
          }}
        >
          Active Schedule Queue
        </h2>
        <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: "#64748b" }}>
          Admin view listing all registered agent shifts
        </p>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Agent ID</th>
              <th>Date</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Status</th>
              <th style={{ textAlign: "center" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {schedules.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  style={{
                    textAlign: "center",
                    padding: "24px",
                    color: "#64748b",
                  }}
                >
                  No schedules found.
                </td>
              </tr>
            ) : (
              schedules.map((sch) => (
                <tr key={sch.id}>
                  <td style={{ fontWeight: "500" }}>#{sch.id}</td>
                  <td>Agent #{sch.agentId}</td>
                  <td>{sch.date}</td>
                  <td style={{ fontFamily: "monospace" }}>{sch.startTime}</td>
                  <td style={{ fontFamily: "monospace" }}>{sch.endTime}</td>
                  <td>
                    <span
                      style={{
                        padding: "4px 10px",
                        borderRadius: "12px",
                        fontSize: "11px",
                        fontWeight: "600",
                        background: "#d1fae5",
                        color: "#065f46",
                        border: "1px solid #a7f3d0",
                      }}
                    >
                      {sch.status}
                    </span>
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <button
                      onClick={() => handleDelete(sch.id)}
                      style={{
                        background: "#ef4444",
                        color: "white",
                        border: "none",
                        padding: "6px 12px",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontSize: "12px",
                        fontWeight: "600",
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
