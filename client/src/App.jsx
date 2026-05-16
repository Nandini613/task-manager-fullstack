import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  const API_URL = "http://localhost:5000/api/tasks";

  const fetchTasks = async () => {
    const res = await axios.get(API_URL);
    setTasks(res.data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async () => {
    if (!title) return;

    await axios.post(API_URL, {
      title,
    });

    setTitle("");
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    fetchTasks();
  };

  const toggleComplete = async (task) => {
    await axios.put(`${API_URL}/${task._id}`, {
      completed: !task.completed,
    });

    fetchTasks();
  };

  return (
    <div className="container">
      <h1>Task Manager</h1>

      <div className="input-section">
        <input
          type="text"
          placeholder="Enter task"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <button onClick={addTask}>Add</button>
      </div>

      {tasks.map((task) => (
        <div className="task" key={task._id}>
          <span
            onClick={() => toggleComplete(task)}
            style={{
              textDecoration: task.completed
                ? "line-through"
                : "none",
              cursor: "pointer",
            }}
          >
            {task.title}
          </span>

          <button onClick={() => deleteTask(task._id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default App;