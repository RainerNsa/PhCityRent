
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { EnhancedButton } from '@/components/ui/enhanced-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Mail, Lock, User, X } from 'lucide-react';
import { designTokens } from '@/lib/design-tokens';

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
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();

  const handleClose = () => {
    // Reset form state when closing
    setEmail('');
    setPassword('');
    setFullName('');
    setMode('signin');
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'signin') {
        const { error } = await signIn(email, password);
        if (error) throw error;
        toast({
          title: "Welcome back!",
          description: "You have been signed in successfully.",
        });
      } else {
        const { error } = await signUp(email, password, fullName);
        if (error) throw error;
        toast({
          title: "Account created!",
          description: "Please check your email to verify your account.",
        });
      }
      handleClose();
    } catch (error: any) {
      toast({
        title: "Authentication failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin');
    setEmail('');
    setPassword('');
    setFullName('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md border-0 shadow-2xl bg-white/95 backdrop-blur-sm p-0 gap-0 overflow-hidden">
        {/* Enhanced Header */}
        <div className="relative bg-gradient-to-r from-orange-500 to-red-500 p-6 text-white">
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors duration-200"
          >
            <X className="w-4 h-4" />
          </button>
          
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-2xl font-bold text-white">
              {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
            </DialogTitle>
            <p className="text-white/90 text-sm">
              {mode === 'signin' 
                ? 'Sign in to access your account and saved properties' 
                : 'Join thousands of users finding their perfect home'
              }
            </p>
          </DialogHeader>
        </div>

        {/* Enhanced Form */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
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
                    className="pl-10 h-12 border-gray-200 focus:border-orange-500 focus:ring-orange-500/20 rounded-xl"
                    placeholder="Enter your full name"
                    required
                  />
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
                  className="pl-10 h-12 border-gray-200 focus:border-orange-500 focus:ring-orange-500/20 rounded-xl"
                  placeholder="Enter your email"
                  required
                />
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
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-12 border-gray-200 focus:border-orange-500 focus:ring-orange-500/20 rounded-xl"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <EnhancedButton 
              type="submit" 
              variant="primary" 
              size="lg"
              className="w-full h-12 text-base font-semibold" 
              disabled={loading}
              loading={loading}
              loadingText={mode === 'signin' ? 'Signing in...' : 'Creating account...'}
            >
              {mode === 'signin' ? 'Sign In' : 'Create Account'}
            </EnhancedButton>
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
            
            <EnhancedButton 
              variant="ghost" 
              onClick={switchMode}
              className="mt-4 text-orange-600 hover:text-orange-700 font-medium"
            >
              {mode === 'signin' 
                ? "Don't have an account? Sign up" 
                : "Already have an account? Sign in"
              }
            </EnhancedButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
