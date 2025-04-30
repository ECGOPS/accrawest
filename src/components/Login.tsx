import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { cn } from '../lib/utils';

interface LoginProps {
  onLoginSuccess?: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    console.log('Login attempt with:', email);
    
    // Simulate login - Replace with actual authentication
    setTimeout(() => {
      console.log('Login successful, setting localStorage...');
      localStorage.setItem('isAuthenticated', 'true');
      
      console.log('Calling onLoginSuccess callback...');
      onLoginSuccess?.();
      
      console.log('Navigating to dashboard...');
      navigate('/dashboard');
      
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8 p-8 bg-white shadow-lg rounded-lg">
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="w-32 h-32 relative mb-4">
            <img
              src="/ecg-uploads/ecg-logo.png"
              alt="ECG Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-ecg-blue">Fraud Alert System</h2>
          <p className="text-sm text-muted-foreground">
            Enter your credentials to access the system
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="name@ecg.com.gh"
                required
                className="w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">
                Password
              </label>
              <Input
                id="password"
                type="password"
                required
                className="w-full"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <Button
              type="submit"
              className="w-full bg-ecg-blue hover:bg-ecg-blue/90 text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Signing in...
                </div>
              ) : (
                'Sign in'
              )}
            </Button>
          </div>

          <div className="text-center text-sm">
            <a href="#" className="text-primary hover:underline">
              Forgot your password?
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login; 