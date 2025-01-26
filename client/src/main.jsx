import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import React from "react"
import './index.css'
import App from './App.jsx'
import Register from './Register.jsx';
import About from './About.jsx';
import Login from './Login.jsx';
import Home from './Home.jsx';
import Update from './Update.jsx';
import Header from './Header.jsx';

const isAuthenticated = !!localStorage.getItem('token');

createRoot(document.getElementById('root')).render(
  <StrictMode>
      
      <Router>
            <Header />
            <Routes>
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/about" element={<About />} />
                <Route path="/update/:id/:text" element={<Update />} />
                <Route
                    path="/home"
                    element={isAuthenticated ? <Home /> : <Navigate to="/login" />}
                />
            </Routes>
        </Router>
    
  </StrictMode>,
)
