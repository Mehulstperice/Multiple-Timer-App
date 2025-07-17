import React, { useState } from "react";
import TimerCard from "./TimerCard";

export default function CategorySection({
  category,
  timers,
  onSelectTimer,
  onDeleteTimer,
  onDeleteCategory,
  onStartAll,
  onPauseAll,
  onResetAll
}) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="category-section">
      <div className="category-header">
        <span onClick={() => setExpanded(!expanded)}>
          {expanded ? "▼" : "▶"} {category}
        </span>
        <button
          className="delete-category-btn"
          onClick={(e) => {
            e.stopPropagation();
            onDeleteCategory(category);
          }}
        >
          Delete
        </button>
      </div>

      <div className="bulk-actions">
        <button onClick={() => onStartAll(category)}>Start All</button>
        <button onClick={() => onPauseAll(category)}>Pause All</button>
        <button onClick={() => onResetAll(category)}>Reset All</button>
      </div>

      {expanded &&
        timers.map((timer) => (
          <TimerCard
            key={timer.id}
            timer={timer}
            onSelect={onSelectTimer}
            onDelete={() => onDeleteTimer(timer.id)}
          />
        ))}
    </div>
  );
}
