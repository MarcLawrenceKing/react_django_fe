import { useState, useEffect } from 'react';

interface Task {
  id: number;
  title: string;
  completed: boolean;
}

const API_URL = 'http://127.0.0.1:8000/api/tasks/';

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [text, setText] = useState('');

  // --- READ (GET) ---
  const getTasks = async () => {
    const response = await fetch(API_URL);
    const data = await response.json();
    setTasks(data);
  };

  // --- CREATE (POST) ---
  const addTask = async () => {
    if (!text) return;
    await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: text, completed: false }),
    });
    setText('');
    getTasks(); // Refresh list
  };

  // --- UPDATE (PATCH) ---
  // We use PATCH to only update the 'completed' status without sending the whole object
  const toggleComplete = async (task: Task) => {
    await fetch(`${API_URL}${task.id}/`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !task.completed }),
    });
    getTasks();
  };

  // --- DELETE (DELETE) ---
  const deleteTask = async (id: number) => {
    await fetch(`${API_URL}${id}/`, {
      method: 'DELETE',
    });
    getTasks();
  };

  useEffect(() => { getTasks(); }, []);

  return (
    <div style={{ padding: '40px' }}>
      <h1>My To-Do List</h1>
      <input value={text} onChange={(e) => setText(e.target.value)} />
      <button onClick={addTask}>Add Task</button>

      <ul>
        {tasks.map(task => (
          <li key={task.id} style={{ margin: '10px 0' }}>
            <span 
              onClick={() => toggleComplete(task)}
              style={{ 
                textDecoration: task.completed ? 'line-through' : 'none',
                cursor: 'pointer' 
              }}
            >
              {task.title}
            </span>
            <button onClick={() => deleteTask(task.id)} style={{ marginLeft: '10px' }}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;