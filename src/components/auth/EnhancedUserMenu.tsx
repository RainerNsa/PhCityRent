
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { 
  User, Settings, LogOut, Shield, Home, User as UserIcon, 
  MessageSquare, Zap, TrendingUp, Bot, ChevronDown, Building, Users 
} from "lucide-react";

const EnhancedUserMenu = () => {
  const { user, signOut, isAdmin } = useAuth();
  const [userType, setUserType] = useState<'tenant' | 'agent' | 'landlord' | null>(null);

  useEffect(() => {
    if (!user) return;

    const checkUserType = async () => {
      try {
        // Check if user is a verified agent
        const { data: agentProfile } = await supabase
          .from('agent_profiles')
          .select('agent_id, is_active')
          .eq('user_id', user.id)
          .eq('is_active', true)
          .single();

        if (agentProfile) {
          setUserType('agent');
          return;
        }

        // Check if user has properties (landlord)
        const { data: properties } = await supabase
          .from('properties')
          .select('id')
          .eq('landlord_id', user.id)
          .limit(1);

        if (properties && properties.length > 0) {
          setUserType('landlord');
          return;
        }

        // Default to tenant
        setUserType('tenant');
      } catch (error) {
        console.error('Error checking user type:', error);
        setUserType('tenant');
      }
    };

    checkUserType();
  }, [user]);

  if (!user) return null;

  const handleSignOut = async () => {
    await signOut();
  };

  const userName = user.user_metadata?.full_name || "User";
  const userEmail = user.email;

  const getDashboardLink = () => {
    if (isAdmin) return { path: '/admin', label: 'Admin Dashboard', icon: Shield };
    if (userType === 'agent') return { path: '/enhanced-agent-dashboard', label: 'Agent Dashboard', icon: Users };
    if (userType === 'landlord') return { path: '/landlord-portal', label: 'Landlord Portal', icon: Building };
    return { path: '/tenant-portal', label: 'Tenant Portal', icon: Home };
  };

  const dashboardInfo = getDashboardLink();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 px-3 rounded-xl hover:bg-gray-100 transition-all duration-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="hidden md:block text-left">
              <div className="text-sm font-medium text-gray-900 truncate max-w-[120px]">
                {userName}
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-72 bg-white border shadow-xl rounded-xl p-2" 
        align="end" 
        forceMount
      >
        {/* User Info Header */}
        <div className="px-3 py-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg mb-2">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-semibold text-lg">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {userName}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {userEmail}
              </p>
            </div>
          </div>
        </div>

        <DropdownMenuSeparator className="my-2" />
        
        {/* Main Navigation */}
        <div className="space-y-1">
          <DropdownMenuItem asChild>
            <Link to={dashboardInfo.path} className="flex items-center px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
              <dashboardInfo.icon className="mr-3 h-4 w-4 text-gray-500" />
              <span className="font-medium">{dashboardInfo.label}</span>
            </Link>
          </DropdownMenuItem>
          
          <DropdownMenuItem asChild>
            <Link to="/profile" className="flex items-center px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
              <UserIcon className="mr-3 h-4 w-4 text-gray-500" />
              <span className="font-medium">Profile</span>
            </Link>
          </DropdownMenuItem>
          
          <DropdownMenuItem asChild>
            <Link to="/profile?tab=settings" className="flex items-center px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
              <Settings className="mr-3 h-4 w-4 text-gray-500" />
              <span className="font-medium">Settings</span>
            </Link>
          </DropdownMenuItem>
        </div>

        <DropdownMenuSeparator className="my-2" />
        
        {/* User Features */}
        <div className="space-y-1">
          <DropdownMenuLabel className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3">
            Features
          </DropdownMenuLabel>
          
          <DropdownMenuItem asChild>
            <Link to="/messages" className="flex items-center px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
              <MessageSquare className="mr-3 h-4 w-4 text-gray-500" />
              <span className="font-medium">Messages</span>
            </Link>
          </DropdownMenuItem>
          
          <DropdownMenuItem asChild>
            <Link to="/advanced-features" className="flex items-center px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
              <Zap className="mr-3 h-4 w-4 text-gray-500" />
              <span className="font-medium">Advanced Features</span>
            </Link>
          </DropdownMenuItem>
        </div>
        
        {/* Admin Section */}
        {isAdmin && (
          <>
            <DropdownMenuSeparator className="my-2" />
            
            <div className="space-y-1">
              <DropdownMenuLabel className="text-xs font-semibold text-orange-600 uppercase tracking-wider px-3">
                Admin
              </DropdownMenuLabel>
              
              <DropdownMenuItem asChild>
                <Link to="/admin" className="flex items-center px-3 py-2 rounded-lg hover:bg-orange-50 transition-colors cursor-pointer group">
                  <Shield className="mr-3 h-4 w-4 text-orange-500 group-hover:text-orange-600" />
                  <span className="font-medium text-orange-700 group-hover:text-orange-800">Admin Dashboard</span>
                </Link>
              </DropdownMenuItem>
              
              <DropdownMenuItem asChild>
                <Link to="/scaling-optimization" className="flex items-center px-3 py-2 rounded-lg hover:bg-orange-50 transition-colors cursor-pointer group">
                  <TrendingUp className="mr-3 h-4 w-4 text-orange-500 group-hover:text-orange-600" />
                  <span className="font-medium text-orange-700 group-hover:text-orange-800">Scaling & Optimization</span>
                </Link>
              </DropdownMenuItem>
              
              <DropdownMenuItem asChild>
                <Link to="/advanced-business-logic" className="flex items-center px-3 py-2 rounded-lg hover:bg-orange-50 transition-colors cursor-pointer group">
                  <Bot className="mr-3 h-4 w-4 text-orange-500 group-hover:text-orange-600" />
                  <span className="font-medium text-orange-700 group-hover:text-orange-800">Business Logic</span>
                </Link>
              </DropdownMenuItem>
            </div>
          </>
        )}
        
        <DropdownMenuSeparator className="my-2" />
        
        {/* Sign Out */}
        <DropdownMenuItem 
          onClick={handleSignOut} 
          className="flex items-center px-3 py-2 rounded-lg hover:bg-red-50 transition-colors cursor-pointer text-red-600 hover:text-red-700 focus:bg-red-50 focus:text-red-700"
        >
          <LogOut className="mr-3 h-4 w-4" />
          <span className="font-medium">Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default EnhancedUserMenu;
