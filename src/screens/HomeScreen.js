import React, { useContext, useEffect, useState } from "react";
import { TimerContext } from "../App";
import CategorySection from "../components/CategorySection";
import TimerModal from "../components/TimerModal";
import { toast } from "react-toastify";

function groupByCategory(timers) {
  const groups = {};
  timers.forEach((t) => {
    if (!groups[t.category]) groups[t.category] = [];
    groups[t.category].push(t);
  });
  return Object.entries(groups).map(([category, timers]) => ({
    category,
    timers,
  }));
}

export default function HomeScreen() {
  const { state, dispatch } = useContext(TimerContext);

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [category, setCategory] = useState("");
  const [selectedTimerId, setSelectedTimerId] = useState(null);
  const [halfwayAlerted, setHalfwayAlerted] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  // Timer ticking logic with halfway alert
  useEffect(() => {
    const interval = setInterval(() => {
      dispatch({
        type: "SET_TIMERS",
        payload: state.timers.map((t) => {
          if (t.status === "Running" && t.remaining > 0) {
            const updatedRemaining = t.remaining - 1;

            
            if (
              !halfwayAlerted[t.id] &&
              updatedRemaining === Math.floor(t.duration / 2)
            ) {
              toast.info(`⏳ Timer "${t.name}" is halfway done!`);
              setHalfwayAlerted((prev) => ({ ...prev, [t.id]: true }));
            }

            return { ...t, remaining: updatedRemaining };
          }
          if (t.status === "Running" && t.remaining === 0) {
            toast.success(`✅ Timer "${t.name}" completed!`);
            dispatch({
              type: "SET_HISTORY",
              payload: [
                ...state.history,
                { name: t.name, completedAt: new Date().toLocaleString() },
              ],
            });
            return { ...t, status: "Completed" };
          }
          return t;
        }),
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [state.timers, state.history, halfwayAlerted, dispatch]);

  const handleAddTimer = () => {
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
    if (!name || totalSeconds <= 0 || !category) {
      toast.error("⚠️ Please fill all fields correctly");
      return;
    }
    const newTimer = {
      id: Date.now().toString(),
      name,
      duration: totalSeconds,
      remaining: totalSeconds,
      category,
      status: "Paused",
    };
    dispatch({ type: "SET_TIMERS", payload: [...state.timers, newTimer] });
    toast.success("✅ Timer added!");
    setName("");
    setHours(0);
    setMinutes(0);
    setSeconds(0);
    setCategory("");
    setShowForm(false);
  };

  const deleteTimer = (id) => {
    dispatch({
      type: "SET_TIMERS",
      payload: state.timers.filter((t) => t.id !== id),
    });
    toast.info("🗑️ Timer deleted");
  };


  const deleteCategory = (cat) => {
    dispatch({
      type: "SET_TIMERS",
      payload: state.timers.filter((t) => t.category !== cat),
    });
    toast.info(`🗑️ Deleted all timers in "${cat}"`);
  };

  // Bulk actions
  const startAllInCategory = (cat) => {
    dispatch({
      type: "SET_TIMERS",
      payload: state.timers.map((t) =>
        t.category === cat ? { ...t, status: "Running" } : t
      ),
    });
    toast.info(`▶️ Started all timers in "${cat}"`);
  };
  const pauseAllInCategory = (cat) => {
    dispatch({
      type: "SET_TIMERS",
      payload: state.timers.map((t) =>
        t.category === cat ? { ...t, status: "Paused" } : t
      ),
    });
    toast.info(`⏸ Paused all timers in "${cat}"`);
  };
  const resetAllInCategory = (cat) => {
    dispatch({
      type: "SET_TIMERS",
      payload: state.timers.map((t) =>
        t.category === cat
          ? { ...t, status: "Paused", remaining: t.duration }
          : t
      ),
    });
    toast.info(`🔄 Reset all timers in "${cat}"`);
  };

  const filteredTimers = state.timers.filter((t) => {
    const term = searchTerm.toLowerCase();
    return (
      t.name.toLowerCase().includes(term) ||
      t.category.toLowerCase().includes(term)
    );
  });

  const grouped = groupByCategory(filteredTimers);
  const selectedTimer = state.timers.find((t) => t.id === selectedTimerId);

  return (
    <div className="container">
      <h2>⏱️ Timers</h2>

      {/* Actions bar with button on left and search bar on right */}
      <div className="actions-bar">
        <button className="add-timer-btn" onClick={() => setShowForm(true)}>
          ➕ Add Timer
        </button>
        <input
          className="search-bar"
          type="text"
          placeholder="🔍 Search by name or category..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {showForm && (
        <div className="form-card">
          <h3>Add New Timer</h3>
          <input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <div className="duration-inputs">
            <div className="duration-group">
              <label>Hours</label>
              <input
                type="number"
                min="0"
                value={hours}
                onChange={(e) => setHours(parseInt(e.target.value) || 0)}
              />
            </div>
            <div className="duration-group">
              <label>Minutes</label>
              <input
                type="number"
                min="0"
                max="59"
                value={minutes}
                onChange={(e) => setMinutes(parseInt(e.target.value) || 0)}
              />
            </div>
            <div className="duration-group">
              <label>Seconds</label>
              <input
                type="number"
                min="0"
                max="59"
                value={seconds}
                onChange={(e) => setSeconds(parseInt(e.target.value) || 0)}
              />
            </div>
          </div>
          <input
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
          <button onClick={handleAddTimer}>Save</button>
          <button onClick={() => setShowForm(false)}>Cancel</button>
        </div>
      )}

      <div style={{ marginTop: "20px" }}>
        {grouped.length === 0 ? (
          <p>No timers found. Add one or adjust your search.</p>
        ) : (
          grouped.map((group) => (
            <CategorySection
              key={group.category}
              category={group.category}
              timers={group.timers}
              onSelectTimer={(t) => setSelectedTimerId(t.id)}
              onDeleteTimer={deleteTimer}
              onDeleteCategory={deleteCategory}
              onStartAll={startAllInCategory}
              onPauseAll={pauseAllInCategory}
              onResetAll={resetAllInCategory}
            />
          ))
        )}
      </div>

      {selectedTimer && (
        <TimerModal
          timer={selectedTimer}
          onClose={() => setSelectedTimerId(null)}
          onStart={(id) =>
            dispatch({
              type: "SET_TIMERS",
              payload: state.timers.map((t) =>
                t.id === id ? { ...t, status: "Running" } : t
              ),
            })
          }
          onPause={(id) =>
            dispatch({
              type: "SET_TIMERS",
              payload: state.timers.map((t) =>
                t.id === id ? { ...t, status: "Paused" } : t
              ),
            })
          }
          onReset={(id) =>
            dispatch({
              type: "SET_TIMERS",
              payload: state.timers.map((t) =>
                t.id === id
                  ? { ...t, status: "Paused", remaining: t.duration }
                  : t
              ),
            })
          }
        />
      )}
    </div>
  );
}
