
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail, Lock, User, Eye, EyeOff, Shield, CheckCircle } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AuthModal = ({ isOpen, onClose }: AuthModalProps) => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();

  // Clear errors when switching modes
  useEffect(() => {
    setErrors({});
  }, [mode]);

  const handleClose = () => {
    // Reset form state when closing
    setEmail('');
    setPassword('');
    setFullName('');
    setMode('signin');
    setErrors({});
    setShowPassword(false);
    setLoading(false);
    onClose();
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (mode === 'signup' && !fullName) {
      newErrors.fullName = 'Full name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      if (mode === 'signin') {
        const { error } = await signIn(email, password);
        if (error) throw error;
        toast({
          title: "Welcome back! 🎉",
          description: "You have been signed in successfully.",
        });
      } else {
        const { error } = await signUp(email, password, fullName);
        if (error) throw error;
        toast({
          title: "Account created! 🎉",
          description: "Please check your email to verify your account.",
        });
      }
      handleClose();
    } catch (error: any) {
      toast({
        title: "Authentication failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin');
    setErrors({});
    setShowPassword(false);
    // Keep email if switching modes, clear others
    setPassword('');
    setFullName('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent
        className="sm:max-w-md border-0 shadow-2xl bg-white p-0 gap-0 overflow-hidden"
        onEscapeKeyDown={handleClose}
        onPointerDownOutside={handleClose}
        onInteractOutside={handleClose}
      >
        {/* Enhanced Header */}
        <div className="relative bg-gradient-to-r from-orange-500 to-red-500 p-6 text-white">
          
          <DialogHeader className="space-y-3">
            <div>
              <DialogTitle className="text-2xl font-bold text-white">
                {mode === 'signin' ? 'Welcome Back! 👋' : 'Join PHCityRent 🏠'}
              </DialogTitle>
              <p className="text-white/90 text-sm">
                {mode === 'signin'
                  ? 'Sign in to access your account and saved properties'
                  : 'Join thousands of users finding their perfect home in Port Harcourt'
                }
              </p>
            </div>
          </DialogHeader>
        </div>

        {/* Enhanced Form */}
        <div className="p-6">
          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            {mode === 'signup' && (
              <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-sm font-semibold text-gray-700">
                    Full Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="fullName"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className={`pl-10 h-12 border-gray-200 focus:border-orange-500 focus:ring-orange-500/20 rounded-xl transition-colors ${
                        errors.fullName ? 'border-red-500 focus:border-red-500' : ''
                      }`}
                      placeholder="Enter your full name"
                    />
                    {errors.fullName && (
                      <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
                    )}
                  </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`pl-10 h-12 border-gray-200 focus:border-orange-500 focus:ring-orange-500/20 rounded-xl transition-colors ${
                    errors.email ? 'border-red-500 focus:border-red-500' : ''
                  }`}
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`pl-10 pr-10 h-12 border-gray-200 focus:border-orange-500 focus:ring-orange-500/20 rounded-xl transition-colors ${
                    errors.password ? 'border-red-500 focus:border-red-500' : ''
                  }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-base font-semibold bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {mode === 'signin' ? 'Signing in...' : 'Creating account...'}
                </>
              ) : (
                <>
                  {mode === 'signin' ? (
                    <>
                      <Shield className="mr-2 h-4 w-4" />
                      Sign In
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Create Account
                    </>
                  )}
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">or</span>
              </div>
            </div>
            
            <Button
              variant="ghost"
              onClick={switchMode}
              className="mt-4 text-orange-600 hover:text-orange-700 font-medium"
            >
              {mode === 'signin'
                ? "Don't have an account? Sign up"
                : "Already have an account? Sign in"
              }
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
