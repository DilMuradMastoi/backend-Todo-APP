import { useEffect, useState } from "react";
import axios from "axios";

function Todo({ user }) {
// const API = "https://todo-app-with-backend-git-main-dil-murad-s-projects.vercel.app/"

  const userId = user.userId;

  const [input, setInput] = useState("");
  const [todos, setTodos] = useState([]);
  const [editId, setEditId] = useState(null);

  // Get Todos
  const getTodos = async () => {
    try {
      const res = await axios.get(API, {
        params: {
          userId,
        },
      });

      setTodos(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getTodos();
  }, []);

  // Add / Update Todo
  const handleSubmit = async () => {
    if (!input.trim()) return;

    try {
      if (editId) {
        await axios.put(`${API}/${editId}`, {
          text: input,
          userId,
        });

        setEditId(null);
      } else {
        await axios.post(API, {
          text: input,
          userId,
        });
      }

      setInput("");
      getTodos();
    } catch (err) {
      console.log(err);
    }
  };

  // Edit Todo
  const handleEdit = (todo) => {
    setInput(todo.text);
    setEditId(todo.id);
  };

  // Delete Todo
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API}/${id}`, {
        data: {
          userId,
        },
      });

      getTodos();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div
      style={{
        width: "700px",
        margin: "50px auto",
        fontFamily: "Arial",
      }}
    >
      <h1>Todo App</h1>

      <h3>Logged in as User: {user.userId}</h3>

      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "20px",
        }}
      >
        <input
          type="text"
          placeholder="Enter Todo..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={{
            flex: 1,
            padding: "12px",
            fontSize: "18px",
          }}
        />

        <button onClick={handleSubmit}>
          {editId ? "Update" : "Add"}
        </button>
      </div>

      {todos.length === 0 && <h2>No Todos Found</h2>}

      {todos.map((todo) => (
        <div
          key={todo.id}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "12px",
            border: "1px solid #ccc",
            borderRadius: "10px",
            marginBottom: "10px",
          }}
        >
          <h2>{todo.text}</h2>

          <div>
            <button
              onClick={() => handleEdit(todo)}
              style={{
                background: "orange",
                color: "#fff",
                marginRight: "10px",
              }}
            >
              Edit
            </button>

            <button
              onClick={() => handleDelete(todo.id)}
              style={{
                background: "red",
                color: "#fff",
              }}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Todo;