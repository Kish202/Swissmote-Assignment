// App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';

import { Toaster } from 'react-hot-toast';

import AuthForm from './pages/AuthForm';
import EventDashboard from './pages/EventDashboard';
import DashboardLayout from './components/DashboardLayout/DashboardLayout';
import CreateEventForm from './pages/CreateEventForm';
import MyEvents from './pages/MyEvents'
import EditEvent from './pages/EditEvent';
import EditEventForm from './pages/EditEvent';

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
                        path="/create-event"
                        element={
                            <ProtectedRoute>
                                <DashboardLayout>
<CreateEventForm/>
                                </DashboardLayout>
                               
                            </ProtectedRoute>
                        }
                    />
                     <Route
                        path="/my-events/:id"
                        element={
                            <ProtectedRoute>
                                <DashboardLayout>
<EditEventForm/>
                                </DashboardLayout>
                               
                            </ProtectedRoute>
                        }
                    />

                    <Route
                        path="/my-events"
                        element={
                            <ProtectedRoute>
                                <DashboardLayout>

                                    <MyEvents/>
                                </DashboardLayout>
                                
                            </ProtectedRoute>
                        }
                    />

<Route
                        path="/my-events/edit-event"
                        element={
                            <ProtectedRoute>
                                <DashboardLayout>
                                    <EditEvent />
                                </DashboardLayout>
                            </ProtectedRoute>
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
