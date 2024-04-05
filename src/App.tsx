import React from 'react';
import TodoList from './components/TodoList';
import TodoForm from './components/TodoForm';

function App() {
  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4 text-center underline">MY TODO APP</h1>
      <TodoForm />
      <TodoList />
    </div>
  );
}

export default App;
