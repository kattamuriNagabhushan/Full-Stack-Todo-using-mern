import axios from 'axios';
import React, { useState } from 'react'
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
const  Update = ()=> {

    const {id  , text} = useParams()
   
    
    
     const [todo, setTodo] = useState({title : text , isCompleted : false});
      const navigate = useNavigate();

        const handleChange = (e) => {
          setTodo({ ...todo, [e.target.name]: e.target.value });
        };
      
        const handleSubmit = async (e) => {
          e.preventDefault();
        
          try {
            console.log(todo.title);
            
            // const response = await axios.put(`http://localhost:5000/todos/${id}` , 
            // { token : localStorage.getItem("token") , title : todo.title})

            const response = await axios.put(
                `http://localhost:5000/todos/${id}`,
                { title: todo.title }, 
                {
                  headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`, // Include token in headers
                  },
                }
              );

            console.log(response.data);

            navigate('/home');
            
            
          } catch (error) {
            console.log(error);
            
          }


        }

  return (

    <>
        

        <div className='update-input'>
          <div><h3>Update your Todo</h3></div>
          <form onSubmit={handleSubmit} className="p-4 border rounded mb-4">
                  <input
                  type="text"
                  name="title"
                  placeholder="Todo Title"
                  value={todo.title}
                  onChange={handleChange}
                  required
                  className="todo-input"
              />

              <button className='todo-update-btn' type='submit'>update</button>

          </form >
        </div>
        
    </>

       
    
    
  )
}

export default Update