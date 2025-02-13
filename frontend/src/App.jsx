// App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';

import { Toaster } from 'react-hot-toast';

import AuthForm from './pages/AuthForm';
import EventDashboard from './pages/EventDashboard';
import DashboardLayout from './components/DashboardLayout/DashboardLayout';

function App() {
    return (
        <AuthProvider>
            <Toaster position="top-right" />
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
                                <DashboardLayout>
                                    <EventDashboard />
                                </DashboardLayout>
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/"
                        element={
                            <ProtectedRoute>
                                <DashboardLayout>
                                    <EventDashboard />
                                </DashboardLayout>
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
