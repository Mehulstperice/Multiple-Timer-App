
import React, { useEffect, useReducer, createContext, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import HomeScreen from "./screens/HomeScreen";
import HistoryScreen from "./screens/HistoryScreen";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css"; 

export const TimerContext = createContext();

const initialState = {
  timers: [],
  history: [],
  loading: true,
};

function reducer(state, action) {
  switch (action.type) {
    case "LOAD_DATA":
      return {
        ...state,
        timers: action.payload.timers,
        history: action.payload.history,
        loading: false,
      };
    case "SET_TIMERS":
      return { ...state, timers: action.payload };
    case "SET_HISTORY":
      return { ...state, history: action.payload };
    default:
      return state;
  }
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const timersData = JSON.parse(localStorage.getItem("timers") || "[]");
    const historyData = JSON.parse(localStorage.getItem("history") || "[]");
    dispatch({ type: "LOAD_DATA", payload: { timers: timersData, history: historyData } });
  }, []);

  useEffect(() => {
    if (!state.loading) localStorage.setItem("timers", JSON.stringify(state.timers));
  }, [state.timers, state.loading]);

  useEffect(() => {
    if (!state.loading) localStorage.setItem("history", JSON.stringify(state.history));
  }, [state.history, state.loading]);

  const updateTimer = (id, changes) => {
    const updated = state.timers.map((t) => (t.id === id ? { ...t, ...changes } : t));
    dispatch({ type: "SET_TIMERS", payload: updated });
  };

  const startTimer = (id) => updateTimer(id, { status: "Running" });
  const pauseTimer = (id) => updateTimer(id, { status: "Paused" });
  const resetTimer = (id) => {
    const t = state.timers.find((x) => x.id === id);
    if (t) updateTimer(id, { status: "Paused", remaining: t.duration });
  };

  const startAllInCategory = (cat) =>
    dispatch({ type: "SET_TIMERS", payload: state.timers.map((t) => (t.category === cat ? { ...t, status: "Running" } : t)) });

  const pauseAllInCategory = (cat) =>
    dispatch({ type: "SET_TIMERS", payload: state.timers.map((t) => (t.category === cat ? { ...t, status: "Paused" } : t)) });

  const resetAllInCategory = (cat) =>
    dispatch({
      type: "SET_TIMERS",
      payload: state.timers.map((t) =>
        t.category === cat ? { ...t, status: "Paused", remaining: t.duration } : t
      ),
    });

  if (state.loading) return <div style={{ padding: 20 }}>Loading...</div>;

  return (
    <div className={theme === "light" ? "theme-light" : "theme-dark"}>
      <TimerContext.Provider
        value={{
          state,
          dispatch,
          startTimer,
          pauseTimer,
          resetTimer,
          startAllInCategory,
          pauseAllInCategory,
          resetAllInCategory,
        }}
      >
        <Router>
          <nav>
            <Link to="/">Home</Link>
            <Link to="/history">History</Link>
            <button className="theme-btn" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
               {theme === "light" ? "Dark" : "Light"} Theme
            </button>
          </nav>
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/history" element={<HistoryScreen />} />
          </Routes>
        </Router>
      </TimerContext.Provider>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
