import React from "react"
import { useState } from "react";
import axios from "axios";
import TodoList from "./TodoList";

const TodoForm = ({onFormSubmit}) => {
    const [todo, setTodo] = useState({title : "" , isCompleted : false});
  
    const handleChange = (e) => {
      setTodo({ ...todo, [e.target.name]: e.target.value });
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
    
      try {
        const res = await axios.post("http://localhost:5000/todos" , 
            {...todo , token : localStorage.getItem("token")})
            
            console.log(res.data);
      } catch (error) {
        console.log('Error : ',error);
        
      }
     
      onFormSubmit()
     
      
      
      
    };
  
    return (

        <>
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
        
        <button type="submit" className="todo-add-btn">
          Add
        </button>
      </form>

      
        
        </>
      

    );
  };

  export default TodoForm;