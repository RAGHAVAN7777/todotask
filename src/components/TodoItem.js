import React, { useState } from "react";

const PRIORITY_COLORS = {
  High: "#FF6B6B",
  Medium: "#FFA94D",
  Low: "#4DABF7",
};

export default function TodoItem({ todo, toggleComplete, deleteTodo, editTodo, provided, snapshot }) {
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [editPriority, setEditPriority] = useState(todo.priority);
  const [editDeadline, setEditDeadline] = useState(todo.deadline || "");

  const saveEdit = () => {
    if (editText.trim()) {
      editTodo(todo.id, { text: editText.trim(), priority: editPriority, deadline: editDeadline });
      setEditing(false);
    }
  };

  const isOverdue = todo.deadline && !todo.completed && new Date(todo.deadline) < new Date();

  return (
    <li
      className={`todo-item ${snapshot.isDragging ? "dragging" : ""}`}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      ref={provided.innerRef}
      style={{ ...provided.draggableProps.style }}
    >
      {editing ? (
        <div className="edit-container">
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
          />
          <select value={editPriority} onChange={(e) => setEditPriority(e.target.value)}>
            <option value="High">High 🔥</option>
            <option value="Medium">Medium ⚡</option>
            <option value="Low">Low 🗒️</option>
          </select>
          <input
            type="date"
            value={editDeadline}
            onChange={(e) => setEditDeadline(e.target.value)}
          />
          <button onClick={saveEdit}>Save</button>
          <button onClick={() => setEditing(false)}>Cancel</button>
        </div>
      ) : (
        <>
          <span
            className={`task-text ${todo.completed ? "completed" : ""} ${
              isOverdue ? "overdue" : ""
            }`}
            onClick={() => toggleComplete(todo.id)}
            tabIndex={0}
            role="button"
            aria-pressed={todo.completed}
            onKeyDown={(e) => {
              if (e.key === "Enter") toggleComplete(todo.id);
            }}
          >
            {todo.text}
          </span>
          <div className="task-meta">
            <span
              className="priority"
              title={`Priority: ${todo.priority}`}
              style={{ backgroundColor: PRIORITY_COLORS[todo.priority] }}
            >
              {todo.priority}
            </span>
            {todo.deadline && (
              <span className="deadline">{todo.deadline ? new Date(todo.deadline).toLocaleDateString() : "No deadline"}</span>

            )}
            <button onClick={() => setEditing(true)} aria-label="Edit task">
              ✏️
            </button>
            <button onClick={() => deleteTodo(todo.id)} aria-label="Delete task">
              ❌
            </button>
          </div>
        </>
      )}
    </li>
  );
}
