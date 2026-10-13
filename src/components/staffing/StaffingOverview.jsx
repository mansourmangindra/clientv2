import { useState, useEffect } from "react";
import apiClient from "../../api/apiClient";

export default function StaffingOverview() {
  const [requirements, setRequirements] = useState([]);
  const [loading, setLoading] = useState(true);

  const [sortField, setSortField] = useState("date");
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    let isMounted = true;

    const fetchStaffing = async () => {
      try {
        const response = await apiClient.get("/staffing");
        if (isMounted) {
          setRequirements(response.data);
        }
      } catch (err) {
        console.error("Failed to fetch staffing requirements", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchStaffing();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const sortedRequirements = [...requirements].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    if (sortField === "date") {
      aValue = new Date(aValue).getTime();
      bValue = new Date(bValue).getTime();
    } else if (sortField === "timePeriod") {
      const [aStart] = aValue.split("-");
      const [bStart] = bValue.split("-");
      aValue = aStart;
      bValue = bStart;
    } else if (
      sortField === "requiredAgents" ||
      sortField === "scheduledAgents"
    ) {
      aValue = Number(aValue);
      bValue = Number(bValue);
    }

    if (sortOrder === "asc") {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  if (loading) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 text-center text-slate-500 animate-pulse">
        Loading staffing forecast metrics...
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-slate-800">
            Staffing Forecast Overview
          </h2>
          <p className="text-xs text-slate-500">
            Real-time tracking of required vs. scheduled agent capacity
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-left">
          <thead className="bg-slate-50 text-slate-600 uppercase text-xs tracking-wider">
            <tr>
              <th
                onClick={() => handleSort("date")}
                style={{ cursor: "pointer", userSelect: "none" }}
                className="px-6 py-3.5 font-semibold"
              >
                Date{" "}
                {sortField === "date" ? (sortOrder === "asc" ? "▲" : "▼") : ""}
              </th>
              <th
                onClick={() => handleSort("timePeriod")}
                style={{ cursor: "pointer", userSelect: "none" }}
                className="px-6 py-3.5 font-semibold"
              >
                Time Period{" "}
                {sortField === "timePeriod"
                  ? sortOrder === "asc"
                    ? "▲"
                    : "▼"
                  : ""}
              </th>
              <th
                onClick={() => handleSort("requiredAgents")}
                style={{ cursor: "pointer", userSelect: "none" }}
                className="px-6 py-3.5 font-semibold text-center"
              >
                Scheduled
              </th>
              <th className="px-6 py-3.5 font-semibold text-center">Gap</th>
              <th className="px-6 py-3.5 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {sortedRequirements.map((req) => {
              const gap = req.requiredAgents - req.scheduledAgents;
              const isUnderstaffed = gap > 0;
              const isOverstaffed = gap < 0;

              return (
                <tr
                  key={req.id}
                  className="hover:bg-slate-50/50 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-slate-900">
                    {req.date}
                  </td>
                  <td className="px-6 py-4 text-slate-600 font-mono">
                    {req.timePeriod}
                  </td>
                  <td className="px-6 py-4 text-center text-slate-700 font-semibold">
                    {req.requiredAgents}
                  </td>
                  <td className="px-6 py-4 text-center text-slate-700 font-semibold">
                    {req.scheduledAgents}
                  </td>
                  <td
                    className={`px-6 py-4 text-center font-bold ${isUnderstaffed ? "text-amber-600" : isOverstaffed ? "text-indigo-600" : "text-emerald-600"}`}
                  >
                    {gap > 0
                      ? `-${gap}`
                      : gap === 0
                        ? "0"
                        : `+${Math.abs(gap)}`}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 inline-flex text-xs font-semibold rounded-full ${
                        isUnderstaffed
                          ? "bg-amber-50 text-amber-700 border border-amber-200"
                          : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      }`}
                    >
                      {isUnderstaffed ? "Understaffed" : "Fully Staffed"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
