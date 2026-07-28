import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { auth } from "../firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

import "../styles/Home.css";
import home from "../assets/home.png";

const API = import.meta.env.VITE_API_URL;


function Home() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [search, setSearch] = useState("");

  // ===========================
  // Check Login
  // ===========================

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        navigate("/login");
        return;
      }

      setUser(currentUser);
    });

    return unsubscribe;
  }, [navigate]);

  // ===========================
  // Load Todos
  // ===========================
const getTodos = async () => {
  if (!user) return;

  try {
    const res = await axios.get(`${API}/todos/${user.uid}`);
    setTodos(res.data.todos || []);
  } catch (err) {
    console.log("API =", API);
    console.error(err);
    setTodos([]);
  }
};

useEffect(() => {
  if (user) {
    getTodos();
  }
}, [user]);



  // ===========================
  // Add Todo
  // ===========================

const addTodo = async () => {
  if (!todo.trim()) return;

  try {
    await axios.post(`${API}/todos`, {
      uid: user.uid,
      text: todo,
    });

    setTodo("");
    getTodos();
  } catch (err) {
    console.error(err);
  }
};
  // ===========================
  // Delete Todo
  // ===========================

const deleteTodo = async (id) => {
  try {
    await axios.delete(`${API}/todos/${id}`);
    getTodos();
  } catch (err) {
    console.error(err);
  }
};

  // ===========================
  // Edit Todo
  // ===========================

