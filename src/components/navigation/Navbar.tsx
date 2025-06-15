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
import { Menu, Moon, Sun } from "lucide-react";
import RealTimeNotificationCenter from "@/components/notifications/RealTimeNotificationCenter";

const Navbar = () => {
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-orange-500">
            Estatein
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/properties" className="hover:text-gray-600 transition-colors">
              Properties
            </Link>
            <Link to="/agents" className="hover:text-gray-600 transition-colors">
              Agents
            </Link>
            <Link to="/landlords" className="hover:text-gray-600 transition-colors">
              Landlords
            </Link>
            <Link to="/contact" className="hover:text-gray-600 transition-colors">
              Contact
            </Link>
          </div>

          {/* Right side - Auth & User Menu */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <RealTimeNotificationCenter />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.user_metadata?.avatar_url || ""} alt={user?.user_metadata?.full_name || "User"} />
                        <AvatarFallback>{user?.user_metadata?.full_name?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user?.user_metadata?.full_name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user?.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => navigate("/profile")}>
                      Profile
                    </DropdownMenuItem>
                    {user?.user_metadata?.role === 'agent' && (
                      <DropdownMenuItem onClick={() => navigate("/agent-dashboard")}>
                        Agent Dashboard
                      </DropdownMenuItem>
                    )}
                    {user?.user_metadata?.role === 'admin' && (
                      <DropdownMenuItem onClick={() => navigate("/admin")}>
                        Admin Dashboard
                      </DropdownMenuItem>
                    )}
                    {user?.user_metadata?.role === 'tenant' && (
                      <DropdownMenuItem onClick={() => navigate("/tenant-portal")}>
                        Tenant Portal
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={() => navigate("/properties")}>
                      My Properties
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => signOut()}>
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button variant="ghost" size="icon" onClick={toggleTheme}>
                  {theme === "dark" ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </div>
            ) : (
              <>
                <Link to="/auth/sign-in">
                  <Button variant="outline" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/auth/sign-up">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </>
            )}

            {/* Mobile menu button */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
                  <Menu className="h-[1.2rem] w-[1.2rem]" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                  <SheetDescription>
                    Explore and manage your account settings.
                  </SheetDescription>
                </SheetHeader>
                <div className="grid gap-4 py-4">
                  <Link to="/properties" className="hover:text-gray-600 transition-colors block py-2">
                    Properties
                  </Link>
                  <Link to="/agents" className="hover:text-gray-600 transition-colors block py-2">
                    Agents
                  </Link>
                  <Link to="/landlords" className="hover:text-gray-600 transition-colors block py-2">
                    Landlords
                  </Link>
                  <Link to="/contact" className="hover:text-gray-600 transition-colors block py-2">
                    Contact
                  </Link>
                  {user ? (
                    <>
                      <Link to="/profile" className="hover:text-gray-600 transition-colors block py-2">
                        Profile
                      </Link>
                      {user?.user_metadata?.role === 'agent' && (
                        <Link to="/agent-dashboard" className="hover:text-gray-600 transition-colors block py-2">
                          Agent Dashboard
                        </Link>
                      )}
                      {user?.user_metadata?.role === 'admin' && (
                        <Link to="/admin" className="hover:text-gray-600 transition-colors block py-2">
                          Admin Dashboard
                        </Link>
                      )}
                      {user?.user_metadata?.role === 'tenant' && (
                        <Link to="/tenant-portal" className="hover:text-gray-600 transition-colors block py-2">
                          Tenant Portal
                        </Link>
                      )}
                      <Link to="/properties" className="hover:text-gray-600 transition-colors block py-2">
                        My Properties
                      </Link>
                      <Button variant="outline" size="sm" className="w-full" onClick={() => signOut()}>
                        Log out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Link to="/auth/sign-in" className="block py-2">
                        <Button variant="outline" size="sm" className="w-full">
                          Sign In
                        </Button>
                      </Link>
                      <Link to="/auth/sign-up" className="block py-2">
                        <Button size="sm" className="w-full">Sign Up</Button>
                      </Link>
                    </>
                  )}
                  <Button variant="ghost" size="icon" className="w-full justify-start" onClick={toggleTheme}>
                    {theme === "dark" ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
                    <span className="ml-2">Toggle theme</span>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {/* You can add a mobile navigation menu here if needed */}
      </div>
    </nav>
  );
};

export default Navbar;
