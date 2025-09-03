import React, { useState, useEffect } from "react";
import "./App.css";
import TodoForm from "./components/TodoForm";
import TodoList from "./components/TodoList";

function useClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  return time.toLocaleTimeString();
}

export default function App() {
  const [showApp, setShowApp] = useState(false);
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem("todos");
    return saved ? JSON.parse(saved) : [];
  });
  const [filter, setFilter] = useState("all");
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => setDarkMode(d => !d);

  const clockStr = useClock();

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = todo => setTodos([...todos, todo]);

  const toggleComplete = id => {
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = id => setTodos(todos.filter(todo => todo.id !== id));

  const editTodo = (id, updatedTodo) => {
    setTodos(todos.map(todo => (todo.id === id ? { ...todo, ...updatedTodo } : todo)));
  };

  // Categorize task based on deadline and status
  const categorizeTasks = () => {
    const now = new Date();
    return {
      completed: todos.filter(t => t.completed),
      dueToday: todos.filter(t => {
        if (t.completed) return false;
        if (!t.deadline) return false;
        const deadlineDate = new Date(t.deadline);
        return (deadlineDate.toDateString() === now.toDateString());
      }),
      upcoming: todos.filter(t => {
        if (t.completed) return false;
        if (!t.deadline) return true; // no deadline = upcoming
        const deadlineDate = new Date(t.deadline);
        return deadlineDate > now;
      }),
      noDeadline: todos.filter(t => !t.deadline && !t.completed)
    };
  };

  const { completed, dueToday, upcoming, noDeadline } = categorizeTasks();

  if (!showApp) {
    // Landing page
    return (
      <div className="landing-page">
        <div className="landing-box">
          <h1>Welcome to Raghavan's Task Manager</h1>
          <p className="landing-author">Created by Raghavan</p>
          <button className="enter-btn" onClick={() => setShowApp(true)}>Enter App</button>
        </div>
      </div>
    );
  }

  // Task page
  return (
    <div className={darkMode ? "app dark" : "app"}>
      {/* Clock */}
      <div className="clock-container">
        <span className="clock">{clockStr}</span>
      </div>

      <header>
        <h1>📝 Raghavan's Advanced To-Do App</h1>
        <button aria-label="Toggle Dark Mode" onClick={toggleDarkMode} className="dark-toggle">
          {darkMode ? "Light Mode ☀️" : "Dark Mode 🌙"}
        </button>
      </header>

      <section className="welcome">
        <p>Manage your tasks with deadlines and status, and keep track of time.</p>
      </section>

      <div className="task-adder-container">
        <TodoForm addTodo={addTodo} />
      </div>

      <section className="filters">
        <button onClick={() => setFilter("all")} className={filter === "all" ? "active" : ""}>
          All ({todos.length})
        </button>
        <button onClick={() => setFilter("pending")} className={filter === "pending" ? "active" : ""}>
          Pending ({todos.filter(t => !t.completed).length})
        </button>
        <button onClick={() => setFilter("completed")} className={filter === "completed" ? "active" : ""}>
          Completed ({todos.filter(t => t.completed).length})
        </button>
      </section>

      <div className="categorized-lists">
        <h3>Due Today</h3>
        {dueToday.length ? (
          <TodoList todos={dueToday} toggleComplete={toggleComplete} deleteTodo={deleteTodo} editTodo={editTodo} />
        ) : (<p>No tasks due today!</p>)}

        <h3>Upcoming Tasks</h3>
        {upcoming.length ? (
          <TodoList todos={upcoming} toggleComplete={toggleComplete} deleteTodo={deleteTodo} editTodo={editTodo} />
        ) : (<p>No upcoming tasks!</p>)}

        <h3>Tasks without Deadline</h3>
        {noDeadline.length ? (
          <TodoList todos={noDeadline} toggleComplete={toggleComplete} deleteTodo={deleteTodo} editTodo={editTodo} />
        ) : (<p>All tasks have deadlines!</p>)}

        <h3>Completed Tasks</h3>
        {completed.length ? (
          <TodoList todos={completed} toggleComplete={toggleComplete} deleteTodo={deleteTodo} editTodo={editTodo} />
        ) : (<p>No completed tasks yet.</p>)}
      </div>

      <footer>
        Created by Raghavan | <a href="https://github.com/your-github" target="_blank" rel="noreferrer">GitHub</a>
      </footer>
    </div>
  );
}