const editTodo = async (item) => {
  const newText = prompt("Edit Todo", item.text);

  if (!newText) return;

  try {
    await axios.put(`${API}/todos/${item.id}`, {
      text: newText,
      completed: item.completed,
    });

    getTodos();
  } catch (err) {
    console.error(err);
  }
};

  // ===========================
  // Complete Todo
  // ===========================

 const toggleComplete = async (item) => {
  try {
    await axios.put(`${API}/todos/${item.id}`, {
      text: item.text,
      completed: !item.completed,
    });

    getTodos();
  } catch (err) {
    console.error(err);
  }
};

  // ===========================
  // Logout
  // ===========================

  const logout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  // ===========================
  // Search
  // ===========================

  
  const filteredTodos = useMemo(() => {

  if (!Array.isArray(todos)) {
    return [];
  }

  return todos.filter((item) =>
    (item.text || item.title || "")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

}, [todos, search]);
  // ===========================
  // Statistics
  // ===========================

const todoList = Array.isArray(todos)
  ? todos
  : [];

const totalTodos = todoList.length;

const completedTodos = todoList.filter(
  (item) => item.completed
).length;

const pendingTodos = totalTodos - completedTodos;

  
  return (
    <div className="home-page">

      {/* ================= HERO ================= */}

      <section className="hero">

        <div className="hero-content hero-bg">

         Authentication and Express API.
      
<p className="hero-tag">
  ✨ Welcome to Todo Pro
</p>

<h1>
  Manage Tasks
  <br />
  Like a Professional
</h1>

<p className="hero-description">
  Plan your day, organize your projects, and achieve more with an elegant,
  lightning-fast Todo Dashboard built using React, Firebase Authentication,
  and Express API.
</p>
        <div className="hero-buttons">
  <button
    className="primary-btn"
    onClick={() =>
      document
        .getElementById("dashboard")
        .scrollIntoView({ behavior: "smooth" })
    }
  >
    🚀 Get Started
  </button>

  {/* <button
    className="secondary-btn"
    onClick={logout}
  >
    🔓 Logout
  </button> */}
</div>

          <div className="hero-points">

            <span className="circle one">✔ Secure Login</span>

            <span className="circle two">✔ Fast API</span>

            <span className="circle three">✔ Modern UI</span>

          </div>

        </div>

       <div className="hero-image">

  <div className="image-glow"></div>

  <img
    src={home}
    alt="home"
    className="hero-img"
  />

  <div className="hero-demo-card">

    <h3>Today's Progress</h3>

    <div className="demo-item">✔ Complete React Project</div>
    <div className="demo-item">✔ Review Express APIs</div>
    <div className="demo-item">⏳ Push Code to GitHub</div>

  </div>

</div>

       

      </section>

<section className="hero-stats">

  <div className="hero-stat">
    <h2>10K+</h2>
    <p>Tasks Completed</p>
  </div>

  <div className="hero-stat">
    <h2>99%</h2>
    <p>User Satisfaction</p>
  </div>

  <div className="hero-stat">
    <h2>24/7</h2>
    <p>Cloud Access</p>
  </div>

</section>

      <section className="features">

        <h2>
          Powerful Features
        </h2>

        <div className="feature-grid">

          <div className="feature-card">
  <div className="feature-icon">📝</div>
  <h3>Create Todos</h3>
  <p>
    Quickly capture ideas and organize tasks in seconds.
  </p>
</div>

<div className="feature-card">
  <div className="feature-icon">⭐</div>
  <h3>Track Progress</h3>
  <p>
    Mark completed tasks and stay focused every day.
  </p>
</div>

<div className="feature-card">
  <div className="feature-icon">🔍</div>
  <h3>Instant Search</h3>
  <p>
    Find any todo immediately with smart filtering.
  </p>
</div>

<div className="feature-card">
  <div className="feature-icon">⚡</div>
  <h3>Fast Performance</h3>
  <p>
    Lightning-fast dashboard powered by Express API.
  </p>
</div>

<div className="feature-card">
  <div className="feature-icon">☁️</div>
  <h3>Cloud Ready</h3>
  <p>
    Secure authentication with Firebase.
  </p>
</div>

<div className="feature-card">
  <div className="feature-icon">📊</div>
  <h3>Analytics</h3>
  <p>
    Track completed and pending todos instantly.
  </p>
</div>

          <div className="feature-card">

            <h3>⭐ Complete Tasks</h3>

            <p>
              Mark tasks completed with one
              click.
            </p>

          </div>

          <div className="feature-card">

            <h3>🔍 Search</h3>

            <p>
              Find any task instantly.
            </p>

          </div>

          <div className="feature-card">

            <h3>📊 Dashboard</h3>
   
            <p>
              Track completed and pending
              todos.
            </p>

          </div>

        </div>

      </section>

      {/* ================= DASHBOARD STARTS HERE ================= */}

      <div id="dashboard" className="todo-container">
              <div className="todo-card"> 

        <div className="dashboard-header">

          <div>
            <h2 className="title">
              Productivity <span>Dashboard</span>
            </h2>

            <p className="subtitle">
              Welcome back,{" "}
              <strong>{user?.displayName || "User"}</strong>
            </p>
          </div>


        </div>

        <input
        type="text"
        className="todo-input"
        placeholder="Enter a new todo..."
        value={todo}
        onChange={(e) =>
          setTodo(e.target.value)
        }
        />

        {/* Add Todo */}

        <div className="add-section">

          <input
            type="text"
            className="search-input"
            placeholder="🔍 Search todos..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          <button
            className="add-btn"
            onClick={addTodo}
          >
            ➕ Add Todo
          </button>

        </div>

        {/* Todo List */}

        <div className="todo-list">

          {filteredTodos.length === 0 ? (

            <div className="empty-state">

              <h2>No Todos Found</h2>

              <p>
                Create your first todo to start
                organizing your work.
              </p>

            </div>

          ) : (

            filteredTodos.map((item) => (

              <div
                className={`todo-item ${
                  item.completed ? "completed" : ""
                }`}
                key={item.id}
              >

                <div className="todo-left">

                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={() =>
                      toggleComplete(item)
                    }
                  />

                  <h3>
                    {item.text}
                  </h3>

                </div>

                <div className="actions">

                  <button
                    className="edit-btn"
                    onClick={() =>
                      editTodo(item)
                    }
                  >
                    ✏ Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() =>
                      deleteTodo(item.id)
                    }
                  >
                    🗑 Delete
                  </button>

                </div>

              </div>

            ))

          )}

        </div>

      </div>

      {/* ================= Statistics ================= */}

      <section className="stats">

        <h2>Your Progress</h2>

        <div className="stats-grid">

          <div className="stat-card">

            <h1>{totalTodos}</h1>

            <p>Total Todos</p>

          </div>

          <div className="stat-card">

            <h1>{completedTodos}</h1>

            <p>Completed</p>

          </div>

          <div className="stat-card">

            <h1>{pendingTodos}</h1>

            <p>Pending</p>

          </div>

          <div className="stat-card">

            <h1>⚡</h1>

            <p>Stay Productive</p>

          </div>

        </div>

      </section>

      {/* ================= CTA ================= */}

      <section className="cta">

        <h2>
          Keep Building Better Habits
        </h2>

        <p>
          Small tasks completed every day
          create big achievements over time.
        </p>

        <button
          className="primary-btn"
          onClick={() =>
            document
              .getElementById("dashboard")
              .scrollIntoView({
                behavior: "smooth",
              })
          }
        >
          🚀 Add Another Todo
        </button>

      </section>

      {/* ================= Footer ================= */}
      <footer className="footer">

        <h2>Todo Dashboard</h2>

        <p>
          Built with React, Firebase
          Authentication, Express API,
          Axios, and modern UI.
        </p>

        <small>
          © 2026 Todo Dashboard. All Rights
          Reserved.
        </small>

      </footer>

    </div>

  </div>

  );
}

export default Home;