import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/register', { email, password });
            alert('Registration successful');
        } catch (err) {
            alert('Error registering user');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className='auth-form'>
                <h2>Register</h2>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <span>Already have an account <Link to="/login">Login</Link></span>

            </div>
            <div className='auth-container-btn'>
                <button className='auth-btn' type="submit">Register</button>

            </div>
            
        </form>
    );
};

export default Register;
