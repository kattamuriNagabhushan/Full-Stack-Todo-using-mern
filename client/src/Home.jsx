import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import TodoForm from './TodoForm';
import TodoList from './TodoList';


const Home = () => {
    
    const [updated , setUpdated] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = ()=>{
        setUpdated(prev => !prev)
    }
    

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('http://localhost:5000/home', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                
            } catch (err) {

                console.log(err);
                
                // alert('Session expired. Please log in again.');
                // localStorage.removeItem('token');
                // navigate('/login');
            }
        };
        fetchData();
    }, [navigate]);

   
    return (
        <>
        
        <div className='main'>

            
            <div className='container'>
            <h1>Welcome to the Home Page</h1>

                <h2>Add your todo's</h2>
                    
                <TodoForm onFormSubmit={handleSubmit}  />
                <TodoList key={updated}/>
            </div>

        </div>
        

        
        

    </>
    )
    
    
};

export default Home;
