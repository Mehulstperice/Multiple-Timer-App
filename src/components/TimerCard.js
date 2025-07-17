import React from "react";
import ProgressBar from "./ProgressBar";

export default function TimerCard({ timer, onSelect, onDelete }) {
  const handleClick = () => {
    if (onSelect) onSelect(timer);
  };

  return (
    <div className="timer-card">
      <div className="timer-info" onClick={handleClick}>
        <strong>{timer.name}</strong>
        <div>Status: {timer.status}</div>
        <div>Remaining: {timer.remaining}s</div>
        <ProgressBar progress={timer.remaining / timer.duration} />
        <small>(Click for details)</small>
      </div>
      <button
        className="delete-timer-btn"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
      >
        Delete
      </button>
    </div>
  );
}
