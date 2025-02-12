// App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';

import { Toaster } from 'react-hot-toast';

import AuthForm from './pages/AuthForm';
import EventDashboard from './pages/EventDashboard';

function App() {
    return (
        <AuthProvider>
            <Toaster position='top-right'/>
            <Router>
                <Routes>
                    <Route 
                        path="/auth" 
                        element={
                            <PublicRoute>
                                <AuthForm />
                            </PublicRoute>
                        } 
                    />
                  
                    <Route 
                        path="/dashboard" 
                        element={
                            <ProtectedRoute>
                                <EventDashboard />
                            </ProtectedRoute>
                        } 
                    />
                    {/* Redirect root to dashboard or login based on auth status */}
                    <Route 
                        path="/" 
                        element={
                            <ProtectedRoute>
                                <EventDashboard />
                            </ProtectedRoute>
                        } 
                    />



      
    


                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
