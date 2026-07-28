import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Routes, Route } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import Navbar from './components/Navbar.jsx'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'


createRoot(document.getElementById('root')).render(
<BrowserRouter>
<Navbar/>
<Routes>
  <Route index element={<Home/>} />
  <Route path='login' element={<Login/>} />
  <Route path='register' element={<Register/>} />
</Routes>
</BrowserRouter>

)