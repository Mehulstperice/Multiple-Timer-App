import React, { useContext } from "react";
import { TimerContext } from "../App";

export default function HistoryScreen() {
  const { state } = useContext(TimerContext);

 
  const exportHistory = () => {
    const blob = new Blob([JSON.stringify(state.history, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "timer-history.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container">
      <h2>📜 History</h2>
      <button className="export-btn" onClick={exportHistory}>
        Export History as JSON
      </button>
      {state.history.length === 0 ? (
        <p>No completed timers yet.</p>
      ) : (
        state.history.map((item, i) => (
          <div key={i} className="history-item">
            <strong>{item.name}</strong> completed at {item.completedAt}
          </div>
        ))
      )}
    </div>
  );
}
