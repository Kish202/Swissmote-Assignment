import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import api from '../config/axios';
import { useAuth } from '../context/AuthContext';
 
const AuthForm = () => {
  const navigate = useNavigate();
  const     {setIsAuthenticated, setCurrentUser, setGuest, isGuest, isAuthenticated} = useAuth()
  
  // Form states
  const [loginData, setLoginData] = useState({ 
    email: '', 
    password: '' 
  });
  
  const [registerData, setRegisterData] = useState({
    username: '',
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });


  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [tabState, setTabState] = useState("register")

  

  useEffect(() => {
    // Load registration data from localStorage on component mount
    const savedData = localStorage.getItem('registrationData');
    if (savedData) {
      setRegisterData(JSON.parse(savedData));
    }
  }, []);

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{7,}$/;
    return passwordRegex.test(password);
  };

  const validateUsername = (username) => {
    const usernameRegex = /^[a-z0-9_-]+$/;
    return username.length >= 3 && usernameRegex.test(username);
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = { ...registerData, [name]: value };
    setRegisterData(updatedFormData);
    
    // Save to localStorage as user types
    localStorage.setItem('registrationData', JSON.stringify(updatedFormData));

    // Validate fields as they change
    const newErrors = { ...errors };
    
    switch (name) {
      case 'username':
        if (value && !validateUsername(value)) {
          newErrors.username = 'Username must be at least 3 characters and contain only letters, numbers, underscores, and hyphens';
        } else {
          delete newErrors.username;
        }
        break;
        
      case 'name':
        if (value && value.length < 3) {
          newErrors.name = 'Name must be at least 3 characters';
        } else {
          delete newErrors.name;
        }
        break;
        
      case 'email':
        if (value && !validateEmail(value)) {
          newErrors.email = 'Please enter a valid email address';
        } else {
          delete newErrors.email;
        }
        break;
        
      case 'password':
        if (value && !validatePassword(value)) {
          newErrors.password = 'Password must be at least 7 characters with 1 uppercase, 1 lowercase letter and a number';
        } else {
          delete newErrors.password;
        }
        
        if (updatedFormData.confirmPassword && value !== updatedFormData.confirmPassword) {
          newErrors.confirmPassword = 'Passwords do not match';
        } else if (updatedFormData.confirmPassword) {
          delete newErrors.confirmPassword;
        }
        break;
        
      case 'confirmPassword':
        if (value !== updatedFormData.password) {
          newErrors.confirmPassword = 'Passwords do not match';
        } else {
          delete newErrors.confirmPassword;
        }
        break;
    }
    
    setErrors(newErrors);
  };

