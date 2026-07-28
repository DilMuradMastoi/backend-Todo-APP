import { 
  useEffect, 
  useMemo, 
  useState 
} from "react";

import axios from "axios";

import { 
  auth 
} from "../firebase";

import { 
  signOut, 
  onAuthStateChanged 
} from "firebase/auth";

import { 
  useNavigate 
} from "react-router-dom";

import toast from "react-hot-toast";

import "../styles/Home.css";

import home from "../assets/home.png";


const API = import.meta.env.VITE_API_URL;



function Home() {

  const navigate = useNavigate();


  // ===========================
  // States
  // ===========================

  const [user, setUser] = useState(null);

  const [todo, setTodo] = useState("");

  const [todos, setTodos] = useState([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);



  // ===========================
  // Firebase Authentication
  // ===========================

  useEffect(() => {

    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser)=>{

        if(!currentUser){

          navigate("/login");

          return;
        }


        setUser(currentUser);

        setLoading(false);

      }
    );


    return unsubscribe;


  },[navigate]);



  // ===========================
  // Get Todos
  // ===========================

  const getTodos = async()=>{

    if(!user) return;


    try{

      setLoading(true);


      const res = await axios.get(
        `${API}/todos/${user.uid}`
      );


      setTodos(
        res.data.todos || []
      );


    }
    catch(error){

      console.log(error);

      toast.error(
        "Failed to load todos"
      );

      setTodos([]);

    }
    finally{

      setLoading(false);

    }

  };



  useEffect(()=>{

    if(user){

      getTodos();

    }

  },[user]);




  // ===========================
  // Add Todo
  // ===========================

  const addTodo = async()=>{


    if(!todo.trim()){

      toast.error(
        "Enter a todo first"
      );

      return;

    }


    try{


      await axios.post(
        `${API}/todos`,
        {

          uid:user.uid,

          text:todo,

          completed:false

        }
      );


      setTodo("");


      toast.success(
        "Todo added"
      );


      getTodos();


    }
    catch(error){

      console.log(error);

      toast.error(
        "Unable to add todo"
      );

    }


  };



  // ===========================
  // Delete Todo
  // ===========================

  const deleteTodo = async(id)=>{


    try{


      await axios.delete(
        `${API}/todos/${id}`
      );


      toast.success(
        "Todo deleted"
      );


      getTodos();


    }
    catch(error){

      console.log(error);

      toast.error(
        "Delete failed"
      );

    }


  };




  // ===========================
  // Edit Todo
  // ===========================

  const editTodo = async(item)=>{


    const newText = prompt(
      "Edit Todo",
      item.text
    );


    if(!newText?.trim()) return;



    try{


      await axios.put(
        `${API}/todos/${item.id}`,
        {

          text:newText,

          completed:item.completed

        }
      );


      toast.success(
        "Todo updated"
      );


      getTodos();


    }
    catch(error){

      console.log(error);

    }


  };




  // ===========================
  // Complete Todo
  // ===========================

  const toggleComplete = async(item)=>{


    try{


      await axios.put(
        `${API}/todos/${item.id}`,
        {

          text:item.text,

          completed:
          !item.completed

        }
      );


      getTodos();


    }
    catch(error){

      console.log(error);

    }


  };



  // ===========================
  // Search
  // ===========================


  const filteredTodos = useMemo(()=>{


    return todos.filter(
      (item)=>

      (
        item.text || ""
      )
      .toLowerCase()
      .includes(
        search.toLowerCase()
      )

    );


  },[
    todos,
    search
  ]);




  // ===========================
  // Statistics
  // ===========================


  const totalTodos =
  todos.length;


  const completedTodos =
  todos.filter(
    item=>item.completed
  ).length;



  const pendingTodos =
  totalTodos -
  completedTodos;



  // ===========================
  // Loading Screen
  // ===========================


  if(loading){

    return (

      <div className="loader">

        Loading...

      </div>

    );

  }



  return (

    <div className="home-page">


      {/* HERO SECTION */}

      <section className="hero">


        <div className="hero-content">


          <p className="hero-tech">

            Built with React,
            Firebase Authentication
            and Express API.

          </p>



          <p className="hero-tag">

            ✨ Welcome to Todo Pro

          </p>



          <h1>

            Manage Tasks

            <br/>

            Like a Professional

          </h1>



          <p className="hero-description">

            Plan your day, organize your
            projects, and achieve more with
            a powerful Todo Dashboard.

          </p>



          <div className="hero-buttons">


            <button

              className="primary-btn"

              onClick={()=>{

                document
                .getElementById(
                  "dashboard"
                )
                .scrollIntoView({
                  behavior:"smooth"
                });

              }}

            >

              🚀 Get Started

            </button>


          </div>



          <div className="hero-points">


            <span className="circle">

              ✔ Secure Login

            </span>


            <span className="circle">

              ✔ Fast API

            </span>


            <span className="circle">

              ✔ Modern UI

            </span>


          </div>


        </div>



        <div className="hero-image">


          <div className="image-glow"></div>


          <img

            src={home}

            alt="Todo Dashboard"

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


            {/* HERO STATS */}

      <section className="hero-stats">


        <div className="hero-stat">

          <h2>
            {totalTodos}
          </h2>

          <p>
            Total Tasks
          </p>

        </div>



        <div className="hero-stat">

          <h2>
            {completedTodos}
          </h2>

          <p>
            Completed
          </p>

        </div>



        <div className="hero-stat">

          <h2>
            {pendingTodos}
          </h2>

          <p>
            Pending
          </p>

        </div>


      </section>





      {/* FEATURES */}


      <section className="features">


        <h2>
          Powerful Features
        </h2>



        <div className="feature-grid">


          <div className="feature-card">

            <div className="feature-icon">
              📝
            </div>

            <h3>
              Create Todos
            </h3>

            <p>
              Quickly create and organize
              your daily tasks.
            </p>

          </div>




          <div className="feature-card">

            <div className="feature-icon">
              ⭐
            </div>

            <h3>
              Track Progress
            </h3>

            <p>
              Complete tasks and monitor
              your productivity.
            </p>

          </div>





          <div className="feature-card">

            <div className="feature-icon">
              🔍
            </div>

            <h3>
              Smart Search
            </h3>

            <p>
              Find any task instantly.
            </p>

          </div>





          <div className="feature-card">

            <div className="feature-icon">
              ⚡
            </div>

            <h3>
              Fast API
            </h3>

            <p>
              Powered by Express backend.
            </p>

          </div>





          <div className="feature-card">

            <div className="feature-icon">
              ☁️
            </div>

            <h3>
              Cloud Ready
            </h3>

            <p>
              Firebase authentication
              and secure storage.
            </p>

          </div>





          <div className="feature-card">

            <div className="feature-icon">
              📊
            </div>

            <h3>
              Analytics
            </h3>

            <p>
              View your productivity
              statistics.
            </p>

          </div>



        </div>


      </section>






      {/* DASHBOARD */}


      <div
        id="dashboard"
        className="todo-container"
      >


        <div className="todo-card">



          <div className="dashboard-header">


            <div>

              <h2 className="title">

                Productivity

                <span>
                  Dashboard
                </span>

              </h2>


              <p className="subtitle">

                Welcome back,

                {" "}

                <strong>

                  {
                    user?.displayName ||
                    "User"
                  }

                </strong>

              </p>


            </div>



{/* 
            <button

              className="logout-btn"

              onClick={logout}

            >

              Logout

            </button> */}



          </div>






          {/* ADD TODO INPUT */}



          <input

            type="text"

            className="todo-input"

            placeholder="Enter a new todo..."

            value={todo}

            onChange={(e)=>
              setTodo(
                e.target.value
              )
            }


            onKeyDown={(e)=>{

              if(e.key==="Enter"){

                addTodo();

              }

            }}

          />






          <div className="add-section">



            <input

              type="text"

              className="search-input"

              placeholder="🔍 Search todos..."

              value={search}

              onChange={(e)=>
                setSearch(
                  e.target.value
                )
              }

            />




            <button

              className="add-btn"

              onClick={addTodo}

            >

              ➕ Add Todo

            </button>



          </div>







          {/* TODO LIST */}



          <div className="todo-list">


            {
              filteredTodos.length === 0 ?


              (

                <div className="empty-state">


                  <h2>

                    No Todos Found

                  </h2>



                  <p>

                    Create your first
                    task to start.

                  </p>


                </div>


              )


              :



              filteredTodos.map(
                (item)=>(


                <div

                  key={item.id}

                  className={

                    `todo-item ${
                      item.completed
                      ?
                      "completed"
                      :
                      ""
                    }`

                  }


                >



                  <div className="todo-left">



                    <input

                      type="checkbox"

                      checked={
                        item.completed
                      }

                      onChange={()=>{

                        toggleComplete(
                          item
                        )

                      }}

                    />



                    <h3>

                      {item.text}

                    </h3>



                  </div>







                  <div className="actions">



                    <button

                      className="edit-btn"

                      onClick={()=>{

                        editTodo(
                          item
                        )

                      }}

                    >

                      ✏ Edit

                    </button>






                    <button

                      className="delete-btn"

                      onClick={()=>{

                        deleteTodo(
                          item.id
                        )

                      }}

                    >

                      🗑 Delete

                    </button>



                  </div>




                </div>



                )

              )


            }



          </div>



        </div>









        {/* PROGRESS */}



        <section className="stats">


          <h2>
            Your Progress
          </h2>




          <div className="stats-grid">



            <div className="stat-card">

              <h1>
                {totalTodos}
              </h1>

              <p>
                Total Todos
              </p>

            </div>





            <div className="stat-card">

              <h1>
                {completedTodos}
              </h1>

              <p>
                Completed
              </p>

            </div>





            <div className="stat-card">

              <h1>
                {pendingTodos}
              </h1>

              <p>
                Pending
              </p>

            </div>





            <div className="stat-card">

              <h1>
                🚀
              </h1>

              <p>
                Stay Productive
              </p>

            </div>



          </div>


        </section>









        {/* CTA */}



        <section className="cta">


          <h2>

            Keep Building Better Habits

          </h2>



          <p>

            Small tasks completed every day
            create big achievements.

          </p>



          <button

            className="primary-btn"

            onClick={()=>{

              document
              .getElementById(
                "dashboard"
              )
              .scrollIntoView({

                behavior:"smooth"

              });

            }}

          >

            🚀 Add Another Todo

          </button>



        </section>









        {/* FOOTER */}



        <footer className="footer">


          <h2>
            Todo Dashboard
          </h2>



          <p>

            Built with React,
            Firebase Authentication,
            Express API and Axios.

          </p>



          <small>

            © 2026 Todo Dashboard.
            All Rights Reserved.

          </small>


        </footer>





      </div>


    </div>


  );

}


export default Home;