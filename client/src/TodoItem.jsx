import React from "react";

const TodoItem = ({ todo }) => {
    return (
      <li className="flex justify-between items-center mb-2">
        <div>
          <strong>{todo.title}</strong> - {todo.completed ? 'Completed' : 'Pending'}
          <br />
        </div>
        <div>
          <button >
            Edit
          </button>
          <button >
            Delete
          </button>
        </div>
      </li>
    );
  };

  export default TodoItem;