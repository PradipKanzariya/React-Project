import { create } from 'zustand';
import axios from 'axios';

const baseUrl = 'https://jsonplaceholder.typicode.com/todos';

interface Todo {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

interface TodoStore {
  todos: Todo[];
  loading: { status: boolean; message: string }; // Loading state variable with message
  fetchTodos: () => Promise<void>;
  addTodo: (todo: Todo) => Promise<void>;
  deleteTodo: (id: number) => Promise<void>;
  updateTodo: (id: number, updatedTodo: Partial<Todo>) => Promise<void>;
}

const useTodoStore = create<TodoStore>((set) => ({
  todos: [],
  loading: { status: false, message: '' }, // Initial loading state with empty message
  fetchTodos: async () => {
    try {
      set({ loading: { status: true, message: 'Fetching todos...' } }); // Set loading to true with message
      const allTodosResponse = await axios.get<Todo[]>(baseUrl); // Fetch all todos

      const allTodos = allTodosResponse.data;

      const randomTodos = getRandomItemsFromArray(allTodos, 5); // Get random five todos

      set({ todos: randomTodos });
    } catch (error) {
      console.error('Error fetching todos:', error);
    } finally {
      set({ loading: { status: false, message: '' } }); // Set loading to false and clear message
    }
  },
  addTodo: async (todo) => {
    try {
      set({ loading: { status: true, message: 'Adding todo...' } }); // Set loading to true with message
      const response = await axios.post<Todo>(baseUrl, todo);
      set((state) => ({
        todos: [...state.todos, { ...response.data, id: state.todos.length + 1 }]
      }));
    } catch (error) {
      console.error('Error adding todo:', error);
    } finally {
      set({ loading: { status: false, message: '' } }); // Set loading to false and clear message
    }
  },
  deleteTodo: async (id) => {
    try {
      set({ loading: { status: true, message: 'Deleting todo...' } }); // Set loading to true with message
      await axios.delete(`${baseUrl}/${id}`);
      set((state) => ({
        todos: state.todos.filter((todo) => todo.id !== id),
      }));
    } catch (error) {
      console.error('Error deleting todo:', error);
    } finally {
      set({ loading: { status: false, message: '' } }); // Set loading to false and clear message
    }
  },
  updateTodo: async (id, updatedTodo) => {
    try {
      set({ loading: { status: true, message: 'Updating todo...' } }); // Set loading to true with message
      const response = await axios.put<Todo>(`${baseUrl}/${id}`, updatedTodo);
      set((state) => ({
        todos: state.todos.map((todo) => (todo.id === id ? response.data : todo)),
      }));
    } catch (error) {
      console.error('Error updating todo:', error);
    } finally {
      set({ loading: { status: false, message: '' } }); // Set loading to false and clear message
    }
  },
}));

// Function to get random items from an array
function getRandomItemsFromArray<T>(array: T[], count: number): T[] {
  const shuffled = array.slice().sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

export default useTodoStore;
