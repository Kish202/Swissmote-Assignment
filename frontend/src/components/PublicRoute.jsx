import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PublicRoute = ({ children }) => {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return <div>Loading...</div>; // Or your loading spinner
    }

    if (isAuthenticated) {
        return <Navigate to="/dashboard" />;
    }

    return children;
};

export default PublicRoute;