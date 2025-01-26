import React, { useEffect, useState } from "react";
import axios from "axios";

import { useNavigate } from 'react-router-dom';

const TodoList =  () => { 
    const [todos , setTodos] = useState([]);
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    const handleDelete = async (id) => {
      try {
        console.log("Delete button clicked");
        console.log(id);
    
        const token = localStorage.getItem("token");
        console.log(token);
    
        const response = await axios.delete(`http://localhost:5000/todos/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Send the token in the Authorization header
          },
        });
        console.log(response.data);
    
      } catch (error) {
        console.error("Error deleting todo:", error.response ? error.response.data : error.message);
      }
    };
    
    const handleUpdate = (id , title) =>{
      
        navigate(`/update/${id}/${title}`)
      
    }

    try {
        
        useEffect(()=>{
            const fetch =  async () => {
                const res = await axios.get(`http://localhost:5000/todos/user/${token}`);
                setTodos(res.data)
                
            }

            fetch();
        },[handleDelete])
        
        // console.log(response.data);
        
        
    } catch (error) {
        console.log(error);
        
    }
    
    const handleToggleComplete =async (id) =>{
        try {
          const response = await axios.put(
            `http://localhost:5000/todos/completed/${id}`,{},
            
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`, // Include token in headers
              },
            }
          );
          console.log(response.data);
          
        } catch (error) {
          console.log(error);
          
        }
    }
    return (
        // <div>
        //     { todos.length > 0 ? (
        //     <ul className="list-disc pl-5">
        //       {todos.map((todo, index) => (
        //         <li key={index} className="todo-row">
        //           {todo.title}

        //           <button className="btn todo-btn todo-del-btn" onClick={()=>handleDelete(todo._id)}>Delete</button>
        //           <button className="btn todo-btn" onClick={()=>handleUpdate(todo._id , todo.title)}>Edit</button>
                  
        //         </li>
                
        //       ))}
        //     </ul>
        //   ) : (
        //     <p>No todos found.</p>
        //   )}
        // </div>

        <div>
            {todos.length > 0 ? (
            <table className="table">
              
              <tbody>
                {todos.map((todo, index) => (
                  <tr key={index} className="todo-row">
                    <td className="border border-gray-300 px-4 py-2">{index + 1}.</td>
                    <td className={todo.completed ? "line-through" : ""}>{todo.title}</td>
                    <td className="border border-gray-300 px-4 py-2">
                      <button className="btn todo-btn todo-del-btn" onClick={() => handleDelete(todo._id)}>Delete</button>
                      <button className="btn todo-btn" onClick={() => handleUpdate(todo._id, todo.title)}>Edit</button>
                      <input 
                        type="checkbox" 
                        checked={todo.completed} 
                        onChange={() => handleToggleComplete(todo._id)}
                        className="todo-checkbox"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No todos found.</p>
          )}

        </div>
        
        


        
        
    );
  };


  export default TodoList;