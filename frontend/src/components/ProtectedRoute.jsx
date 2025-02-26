import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, isLoading, isGuest } = useAuth();
    const location = useLocation();
    const currentPath = location.pathname;




    if (isLoading) {
        return <div>Loading...</div>; // Or your loading spinner
    }

    // If not authenticated and not a guest, redirect to auth page
    if (!isAuthenticated && !isGuest) {
        return <Navigate to="/auth" replace state={{ from: location }} />;
    }
// if(isGuest)
// {
//     return <Navigate to="/guest-dashboard" />;
// }
if (isGuest) {
    if (currentPath !== '/guest-dashboard') {
        console.log('Guest user trying to access:', currentPath);
        return <Navigate to="/guest-dashboard" replace />;
    }
}

    // If authenticated as a guest and trying to access regular dashboard
    if (isGuest && currentPath == '/dashboard') {
        return <Navigate to="/guest-dashboard" replace />;
    }

    // If authenticated as regular user and trying to access guest dashboard
    // if (isAuthenticated && !isGuest && currentPath === '/guest-dashboard') {
    //     return <Navigate to="/dashboard" replace />;
    // }

    return children;
};

export default ProtectedRoute;