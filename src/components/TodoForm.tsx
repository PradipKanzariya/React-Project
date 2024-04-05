import React, { useState } from 'react';
import useTodoStore from '../store/todoStore';

const TodoForm: React.FC = () => {
  const [title, setTitle] = useState('');
  const { addTodo, loading } = useTodoStore();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!title.trim()) return;
    addTodo({ title, completed: false });
    setTitle('');
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 text-center">
      <input
        type="text"
        id="todoTitle"
        placeholder="Add Todo"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={loading.status} // Disable input when loading
        className="border border-gray-300 rounded-md px-4 py-2 mr-2"
      />
      <button type="submit" className="bg-blue-500 text-white rounded-md px-4 py-2" disabled={loading.status}>
        {loading.status ? 'Adding...' : 'Add'} {/* Display loading message */}
      </button>
      {loading.status && <p>{loading.message}</p>} {/* Display loading message */}
    </form>
  );
};

export default TodoForm;
