import React from 'react'
import { Button } from "@/components/ui/button";
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
const {setIsAuthenticated} = useAuth();
const navigate = useNavigate();    

const handleLogOut = ()=>{
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        navigate('/auth')
      }

  return (
      <nav className="bg-white shadow-sm p-4">
            <div className="container mx-auto max-w-4xl flex justify-between items-center">
              <div className="text-xl font-bold">Logo</div>
              <div className="flex gap-4">
                <Button variant="outline"><Link to></Link> </Button>
                <Button variant="ghost" onClick={handleLogOut}>Logout</Button>
              </div>
            </div>
          </nav>
  )
}

export default Navbar
