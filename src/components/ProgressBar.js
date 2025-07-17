import React from "react";

export default function ProgressBar({ progress }) {
  const clamped = Math.max(0, Math.min(progress, 1));
  return (
    <div className="progress-container">
      <div
        className="progress-bar"
        style={{ width: `${clamped * 100}%` }}
      ></div>
    </div>
  );
}
