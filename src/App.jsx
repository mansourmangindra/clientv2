import { useState } from "react";
import StaffingOverview from "./components/staffing/StaffingOverview";
import ScheduleForm from "./components/schedules/ScheduleForm";
import ScheduleQueue from "./components/schedules/ScheduleQueue";
import StaffingRequirementForm from "./components/staffing/StaffingRequirementForm";

function App() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f1f5f9",
        padding: "32px 16px",
      }}
    >
      <header
        style={{
          maxWidth: "1280px",
          margin: "0 auto 32px auto",
          background: "white",
          padding: "24px 32px",
          borderRadius: "12px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          border: "1px solid #e2e8f0",
        }}
      >
        <h1
          style={{
            fontSize: "22px",
            fontWeight: "bold",
            color: "#0f172a",
            margin: 0,
          }}
        >
          Workforce Management (WFM)
        </h1>
        <p style={{ fontSize: "13px", color: "#64748b", margin: "2px 0 0 0" }}>
          Forecasting & Scheduling Module — Admin Portal
        </p>
      </header>

      <main
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "380px 1fr",
          gap: "24px",
          alignItems: "start",
        }}
      >
        <div>
          <ScheduleForm onScheduleSaved={handleRefresh} />
          <StaffingRequirementForm onRequirementSaved={handleRefresh} />
        </div>
        <div>
          <StaffingOverview key={refreshKey} />
          <ScheduleQueue
            key={`queue-${refreshKey}`}
            onScheduleChanged={handleRefresh}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
