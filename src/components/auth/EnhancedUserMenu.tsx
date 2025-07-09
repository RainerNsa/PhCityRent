
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  User,
  LogOut,
  Settings,
  Shield,
  Home,
  Building2,
  UserCheck,
  ChevronDown,
  Crown,
  Briefcase,
  CreditCard
} from 'lucide-react';

const EnhancedUserMenu = () => {
  const { user, signOut, isAdmin } = useAuth();

  if (!user) {
    return (
      <div className="flex items-center gap-3">
        <Link to="/auth">
          <Button 
            variant="outline" 
            className="hidden sm:flex border-orange-200 text-orange-600 hover:bg-orange-50 hover:border-orange-300 transition-all duration-200"
          >
            Sign In
          </Button>
        </Link>
        <Link to="/auth">
          <Button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
            Get Started
          </Button>
        </Link>
      </div>
    );
  }

  const userInitials = user.user_metadata?.full_name 
    ? user.user_metadata.full_name.split(' ').map((n: string) => n[0]).join('').toUpperCase()
    : user.email?.charAt(0).toUpperCase() || 'U';

  const userDisplayName = user.user_metadata?.full_name || user.email || 'User';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="relative h-12 w-auto px-3 rounded-xl hover:bg-gray-100 transition-all duration-200 group"
        >
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8 ring-2 ring-orange-200 group-hover:ring-orange-300 transition-all duration-200">
              <AvatarFallback className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-semibold">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium text-gray-900 truncate max-w-32">
                {userDisplayName}
              </p>
              <p className="text-xs text-gray-500 truncate max-w-32">
                {user.email}
              </p>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-500 group-hover:text-gray-700 transition-colors" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-64 p-2" align="end" forceMount>
        <DropdownMenuLabel className="p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg mb-2">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 ring-2 ring-orange-200">
              <AvatarFallback className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {userDisplayName}
              </p>
              <p className="text-xs text-gray-600 truncate">
                {user.email}
              </p>
              {isAdmin && (
                <div className="flex items-center gap-1 mt-1">
                  <Crown className="h-3 w-3 text-yellow-600" />
                  <span className="text-xs font-medium text-yellow-700">Admin</span>
                </div>
              )}
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {/* Dashboard Access Section */}
        <div className="py-2">
          <DropdownMenuLabel className="text-xs text-gray-500 uppercase tracking-wider font-semibold px-2 py-1">
            Dashboards
          </DropdownMenuLabel>
          
          <Link to="/tenant-portal">
            <DropdownMenuItem className="cursor-pointer rounded-lg mx-1 px-3 py-2 hover:bg-blue-50 hover:text-blue-700 transition-colors">
              <Home className="mr-3 h-4 w-4" />
              <span>Tenant Portal</span>
            </DropdownMenuItem>
          </Link>

          <Link to="/payment-dashboard">
            <DropdownMenuItem className="cursor-pointer rounded-lg mx-1 px-3 py-2 bg-gradient-to-r from-orange-50 to-red-50 hover:from-orange-100 hover:to-red-100 border border-orange-200 hover:border-orange-300 transition-all duration-200">
              <div className="flex items-center">
                <div className="p-1 bg-gradient-to-r from-orange-500 to-red-500 rounded-md mr-3">
                  <CreditCard className="h-4 w-4 text-white" />
                </div>
                <div>
                  <span className="font-medium text-orange-800">Payment Dashboard</span>
                  <p className="text-xs text-orange-600">Manage payments & analytics</p>
                </div>
              </div>
            </DropdownMenuItem>
          </Link>

          <Link to="/landlord-portal">
            <DropdownMenuItem className="cursor-pointer rounded-lg mx-1 px-3 py-2 hover:bg-green-50 hover:text-green-700 transition-colors">
              <Building2 className="mr-3 h-4 w-4" />
              <span>Landlord Portal</span>
            </DropdownMenuItem>
          </Link>

          <Link to="/enhanced-agent-dashboard">
            <DropdownMenuItem className="cursor-pointer rounded-lg mx-1 px-3 py-2 hover:bg-purple-50 hover:text-purple-700 transition-colors">
              <UserCheck className="mr-3 h-4 w-4" />
              <span>Agent Dashboard</span>
            </DropdownMenuItem>
          </Link>

          {isAdmin && (
            <Link to="/admin">
              <DropdownMenuItem className="cursor-pointer rounded-lg mx-1 px-3 py-2 hover:bg-yellow-50 hover:text-yellow-700 transition-colors">
                <Shield className="mr-3 h-4 w-4" />
                <span>Admin Dashboard</span>
              </DropdownMenuItem>
            </Link>
          )}
        </div>

        <DropdownMenuSeparator />

        {/* User Actions */}
        <div className="py-2">
          <DropdownMenuLabel className="text-xs text-gray-500 uppercase tracking-wider font-semibold px-2 py-1">
            Account
          </DropdownMenuLabel>
          
          <Link to="/profile">
            <DropdownMenuItem className="cursor-pointer rounded-lg mx-1 px-3 py-2 hover:bg-gray-50 transition-colors">
              <User className="mr-3 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
          </Link>

          <DropdownMenuItem className="cursor-pointer rounded-lg mx-1 px-3 py-2 hover:bg-gray-50 transition-colors">
            <Settings className="mr-3 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem 
          className="cursor-pointer rounded-lg mx-1 px-3 py-2 text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors"
          onClick={() => signOut()}
        >
          <LogOut className="mr-3 h-4 w-4" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default EnhancedUserMenu;
