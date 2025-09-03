import React, { useState } from "react";

export default function TodoForm({ addTodo }) {
  const [text, setText] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [deadline, setDeadline] = useState("");

  const handleSubmit = e => {
    e.preventDefault();
    if (!text.trim()) return;

    addTodo({
      id: Date.now(),
      text: text.trim(),
      priority,
      deadline: deadline || null,
      completed: false,
    });
    setText("");
    setDeadline("");
    setPriority("Medium");
  };

  return (
    <form onSubmit={handleSubmit} className="todo-form" aria-label="Add new task form">
      <input
        type="text"
        placeholder="Add a new task..."
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <select
        value={priority}
        onChange={e => setPriority(e.target.value)}
        aria-label="Select priority"
      >
        <option value="High">High 🔥</option>
        <option value="Medium">Medium ⚡</option>
        <option value="Low">Low 🗒️</option>
      </select>
      <input
        type="date"
        value={deadline}
        onChange={e => setDeadline(e.target.value)}
        aria-label="Select deadline"
      />
      <button type="submit">Add</button>
    </form>
  );
}
