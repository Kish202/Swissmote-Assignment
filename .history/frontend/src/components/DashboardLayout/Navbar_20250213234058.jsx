import { Button } from "@/components/ui/button";
import { useAuth } from '../../context/AuthContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';

function Navbar() {
  const {setIsAuthenticated} = useAuth();
  const navigate = useNavigate();    
  const location = useLocation(); // Add this hook to get current route

  const handleLogOut = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate('/auth')
  }

  return (
    <nav className="bg-white shadow-sm p-4">
      <div className="container mx-auto max-w-4xl flex justify-between items-center">
        <div className="text-xl font-bold">Logo</div>
        <div className="flex gap-4">
          {/* Only show Create Event button if NOT on /create-event route */}
          {location.pathname !== '/create-event'?(
            <Link to="/create-event">
              <Button variant="outline">Create Event</Button>
            </Link>
          ): (<Link to="/dashboard"> <Button variant="outline"> Dashboard</Button></Link>)}
          <Button variant="ghost" onClick={handleLogOut}>Logout</Button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar;
