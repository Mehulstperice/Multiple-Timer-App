import React, { useState, useContext, useEffect } from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { TimerContext } from "../App";
import { toast } from "react-toastify";

export default function TimerModal({ timer, onClose, onStart, onPause, onReset }) {
  const { state, dispatch } = useContext(TimerContext);

  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState(timer.name);
  const [editCategory, setEditCategory] = useState(timer.category);

  // Split duration into hours/minutes/seconds
  const [editHours, setEditHours] = useState(0);
  const [editMinutes, setEditMinutes] = useState(0);
  const [editSeconds, setEditSeconds] = useState(0);

  // When entering edit mode, populate fields
  useEffect(() => {
    if (editing) {
      const total = timer.duration;
      const h = Math.floor(total / 3600);
      const m = Math.floor((total % 3600) / 60);
      const s = total % 60;
      setEditHours(h);
      setEditMinutes(m);
      setEditSeconds(s);
      setEditName(timer.name);
      setEditCategory(timer.category);
    }
  }, [editing, timer]);

  if (!timer) return null;

  const percentage = ((timer.duration - timer.remaining) / timer.duration) * 100;
  const minutes = Math.floor(timer.remaining / 60);
  const seconds = timer.remaining % 60;
  const displayTime = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  const handleSave = () => {
    const totalSeconds = editHours * 3600 + editMinutes * 60 + editSeconds;
    if (totalSeconds <= 0) {
      toast.error("⚠️ Duration must be greater than 0");
      return;
    }
    const updatedTimers = state.timers.map((t) =>
      t.id === timer.id
        ? {
            ...t,
            name: editName,
            category: editCategory,
            duration: totalSeconds,
            remaining: totalSeconds,
            status: "Paused",
          }
        : t
    );
    dispatch({ type: "SET_TIMERS", payload: updatedTimers });
    toast.success("✅ Timer updated!");
    setEditing(false);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>✖</button>

        {!editing ? (
          <>
            <h2>{timer.name}</h2>
            <div className="circular-container">
              <CircularProgressbar
                value={percentage}
                text={displayTime}
                styles={buildStyles({
                  textColor: "#fff",
                  pathColor: "#bb86fc",
                  trailColor: "rgba(255,255,255,0.2)",
                })}
              />
              <p>{timer.remaining}s left of {timer.duration}s</p>
            </div>
            <div className="modal-controls">
              <button onClick={() => onStart(timer.id)}>▶️</button>
              <button onClick={() => onPause(timer.id)}>⏸</button>
              <button onClick={() => onReset(timer.id)}>🔄</button>
              <button onClick={() => setEditing(true)}>✏️</button>
            </div>
          </>
        ) : (
          <>
            <h2>Edit Timer</h2>
            <input
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              placeholder="Name"
              className="modal-input"
            />

            <div className="duration-inputs">
              <div className="duration-group">
                <label>Hours</label>
                <input
                  type="number"
                  min="0"
                  value={editHours}
                  onChange={(e) => setEditHours(parseInt(e.target.value) || 0)}
                />
              </div>
              <div className="duration-group">
                <label>Minutes</label>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={editMinutes}
                  onChange={(e) => setEditMinutes(parseInt(e.target.value) || 0)}
                />
              </div>
              <div className="duration-group">
                <label>Seconds</label>
                <input
                  type="number"
                  min="0"
                  max="59"
                  value={editSeconds}
                  onChange={(e) => setEditSeconds(parseInt(e.target.value) || 0)}
                />
              </div>
            </div>

            <input
              value={editCategory}
              onChange={(e) => setEditCategory(e.target.value)}
              placeholder="Category"
              className="modal-input"
            />
            <div className="modal-controls">
              <button onClick={handleSave}>💾</button>
              <button onClick={() => setEditing(false)}>❌</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