const handleGuesTlogin = async (e) => {

    setIsLoading(true);
    setErrors('');
  
    try {
      const response = await api.post('/api/auth/guest-login', {
        headers: {
          'Content-Type': 'application/json'
        }
      });
  
      const data = response.data;
  
      if (data.success === true) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Update all auth states and wait for them to complete
        await Promise.all([
          new Promise(resolve => {
            setIsAuthenticated(true);
            setCurrentUser(data.user);
            setGuest(true);
            resolve();
          })
        ]);
  console.log(isGuest);
        // Navigate after states are updated
        navigate('/guest-dashboard');
      } else {
        setErrors(data.message);
      }
    } catch (err) {
      setErrors('Failed to login as guest');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  

}
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await api.post('/api/auth/login', loginData);
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        setCurrentUser(response.data.user);
        console.log(response.data.user);
                setIsAuthenticated(true);
        navigate('/dashboard');
      } else {
        setErrors(prev => ({
          ...prev,
          login: response.data.message || 'Login failed'
        }));
      }
    } catch (error) {
      setErrors(prev => ({
        ...prev,
        login: error.response?.data?.message || 'Login failed'
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (Object.keys(errors).length > 0) return;
    
    setIsLoading(true);
    try {
      const response = await api.post('api/auth/register', {
        username: registerData.username,
        name: registerData.name,
        email: registerData.email,
        password: registerData.password
      });
      
      localStorage.setItem('token', response.data.token);
      localStorage.removeItem('registrationData');

setTabState("login");
    } catch (error) {
      if (error.response?.data?.message.includes('Username must be unique')) {
        setErrors(prev => ({...prev, username: 'Username already taken'}));
      } else if (error.response?.data?.message.includes('email is already registered')) {
        setErrors(prev => ({...prev, email: 'Email already registered'}));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const hidePasswordsOnOtherFocus = () => {
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  return (
    <div className="flex h-screen">
      <Card className="w-full max-w-md mx-auto my-auto">
        <Tabs value={tabState} onValueChange={setTabState} className="w-full p-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
            <TabsTrigger value="guest-login">The Guest Login</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <CardHeader className="space-y-2">
              <CardTitle>Login</CardTitle>
              <CardDescription>Enter your credentials to access your account</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                {errors.login && (
                  <Alert variant="destructive">
                    <AlertDescription>{errors.login}</AlertDescription>
                  </Alert>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="login-email">Email</Label>
                  <Input
                    id="login-email"
                    type="email"
                    name="email"
                    value={loginData.email}
                    onChange={handleLoginChange}
                    onFocus={hidePasswordsOnOtherFocus}
                    placeholder="Enter email"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <div className="relative">
                    <Input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={loginData.password}
                      onChange={handleLoginChange}
                      placeholder="Enter password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="w-4 h-4 animate-spin mr-2"/>
                      <span>Logging in...</span>
                    </div>
                  ) : (
                    'Login'
                  )}
                </Button>
              </form>
            </CardContent>
             </TabsContent>

          <TabsContent value="register">
            <CardHeader className="space-y-2">
              <CardTitle>Register</CardTitle>
              <CardDescription>Create a new account</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleRegister}    className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-username">Username</Label>
                  <Input
                    id="register-username"
                    name="username"
                    value={registerData.username}
                    onChange={handleRegisterChange}
                    onFocus={hidePasswordsOnOtherFocus}
                    placeholder="Enter username"
                  />
                  {errors.username && <p className="text-sm text-red-600">{errors.username}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-name">Name</Label>
                  <Input
                    id="register-name"
                    name="name"
                    value={registerData.name}
                    onChange={handleRegisterChange}
                    onFocus={hidePasswordsOnOtherFocus}
                    placeholder="Enter name"
                  />
                  {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-email">Email</Label>
                  <Input
                    id="register-email"
                    type="email"
                    name="email"
                    value={registerData.email}
                    onChange={handleRegisterChange}
                    onFocus={hidePasswordsOnOtherFocus}
                    placeholder="Enter email"
                  />
                  {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-password">Password</Label>
                  <div className="relative">
                    <Input
                      id="register-password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={registerData.password}
                      onChange={handleRegisterChange}
                      placeholder="Enter password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-confirm-password">Confirm Password</Label>
                  <div className="relative">
                    <Input
                      id="register-confirm-password"
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={registerData.confirmPassword}
                      onChange={handleRegisterChange}
                      placeholder="Confirm password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {errors.confirmPassword && <p className="text-sm text-red-600">{errors.confirmPassword}</p>}
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading || Object.keys(errors).length > 0}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="w-4 h-4 animate-spin mr-2"/>
                      <span>Registering...</span>
                    </div>
                  ) : (
                    'Register'
                  )}
                </Button>
              </form>
            </CardContent>
             </TabsContent>

             <TabsContent value="guest-login">


            <CardContent className='flex items-center justify-center'>
             <Button variant="outline" className='border border-yellow-950 m-10' 
             onClick={handleGuesTlogin}>    {isLoading ? 'Loading...' : 'Continue as Guest'} </Button>
            </CardContent>
             </TabsContent>
        </Tabs>
      </Card>


    </div>
  );
};



export default AuthForm;
