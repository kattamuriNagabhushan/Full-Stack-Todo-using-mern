import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post('http://localhost:5000/login', { email, password });
            localStorage.setItem('token', data.token);
            navigate('/home');
        } catch (err) {
            alert('Invalid credentials');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className='auth-form'>
                <h2>Login</h2>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <br />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <span>Don't have an account <Link to="/register">Register</Link></span>
            </div>
            

            <div className='auth-container-btn'>
                <button className='auth-btn' type="submit">Login</button>
            </div>
            
            
        </form>
    );
};

export default Login;
