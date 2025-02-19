import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PublicRoute = ({ children }) => {
    const { isAuthenticated, isLoading ,isGuest} = useAuth();

    if (isLoading) {
        return <div>Loading...</div>; // Or your loading spinner
    }



    if (isAuthenticated && !isGuest) {
        return <Navigate to="/dashboard" />;
    }

    if (isAuthenticated && isGuest) {
        return <Navigate to="/guest-dashboard" />;
    }

    return children;
};

export default PublicRoute;