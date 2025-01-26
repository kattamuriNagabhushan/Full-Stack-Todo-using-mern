import React from "react";
import { useNavigate } from "react-router-dom";

const Header = () =>{

    const navigate = useNavigate();

    const handleLogout = () => {
            localStorage.removeItem("token");  // Remove the token
            navigate("/login");  // Navigate to the login page after logout
    };

    return (
        <>

            <div className="header-nav">
            <div className='nav-btn'>
            <button className='btn' onClick={()=>navigate('/home')}>Home</button>
                <button className='btn' onClick={()=>navigate('/about')}>About</button>
                <button className='btn' onClick={handleLogout}>Logout</button>
            </div>

            </div>
            


        
        </>
    )
}

export default Header;