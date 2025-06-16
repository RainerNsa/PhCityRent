
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Moon, Sun, Home, Search, Building2, Users, Phone, Bell } from "lucide-react";
import RealTimeNotificationCenter from "@/components/notifications/RealTimeNotificationCenter";

const Navbar = () => {
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const navItems = [
    { href: "/properties", label: "Properties", icon: Building2 },
    { href: "/agents", label: "Agents", icon: Users },
    { href: "/landlords", label: "Landlords", icon: Home },
    { href: "/contact", label: "Contact", icon: Phone },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 group">
            <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                PhCityRent
              </span>
              <span className="text-xs text-gray-500 -mt-1">Premium Rentals</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-600 hover:text-orange-600 hover:bg-orange-50 transition-all duration-200 group"
              >
                <item.icon className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Right side - Auth & User Menu */}
          <div className="flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-3">
                <RealTimeNotificationCenter />
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-10 w-10 p-0 rounded-full hover:ring-2 hover:ring-orange-200 transition-all duration-200">
                      <Avatar className="h-10 w-10 ring-2 ring-orange-100">
                        <AvatarImage src={user?.user_metadata?.avatar_url || ""} alt={user?.user_metadata?.full_name || "User"} />
                        <AvatarFallback className="bg-gradient-to-br from-orange-500 to-red-500 text-white font-semibold">
                          {user?.user_metadata?.full_name?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-64 p-2" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg mb-2">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-semibold leading-none text-gray-900">
                          {user?.user_metadata?.full_name || "User"}
                        </p>
                        <p className="text-xs leading-none text-gray-600">
                          {user?.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    
                    <DropdownMenuItem onClick={() => navigate("/profile")} className="cursor-pointer hover:bg-orange-50">
                      <Users className="h-4 w-4 mr-2" />
                      Profile
                    </DropdownMenuItem>
                    
                    {user?.user_metadata?.role === 'agent' && (
                      <DropdownMenuItem onClick={() => navigate("/agent-dashboard")} className="cursor-pointer hover:bg-orange-50">
                        <Building2 className="h-4 w-4 mr-2" />
                        Agent Dashboard
                      </DropdownMenuItem>
                    )}
                    
                    {user?.user_metadata?.role === 'admin' && (
                      <DropdownMenuItem onClick={() => navigate("/admin")} className="cursor-pointer hover:bg-orange-50">
                        <Building2 className="h-4 w-4 mr-2" />
                        Admin Dashboard
                      </DropdownMenuItem>
                    )}
                    
                    {user?.user_metadata?.role === 'tenant' && (
                      <DropdownMenuItem onClick={() => navigate("/tenant-portal")} className="cursor-pointer hover:bg-orange-50">
                        <Home className="h-4 w-4 mr-2" />
                        Tenant Portal
                      </DropdownMenuItem>
                    )}
                    
                    <DropdownMenuItem onClick={() => navigate("/properties")} className="cursor-pointer hover:bg-orange-50">
                      <Search className="h-4 w-4 mr-2" />
                      My Properties
                    </DropdownMenuItem>
                    
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer hover:bg-red-50 text-red-600">
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={toggleTheme}
                  className="h-10 w-10 rounded-full hover:bg-orange-100 transition-colors duration-200"
                >
                  {theme === "dark" ? 
                    <Sun className="h-5 w-5 text-orange-600" /> : 
                    <Moon className="h-5 w-5 text-orange-600" />
                  }
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/auth/sign-in">
                  <Button variant="outline" size="sm" className="border-orange-200 text-orange-600 hover:bg-orange-50 hover:border-orange-300">
                    Sign In
                  </Button>
                </Link>
                <Link to="/auth/sign-up">
                  <Button size="sm" className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-lg hover:shadow-xl transition-all duration-200">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <Sheet>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="md:hidden h-10 w-10 rounded-full hover:bg-orange-100 transition-colors duration-200"
                >
                  <Menu className="h-5 w-5 text-orange-600" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 bg-white">
                <SheetHeader className="text-left pb-6">
                  <SheetTitle className="flex items-center space-x-2">
                    <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg">
                      <Building2 className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-lg font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                      PhCityRent
                    </span>
                  </SheetTitle>
                  <SheetDescription>
                    Explore premium rental properties and manage your account.
                  </SheetDescription>
                </SheetHeader>
                
                <div className="grid gap-3 py-4">
                  {navItems.map((item) => (
                    <Link 
                      key={item.href}
                      to={item.href} 
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-orange-50 transition-colors duration-200 group"
                    >
                      <item.icon className="h-5 w-5 text-orange-600 group-hover:scale-110 transition-transform duration-200" />
                      <span className="font-medium text-gray-700 group-hover:text-orange-700">{item.label}</span>
                    </Link>
                  ))}
                  
                  {user ? (
                    <>
                      <div className="border-t border-gray-200 my-4"></div>
                      <Link to="/profile" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-orange-50 transition-colors duration-200">
                        <Users className="h-5 w-5 text-orange-600" />
                        <span className="font-medium text-gray-700">Profile</span>
                      </Link>
                      
                      {user?.user_metadata?.role === 'agent' && (
                        <Link to="/agent-dashboard" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-orange-50 transition-colors duration-200">
                          <Building2 className="h-5 w-5 text-orange-600" />
                          <span className="font-medium text-gray-700">Agent Dashboard</span>
                        </Link>
                      )}
                      
                      {user?.user_metadata?.role === 'admin' && (
                        <Link to="/admin" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-orange-50 transition-colors duration-200">
                          <Building2 className="h-5 w-5 text-orange-600" />
                          <span className="font-medium text-gray-700">Admin Dashboard</span>
                        </Link>
                      )}
                      
                      {user?.user_metadata?.role === 'tenant' && (
                        <Link to="/tenant-portal" className="flex items-center space-x-3 p-3 rounded-lg hover:bg-orange-50 transition-colors duration-200">
                          <Home className="h-5 w-5 text-orange-600" />
                          <span className="font-medium text-gray-700">Tenant Portal</span>
                        </Link>
                      )}
                      
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full mt-4 border-red-200 text-red-600 hover:bg-red-50" 
                        onClick={() => signOut()}
                      >
                        Sign out
                      </Button>
                    </>
                  ) : (
                    <>
                      <div className="border-t border-gray-200 my-4"></div>
                      <Link to="/auth/sign-in" className="block">
                        <Button variant="outline" size="sm" className="w-full border-orange-200 text-orange-600 hover:bg-orange-50">
                          Sign In
                        </Button>
                      </Link>
                      <Link to="/auth/sign-up" className="block">
                        <Button size="sm" className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white">
                          Sign Up
                        </Button>
                      </Link>
                    </>
                  )}
                  
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full justify-start mt-4 hover:bg-orange-50" 
                    onClick={toggleTheme}
                  >
                    {theme === "dark" ? 
                      <Sun className="h-4 w-4 mr-2 text-orange-600" /> : 
                      <Moon className="h-4 w-4 mr-2 text-orange-600" />
                    }
                    <span>Toggle {theme === "dark" ? "Light" : "Dark"} Mode</span>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
