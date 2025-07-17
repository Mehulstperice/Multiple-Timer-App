
# ⏱️ Multi‑Timer Management App (React)

A web application to create, manage, and visualize multiple timers grouped by categories, with bulk actions, edit/delete, search, and live progress.

---

## 🚀 Features

✅ **Add Timers** with:

* Name
* Duration (Hours, Minutes, Seconds)
* Category

✅ **Manage Timers**:

* Start / Pause / Reset individual timers
* Bulk Start / Pause / Reset per category
* Delete individual timers or entire categories
* Edit name, duration, category

✅ **Grouping**:

* Timers are grouped by category
* Expand/collapse categories

✅ **Search & Filter**:

* Search by timer name or category

✅ **Live Progress**:

* Progress bar in cards
* Circular live progress in a modal

✅ **Alerts & Notifications**:

* Toast notification when timer reaches 50% duration
* Toast notification on completion

✅ **Theme**:

* Light/Dark theme switch

✅ **History**:

* Log of completed timers on History screen

✅ **Persistence**:

* Data saved in `localStorage` so timers persist between page reloads

---

## 📂 Project Structure

```
src/
 ├── App.js                 // Context, Reducer, Persistence
 ├── styles.css             // Global styling
 ├── screens/
 │    ├── HomeScreen.js     // Main page: add/search/timers
 │    └── HistoryScreen.js  // Completed timers log
 ├── components/
 │    ├── CategorySection.js// Category group UI & bulk actions
 │    ├── TimerCard.js      // Timer card with progress/edit/delete
 │    └── TimerModal.js     // Modal with circular progress
```

---

## 🏗️ High‑Level Architecture

* **React** with `useReducer` for state management.
* **Context API** (`TimerContext`) to share timers/history/actions.
* **React Router** for navigation between Home and History.
* **Local Storage** for persistence.
* **React‑Toastify** for non‑blocking notifications.

---

## 🔧 Low‑Level Implementation Details

### Data Structure

```js
{
  id: "unique_id",
  name: "Workout Timer",
  duration: 3600, // total seconds
  remaining: 1800,
  category: "Workout",
  status: "Paused" // Running | Paused | Completed
}
```

### Reducer Actions

* `LOAD_DATA`: Load timers/history from storage
* `SET_TIMERS`: Update timers list
* `SET_HISTORY`: Update history list

### Timer Ticking

* `setInterval` (1 second):

  * Decrement `remaining` for all running timers
  * If `remaining === duration/2`: show halfway toast
  * If `remaining === 0`: mark complete, add to history

### UI Components

* **HomeScreen**: add/search, renders `CategorySection`
* **CategorySection**: expand/collapse, bulk actions, delete category
* **TimerCard**: shows timer info, progress, edit/delete buttons
* **TimerModal**: shows circular progress, start/pause/reset

### Styling

* `styles.css` for:

  * `.actions-bar`: Add Timer left, Search right
  * Responsive layouts
  * Hover effects & transitions
  * Dark/Light theme classes

---

## 📦 Installation & Setup

1. **Clone this repo:**

```bash
git clone https://github.com/yourusername/multi-timer-app.git
cd multi-timer-app
```

2. **Install dependencies:**

```bash
npm install
```

3. **Run development server:**

```bash
npm start
```

Your app will run at [http://localhost:3000](http://localhost:3000).

---

## 🛠️ Built With

* [React](https://reactjs.org/)
* [React Router](https://reactrouter.com/)
* [React Toastify](https://fkhadra.github.io/react-toastify/)
* CSS (no heavy frameworks)

---





https://github.com/user-attachments/assets/b30c5d4a-65d7-4fa8-9f2d-b45aded67951



