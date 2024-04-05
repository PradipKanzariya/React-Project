import React, { useEffect, useState } from 'react';
import useTodoStore from '../store/todoStore';

const TodoList: React.FC = () => {
  const { todos, fetchTodos, deleteTodo, updateTodo, addTodo } = useTodoStore();
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [editedTodoTitle, setEditedTodoTitle] = useState<string>('');
  const [loadingEdit, setLoadingEdit] = useState<{ [key: number]: boolean }>({});
  const [loadingDelete, setLoadingDelete] = useState<{ [key: number]: boolean }>({});
  const [loadingAdd, setLoadingAdd] = useState<boolean>(false);
  const [serialNumber, setSerialNumber] = useState<number>(1);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const handleAdd = async (title: string) => {
    setLoadingAdd(true);
    await addTodo({ title, completed: false });
    setLoadingAdd(false);
  };

  const handleDelete = async (id: number) => {
    setLoadingDelete({ ...loadingDelete, [id]: true });
    await deleteTodo(id);
    setLoadingDelete({ ...loadingDelete, [id]: false });
  };

  const handleEdit = (id: number, title: string) => {
    setEditingTodoId(id);
    setEditedTodoTitle(title);
  };

  const handleSaveEdit = async (id: number) => {
    setLoadingEdit({ ...loadingEdit, [id]: true });
    await updateTodo(id, { title: editedTodoTitle });
    setEditingTodoId(null);
    setLoadingEdit({ ...loadingEdit, [id]: false });
  };

  if (todos.length === 0) {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-4 underline">TODO's:</h2>
        <p>No todos found. Add some todos to get started!</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4 underline">TODO's:</h2>
      <ul>
        {todos.map((todo, index) => (
          <li key={todo.id} className="flex items-center justify-between border-b py-2">
            <div>
              <span><b>{`${serialNumber + index}. `}</b></span>
              {editingTodoId === todo.id ? (
                <input
                  type="text"
                  value={editedTodoTitle}
                  onChange={(e) => setEditedTodoTitle(e.target.value)}
                  className="border rounded px-2 py-1 mr-2"
                />
              ) : (
                <span>{todo.title}</span>
              )}
            </div>
            <div>
              {editingTodoId === todo.id ? (
                <button
                  onClick={() => handleSaveEdit(todo.id)}
                  className="bg-green-500 text-white rounded-md px-4 py-1 mr-2"
                  disabled={loadingEdit[todo.id]}
                >
                  {loadingEdit[todo.id] ? 'Saving...' : 'Save'}
                </button>
              ) : (
                <button
                  onClick={() => handleEdit(todo.id, todo.title)}
                  className="bg-blue-500 text-white rounded-md px-4 py-1 mr-2"
                  disabled={loadingEdit[todo.id] || loadingDelete[todo.id] || loadingAdd}
                >
                  {loadingEdit[todo.id] ? 'Editing...' : 'Edit'}
                </button>
              )}
              <button
                onClick={() => handleDelete(todo.id)}
                className="bg-red-500 text-white rounded-md px-4 py-1"
                disabled={loadingEdit[todo.id] || loadingDelete[todo.id] || loadingAdd}
              >
                {loadingDelete[todo.id] ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
