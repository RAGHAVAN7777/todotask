import React from "react";
import TodoItem from "./TodoItem";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

export default function TodoList({ todos, toggleComplete, deleteTodo, editTodo, reorderTodos }) {
  const onDragEnd = (result) => {
    if (!result.destination) return;

    reorderTodos(result.source.index, result.destination.index);
  };

  if (todos.length === 0) {
    return <p className="empty-tasks">No tasks to show 🎉</p>;
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="todos">
        {(provided) => (
          <ul
            className="todo-list"
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {todos.map((todo, index) => (
              <Draggable key={todo.id} draggableId={todo.id.toString()} index={index}>
                {(provided, snapshot) => (
                  <TodoItem
                    todo={todo}
                    toggleComplete={toggleComplete}
                    deleteTodo={deleteTodo}
                    editTodo={editTodo}
                    provided={provided}
                    snapshot={snapshot}
                  />
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </ul>
        )}
      </Droppable>
    </DragDropContext>
  );
}
