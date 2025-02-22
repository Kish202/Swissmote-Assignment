// context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../config/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const[isGuest, setGuest] = useState(false);

    useEffect(() => {
        checkAuth();
    }, []);

const checkAuth = async () => {
    const token = localStorage.getItem('token');
 
    if (token) {
        try {
            const response = await api.get('/api/auth/verify');
            if (response.data.success) {
    
                setIsAuthenticated(true);
            } else {
                localStorage.removeItem('token');
           
                setIsAuthenticated(false);
            }
        } catch {
            localStorage.removeItem('token');
            // console.log("in guest")
            setIsAuthenticated(false);
        }
    } else {
        setIsAuthenticated(false);
        // console.log("in guest")
    }
    setIsLoading(false);
    // console.log("in guest")
};


    return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, isLoading, currentUser, setCurrentUser,isGuest, setGuest }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);