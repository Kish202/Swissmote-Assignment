import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Eye, EyeOff } from 'lucide-react';

const AuthForm = () => {
  // Form states
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  // Error states
  const [loginErrors, setLoginErrors] = useState({});
  const [registerErrors, setRegisterErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 8;
  };

  const validateLoginForm = () => {
    const errors = {};
    if (!loginData.email) errors.email = 'Email is required';
    else if (!validateEmail(loginData.email)) errors.email = 'Invalid email format';
    if (!loginData.password) errors.password = 'Password is required';
    setLoginErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateRegisterForm = () => {
    const errors = {};
    if (!registerData.name) errors.name = 'Name is required';
    if (!registerData.email) errors.email = 'Email is required';
    else if (!validateEmail(registerData.email)) errors.email = 'Invalid email format';
    if (!registerData.password) errors.password = 'Password is required';
    else if (!validatePassword(registerData.password)) 
      errors.password = 'Password must be at least 8 characters';
    if (!registerData.confirmPassword) errors.confirmPassword = 'Please confirm password';
    else if (registerData.password !== registerData.confirmPassword) 
      errors.confirmPassword = 'Passwords do not match';
    setRegisterErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submissions
  const handleLogin = (e) => {
    e.preventDefault();
    if (validateLoginForm()) {
      // Here you would integrate your login API
      console.log('Login data:', loginData);
   
      const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await api.post('/auth/login', loginData);
            if (response.data.success) {
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('user', JSON.stringify(response.data.user));
                setIsAuthenticated(true);
                navigate('/dashboard');
            } else {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                setIsAuthenticated(false);
                toast.error(response.data.message || 'Login failed');
            }
        } catch (error) {
            setLoginErrors(error.response?.data?.message || 'Login failed');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setIsAuthenticated(false);
        } finally {
            setIsLoading(false);
        }
     };
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedFormData = { ...formData, [name]: value };
    setRegisterData(updatedFormData);
    
    // Save to localStorage as user types
    localStorage.setItem('registrationData', JSON.stringify(updatedFormData));

    // Validate the field that just changed
    const newErrors = { ...errors };
    
    switch (name) {
        
      case 'name':
        if (value.length > 0 && value.length < 3) {
          newErrors.name = 'Name must be at least 3 characters';
        } else {
          delete newErrors.name;
        }
        break;
        
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (value.length > 0 && !emailRegex.test(value)) {
          newErrors.email = 'Please enter a valid email address';
        } else {
          delete newErrors.email;
        }
        break;
        
      case 'password':
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{7,}$/;
        if (value.length > 0 && !passwordRegex.test(value)) {
          newErrors.password = 'Password must be at least 7 characters with 1 uppercase, 1 lowercase letter and a number';
        } else {
          delete newErrors.password;
        }
        
        // Also check confirm password match if it exists
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
        
      default:
        break;
    }
    
    setRegisterErrors(newErrors);
  };
  const handleRegister = (e) => {
    e.preventDefault();
    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!validateRegisterForm()) return;
      
      setIsLoading(true);
      try {
          const response = await api.post('/auth/register', {
              
              name: registerData.name, 
              email: registerData.email,
              password: registerData.password
          });
          
          localStorage.setItem('token', response.data.token);
    
          toast(response?.data?.message);
          setRegisterData({
              
              name: '',
              email: '',
              password: '',
              confirmPassword: ''
          });
          localStorage.removeItem('registrationData');
          navigate('/login');
      } catch (error) {
          if (error.response?.data?.message.includes('Username must be unique')) {
                setRegisterErrors(prev => ({...prev, username: 'Username must be unique'}));
              toast(error.response?.data?.message);
          } else if (error.response?.data?.message.includes('email is already registered')) {
                 setRegisterErrors(prev => ({...prev, email: 'This email is already registered'}));
              toast(error.response?.data?.message);
          }
      } finally {
          setIsLoading(false);
      }
    };
  };

  return (
    <div className='flex border-yellow-400 h-screen border-[9px]' >
       <Card className="w-full  max-w-md mx-auto my-auto ">

      <Tabs defaultValue="register" className="w-full p-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="register">Register</TabsTrigger>
        </TabsList>

        <TabsContent value="login">
          <CardHeader className='space-y-2'>
            <CardTitle>Login</CardTitle>
            <CardDescription>Enter your credentials to access your account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-8">
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="Enter your email"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}s
                />
                {loginErrors.email && (
                  <Alert variant="destructive" className="py-2">
                    <AlertDescription>{loginErrors.email}</AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="login-password">Password</Label>
                <div className="relative border border-violet-950">
                  <Input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent "
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
                {loginErrors.password && (
                  <Alert variant="destructive" className="py-2">
                    <AlertDescription>{loginErrors.password}</AlertDescription>
                  </Alert>
                )}
              </div>

              <Button type="submit" className="w-full">Login</Button>
            </form>
          </CardContent>
        </TabsContent>

        <TabsContent value="register">
          <CardHeader className='space-y-2'>
            <CardTitle>Register</CardTitle>
            <CardDescription>Create a new account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="register-name">Name</Label>
                <Input
                  id="register-name"
                  type="text"
                  placeholder="Enter your name"
                  value={registerData.name}
                  onChange={(e) => setRegisterData({ ...registerData, name: e.target.value })}
                />
                {registerErrors.name && (
                  <Alert variant="destructive" className="py-2">
                    <AlertDescription>{registerErrors.name}</AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-email">Email</Label>
                <Input
                  id="register-email"
                  type="email"
                  placeholder="Enter your email"
                  value={registerData.email}
                  onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                />
                {registerErrors.email && (
                  <Alert variant="destructive" className="py-2">
                    <AlertDescription>{registerErrors.email}</AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-password">Password</Label>
                <div className="relative">
                  <Input
                    id="register-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    value={registerData.password}
                    onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
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
                {registerErrors.password && (
                  <Alert variant="destructive" className="py-2">
                    <AlertDescription>{registerErrors.password}</AlertDescription>
                  </Alert>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="register-confirm-password">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="register-confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={registerData.confirmPassword}
                    onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
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
                {registerErrors.confirmPassword && (
                  <Alert variant="destructive" className="py-2">
                    <AlertDescription>{registerErrors.confirmPassword}</AlertDescription>
                  </Alert>
                )}
              </div>

              <Button type="submit" className="w-full mt-2">Register</Button>
            </form>
          </CardContent>
        </TabsContent>
      </Tabs>
    </Card>

    </div>
   
  );
};

export default AuthForm;
