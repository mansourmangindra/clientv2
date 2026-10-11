import { useState } from "react";
import StaffingOverview from "./components/staffing/StaffingOverview";
import ScheduleForm from "./components/schedules/ScheduleForm";
import ScheduleQueue from "./components/schedules/ScheduleQueue";

function App() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleScheduleSaved = () => {
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
      {/* Header Container */}
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
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              background: "#2563eb",
              color: "white",
              padding: "8px 12px",
              borderRadius: "8px",
              fontWeight: "bold",
              fontSize: "14px",
            }}
          >
            WFM
          </div>
          <div>
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
            <p
              style={{
                fontSize: "13px",
                color: "#64748b",
                margin: "2px 0 0 0",
              }}
            >
              Forecasting & Scheduling Module — Admin Portal
            </p>
          </div>
        </div>
      </header>

      {/* Main Dashboard Grid */}
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
        {/* Left Column: Form */}
        <div>
          <ScheduleForm onScheduleSaved={handleScheduleSaved} />
        </div>

        {/* Right Column: Table Overview & Active Queue */}
        <div>
          <StaffingOverview key={refreshKey} />
          <ScheduleQueue
            key={`queue-${refreshKey}`}
            onScheduleChanged={handleScheduleSaved}
          />
        </div>
      </main>
    </div>
  );
}

export default App;
