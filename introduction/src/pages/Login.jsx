import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Auth.css";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async (event) => {
    event.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, email, password);

      alert("🎉 Login Successful!");

      setEmail("");
      setPassword("");

      navigate("/");
    } catch (error) {
      console.log(error);

      if (error.code === "auth/invalid-credential") {
        alert("Invalid Email or Password");
      } else {
        alert(error.message);
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
       <div className="auth-logo">
  🔐
</div>

<h2>Welcome Back</h2>

<p>Login to continue managing your todos.</p>

        <form onSubmit={login}>
          <div className="input-box">
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-box">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit">Login</button>
        </form>

        <div className="auth-footer">
          Don't have an account?
          <Link to="/register"> Register</Link>
        </div>
      </div>
    </div>
  );
}