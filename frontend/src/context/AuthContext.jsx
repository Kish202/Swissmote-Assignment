// context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import api from '../config/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

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
            setIsAuthenticated(false);
        }
    } else {
        setIsAuthenticated(false);
    }
    setIsLoading(false);
};


    return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, isLoading, currentUser, setCurrentUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);