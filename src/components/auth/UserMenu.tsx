
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { User, LogOut, Settings, Shield, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

const UserMenu = () => {
  const { user, userRole, signOut, isAdmin, isAgent } = useAuth();

  if (!user) return null;

  const getRoleColor = (role: string | null) => {
    switch (role) {
      case 'super_admin':
        return 'bg-red-100 text-red-800';
      case 'admin':
        return 'bg-purple-100 text-purple-800';
      case 'agent':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2">
          <div className="bg-pulse-100 p-1 rounded-full">
            <User className="w-4 h-4 text-pulse-600" />
          </div>
          <span className="hidden md:block text-sm">
            {user.user_metadata?.full_name || user.email?.split('@')[0]}
          </span>
          <ChevronDown className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent align="end" className="w-56">
        <div className="px-2 py-1.5">
          <p className="text-sm font-medium">{user.user_metadata?.full_name || 'User'}</p>
          <p className="text-xs text-gray-500">{user.email}</p>
          {userRole && (
            <Badge className={`text-xs mt-1 ${getRoleColor(userRole)}`}>
              {userRole.replace('_', ' ').toUpperCase()}
            </Badge>
          )}
        </div>
        
        <DropdownMenuSeparator />
        
        {isAgent && (
          <DropdownMenuItem>
            <Shield className="w-4 h-4 mr-2" />
            Agent Dashboard
          </DropdownMenuItem>
        )}
        
        {isAdmin && (
          <DropdownMenuItem>
            <Settings className="w-4 h-4 mr-2" />
            Admin Panel
          </DropdownMenuItem>
        )}
        
        <DropdownMenuSeparator />
        
        <DropdownMenuItem onClick={signOut} className="text-red-600">
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
